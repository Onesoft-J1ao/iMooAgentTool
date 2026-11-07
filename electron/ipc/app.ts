import { ipcMain } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { appService } from '../services/AppService';
import { adbService } from '../services/AdbService';

export function registerAppIpc() {
  ipcMain.handle('app:list', wrap(async (_event, { serial }: { serial: string }) => {
    const packages = await adbService.listPackages(serial, true);
    const result: Array<{ package: string; name: string; version: string; system: boolean }> = [];
    for (const pkg of packages) {
      try {
        const info = await adbService.packageInfo(serial, pkg);
        result.push({
          package: pkg,
          name: info.label || pkg,
          version: info.versionName || info.versionCode || '',
          system: false,
        });
      } catch {
        result.push({ package: pkg, name: pkg, version: '', system: false });
      }
    }
    return result;
  }));

  ipcMain.handle('app:list-all', wrap(async (_event, { serial }: { serial: string }) => {
    const packages = await adbService.listPackages(serial, false);
    return packages.map((pkg: string) => ({ package: pkg, name: pkg, version: '', system: true }));
  }));

  ipcMain.handle('app:install', wrap(async (_event, { serial, apkPath }: { serial: string; apkPath: string }) => {
    return appService.installApk(serial, apkPath);
  }));

  ipcMain.handle('app:uninstall', wrap(async (_event, { serial, packageName, keepData }: { serial: string; packageName: string; keepData?: boolean }) => {
    return appService.uninstallApk(serial, packageName, keepData);
  }));

  ipcMain.handle('app:launch', wrap(async (_event, { serial, packageName }: { serial: string; packageName: string }) => {
    const out = await adbService.shell(serial, `monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`);
    if (/No activities found|aborted/i.test(out)) {
      throw new Error(`无法启动 ${packageName}: ${out.trim()}`);
    }
    return out;
  }));

  ipcMain.handle('app:force-stop', wrap(async (_event, { serial, packageName }: { serial: string; packageName: string }) => {
    return adbService.shell(serial, `am force-stop ${packageName}`);
  }));

  ipcMain.handle('app:clear-data', wrap(async (_event, { serial, packageName }: { serial: string; packageName: string }) => {
    return adbService.shell(serial, `pm clear ${packageName}`);
  }));

  ipcMain.handle('app:unlock-z10', wrap(async () => {
    return appService.unlockZ10Install();
  }));

  ipcMain.handle('app:enable-autostart', wrap(async (_event, { packageName, enabled }: { packageName: string; enabled: boolean }) => {
    return appService.enableAutoStart([packageName], enabled);
  }));

  ipcMain.handle('app:default-autostart', wrap(async (_event, { enabled }: { enabled: boolean }) => {
    return appService.enableAutoStart(undefined, enabled);
  }));
}
