import path from 'node:path';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { paths } from '../core/paths';
import { subprocessPool, SpawnError } from './SubprocessPool';
import { adbService } from './AdbService';
import { magiskService } from './MagiskService';

const logger = {
  info: (...args: any[]) => console.log('[BackupService]', ...args),
  warn: (...args: any[]) => console.warn('[BackupService]', ...args),
  error: (...args: any[]) => console.error('[BackupService]', ...args),
};

const TIMEOUT = {
  shell: 10000,
  shellLong: 30000,
  install: 120000,
  backup: 600000,
  device: 5000,
  flash: 60000,
  transfer: 300000,
};

class BackupServiceClass {
  adbPath = process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb';
  sevenZipPath = path.join(paths.bin, '7z.exe');

  async backupDcim(outputDir: string, onProgress?: (msg: string) => void) {
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      onProgress?.('正在备份相册...');
      await adbService.pull('', '/storage/emulated/0/DCIM', outputDir);
      onProgress?.('备份成功');
      logger.info('DCIM 备份成功: ' + outputDir);
      return { success: true };
    } catch (e: any) {
      const msg = e.message;
      onProgress?.('备份失败');
      logger.error('DCIM 备份失败: ' + msg);
      return { success: false, error: msg };
    }
  }

  async recoverDcim(inputDir: string, onProgress?: (msg: string) => void) {
    try {
      onProgress?.('正在恢复相册...');
      const dcimPath = path.join(inputDir, 'DCIM');
      if (!fs.existsSync(dcimPath)) {
        return { success: false, error: '所选文件夹中没有 DCIM 子目录: ' + dcimPath };
      }
      await adbService.push('', dcimPath, '/storage/emulated/0/');
      onProgress?.('恢复成功');
      logger.info('DCIM 恢复成功: ' + inputDir);
      return { success: true };
    } catch (e: any) {
      const msg = e.message;
      onProgress?.('恢复失败');
      logger.error('DCIM 恢复失败: ' + msg);
      return { success: false, error: msg };
    }
  }

  async backupAdbDd(outputDir: string, onProgress?: (msg: string) => void) {
    try {
      const now = new Date();
      const d = '' + now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
      const t = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
      const backupName = 'ADB_' + d + '_' + t;
      const backupDir = path.join(outputDir, backupName);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      onProgress?.('等待设备连接...');
      onProgress?.('检查 root 权限...');
      const rootResult = await adbService.root('');
      if (!rootResult.granted) {
        return { success: false, error: '没有 root 权限,请尝试进入 twrp/qmmi' };
      }
      onProgress?.('正在获取分区列表...');
      const listOutput = await adbService.shell('', 'ls /dev/block/bootdevice/by-name/');
      const partitions = listOutput.split(/\s+/).map((s: string) => s.trim()).filter(Boolean);
      if (partitions.length === 0) {
        return { success: false, error: '无法获取分区列表,请检查 root 权限或设备支持' };
      }
      const failedParts: string[] = [];
      onProgress?.('开始备份分区(共 ' + partitions.length + ' 个)...');
      for (const part of partitions) {
        if (part.toLowerCase() === 'userdata') {
          onProgress?.('跳过 userdata');
          continue;
        }
        onProgress?.('正在备份分区: ' + part);
        const imgFile = path.join(backupDir, part + '.img');
        try {
          await this.adbExecOutToFile("su -c 'dd if=/dev/block/bootdevice/by-name/" + part + " bs=4096 2>/dev/null'", imgFile);
          onProgress?.('备份 ' + part + ' 已完成');
        } catch (e: any) {
          logger.warn('分区 ' + part + ' 备份可能失败: ' + e.message);
          failedParts.push(part);
        }
      }
      onProgress?.('正在校验备份文件完整性...');
      await this.verifyBackupMd5(backupDir, failedParts, onProgress);
      if (failedParts.length > 0) {
        onProgress?.('备份失败的分区: ' + failedParts.join(' '));
      }
      onProgress?.('压缩备份文件...');
      const zipPath = path.join(outputDir, backupName + '.zip');
      await subprocessPool.spawn({
        cmd: this.sevenZipPath,
        args: ['a', '-tzip', '-y', zipPath, backupDir + path.sep],
        encoding: 'utf-8',
        timeout: TIMEOUT.backup,
        cwd: paths.bin,
        onStdout: (line: string) => onProgress?.(line),
      });
      try { fs.rmSync(backupDir, { recursive: true, force: true }); } catch {}
      onProgress?.('备份完成: ' + zipPath);
      logger.info('ADB-dd 备份成功: ' + zipPath);
      return { success: true, zipPath };
    } catch (e: any) {
      const msg = e.message;
      onProgress?.('备份失败: ' + msg);
      logger.error('ADB-dd 备份失败: ' + msg);
      return { success: false, error: msg };
    }
  }

  async verifyBackupMd5(backupDir: string, failedParts: string[], onProgress?: (msg: string) => void) {
    let entries: string[] = [];
    try {
      entries = fs.readdirSync(backupDir).filter((f: string) => f.endsWith('.img'));
    } catch { return; }
    for (const file of entries) {
      const part = path.basename(file, '.img');
      onProgress?.('正在校验 ' + part + '...');
      try {
        const remoteOut = await adbService.shell('', 'md5sum /dev/block/bootdevice/by-name/' + part + ' 2>/dev/null');
        const remoteHash = remoteOut.trim().split(/\s+/)[0];
        if (!remoteHash) {
          onProgress?.('无法获取分区 ' + part + ' 的 MD5,跳过校验');
          continue;
        }
        const localHash = await this.busyboxMd5(path.join(backupDir, file));
        if (!localHash) {
          onProgress?.('无法计算本地文件 ' + part + '.img 的 MD5,跳过校验');
          continue;
        }
        if (localHash.toLowerCase() !== remoteHash.toLowerCase()) {
          onProgress?.('分区 ' + part + ' 校验失败,删除不匹配文件');
          try { fs.unlinkSync(path.join(backupDir, file)); } catch {}
          if (!failedParts.includes(part)) failedParts.push(part);
        } else {
          onProgress?.('分区 ' + part + ' 校验通过');
        }
      } catch (e: any) {
        logger.warn('校验 ' + part + ' 异常: ' + e.message);
      }
    }
  }

  async prepareAdbDdRecover(zipPath: string, onProgress?: (msg: string) => void) {
    try {
      onProgress?.('解压备份文件...');
      const tmpDir = path.join(paths.resources, 'backup', 'tmp');
      if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
      fs.mkdirSync(tmpDir, { recursive: true });
      await subprocessPool.spawn({
        cmd: this.sevenZipPath,
        args: ['x', zipPath, '-o' + tmpDir, '-aoa'],
        encoding: 'utf-8',
        timeout: TIMEOUT.install,
        cwd: paths.bin,
      });
      let extractDir = tmpDir;
      let imgFiles = this.listImgFiles(extractDir);
      if (imgFiles.length === 0) {
        const subEntries = fs.readdirSync(tmpDir, { withFileTypes: true }).filter((e: fs.Dirent) => e.isDirectory());
        for (const sub of subEntries) {
          const subDir = path.join(tmpDir, sub.name);
          const subImgs = this.listImgFiles(subDir);
          if (subImgs.length > 0) {
            extractDir = subDir;
            imgFiles = subImgs;
            break;
          }
        }
      }
      if (imgFiles.length === 0) {
        return { success: false, error: '备份文件中没有找到任何 .img 文件' };
      }
      onProgress?.('检查 root 权限...');
      const rootResult = await adbService.root('');
      if (!rootResult.granted) {
        return { success: false, error: '没有 root 权限,请尝试进入 twrp/qmmi' };
      }
      onProgress?.('正在获取设备分区表...');
      const partListOutput = await adbService.shell('', 'ls /dev/block/bootdevice/by-name/');
      const deviceParts = new Set(partListOutput.split(/\s+/).map((s: string) => s.trim()).filter(Boolean));
      const matched: string[] = [];
      const skipped: string[] = [];
      for (const img of imgFiles) {
        const part = path.basename(img, '.img');
        if (deviceParts.has(part)) {
          matched.push(part);
        } else {
          skipped.push(part);
        }
      }
      if (matched.length === 0) {
        return { success: false, error: '没有可恢复的分区(备份中的分区均未在设备上发现)' };
      }
      onProgress?.('匹配 ' + matched.length + ' 个分区,跳过 ' + skipped.length + ' 个');
      return { success: true, extractDir, match: { matched, skipped } };
    } catch (e: any) {
      const msg = e.message;
      onProgress?.('准备恢复失败: ' + msg);
      logger.error('ADB-dd 恢复准备失败: ' + msg);
      return { success: false, error: msg };
    }
  }

  async executeAdbDdRecover(extractDir: string, parts: string[], onProgress?: (msg: string) => void) {
    const failedParts: string[] = [];
    try {
      for (const part of parts) {
        onProgress?.('恢复分区: ' + part + ' ...');
        const imgFile = path.join(extractDir, part + '.img');
        if (!fs.existsSync(imgFile)) {
          logger.warn('分区 ' + part + ' 的镜像不存在: ' + imgFile + ',跳过');
          failedParts.push(part);
          continue;
        }
        try {
          await this.adbExecInFromFile("su -c 'dd of=/dev/block/bootdevice/by-name/" + part + " bs=4096 2>/dev/null'", imgFile);
          onProgress?.(part + ' 恢复成功');
        } catch (e: any) {
          logger.warn('分区 ' + part + ' 写入可能失败: ' + e.message);
          failedParts.push(part);
        }
      }
      try { fs.rmSync(extractDir, { recursive: true, force: true }); } catch {}
      if (failedParts.length > 0) {
        onProgress?.('恢复流程结束,部分分区失败: ' + failedParts.join(' '));
        return { success: false, error: '部分分区恢复失败: ' + failedParts.join(' ') };
      }
      onProgress?.('恢复流程结束,建议重启设备');
      logger.info('ADB-dd 恢复完成');
      return { success: true };
    } catch (e: any) {
      const msg = e.message;
      onProgress?.('恢复失败: ' + msg);
      logger.error('ADB-dd 恢复失败: ' + msg);
      return { success: false, error: msg };
    }
  }

  async recoverAdbDd(zipPath: string, onProgress?: (msg: string) => void, onConfirm?: (match: any) => Promise<boolean>) {
    const prep = await this.prepareAdbDdRecover(zipPath, onProgress);
    if (!prep.success || !prep.extractDir || !prep.match) {
      return { success: false, error: prep.error };
    }
    if (onConfirm) {
      const ok = await onConfirm(prep.match);
      if (!ok) {
        onProgress?.('已取消操作');
        try { fs.rmSync(prep.extractDir, { recursive: true, force: true }); } catch {}
        return { success: false, error: '用户已取消' };
      }
    }
    return this.executeAdbDdRecover(prep.extractDir, prep.match.matched, onProgress);
  }

  async autoFlashTwrp(innermodel: string, onProgress?: (msg: string) => void) {
    try {
      const twrpDir = path.join(paths.edl, 'twrp');
      if (!fs.existsSync(twrpDir)) {
        return { success: false, error: 'TWRP 镜像未下载,请先在"资源下载"页下载 TWRP' };
      }
      const twrpImg = path.join(twrpDir, innermodel + '.img');
      if (!fs.existsSync(twrpImg)) {
        return { success: false, error: 'TWRP 镜像不存在: ' + innermodel + '.img' };
      }
      onProgress?.('拷贝文件到临时目录...');
      const workDir = path.join(paths.edl, 'work');
      if (!fs.existsSync(workDir)) {
        fs.mkdirSync(workDir, { recursive: true });
      }
      const recoveryImg = path.join(workDir, 'recovery.img');
      fs.copyFileSync(twrpImg, recoveryImg);
      onProgress?.('推送 recovery.img...');
      await adbService.push('', recoveryImg, '/sdcard/');
      onProgress?.('推送 auto_flash_recovery.sh...');
      const scriptPath = path.join(paths.scripts, 'auto_flash_recovery.sh');
      if (!fs.existsSync(scriptPath)) {
        return { success: false, error: '脚本文件不存在: auto_flash_recovery.sh' };
      }
      await adbService.push('', scriptPath, '/sdcard/');
      onProgress?.('安装到 Magisk 服务目录...');
      await adbService.shell('', 'cp /sdcard/recovery.img /data/rec.img');
      await adbService.shell('', 'cp /sdcard/auto_flash_recovery.sh /data/adb/service.d/rec.sh');
      await adbService.shell('', 'chmod 755 -R /data/adb/service.d/rec.sh');
      try {
        const workFiles = fs.readdirSync(workDir);
        for (const f of workFiles) {
          fs.unlinkSync(path.join(workDir, f));
        }
      } catch {}
      onProgress?.('刷入完成');
      logger.info('开机自刷 TWRP 完成: ' + innermodel);
      return { success: true };
    } catch (e: any) {
      const msg = e.message;
      onProgress?.('刷入失败: ' + msg);
      logger.error('开机自刷 TWRP 失败: ' + msg);
      return { success: false, error: msg };
    }
  }

  async installXposed(onProgress?: (msg: string) => void) {
    try {
      onProgress?.('等待设备开机完成...');
      await adbService.waitForBoot(120000);
      const androidVersion = await adbService.getProp('', 'ro.build.version.release');
      onProgress?.('您的设备安卓版本为: ' + androidVersion);
      const sdkVersion = (await adbService.getProp('', 'ro.build.version.sdk')).trim();
      onProgress?.('SDK 版本号: ' + sdkVersion);
      if (sdkVersion === '19') {
        return await this.installXposedSdk19(onProgress);
      }
      if (sdkVersion === '25') {
        return await this.installXposedSdk25(onProgress);
      }
      onProgress?.('不是安卓 4.4.4,也不是安卓 7.1.1,无法安装');
      return { success: false, error: '不支持的 SDK 版本: ' + sdkVersion + '(仅支持 19/25)' };
    } catch (e: any) {
      const msg = e.message;
      onProgress?.('Xposed 安装失败: ' + msg);
      logger.error('Xposed 安装失败: ' + msg);
      return { success: false, error: msg };
    }
  }

  async installXposedSdk19(onProgress?: (msg: string) => void) {
    try {
      const ensureOk = await this.ensureXposedResources(onProgress);
      if (!ensureOk.success) {
        return { success: false, error: ensureOk.error };
      }
      onProgress?.('安装 xpinstaller19.apk...');
      const apk1 = path.join(paths.resources, 'apks', 'xpinstaller19.apk');
      if (!fs.existsSync(apk1)) {
        return { success: false, error: 'apks/xpinstaller19.apk 不存在,请先在"资源下载"页下载 apks 资源' };
      }
      // @ts-ignore
      const r1 = await adbService.install(apk1, 'install');
      if (!r1.success) {
        return { success: false, error: '安装 xpinstaller19.apk 失败' };
      }
      onProgress?.('安装 19xposed.zip 模块...');
      const zip1 = path.join(paths.cache, '19xposed.zip');
      if (!fs.existsSync(zip1)) {
        return { success: false, error: 'tmp/19xposed.zip 不存在,请先在"资源下载"页下载 xp 资源' };
      }
      const r2 = await magiskService.install(zip1, 'shinst');
      if (!r2.success) {
        return { success: false, error: r2.error ?? '安装 19xposed.zip 失败' };
      }
      onProgress?.('重启手表...');
      await adbService.reboot('', 'system');
      onProgress?.('Xposed 安装成功');
      logger.info('Xposed 安装成功(SDK=19)');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async installXposedSdk25(onProgress?: (msg: string) => void) {
    try {
      const ensureOk = await this.ensureXposedResources(onProgress);
      if (!ensureOk.success) {
        return { success: false, error: ensureOk.error };
      }
      onProgress?.('安装 toolkit.apk...');
      const apkToolkit = path.join(paths.resources, 'apks', 'toolkit.apk');
      if (!fs.existsSync(apkToolkit)) {
        return { success: false, error: 'apks/toolkit.apk 不存在,请先在"资源下载"页下载 apks 资源' };
      }
      // @ts-ignore
      const r1 = await adbService.install(apkToolkit, 'install');
      if (!r1.success) {
        return { success: false, error: '安装 toolkit.apk 失败' };
      }
      onProgress?.('安装 xposed-magisk.apk...');
      const apkXp = path.join(paths.resources, 'apks', 'xposed-magisk.apk');
      if (!fs.existsSync(apkXp)) {
        return { success: false, error: 'apks/xposed-magisk.apk 不存在,请先在"资源下载"页下载 apks 资源' };
      }
      // @ts-ignore
      const r2 = await adbService.install(apkXp, 'install');
      if (!r2.success) {
        return { success: false, error: '安装 xposed-magisk.apk 失败' };
      }
      onProgress?.('安装 xposed-magisk-1.zip 模块...');
      const zip1 = path.join(paths.cache, 'xposed-magisk-1.zip');
      if (!fs.existsSync(zip1)) {
        return { success: false, error: 'tmp/xposed-magisk-1.zip 不存在,请先在"资源下载"页下载 xp 资源' };
      }
      const r3 = await magiskService.install(zip1, 'shinst');
      if (!r3.success) {
        return { success: false, error: r3.error ?? '安装 xposed-magisk-1.zip 失败' };
      }
      onProgress?.('重启手表(首次刷入 xp 可能需要 7-15 分钟开机时间,请耐心等待)...');
      await adbService.reboot('', 'system');
      onProgress?.('等待设备重新开机完成...');
      await adbService.waitForBoot(900000);
      await new Promise((r) => setTimeout(r, 10000));
      onProgress?.('安装 xposed-magisk-2.zip 模块...');
      const zip2 = path.join(paths.cache, 'xposed-magisk-2.zip');
      if (!fs.existsSync(zip2)) {
        return { success: false, error: 'tmp/xposed-magisk-2.zip 不存在,请先在"资源下载"页下载 xp 资源' };
      }
      const r4 = await magiskService.install(zip2, 'shinst');
      if (!r4.success) {
        return { success: false, error: r4.error ?? '安装 xposed-magisk-2.zip 失败' };
      }
      onProgress?.('重启手表...');
      await adbService.reboot('', 'system');
      onProgress?.('Xposed 安装成功');
      logger.info('Xposed 安装成功(SDK=25)');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async ensureXposedResources(_onProgress?: (msg: string) => void) {
    const xp19 = path.join(paths.cache, '19xposed.zip');
    const xp251 = path.join(paths.cache, 'xposed-magisk-1.zip');
    if (fs.existsSync(xp19) || fs.existsSync(xp251)) {
      return { success: true };
    }
    const apk19 = path.join(paths.resources, 'apks', 'xpinstaller19.apk');
    const apkTool = path.join(paths.resources, 'apks', 'toolkit.apk');
    const hasApks = fs.existsSync(apk19) || fs.existsSync(apkTool);
    if (!hasApks) {
      return { success: false, error: '缺少 apks 资源,请先在"资源下载"页下载 apks 资源' };
    }
    return { success: false, error: '缺少 xp 资源,请先在"资源下载"页下载 xp 资源(会自动解压到 cache/)' };
  }

  listImgFiles(dir: string) {
    try {
      return fs.readdirSync(dir).filter((f: string) => f.toLowerCase().endsWith('.img')).map((f: string) => path.join(dir, f));
    } catch {
      return [];
    }
  }

  async busyboxMd5(filePath: string) {
    try {
      const result = await subprocessPool.spawn({
        cmd: path.join(paths.bin, 'busybox.exe'),
        args: ['md5sum', filePath],
        encoding: 'utf-8',
        timeout: TIMEOUT.install,
        cwd: paths.bin,
        silent: true,
      });
      return result.stdout.trim().split(/\s+/)[0] || null;
    } catch {
      return null;
    }
  }

  adbExecOutToFile(shellCmd: string, outputFile: string) {
    return new Promise<void>((resolve, reject) => {
      const proc = spawn(this.adbPath, ['exec-out', shellCmd], { cwd: paths.bin, windowsHide: true, shell: false });
      const out = fs.createWriteStream(outputFile);
      proc.stdout?.pipe(out);
      let stderr = '';
      proc.stderr?.on('data', (chunk: Buffer) => { stderr += chunk.toString('utf-8'); });
      proc.on('error', (err: any) => {
        try { out.close(); } catch {}
        reject(new SpawnError('adb exec-out 启动失败: ' + err.message, -1, '', stderr, 0, false, false));
      });
      proc.on('close', (code: number | null) => {
        try { out.close(); } catch {}
        if (code === 0) {
          resolve();
        } else {
          reject(new SpawnError('adb exec-out 退出码 ' + code, code ?? -1, '', stderr, 0, false, false));
        }
      });
    });
  }

  adbExecInFromFile(shellCmd: string, inputFile: string) {
    return new Promise<void>((resolve, reject) => {
      const proc = spawn(this.adbPath, ['exec-in', shellCmd], { cwd: paths.bin, windowsHide: true, shell: false });
      const inp = fs.createReadStream(inputFile);
      let stderr = '';
      proc.stderr?.on('data', (chunk: Buffer) => { stderr += chunk.toString('utf-8'); });
      inp.on('error', (err: any) => {
        try { proc.kill(); } catch {}
        reject(new SpawnError('读取文件失败: ' + err.message, -1, '', stderr, 0, false, false));
      });
      inp.pipe(proc.stdin!);
      proc.on('error', (err: any) => {
        reject(new SpawnError('adb exec-in 启动失败: ' + err.message, -1, '', stderr, 0, false, false));
      });
      proc.on('close', (code: number | null) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new SpawnError('adb exec-in 退出码 ' + code, code ?? -1, '', stderr, 0, false, false));
        }
      });
    });
  }
}

export const backupService = new BackupServiceClass();
export default backupService;
