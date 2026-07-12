import { app, BrowserWindow, Menu } from 'electron';
import { createMainWindow } from './core/windows';
import { buildAppMenu } from './core/menu';
import { ensureSingleInstance } from './core/single-instance';
import { paths } from './core/paths';
import { Logger } from './services/Logger';
import { DeviceService } from './services/DeviceService';
import { registerAllIpc } from './ipc';

if (!ensureSingleInstance()) {
  process.exit(0);
}

const logger = Logger.instance;
logger.info('main', `iMooDesktop 启动(dev=${paths.isDev})`);

const deviceService = DeviceService.instance;

app.whenReady().then(() => {
  Menu.setApplicationMenu(buildAppMenu());
  createMainWindow();
  registerAllIpc();
  deviceService.start();
  logger.info('main', '应用就绪');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  deviceService.stop();
  logger.info('main', '应用退出');
});

process.on('uncaughtException', (err) => {
  logger.error('main', `未捕获异常: ${err.message}`, err.stack);
});

process.on('unhandledRejection', (reason) => {
  logger.error('main', `未处理的 Promise 拒绝: ${String(reason)}`);
});
