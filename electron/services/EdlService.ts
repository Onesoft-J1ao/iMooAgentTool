import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { paths } from '../core/paths';
import { subprocessPool } from './SubprocessPool';
import logger from './Logger';
import { TIMEOUTS } from '../lib/timeouts';
import { decodeGbk } from '../lib/gbk';

const SRC = 'EdlService';

class EdlService {
  async loadFirehose(progPath: string, port: string): Promise<void> {
    if (!fs.existsSync(progPath)) throw new Error('Firehose loader 不存在: ' + progPath);
    const qsahara = paths.qsahara();
    const args = ['--tool=2', '--port=' + port, '--sahara=' + progPath];
    logger.info(SRC, `Loading firehose on ${port}`);
    try {
      for await (const _line of subprocessPool.spawnStreaming({
        cmd: qsahara,
        args,
        timeout: TIMEOUTS.EDL_LOAD_FIREHOSE,
      })) {
        // stream only
      }
    } catch (err) {
      logger.error(SRC, `loadFirehose failed: ${(err as Error).message}`);
      throw err;
    }
  }

  async flashPartitions(
    xmlFiles: string[],
    port: string,
    onProgress?: (msg: string) => void,
    imagesDir?: string
  ): Promise<void> {
    if (xmlFiles.length === 0) throw new Error('没有可刷写的 XML 文件');
    const fhLoader = paths.fhLoader();
    const searchDir = imagesDir || path.dirname(xmlFiles[0]);
    const args = [
      '--port=' + port,
      '--convertprogram2read=0',
      '--memoryname=emmc',
      '--resetafter=0',
      '--maxpayloadsizemb=2048',
      '--zlpawarehost=1',
      '--waitforprocesstimeout=5000',
      '--search_path=' + searchDir,
      ...xmlFiles.map((x) => '--sendxml=' + x),
      '--noprompt',
    ];
    logger.info(SRC, `Flashing partitions on ${port}`);
    try {
      for await (const line of subprocessPool.spawnStreaming({
        cmd: fhLoader,
        args,
        timeout: TIMEOUTS.EDL_FLASH,
      })) {
        onProgress?.(line);
      }
    } catch (err) {
      logger.error(SRC, `flashPartitions failed: ${(err as Error).message}`);
      throw err;
    }
  }

  async readPartitions(
    xmlFiles: string[],
    port: string,
    onProgress?: (msg: string) => void,
    imagesDir?: string
  ): Promise<void> {
    if (xmlFiles.length === 0) throw new Error('没有可读取的 XML 文件');
    const fhLoader = paths.fhLoader();
    const searchDir = imagesDir || path.dirname(xmlFiles[0]);
    const args = [
      '--port=' + port,
      '--convertprogram2read=1',
      '--memoryname=emmc',
      '--resetafter=0',
      '--maxpayloadsizemb=2048',
      '--zlpawarehost=1',
      '--waitforprocesstimeout=5000',
      '--search_path=' + searchDir,
      ...xmlFiles.map((x) => '--sendxml=' + x),
      '--noprompt',
    ];
    logger.info(SRC, `Reading partitions on ${port}`);
    try {
      for await (const line of subprocessPool.spawnStreaming({
        cmd: fhLoader,
        args,
        timeout: TIMEOUTS.EDL_READ,
      })) {
        onProgress?.(line);
      }
    } catch (err) {
      logger.error(SRC, `readPartitions failed: ${(err as Error).message}`);
      throw err;
    }
  }

  async reboot(port: string): Promise<void> {
    const fhLoader = paths.fhLoader();
    const args = [
      '--port=' + port,
      '--convertprogram2read=0',
      '--memoryname=emmc',
      '--resetafter=1',
      '--maxpayloadsizemb=2048',
      '--zlpawarehost=1',
      '--waitforprocesstimeout=5000',
    ];
    try {
      for await (const _line of subprocessPool.spawnStreaming({
        cmd: fhLoader,
        args,
        timeout: TIMEOUTS.EDL_REBOOT,
      })) {
        // stream only
      }
    } catch (err) {
      logger.error(SRC, `EDL reboot failed: ${(err as Error).message}`);
      throw err;
    }
  }

