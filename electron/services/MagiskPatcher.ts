import path from 'node:path';
import fs from 'node:fs';
import { paths } from '../core/paths';
import { subprocessPool } from './SubprocessPool';

const logger = {
  info: (...args: any[]) => console.log('[MagiskPatcher]', ...args),
  warn: (...args: any[]) => console.warn('[MagiskPatcher]', ...args),
  error: (...args: any[]) => console.error('[MagiskPatcher]', ...args),
  debug: (...args: any[]) => console.debug('[MagiskPatcher]', ...args),
};

async function magiskboot(args: string[], opts: any = { cwd: paths.edl }) {
  const magiskbootExe = path.join(paths.bin, 'magiskboot.exe');
  try {
    const r = await subprocessPool.spawn({
      cmd: magiskbootExe,
      args,
      cwd: opts.cwd,
      encoding: 'utf-8',
      timeout: opts.timeout ?? 60000,
      taskId: opts.taskId,
      onStdout: (line: string) => logger.debug('magiskboot: ' + line),
      onStderr: (line: string) => logger.warn('magiskboot stderr: ' + line),
    });
    return { stdout: r.stdout, stderr: r.stderr, exitCode: r.exitCode ?? 0 };
  } catch (e: any) {
    if (e.exitCode !== undefined && e.exitCode !== null) {
      return { stdout: e.stdout ?? '', stderr: e.stderr ?? '', exitCode: e.exitCode };
    }
    throw e;
  }
}

