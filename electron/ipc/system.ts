import path from 'node:path';
import { ipcMain, dialog, shell, BrowserWindow } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { config } from '../core/config';
import { resourceService } from '../services/ResourceService';
import { paths } from '../core/paths';
import { APP_META } from "../../shared/types";
import type { AppSettings, VerifyResult } from "../../shared/types";

export function registerSystemIpc() {
  ipcMain.handle(
    'system:get-settings',
    wrap(async () => {
      return config.getSettings();
    })
  );

  ipcMain.handle(
    'system:set-settings',
    wrap(async (_event, settings: Partial<AppSettings>) => {
      return config.setSettings(settings);
    })
  );

  ipcMain.handle(
    'system:pick-file',
    wrap(async (_event, { kind, filter, multi }: { kind: 'open' | 'folder'; filter?: string; multi?: boolean }) => {
      const options: Electron.OpenDialogOptions = {};
      if (kind === 'folder') {
        options.properties = ['openDirectory'];
      } else {
        options.properties = multi ? ['openFile', 'multiSelections'] : ['openFile'];
        if (filter) options.filters = [{ name: 'Filter', extensions: filter.split(',') }];
      }
      const result = await dialog.showOpenDialog(options);
      if (result.canceled || result.filePaths.length === 0) return null;
      if (multi) return result.filePaths;
      return result.filePaths[0];
    })
  );

  ipcMain.handle(
    'system:open-external',
    wrap(async (_event, { url }: { url: string }) => {
      await shell.openExternal(url);
    })
  );

  ipcMain.handle(
    'system:show-in-folder',
    wrap(async (_event, { path: p }: { path: string }) => {
      shell.showItemInFolder(p);
    })
  );

  ipcMain.handle(
    'system:verify-resources',
    wrap(async (): Promise<VerifyResult[]> => {
      return resourceService.verify(path.join(paths.resources, 'manifest.json'), paths.resources);
    })
  );

  ipcMain.handle(
    'system:get-version',
    wrap(async () => {
      return { version: APP_META.version, buildDate: APP_META.buildDate };
    })
  );

  ipcMain.handle(
    'system:set-window-opacity',
    wrap(async (_event, opacity: number) => {
      const win = BrowserWindow.getFocusedWindow();
      if (win) win.setOpacity(Math.max(0.2, Math.min(1, opacity)));
    })
  );

  ipcMain.handle(
    'system:window-minimize',
    wrap(async () => {
      const win = BrowserWindow.getFocusedWindow();
      if (win) win.minimize();
    })
  );

  ipcMain.handle(
    'system:window-toggle-maximize',
    wrap(async () => {
      const win = BrowserWindow.getFocusedWindow();
      if (!win) return;
      if (win.isMaximized()) win.unmaximize();
      else win.maximize();
    })
  );

  ipcMain.handle(
    'system:window-close',
    wrap(async () => {
      const win = BrowserWindow.getFocusedWindow();
      if (win) win.close();
    })
  );

  ipcMain.handle(
    'system:window-is-maximized',
    wrap(async (): Promise<boolean> => {
      const win = BrowserWindow.getFocusedWindow();
      return win ? win.isMaximized() : false;
    })
  );

  ipcMain.handle(
    'system:open-terminal',
    wrap(async (_event, { cwd }: { cwd?: string }) => {
      const terminal = process.env.COMSPEC || 'cmd.exe';
      const childProcess = await import('child_process');
      childProcess.exec(`start "${terminal}" ${cwd ? `/D "${cwd}"` : ''}`, { cwd });
    })
  );
}
