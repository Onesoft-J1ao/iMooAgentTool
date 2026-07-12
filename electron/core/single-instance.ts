import { app, BrowserWindow } from 'electron';

export function ensureSingleInstance(): boolean {
  const gotLock = app.requestSingleInstanceLock();

  if (!gotLock) {
    app.on('second-instance', () => {
      const windows = BrowserWindow.getAllWindows();
      if (windows.length > 0) {
        const main = windows[0];
        if (main.isMinimized()) main.restore();
        main.focus();
      }
    });
  }

  return gotLock;
}
