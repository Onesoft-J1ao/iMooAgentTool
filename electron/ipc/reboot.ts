import { ipcMain } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { rebootService } from '../services/RebootService';
import type { RebootMode } from "../../shared/types";

export function registerRebootIpc() {
  ipcMain.handle(
    'reboot:execute',
    wrap(async (_event, { mode, innermodel, platform }: { mode: RebootMode; innermodel?: string; platform?: string }) => {
      return rebootService.reboot({ mode, innermodel, platform });
    })
  );
}
