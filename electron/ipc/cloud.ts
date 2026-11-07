import { ipcMain } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { cloudService } from '../services/CloudService';
import type { CloudResource } from '../../shared/types';

export function registerCloudIpc() {
  ipcMain.handle('cloud:list', wrap(async (): Promise<CloudResource[]> => {
    return cloudService.list();
  }));

  ipcMain.handle('cloud:list-by-category', wrap(async (): Promise<Record<string, CloudResource[]>> => {
    return cloudService.listByCategory();
  }));

  ipcMain.handle('cloud:download', wrap(async (_event, { name }: { name: string }) => {
    return cloudService.download(name);
  }));

  ipcMain.handle('cloud:check-updates', wrap(async () => {
    return cloudService.checkUpdates();
  }));
}
