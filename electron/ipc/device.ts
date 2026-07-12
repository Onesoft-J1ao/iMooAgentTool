import { ipcMain } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { DeviceService } from '../services/DeviceService';
import type { DeviceType } from "../../shared/types";

export function registerDeviceIpc() {
  ipcMain.handle(
    'device:current',
    wrap(async () => {
      return DeviceService.instance.getCurrentDevice();
    })
  );

  ipcMain.handle(
    'device:wait',
    wrap(async (_event, { types, timeout }: { types: DeviceType[]; timeout?: number }) => {
      return DeviceService.instance.waitFor(types, timeout);
    })
  );
}
