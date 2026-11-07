import path from 'node:path';
import fs from 'node:fs';
import { paths } from '../core/paths';
import { adbService } from './AdbService';

const logger = {
  info: (...args: any[]) => console.log('[AppService]', ...args),
  warn: (...args: any[]) => console.warn('[AppService]', ...args),
  error: (...args: any[]) => console.error('[AppService]', ...args),
};

const DEFAULT_AUTOSTART_PACKAGES = [
  'com.tencent.qqlite',
  'com.tencent.qqwatch',
  'com.tencent.wechatkids',
];

class AppServiceClass {
  async unlockZ10Install() {
    const steps: Array<{ name: string; status: string; message: string }> = [
      { name: '检查 ADB 设备', status: 'pending' as const, message: '' },
      { name: '推送 switch.db 到 /sdcard/', status: 'pending' as const, message: '' },
      { name: 'adb root', status: 'pending' as const, message: '' },
      { name: '等待 3 秒', status: 'pending' as const, message: '' },
      { name: 'setprop persist.sys.xtc.adb_port 1', status: 'pending' as const, message: '' },
      { name: 'setprop persist.sys.adb.install 1', status: 'pending' as const, message: '' },
      { name: '替换桌面 switch.db', status: 'pending' as const, message: '' },
      { name: '重启 zygote', status: 'pending' as const, message: '' },
      { name: '安装 z10apk.Apk', status: 'pending' as const, message: '' },
      { name: '安装 z10apk1.Apk', status: 'pending' as const, message: '' },
    ];

    const runStep = async (index: number, fn: () => Promise<unknown>) => {
      steps[index].status = 'running';
      try {
        await fn();
        steps[index].status = 'success';
        return true;
      } catch (e) {
        steps[index].status = 'failed';
        steps[index].message = (e as Error).message;
        return false;
      }
    };

    let ok = await runStep(0, async () => {
      const devices = await adbService.devices();
      if (!devices.some((d) => d.state === 'device')) {
        throw new Error('未检测到 ADB 设备');
      }
    });
    if (!ok) return { success: false, steps, error: steps[0].message };

    const switchDbPath = path.join(paths.bin, 'switch.db');
    if (!fs.existsSync(switchDbPath)) {
      steps[1].status = 'failed';
      steps[1].message = `缺少文件: ${switchDbPath}`;
      return { success: false, steps, error: steps[1].message };
    }

    ok = await runStep(1, async () => {
      await adbService.push('', switchDbPath, '/sdcard/');
    });
    if (!ok) return { success: false, steps, error: steps[1].message };

    ok = await runStep(2, async () => {
      const result = await adbService.root('');
      if (!result.granted) {
        throw new Error('获取 root 权限失败，可能没有降级或不在 QMMI');
      }
    });
    if (!ok) return { success: false, steps, error: steps[2].message };

    await runStep(3, async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
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
      await adbService.shell('', 'cp -R /sdcard/switch.db /data/data/com.xtc.i3launcher/databases/switch.db');
    });
    if (!ok) return { success: false, steps, error: steps[6].message };

    ok = await runStep(7, async () => {
      await adbService.shell('', 'setprop ctl.restart zygote');
      await new Promise((resolve) => setTimeout(resolve, 8000));
    });
    if (!ok) return { success: false, steps, error: steps[7].message };

    const apks = ['z10apk.Apk', 'z10apk1.Apk'];
    for (let i = 0; i < apks.length; i++) {
      const apkPath = path.join(paths.resources, 'apks', apks[i]);
      ok = await runStep(8 + i, async () => {
        if (!fs.existsSync(apkPath)) {
          throw new Error(`缺少资源: ${apkPath}，请先下载 apks 资源`);
        }
        const result = await adbService.install('', apkPath);
        if (!result.success) throw new Error(result.error ?? '安装失败');
      });
      if (!ok) return { success: false, steps, error: steps[8 + i].message };
    }

    logger.info('Z10 安装限制解除完成');
    return { success: true, steps };
  }

  async enableAutoStart(packages = DEFAULT_AUTOSTART_PACKAGES, enabled = true) {
    const results: Array<{ pkg: string; success: boolean; error?: string }> = [];
    for (const pkg of packages) {
      try {
        await adbService.shell(
          '',
          `content call --uri content://com.xtc.launcher.self.start --method METHOD_SELF_START --extra EXTRA_ENABLE:b:${enabled} --arg ${pkg}`
        );
        results.push({ pkg, success: true });
      } catch (e) {
        results.push({ pkg, success: false, error: (e as Error).message });
      }
    }
    const success = results.every((r) => r.success);
    logger.info(`开机自启${enabled ? '设置' : '取消'}完成: ${results.filter((r) => r.success).length}/${results.length}`);
    return { success, results };
  }

  async installApk(serial: string, apkPath: string) {
    if (!fs.existsSync(apkPath)) {
      return { success: false, error: `APK 不存在: ${apkPath}` };
    }
    const result = await adbService.install(serial, apkPath);
    if (result.success) logger.info(`安装成功: ${apkPath}`);
    else logger.warn(`安装失败: ${apkPath} - ${result.error}`);
    return result;
  }

  async uninstallApk(serial: string, packageName: string, keepData = false) {
    const cmd = `pm uninstall${keepData ? ' -k' : ''} ${packageName}`;
    const output = await adbService.shell(serial, cmd);
    const success = /\bSuccess\b/i.test(output);
    return { success, output, error: success ? undefined : output.trim() || '卸载失败' };
  }
}

export const appService = new AppServiceClass();
export default appService;