class MagiskPatcherClass {
  async patch(bootImg: string, outputPath: string, magiskVer: number, workDir: string = path.join(paths.edl, 'work'), taskId?: string) {
    if (!fs.existsSync(bootImg)) {
      return { success: false, status: 'stock', error: 'boot.img 不存在: ' + bootImg };
    }
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    logger.info('开始修补 boot.img(magisk ' + magiskVer + '): ' + bootImg + ' → ' + outputPath);
    const tempFiles = ['magiskinit', 'header', 'kernel_dtb', 'kernel', 'ramdisk.cpio', 'config', 'ramdisk.cpio.orig'];
    for (const f of tempFiles) {
      const p = path.join(workDir, f);
      try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch {}
    }
    const magiskinitSrc = path.join(paths.bin, 'magiskinit' + magiskVer);
    const magiskinitDst = path.join(workDir, 'magiskinit');
    if (!fs.existsSync(magiskinitSrc)) {
      return { success: false, status: 'stock', error: 'magiskinit' + magiskVer + ' 不存在' };
    }
    fs.copyFileSync(magiskinitSrc, magiskinitDst);
    const KEEPVERITY = 'true';
    const KEEPFORCEENCRYPT = 'true';
    const PATCHVBMETAFLAG = magiskVer === 25 ? 'false' : undefined;
    let RECOVERYMODE = 'false';
    if (magiskVer === 25) {
      const magisk32xzSrc = path.join(paths.bin, 'magisk32.xz');
      if (!fs.existsSync(magisk32xzSrc)) {
        return { success: false, status: 'stock', error: 'magisk32.xz 不存在' };
      }
      fs.copyFileSync(magisk32xzSrc, path.join(workDir, 'magisk32.xz'));
    }
    await magiskboot(['unpack', '-h', bootImg], { cwd: workDir, taskId });
    if (magiskVer === 21) {
      if (fs.existsSync(path.join(workDir, 'recovery_dtbo'))) {
        RECOVERYMODE = 'true';
        logger.info('检测到 recovery_dtbo,RECOVERYMODE 强制设为 true');
      }
    }
    let STATUS = 0;
    let sha1 = '';
    let status = 'stock';
    if (!fs.existsSync(path.join(workDir, 'ramdisk.cpio'))) {
      STATUS = 0;
    } else {
      const testResult = await magiskboot(['cpio', 'ramdisk.cpio', 'test'], { cwd: workDir, taskId });
      STATUS = testResult.exitCode;
      if (STATUS !== 0 && STATUS !== 1) {
        return { success: false, status: 'stock', error: 'magiskboot cpio test 返回异常 exitCode: ' + STATUS };
      }
    }
    if (STATUS === 0) {
      status = 'stock';
      const sha1Result = await magiskboot(['sha1', bootImg], { cwd: workDir, taskId });
      sha1 = sha1Result.stdout.trim().split(/\s+/)[0] ?? '';
      const ramdiskCpio = path.join(workDir, 'ramdisk.cpio');
      const ramdiskOrig = path.join(workDir, 'ramdisk.cpio.orig');
      if (fs.existsSync(ramdiskCpio)) {
        fs.copyFileSync(ramdiskCpio, ramdiskOrig);
      }
    } else {
      status = 'magisk-patched';
      const sha1Result = await magiskboot(['cpio', 'ramdisk.cpio', 'sha1'], { cwd: workDir, taskId });
      sha1 = sha1Result.stdout.trim().split(/\s+/)[0] ?? '';
      await magiskboot(['cpio', 'ramdisk.cpio', 'restore'], { cwd: workDir, taskId });
      status = 'restored';
      const ramdiskCpio = path.join(workDir, 'ramdisk.cpio');
      const ramdiskOrig = path.join(workDir, 'ramdisk.cpio.orig');
      if (fs.existsSync(ramdiskCpio)) {
        fs.copyFileSync(ramdiskCpio, ramdiskOrig);
      }
    }
    const configLines: string[] = [];
    configLines.push('KEEPVERITY=' + KEEPVERITY);
    configLines.push('KEEPFORCEENCRYPT=' + KEEPFORCEENCRYPT);
    if (PATCHVBMETAFLAG !== undefined) {
      configLines.push('PATCHVBMETAFLAG=' + PATCHVBMETAFLAG);
    }
    configLines.push('RECOVERYMODE=' + RECOVERYMODE);
    if (sha1) {
      configLines.push('SHA1=' + sha1);
    }
    fs.writeFileSync(path.join(workDir, 'config'), configLines.join('\n') + '\n', 'utf-8');
    if (magiskVer === 25) {
      await magiskboot([
        'cpio',
        'ramdisk.cpio',
        'add 0750 init magiskinit',
        'mkdir 0750 overlay.d',
        'mkdir 0750 overlay.d/sbin',
        'add 0644 overlay.d/sbin/magisk32.xz magisk32.xz',
        '# add 0644 overlay.d/sbin/magisk64.xz magisk64.xz',
        'patch',
        'backup ramdisk.cpio.orig',
        'mkdir 000 .backup',
        'add 000 .backup/.magisk config',
      ], { cwd: workDir, taskId });
    } else {
      await magiskboot([
        'cpio',
        'ramdisk.cpio',
        'add 750 init magiskinit',
        'patch',
        'backup ramdisk.cpio.orig',
        'mkdir 000 .backup',
        'add 000 .backup/.magisk config',
      ], { cwd: workDir, taskId });
    }
    if (magiskVer === 25) {
      for (const dtbName of ['dtb', 'kernel_dtb', 'extra']) {
        const dtbPath = path.join(workDir, dtbName);
        if (fs.existsSync(dtbPath)) {
          await magiskboot(['dtb', dtbName, 'test'], { cwd: workDir, taskId });
          await magiskboot(['dtb', dtbName, 'patch'], { cwd: workDir, taskId });
        }
      }
    } else {
      let dtbName: string | null = null;
      for (const name of ['dtb', 'kernel_dtb', 'extra', 'recovery_dtbo']) {
        if (fs.existsSync(path.join(workDir, name))) {
          dtbName = name;
          break;
        }
      }
      if (dtbName) {
        await magiskboot(['dtb', dtbName, 'patch'], { cwd: workDir, taskId });
      }
    }
    await magiskboot([
      'hexpatch', 'kernel',
      '49010054011440B93FA00F71E9000054010840B93FA00F7189000054001840B91FA00F7188010054',
      'A1020054011440B93FA00F7140020054010840B93FA00F71E0010054001840B91FA00F7181010054',
    ], { cwd: workDir, taskId });
    await magiskboot(['hexpatch', 'kernel', '821B8012', 'E2FF8F12'], { cwd: workDir, taskId });
    await magiskboot([
      'hexpatch', 'kernel',
      '77616E745F696E697472616D667300',
      '736B69705F696E697472616D667300',
    ], { cwd: workDir, taskId });
    await magiskboot(['repack', bootImg, 'boot_new.img'], { cwd: workDir, taskId });
    const bootNewPath = path.join(workDir, 'boot_new.img');
    if (!fs.existsSync(bootNewPath)) {
      return { success: false, status, sha1, error: 'magiskboot repack 未生成 boot_new.img' };
    }
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
    fs.renameSync(bootNewPath, outputPath);
    for (const f of tempFiles) {
      const p = path.join(workDir, f);
      try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch {}
    }
    if (magiskVer === 25) {
      try {
        const p = path.join(workDir, 'magisk32.xz');
        if (fs.existsSync(p)) fs.unlinkSync(p);
      } catch {}
    }
    logger.info('boot.img 修补完成: ' + outputPath + '(status=' + status + ')');
    return { success: true, status, sha1 };
  }
}

export const magiskPatcher = new MagiskPatcherClass();
export default magiskPatcher;
