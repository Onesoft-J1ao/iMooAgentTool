import { ipcMain } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { appService } from '../services/AppService';
import { adbService } from '../services/AdbService';
import path from 'node:path';
import { paths } from '../core/paths';

export function registerAppIpc() {
  ipcMain.handle(
    'app:list',
    wrap(async (_event, serial: string) => {
      const out = await adbService.shell(serial, 'pm list packages -3');
      return out.split('\n')
        .map((l: string) => l.trim().replace(/^package:/, ''))
        .filter(Boolean);
    })
  );

  ipcMain.handle(
    'app:install',
    wrap(async (_event, { apkPath }: { apkPath: string }) => {
      return appService.installApk(apkPath);
    })
  );

  ipcMain.handle(
    'app:uninstall',
    wrap(async (_event, { serial, packageName }: { serial: string; packageName: string }) => {
      return adbService.uninstall(serial, packageName);
    })
  );

  ipcMain.handle(
    'app:unlock-z10',
    wrap(async () => {
      return appService.unlockZ10Install();
    })
  );

  ipcMain.handle(
    'app:enable-autostart',
    wrap(async (_event, { packageName, enabled }: { packageName: string; enabled: boolean }) => {
      return appService.enableAutoStart([packageName]);
    })
  );
}
