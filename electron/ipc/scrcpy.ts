import { ipcMain, BrowserWindow } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { scrcpyService } from '../services/ScrcpyService';
import type { ScrcpyOptions } from '../../shared/types';

export function registerScrcpyIpc() {
  ipcMain.handle(
    'scrcpy:launch',
    wrap(async (_event, { serial, options }: { serial?: string; options?: ScrcpyOptions }) => {
      return scrcpyService.launch(serial, options || {});
    })
  );

  ipcMain.handle(
    'scrcpy:stop',
    wrap(async (_event, { pid }: { pid: number }) => {
      return scrcpyService.stop(pid);
    })
  );

  ipcMain.handle(
    'scrcpy:stop-all',
    wrap(async () => {
      return scrcpyService.stopAll();
    })
  );

  ipcMain.handle(
    'scrcpy:list',
    wrap(async () => {
      return scrcpyService.listRunning();
    })
  );

  ipcMain.handle(
    'scrcpy:subscribe',
    wrap(async (event) => {
      const win = BrowserWindow.fromWebContents(event.sender);
      const handler = (data: unknown) => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('scrcpy:process-change', data);
        }
      };
      scrcpyService.on('process-change', handler);
      event.sender.on('destroyed', () => {
        scrcpyService.off('process-change', handler);
      });
    })
  );
}
