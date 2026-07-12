import { ipcMain } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { rootService } from '../services/RootService';
import type { RootOptions, RootContext } from "../../shared/types";

export function registerRootIpc() {
  ipcMain.handle(
    'root:start',
    wrap(async (_event, options: RootOptions): Promise<string> => {
      return rootService.start(options);
    })
  );

  ipcMain.handle(
    'root:cancel',
    wrap(async (_event, { taskId }: { taskId: string }): Promise<void> => {
      return rootService.cancel(taskId);
    })
  );

  ipcMain.handle(
    'root:pause',
    wrap(async (_event, { taskId }: { taskId: string }): Promise<void> => {
      return rootService.pause(taskId);
    })
  );

  ipcMain.handle(
    'root:resume',
    wrap(async (_event, { taskId }: { taskId: string }): Promise<void> => {
      return rootService.resume(taskId);
    })
  );

  ipcMain.handle(
    'root:get-context',
    wrap(async (_event, { taskId }: { taskId: string }): Promise<RootContext | null> => {
      return rootService.getContext(taskId);
    })
  );
}
