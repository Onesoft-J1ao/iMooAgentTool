import { ipcMain } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { adbService } from '../services/AdbService';
import { driverService } from '../services/DriverService';
import { otaService } from '../services/OtaService';
import { rootProService } from '../services/RootProService';
import { atbmodService } from '../services/AtbmodService';
import { updateService } from '../services/UpdateService';

export function registerToolsIpc() {
  ipcMain.handle('tools:open-charge', wrap(async (_event, serial: string) => {
    return adbService.shell(serial, 'svc power stayon true');
  }));

  ipcMain.handle('tools:read-build-props', wrap(async (_event, serial: string) => {
    return adbService.shell(serial, 'getprop');
  }));

  ipcMain.handle('tools:wifi-enable', wrap(async (_event, serial: string) => {
    await adbService.shell(serial, 'svc wifi enable');
    return adbService.tcpip(serial, 5555);
  }));

  ipcMain.handle('tools:wifi-connect', wrap(async (_event, { host, port }: { host: string; port?: number }) => {
    return adbService.connect(host, port || 5555);
  }));

  ipcMain.handle('tools:wifi-disconnect', wrap(async (_event, { host, port }: { host: string; port?: number }) => {
    return adbService.disconnect(host, port || 5555);
  }));

  ipcMain.handle('tools:wifi-pair', wrap(async (_event, { host, port, code }: { host: string; port: number; code: string }) => {
    return adbService.pair(host, port, code);
  }));

  ipcMain.handle('tools:ota-start', wrap(async (_event, { zipPath }: { zipPath: string }) => {
    return otaService.start({ zipPath });
  }));

  ipcMain.handle('tools:rootpro', wrap(async (_event, options: { installApks?: boolean; installDesktop?: boolean; installMods?: boolean }) => {
    return rootProService.run(options);
  }));

  ipcMain.handle('tools:check-drivers', wrap(async () => {
    return driverService.check();
  }));

  ipcMain.handle('tools:install-drivers', wrap(async () => {
    return driverService.installDrivers();
  }));

  ipcMain.handle('tools:atbmod-scan', wrap(async () => {
    return atbmodService.scan();
  }));

  ipcMain.handle('tools:atbmod-install', wrap(async (_event, { file }: { file: string }) => {
    return atbmodService.install(file);
  }));

  ipcMain.handle('tools:atbmod-list', wrap(async () => {
    return atbmodService.listInstalled();
  }));

  ipcMain.handle('tools:atbmod-uninstall', wrap(async (_event, { modid }: { modid: string }) => {
    return atbmodService.uninstall(modid);
  }));

  ipcMain.handle('tools:check-app-update', wrap(async () => {
    return updateService.checkForUpdate();
  }));
}
