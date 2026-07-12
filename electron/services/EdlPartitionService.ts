import path from 'node:path';
import fs from 'node:fs';
import { paths } from '../core/paths';
import { subprocessPool } from './SubprocessPool';
import { DeviceService } from './DeviceService';

const logger = {
  info: (...args: any[]) => console.log('[EdlPartitionService]', ...args),
  warn: (...args: any[]) => console.warn('[EdlPartitionService]', ...args),
  error: (...args: any[]) => console.error('[EdlPartitionService]', ...args),
};

const CRITICAL_PARTITIONS = [
  'boot', 'system', 'modem', 'recovery', 'xbl', 'sbl', 'aboot', 'tz', 'rpm', 'hyp',
  'modemst1', 'modemst2', 'fsg', 'fsc', 'ssd', 'DDR', 'pad',
];

const PROGRESS_RE = /(\w+):\s*([\d.]+)%\s*\(([\d.]+)\s*\/\s*([\d.]+)\s*MiB\)\s*\[([^\]]+)\]/;

class EdlPartitionServiceClass {
  edlNgPath = path.join(paths.bin, 'edl-ng', 'edl-ng.exe');
  edlNgDir = path.join(paths.bin, 'edl-ng');
  operationHistory: any[] = [];
  historyIdCounter = 0;

  async printGpt(opts: any) {
    const { loader, onProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(loader)) { throw new Error('firehose loader 不存在: ' + loader); }
      onProgress?.('正在读取 GPT 分区表...');
      const result = await this.spawnEdlNg(['--loader', loader, '--memory', 'Sdcc', '--slot', '0', 'printgpt'], onProgress);
      if (result.exitCode !== 0) { const msg2 = 'printgpt 失败(退出码 ' + result.exitCode + '): ' + (result.stderr || result.stdout); this.recordOperation({ type: 'printgpt', label: '-', success: false, message: msg2, durationMs: Date.now() - start }); return { success: false, partitions: [], error: msg2 }; }
      const partitions = this.parseGptOutput(result.stdout);
      const storage = this.parseStorageInfo(result.stdout);
      const msg = '读取成功,共 ' + partitions.length + ' 个分区';
      onProgress?.(msg);
      this.recordOperation({ type: 'printgpt', label: '-', success: true, message: msg, durationMs: Date.now() - start });
      return { success: true, partitions, storage };
    } catch (e: any) {
      const msg = e.message;
      logger.error('printgpt 失败: ' + msg);
      this.recordOperation({ type: 'printgpt', label: '-', success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, partitions: [], error: msg };
    }
  }

  parseGptOutput(output: string) {
    const partitions: any[] = [];
    let current: any = null;
    let currentLun = 0;
    for (const line of output.split('\n')) {
      const trimmed = line.trim();
      const lunMatch = trimmed.match(/--- Partitions\s+(?:LUN\s+)?(\d+)\s*---/i);
      if (lunMatch) { currentLun = parseInt(lunMatch[1], 10); continue; }
      const nameMatch = trimmed.match(/^Name:\s*(.+)$/);
      if (nameMatch) { if (current) partitions.push(current); current = { label: nameMatch[1].trim(), lun: currentLun }; continue; }
      if (!current) continue;
      const typeMatch = trimmed.match(/^Type:\s*(.+)$/);
      if (typeMatch) { current.typeGuid = typeMatch[1].trim(); continue; }
      const uidMatch = trimmed.match(/^UID:\s*(.+)$/);
      if (uidMatch) { current.uid = uidMatch[1].trim(); continue; }
      const lbaMatch = trimmed.match(/^LBA:\s*(\d+)-(\d+)\s*\(Size:\s*([\d.]+)\s*(KiB|MiB|GiB)\)/i);
      if (lbaMatch) {
        current.firstLba = parseInt(lbaMatch[1], 10);
        current.lastLba = parseInt(lbaMatch[2], 10);
        const val = parseFloat(lbaMatch[3]);
        const unit = lbaMatch[4].toLowerCase();
        const mult = unit === 'kib' ? 1024 : unit === 'mib' ? 1024 * 1024 : 1024 * 1024 * 1024;
        current.sizeBytes = Math.round(val * mult);
        continue;
      }
    }
    if (current) partitions.push(current);
    return partitions.filter((p: any) => p.label && p.sizeBytes > 0);
  }

