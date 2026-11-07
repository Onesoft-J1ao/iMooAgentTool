import { ipcMain } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { magiskService } from '../services/MagiskService';
import type { MagiskModule, StoreModule, InstallMethod, UninstallMethod } from '../../shared/types';

export function registerMagiskIpc() {
  ipcMain.handle(
    'magisk:list',
    wrap(async (): Promise<MagiskModule[]> => {
      return magiskService.list();
    })
  );

  ipcMain.handle(
    'magisk:install',
    wrap(async (_event, { zipPath, method }: { zipPath: string; method: InstallMethod }) => {
      return magiskService.install(zipPath, method);
    })
  );

  ipcMain.handle(
    'magisk:uninstall',
    wrap(async (_event, { moduleId, method }: { moduleId: string; method: UninstallMethod }) => {
      return magiskService.uninstall(moduleId, method);
    })
  );

  ipcMain.handle(
    'magisk:enable',
    wrap(async (_event, { moduleId }: { moduleId: string }) => {
      return magiskService.enable(moduleId);
    })
  );

  ipcMain.handle(
    'magisk:disable',
    wrap(async (_event, { moduleId }: { moduleId: string }) => {
      return magiskService.disable(moduleId);
    })
  );

  ipcMain.handle(
    'magisk:store-search',
    wrap(async (_event, query: string): Promise<StoreModule[]> => {
      return magiskService.storeSearch(query);
    })
  );

  ipcMain.handle(
    'magisk:store-install',
    wrap(async (_event, { module }: { module: StoreModule }) => {
      return magiskService.installFromStore(module);
    })
  );
}