  findPort(): Promise<string | null> {
    return new Promise((resolve) => {
      try {
        const proc = spawn('wmic', ['path', 'Win32_PnPEntity', 'get', 'Name', '/format:list'], {
          windowsHide: true,
          stdio: ['ignore', 'pipe', 'pipe'],
        });
        let output = '';
        proc.stdout.on('data', (data: Buffer) => { output += decodeGbk(data); });
        proc.on('close', () => {
          if (/QDLoader|Qualcomm|9008/i.test(output)) {
            const match = output.match(/COM(\d+)/);
            resolve(match ? `COM${match[1]}` : null);
          } else {
            resolve(null);
          }
        });
        proc.on('error', () => resolve(null));
      } catch {
        resolve(null);
      }
    });
  }

  async waitForEdl(timeout: number = TIMEOUTS.EDL_WAIT): Promise<string> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const port = await this.findPort();
      if (port) return port;
      await new Promise((r) => setTimeout(r, 1000));
    }
    throw new Error('等待 EDL 设备超时');
  }

  async backup9008(
    xmlFiles: string[],
    backupDir: string,
    port: string,
    onProgress?: (msg: string) => void
  ): Promise<string> {
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    await this.readPartitions(xmlFiles, port, onProgress);
    const sevenZip = paths.sevenZip();
    const archivePath = path.join(backupDir, `edl_backup_${Date.now()}.7z`);
    const args = ['a', '-t7z', '-mx=5', archivePath, ...xmlFiles.map((x) => path.dirname(x))];
    for await (const line of subprocessPool.spawnStreaming({
      cmd: sevenZip,
      args,
      timeout: TIMEOUTS.BACKUP_EDL,
    })) {
      onProgress?.(line);
    }
    return archivePath;
  }

  async recover9008(
    archivePath: string,
    xmlFiles: string[],
    port: string,
    onProgress?: (msg: string) => void
  ): Promise<void> {
    const sevenZip = paths.sevenZip();
    const extractDir = path.dirname(xmlFiles[0]);
    for await (const line of subprocessPool.spawnStreaming({
      cmd: sevenZip,
      args: ['x', archivePath, '-o' + extractDir, '-y'],
      timeout: TIMEOUTS.RECOVERY_EDL,
    })) {
      onProgress?.(line);
    }
    await this.flashPartitions(xmlFiles, port, onProgress);
  }

  async superRecovery(
    xmlSets: string[][],
    port: string,
    onProgress?: (msg: string) => void
  ): Promise<void> {
    for (let i = 0; i < xmlSets.length; i++) {
      onProgress?.(`Super recovery stage ${i + 1}/${xmlSets.length}`);
      await this.flashPartitions(xmlSets[i], port, onProgress);
    }
  }

  async flashTwrp(twrpImg: string, port: string): Promise<void> {
    const xmlDir = path.dirname(twrpImg);
    const rawprogram = path.join(xmlDir, 'rawprogram0.xml');
    const patch = path.join(xmlDir, 'patch0.xml');
    const xmls: string[] = [];
    if (fs.existsSync(rawprogram)) xmls.push(rawprogram);
    if (fs.existsSync(patch)) xmls.push(patch);
    if (xmls.length === 0) throw new Error('TWRP 刷写缺少 rawprogram0.xml / patch0.xml');
    await this.loadFirehose(path.join(xmlDir, 'prog_firehose_ddr.elf'), port);
    await this.flashPartitions(xmls, port, undefined, xmlDir);
  }

  async flashMisc(xmlPath: string, port: string): Promise<void> {
    if (!fs.existsSync(xmlPath)) throw new Error('misc XML 不存在: ' + xmlPath);
    await this.loadFirehose(path.join(paths.edl, 'prog_firehose_ddr.elf'), port);
    await this.flashPartitions([xmlPath], port, undefined, path.dirname(xmlPath));
  }
}

export const edlService = new EdlService();
export default edlService;
