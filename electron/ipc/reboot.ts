import { ipcMain } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { rebootService } from '../services/RebootService';
import { DeviceService } from '../services/DeviceService';
import type { RebootMode } from '../../shared/types';

export function registerRebootIpc() {
  ipcMain.handle(
    'reboot:execute',
    wrap(async (_event, { mode, innermodel, platform }: { mode: RebootMode; innermodel?: string; platform?: string }) => {
      const device = DeviceService.instance.getCurrentDevice();
      return rebootService.reboot({
        mode,
        innermodel: innermodel || device?.innermodel,
        platform: platform || device?.platform,
      });
    })
  );
}
