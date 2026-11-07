import { ipcMain } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { fileService } from '../services/FileService';
import { adbService } from '../services/AdbService';
import { apkParser } from '../services/ApkParser';
import { paths } from '../core/paths';
import fs from 'node:fs';
import path from 'node:path';

export function registerFileIpc() {
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
    wrap(async (_event, { serial, path: p }: { serial?: string; path: string }) => {
      return fileService.mkdir(p, true, serial);
    })
  );

  ipcMain.handle(
    'file:remove',
    wrap(async (_event, { serial, path: p }: { serial?: string; path: string }) => {
      return fileService.remove(p, true, serial);
    })
  );

  ipcMain.handle(
    'file:rename',
    wrap(async (_event, { serial, oldPath, newPath }: { serial?: string; oldPath: string; newPath: string }) => {
      return fileService.rename(oldPath, newPath, serial);
    })
  );

  ipcMain.handle(
    'file:copy',
    wrap(async (_event, { serial, src, dest }: { serial?: string; src: string; dest: string }) => {
      return fileService.copy(src, dest, true, serial);
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
    'file:push-folder',
    wrap(async (_event, { serial, localDir, remoteDir }: { serial?: string; localDir: string; remoteDir: string }) => {
      if (!fs.existsSync(localDir) || !fs.statSync(localDir).isDirectory()) {
        throw new Error('本地目录不存在: ' + localDir);
      }
      const target = `${remoteDir.replace(/\/+$/, '')}/${path.basename(localDir)}`;
      await fileService.mkdir(target, true, serial);
      const walk = async (dir: string, remoteBase: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const localPath = path.join(dir, entry.name);
          const remotePath = `${remoteBase}/${entry.name}`;
          if (entry.isDirectory()) {
            await fileService.mkdir(remotePath, true, serial);
            await walk(localPath, remotePath);
          } else {
            await fileService.push(localPath, remotePath, serial);
          }
        }
      };
      await walk(localDir, target);
      return target;
    })
  );

  ipcMain.handle(
    'file:install-apk',
    wrap(async (_event, { serial, remoteApk }: { serial?: string; remoteApk: string }) => {
      return fileService.installRemoteApk(remoteApk, serial);
    })
  );

  ipcMain.handle(
    'file:install-local-apk',
    wrap(async (_event, { serial }: { serial?: string }) => {
      const { dialog } = await import('electron');
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'APK files', extensions: ['apk'] }],
      });
      if (canceled || filePaths.length === 0) return '';
      if (!fs.existsSync(paths.cache)) fs.mkdirSync(paths.cache, { recursive: true });
      const tmp = path.join(paths.cache, `install_${Date.now()}.apk`);
      fs.copyFileSync(filePaths[0], tmp);
      const result = await adbService.install(serial || '', tmp);
      try { fs.unlinkSync(tmp); } catch { /* ignore */ }
      if (!result.success) throw new Error(result.error || '安装失败');
      return result.output;
    })
  );

  ipcMain.handle(
    'file:disk-info',
    wrap(async (_event, { path: p }: { path?: string }) => {
      return fileService.diskInfo(p || '/sdcard');
    })
  );

  ipcMain.handle(
    'file:read-text',
    wrap(async (_event, { path: p }: { path: string }) => {
      return fileService.readTextFile(p);
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
}
