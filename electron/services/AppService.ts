import path from 'node:path';
import { paths } from '../core/paths';
import { subprocessPool, SpawnError } from './SubprocessPool';
import { adbService } from './AdbService';

const logger = {
  info: (...args: any[]) => console.log('[AppService]', ...args),
  warn: (...args: any[]) => console.warn('[AppService]', ...args),
  error: (...args: any[]) => console.error('[AppService]', ...args),
};

const TIMEOUT = {
  shell: 10000,
  install: 120000,
};

const DEFAULT_AUTOSTART_PACKAGES = [
  'com.tencent.qqlite',
  'com.tencent.qqwatch',
  'com.tencent.wechatkids',
];

class AppServiceClass {
  async unlockZ10Install() {
    const steps = [
      { name: '检查 ADB 设备', status: 'pending' },
      { name: '推送 switch.db 到 /sdcard/', status: 'pending' },
      { name: 'adb root(必须含 "restarting")', status: 'pending' },
      { name: '等待 3 秒', status: 'pending' },
      { name: 'setprop persist.sys.xtc.adb_port 1', status: 'pending' },
      { name: 'setprop persist.sys.adb.install 1', status: 'pending' },
      { name: 'cp switch.db 到桌面数据库', status: 'pending' },
      { name: 'setprop ctl.restart zygote(软重启)', status: 'pending' },
      { name: '安装 z10apk.Apk', status: 'pending' },
      { name: '安装 z10apk1.Apk', status: 'pending' },
    ];
    const runStep = async (i: number, fn: () => Promise<any>) => {
      steps[i].status = 'running';
      try {
        await fn();
        steps[i].status = 'success';
        return true;
      } catch (e: any) {
        steps[i].status = 'failed';
        steps[i].message = e.message;
        return false;
      }
    };
    let ok = await runStep(0, async () => {
      // @ts-ignore
      const devices = await adbService.devices();
      if (devices.length === 0) {
        throw new Error('未检测到 ADB 设备');
      }
    });
    if (!ok) {
      return { success: false, steps, error: steps[0].message };
    }
    const switchDbPath = path.join(paths.bin, 'switch.db');
    ok = await runStep(1, async () => {
      await adbService.push('', switchDbPath, '/sdcard/');
    });
    if (!ok) return { success: false, steps, error: steps[1].message };
    const rootOk = await runStep(2, async () => {
      const result = await subprocessPool.spawn({
        cmd: process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb',
        args: ['root'],
        encoding: 'gbk',
        timeout: TIMEOUT.shell,
        cwd: paths.bin,
      });
      if (!result.stdout.includes('restarting') && !result.stdout.includes('already')) {
        throw new Error('获取 root 权限时出错,可能没有降级或者不在 QMMI');
      }
    });
    if (!rootOk) {
      return { success: false, steps, error: steps[2].message };
    }
    await runStep(3, async () => {
      await new Promise((r) => setTimeout(r, 3000));
    });
    ok = await runStep(4, async () => {
      await adbService.shell('', 'setprop persist.sys.xtc.adb_port 1');
    });
    if (!ok) return { success: false, steps, error: steps[4].message };
    ok = await runStep(5, async () => {
      await adbService.shell('', 'setprop persist.sys.adb.install 1');
    });
    if (!ok) return { success: false, steps, error: steps[5].message };
    ok = await runStep(6, async () => {
      await adbService.shell('', "cp -R /sdcard/switch.db /data/data/com.xtc.i3launcher/databases/switch.db");
    });
    if (!ok) return { success: false, steps, error: steps[6].message };
    ok = await runStep(7, async () => {
      await adbService.shell('', 'setprop ctl.restart zygote');
      await new Promise((r) => setTimeout(r, 8000));
    });
    if (!ok) return { success: false, steps, error: steps[7].message };
    ok = await runStep(8, async () => {
      const apkPath = path.join(paths.resources, 'apks', 'z10apk.Apk');
      const result = await this.installApk(apkPath);
      if (!result.success) {
        throw new Error(result.error ?? '安装失败');
      }
    });
    if (!ok) return { success: false, steps, error: steps[8].message };
    ok = await runStep(9, async () => {
      const apkPath = path.join(paths.resources, 'apks', 'z10apk1.Apk');
      const result = await this.installApk(apkPath);
      if (!result.success) {
        throw new Error(result.error ?? '安装失败');
      }
    });
    if (!ok) return { success: false, steps, error: steps[9].message };
    logger.info('Z10 安装限制解除完成');
    return { success: true, steps };
  }

  async enableAutoStart(packages = DEFAULT_AUTOSTART_PACKAGES) {
    const results = [];
    for (const pkg of packages) {
      try {
        await adbService.shell('', `content call --uri content://com.xtc.launcher.self.start --method METHOD_SELF_START --extra EXTRA_ENABLE:b:true --arg ${pkg}`);
        results.push({ pkg, success: true });
      } catch (e: any) {
        results.push({ pkg, success: false, error: e.message });
      }
    }
    const success = results.every((r) => r.success);
    logger.info('开机自启设置完成: ' + results.filter((r: any) => r.success).length + '/' + results.length);
    return { success, results };
  }

  async installApk(apkPath: string) {
    try {
      const result = await subprocessPool.spawn({
        cmd: process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb',
        args: ['install', '-r', '-t', '-d', apkPath],
        encoding: 'gbk',
        timeout: TIMEOUT.install,
        cwd: paths.bin,
        onStdout: (line: string) => logger.info('install: ' + line),
      });
      const success = result.stdout.includes('Success');
      if (!success) {
        return { success: false, error: result.stdout.trim() || '安装失败' };
      }
      return { success: true };
    } catch (e: any) {
      if (e instanceof SpawnError) {
        return { success: false, error: e.stdout.trim() || e.message };
      }
      return { success: false, error: e.message };
    }
  }
}

export const appService = new AppServiceClass();
export default appService;