  parseStorageInfo(output: string) {
    let sectorSize = 512;
    let lunCount = 1;
    for (const line of output.split('\n')) {
      const trimmed = line.trim();
      const sectorMatch = trimmed.match(/sector size:\s*(\d+)\s*bytes/i);
      if (sectorMatch) { sectorSize = parseInt(sectorMatch[1], 10); }
      const lunHeaderMatch = trimmed.match(/--- (?:GPT Header|Partitions)\s+LUN\s+(\d+)\s*---/i);
      if (lunHeaderMatch) { const lun = parseInt(lunHeaderMatch[1], 10) + 1; if (lun > lunCount) lunCount = lun; }
    }
    return { sectorSize, lunCount };
  }

  async backupPartition(opts: any) {
    const { loader, label, outputFile, onProgress, onTransferProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(loader)) { throw new Error('firehose loader 不存在: ' + loader); }
      const outputDir = path.dirname(outputFile);
      if (!fs.existsSync(outputDir)) { fs.mkdirSync(outputDir, { recursive: true }); }
      onProgress?.('正在备份分区: ' + label);
      const result = await this.spawnEdlNgWithProgress(['--loader', loader, '--memory', 'Sdcc', '--slot', '0', 'read-part', label, outputFile], onProgress, onTransferProgress);
      if (result.exitCode !== 0) { const msg2 = '备份失败: ' + (result.stderr || result.stdout); this.recordOperation({ type: 'backup', label, success: false, message: msg2, durationMs: Date.now() - start }); return { success: false, error: msg2 }; }
      if (!fs.existsSync(outputFile)) { const msg2 = '备份失败: 输出文件未生成'; this.recordOperation({ type: 'backup', label, success: false, message: msg2, durationMs: Date.now() - start }); return { success: false, error: msg2 }; }
      const msg = '备份完成: ' + outputFile;
      onProgress?.(msg);
      this.recordOperation({ type: 'backup', label, success: true, message: msg, durationMs: Date.now() - start });
      return { success: true };
    } catch (e: any) {
      const msg = e.message;
      logger.error('备份分区 ' + label + ' 失败: ' + msg);
      this.recordOperation({ type: 'backup', label, success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, error: msg };
    }
  }

