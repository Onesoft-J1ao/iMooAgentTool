import { ipcMain } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { edlPartitionService } from '../services/EdlPartitionService';

export function registerEdlPartitionIpc() {
  ipcMain.handle(
    'edl-part:list-loaders',
    wrap(async () => {
      return edlPartitionService.listLoaders();
    })
  );

  ipcMain.handle(
    'edl-part:check-edl-device',
    wrap(async () => {
      const result = await edlPartitionService.checkEdlDevice();
      return { found: result.inEdl, port: result.port };
    })
  );

  ipcMain.handle(
    'edl-part:print-gpt',
    wrap(async (_event, { loader }: { loader: string }) => {
      const result = await edlPartitionService.printGpt({ loader });
      if (!result.success) throw new Error(result.error || '读取 GPT 失败');
      return result;
    })
  );

  ipcMain.handle(
    'edl-part:backup-partition',
    wrap(async (_event, { loader, label, outputFile }: { loader: string; label: string; outputFile: string }) => {
      return edlPartitionService.backupPartition({ loader, label, outputFile });
    })
  );

  ipcMain.handle(
    'edl-part:restore-partition',
    wrap(async (_event, { loader, label, inputFile }: { loader: string; label: string; inputFile: string }) => {
      return edlPartitionService.restorePartition({ loader, label, inputFile });
    })
  );

  ipcMain.handle(
    'edl-part:erase-partition',
    wrap(async (_event, { loader, label }: { loader: string; label: string }) => {
      return edlPartitionService.erasePartition({ loader, label });
    })
  );

  ipcMain.handle(
    'edl-part:verify-partition',
    wrap(async (_event, { loader, label, filePath }: { loader: string; label: string; filePath: string }) => {
      return edlPartitionService.verifyPartition({ loader, label, expectedFile: filePath });
    })
  );

  ipcMain.handle(
    'edl-part:reset-device',
    wrap(async (_event, { loader }: { loader: string }) => {
      return edlPartitionService.resetDevice({ loader });
    })
  );

  ipcMain.handle(
    'edl-part:get-history',
    wrap(async () => {
      return edlPartitionService.getHistory();
    })
  );

  ipcMain.handle(
    'edl-part:clear-history',
    wrap(async () => {
      edlPartitionService.clearHistory();
    })
  );
}
