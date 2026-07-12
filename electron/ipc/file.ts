import path from 'node:path';
import fs from 'node:fs';
import { ipcMain, BrowserWindow, dialog } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { fileService } from '../services/FileService';
import { adbService } from '../services/AdbService';
import { apkParser } from '../services/ApkParser';
import { paths as corePaths } from '../core/paths';

export function registerFileIpc() {
  const notifyWindows = (channel: string, data: any) => {
    for (const w of BrowserWindow.getAllWindows()) {
      if (!w.isDestroyed()) {
        w.webContents.send(channel, data);
      }
    }
  };

  ipcMain.handle(
    'file:list',
    wrap(async (_event, { serial, path: p }: { serial?: string; path: string }) => {
      return fileService.list(p, serial);
    })
  );

  ipcMain.handle(
    'file:stat',
    wrap(async (_event, { serial, path: p }: { serial?: string; path: string }) => {
      return fileService.stat(p, serial);
    })
  );

  ipcMain.handle(
    'file:mkdir',
    wrap(async (_event, { path: p }: { path: string }) => {
      return fileService.mkdir(p, true);
    })
  );

  ipcMain.handle(
    'file:remove',
    wrap(async (_event, { path: p }: { path: string }) => {
      return fileService.remove(p, true);
    })
  );

  ipcMain.handle(
    'file:rename',
    wrap(async (_event, { oldPath, newPath }: { oldPath: string; newPath: string }) => {
      return fileService.rename(oldPath, newPath);
    })
  );

  ipcMain.handle(
    'file:copy',
    wrap(async (_event, { src, dest }: { src: string; dest: string }) => {
      return fileService.copy(src, dest, true);
    })
  );

  ipcMain.handle(
    'file:push',
    wrap(async (_event, { serial, local, remote }: { serial?: string; local: string; remote: string }) => {
      return fileService.push(local, remote, serial);
    })
  );

  ipcMain.handle(
    'file:pull',
    wrap(async (_event, { serial, remote, local }: { serial?: string; remote: string; local: string }) => {
      return fileService.pull(remote, local, serial);
    })
  );

  ipcMain.handle(
    'file:read-text',
    wrap(async (_event, { path: p }: { path: string }) => {
      return fileService.readTextFile(p);
    })
  );

  ipcMain.handle(
    'file:write-file',
    wrap(async (_event, { path: p, content }: { path: string; content: string }) => {
      return fileService.writeFile(p, content);
    })
  );

  ipcMain.handle(
    'file:chmod',
    wrap(async (_event, { path: p, mode }: { path: string; mode: string }) => {
      return fileService.chmod(p, mode, false);
    })
  );

  ipcMain.handle(
    'file:batch-remove',
    wrap(async (_event, { paths: ps }: { paths: string[] }) => {
      return fileService.batchRemove(ps, true);
    })
  );

  ipcMain.handle(
    'file:search',
    wrap(async (_event, { serial, pattern, path: p }: { serial?: string; pattern: string; path?: string }) => {
      return fileService.searchInDir(p || '/sdcard', pattern, serial);
    })
  );

  ipcMain.handle(
    'file:exists',
    wrap(async (_event, { path: p }: { path: string }) => {
      return fileService.exists(p);
    })
  );

  ipcMain.handle(
    'file:quick-paths',
    wrap(async () => {
      return fileService.QUICK_PATHS;
    })
  );

  ipcMain.handle(
    'file:list-devices',
    wrap(async () => {
      return fileService.listDevices();
    })
  );

  ipcMain.handle(
    'file:create-file',
    wrap(async (_event, { path: p, content }: { path: string; content?: string }) => {
      return fileService.createFile(p, content || '');
    })
  );

  ipcMain.handle(
    'file:disk-info',
    wrap(async (_event, { path: p }: { path?: string }) => {
      return fileService.diskInfo(p || '/sdcard');
    })
  );

  ipcMain.handle(
    'file:parse-apk',
    wrap(async (_event, { apkPath }: { apkPath: string }) => {
      const meta = await apkParser.parse(apkPath);
      return {
        package: meta.packageName,
        name: meta.label,
        version: meta.versionName,
        icon: meta.iconBase64 ? `data:${meta.iconMime};base64,${meta.iconBase64}` : undefined,
      };
    })
  );

  ipcMain.handle(
    'file:install-apk',
    wrap(async (_event, { remoteApk }: { remoteApk: string }) => {
      return fileService.installRemoteApk(remoteApk);
    })
  );

  ipcMain.handle(
    'file:install-local-apk',
    wrap(async (_event, { serial }: { serial?: string }) => {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'APK files', extensions: ['apk'] }],
      });
      if (canceled || filePaths.length === 0) return '';
      const localPath = filePaths[0];
      const tmp = path.join(corePaths.cache, `install_${Date.now()}.apk`);
      fs.copyFileSync(localPath, tmp);
      return adbService.install(serial || '', tmp);
    })
  );

  ipcMain.handle(
    'file:set-compat-mode',
    wrap(async (_event, { enabled }: { enabled: boolean }) => {
      fileService.compatMode = enabled;
    })
  );

  ipcMain.handle(
    'file:set-keep-mtime',
    wrap(async (_event, { enabled }: { enabled: boolean }) => {
      fileService.keepMtime = enabled;
    })
  );

  fileService.on('transfer-progress', (progress: any) => {
    notifyWindows('file:transfer-progress', progress);
  });
}