  async restorePartition(opts: any) {
    const { loader, label, inputFile, backupBeforeRestore = true, backupOutputDir, verifyAfterRestore = false, onProgress, onTransferProgress } = opts;
    const start = Date.now();
    let backupPath: string | undefined;
    try {
      if (!fs.existsSync(loader)) { throw new Error('firehose loader 不存在: ' + loader); }
      if (!fs.existsSync(inputFile)) { throw new Error('输入文件不存在: ' + inputFile); }
      if (backupBeforeRestore) {
        if (!backupOutputDir) { throw new Error('backupBeforeRestore=true 时需提供 backupOutputDir'); }
        const ts = (new Date()).toISOString().replace(/[:.]/g, '-').slice(0, 19);
        backupPath = path.join(backupOutputDir, label + '_pre_restore_' + ts + '.img');
        onProgress?.('恢复前备份当前分区到: ' + backupPath);
        const backupRes = await this.backupPartition({ loader, label, outputFile: backupPath, onProgress, onTransferProgress });
        if (!backupRes.success) { throw new Error('恢复前备份失败: ' + backupRes.error + '(已中止恢复以防数据丢失)'); }
      }
      onProgress?.('正在恢复分区: ' + label);
      const result = await this.spawnEdlNgWithProgress(['--loader', loader, '--memory', 'Sdcc', '--slot', '0', 'write-part', label, inputFile], onProgress, onTransferProgress);
      if (result.exitCode !== 0) { const msg2 = '恢复失败: ' + (result.stderr || result.stdout); this.recordOperation({ type: 'restore', label, success: false, message: msg2, durationMs: Date.now() - start }); return { success: false, error: msg2, backupPath }; }
      if (verifyAfterRestore) {
        onProgress?.('恢复后读回校验...');
        const verify = await this.verifyPartition({ loader, label, expectedFile: inputFile, onProgress, onTransferProgress });
        if (!verify.matched) { onProgress?.('校验未通过: ' + (verify.error ?? '数据不一致')); } else { onProgress?.('校验通过'); }
      }
      const msg = '恢复完成: ' + label;
      onProgress?.(msg);
      this.recordOperation({ type: 'restore', label, success: true, message: msg + (backupPath ? '(已备份原数据)' : ''), durationMs: Date.now() - start });
      return { success: true, backupPath };
    } catch (e: any) {
      const msg = e.message;
      logger.error('恢复分区 ' + label + ' 失败: ' + msg);
      this.recordOperation({ type: 'restore', label, success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, error: msg, backupPath };
    }
  }

  async verifyPartition(opts: any) {
    const { loader, label, expectedFile, onProgress, onTransferProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(expectedFile)) { return { success: false, matched: false, bytesRead: 0, bytesExpected: 0, error: '预期文件不存在' }; }
      const expectedSize = fs.statSync(expectedFile).size;
      const workDir = path.join(app.getPath('userData'), 'edl_work');
      if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });
      const readBackPath = path.join(workDir, 'verify_' + label + '_' + Date.now() + '.img');
      onProgress?.('读回分区 ' + label + ' 进行校验...');
      const result = await this.spawnEdlNgWithProgress(['--loader', loader, '--memory', 'Sdcc', '--slot', '0', 'read-part', label, readBackPath], onProgress, onTransferProgress);
      if (result.exitCode !== 0 || !fs.existsSync(readBackPath)) {
        this.recordOperation({ type: 'verify', label, success: false, message: '读回失败', durationMs: Date.now() - start });
        return { success: false, matched: false, bytesRead: 0, bytesExpected: expectedSize, error: '读回失败' };
      }
      const actualSize = fs.statSync(readBackPath).size;
      let matched = actualSize === expectedSize;
      if (matched) {
        const expectedFd = fs.openSync(expectedFile, 'r');
        const actualFd = fs.openSync(readBackPath, 'r');
        const bufSize = 4 * 1024 * 1024;
        const buf1 = Buffer.alloc(bufSize);
        const buf2 = Buffer.alloc(bufSize);
        let offset = 0;
        while (offset < expectedSize) {
          const toRead = Math.min(bufSize, expectedSize - offset);
          const r1 = fs.readSync(expectedFd, buf1, 0, toRead, offset);
          const r2 = fs.readSync(actualFd, buf2, 0, toRead, offset);
          if (r1 !== r2 || buf1.compare(buf2, 0, r1, 0, r2) !== 0) { matched = false; break; }
          offset += r1;
        }
        fs.closeSync(expectedFd);
        fs.closeSync(actualFd);
      }
      try { fs.unlinkSync(readBackPath); } catch {}
      this.recordOperation({ type: 'verify', label, success: true, message: matched ? '校验通过' : '数据不一致', durationMs: Date.now() - start });
      return { success: true, matched, bytesRead: actualSize, bytesExpected: expectedSize };
    } catch (e: any) {
      const msg = e.message;
      logger.error('校验分区 ' + label + ' 失败: ' + msg);
      this.recordOperation({ type: 'verify', label, success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, matched: false, bytesRead: 0, bytesExpected: 0, error: msg };
    }
  }

  async erasePartition(opts: any) {
    const { loader, label, onProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(loader)) { throw new Error('firehose loader 不存在: ' + loader); }
      onProgress?.('正在擦除分区: ' + label);
      const result = await this.spawnEdlNg(['--loader', loader, '--memory', 'Sdcc', '--slot', '0', 'erase-part', label], onProgress);
      if (result.exitCode !== 0) { const msg2 = '擦除失败: ' + (result.stderr || result.stdout); this.recordOperation({ type: 'erase', label, success: false, message: msg2, durationMs: Date.now() - start }); return { success: false, error: msg2 }; }
      const msg = '擦除完成: ' + label;
      onProgress?.(msg);
      this.recordOperation({ type: 'erase', label, success: true, message: msg, durationMs: Date.now() - start });
      return { success: true };
    } catch (e: any) {
      const msg = e.message;
      logger.error('擦除分区 ' + label + ' 失败: ' + msg);
      this.recordOperation({ type: 'erase', label, success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, error: msg };
    }
  }

  async resetDevice(opts: any) {
    const { loader, onProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(loader)) { throw new Error('firehose loader 不存在: ' + loader); }
      onProgress?.('正在重启设备...');
      const result = await this.spawnEdlNg(['--loader', loader, '--memory', 'Sdcc', '--slot', '0', 'reset', '--mode', 'Reset', '--delay', '1'], onProgress);
      if (result.exitCode !== 0) { const msg2 = '重启失败: ' + (result.stderr || result.stdout); this.recordOperation({ type: 'reset', label: '-', success: false, message: msg2, durationMs: Date.now() - start }); return { success: false, error: msg2 }; }
      const msg = '重启指令已发送';
      onProgress?.(msg);
      this.recordOperation({ type: 'reset', label: '-', success: true, message: msg, durationMs: Date.now() - start });
      return { success: true };
    } catch (e: any) {
      const msg = e.message;
      logger.error('重启失败: ' + msg);
      this.recordOperation({ type: 'reset', label: '-', success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, error: msg };
    }
  }

  async checkEdlDevice() {
    const device = DeviceService.instance.getCurrentDevice();
    if (device?.type === 'qcom_edl') { return { inEdl: true, port: device.port }; }
    return { inEdl: false };
  }

  isCritical(label: string) { return CRITICAL_PARTITIONS.includes(label); }

  listLoaders() {
    return [
      { name: 'msm8909w.mbn', path: path.join(paths.edl, 'msm8909w.mbn'), description: 'Z2-Z6 非 V3' },
      { name: 'msm8937.mbn', path: path.join(paths.edl, 'msm8937.mbn'), description: 'V3 机型(Z6+/Z7+)' },
      { name: 'prog_firehose_ddr.elf', path: path.join(paths.edl, 'prog_firehose_ddr.elf'), description: 'Z10/ND03' },
    ];
  }

  getHistory() { return [...this.operationHistory].reverse(); }
  clearHistory() { this.operationHistory = []; }

  recordOperation(opts: any) {
    this.operationHistory.push({ id: 'op-' + (++this.historyIdCounter), ...opts, timestamp: Date.now() });
    if (this.operationHistory.length > 50) { this.operationHistory.shift(); }
  }

  async spawnEdlNg(args: string[], onProgress?: (msg: string) => void) {
    logger.info('edl-ng ' + args.join(' '));
    return subprocessPool.spawn({ cmd: this.edlNgPath, args, encoding: 'utf-8', timeout: 0, cwd: this.edlNgDir, onStdout: (line: string) => { logger.info('edl-ng: ' + line); onProgress?.(line); }, onStderr: (line: string) => { logger.warn('edl-ng stderr: ' + line); } });
  }

  async spawnEdlNgWithProgress(args: string[], onProgress?: (msg: string) => void, onTransferProgress?: (info: any) => void) {
    logger.info('edl-ng ' + args.join(' '));
    return subprocessPool.spawn({ cmd: this.edlNgPath, args, encoding: 'utf-8', timeout: 0, cwd: this.edlNgDir, onStdout: (line: string) => {
      const m = line.match(PROGRESS_RE);
      if (m && onTransferProgress) { onTransferProgress({ operation: m[1], percent: parseFloat(m[2]), transferredMiB: parseFloat(m[3]), totalMiB: parseFloat(m[4]), speed: m[5] }); } else { logger.info('edl-ng: ' + line); onProgress?.(line); }
    }, onStderr: (line: string) => { logger.warn('edl-ng stderr: ' + line); } });
  }
}

import { app } from 'electron';

export const edlPartitionService = new EdlPartitionServiceClass();
export default edlPartitionService;
