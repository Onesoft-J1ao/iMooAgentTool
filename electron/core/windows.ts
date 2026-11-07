import { BrowserWindow } from 'electron';
import { join } from 'node:path';
import { paths } from './paths';

let mainWindow: BrowserWindow | null = null;

export function createMainWindow(): BrowserWindow {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    show: false,
    icon: join(paths.assets, 'icon.png'),
    webPreferences: {
      preload: paths.preload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (paths.isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(join(paths.dist, 'index.html'));
  }

  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('system:window-state', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('system:window-state', false);
  });

  return mainWindow;
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}
