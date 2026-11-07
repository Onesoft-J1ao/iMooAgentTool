import { ipcMain, BrowserWindow } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { backupService } from '../services/BackupService';
import { edlService } from '../services/EdlService';
import { adbService } from '../services/AdbService';
import { paths } from '../core/paths';
import fs from 'node:fs';
import path from 'node:path';
import type { AdbDdMatchResult } from '../../shared/types';

function broadcast(channel: string, payload: unknown) {
  for (const win of BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.webContents.send(channel, payload);
  }
}

function progress(stage: string, percent: number, message: string) {
  broadcast('backup:progress', { stage, percent, message });
}

export function registerBackupIpc() {
  ipcMain.handle(
    'backup:dcim-backup',
    wrap(async (_event, { outputDir }: { outputDir: string }) => {
      return backupService.backupDcim(outputDir, (msg) => progress('DCIM 备份', 50, msg));
    })
  );

  ipcMain.handle(
    'backup:dcim-recover',
    wrap(async (_event, { inputDir }: { inputDir: string }) => {
      return backupService.recoverDcim(inputDir, (msg) => progress('DCIM 恢复', 50, msg));
    })
  );

  ipcMain.handle(
    'backup:adbdd-backup',
    wrap(async (_event, { outputDir }: { outputDir: string }) => {
      return backupService.backupAdbDd(outputDir, (msg) => progress('ADB-dd 备份', 50, msg));
    })
  );

  ipcMain.handle(
    'backup:adbdd-recover',
    wrap(async (_event, { zipPath }: { zipPath: string }) => {
      return backupService.recoverAdbDd(zipPath, (msg) => progress('ADB-dd 恢复', 50, msg));
    })
  );

  ipcMain.handle(
    'backup:adbdd-prepare',
    wrap(async (_event, { zipPath }: { zipPath: string }): Promise<AdbDdMatchResult & { extractDir?: string; success?: boolean; error?: string }> => {
      const result = await backupService.prepareAdbDdRecover(zipPath, (msg) => progress('准备恢复', 30, msg));
      if (!result.success || !result.match) {
        return { matched: [], skipped: [], extractDir: result.extractDir, success: false, error: result.error };
      }
      return { ...result.match, extractDir: result.extractDir, success: true };
    })
  );

  ipcMain.handle(
    'backup:adbdd-execute',
    wrap(async (_event, { extractDir, parts }: { extractDir: string; parts: string[] }) => {
      return backupService.executeAdbDdRecover(extractDir, parts, (msg) => progress('恢复分区', 50, msg));
    })
  );

  ipcMain.handle(
    'backup:edl-backup',
    wrap(async (_event, { xmlFiles, backupDir, port }: { xmlFiles: string[]; backupDir: string; port: string }) => {
      if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
      return edlService.backup9008(xmlFiles, backupDir, port, (msg) => progress('EDL 备份', 50, msg));
    })
  );

  ipcMain.handle(
    'backup:edl-recover',
    wrap(async (_event, { archivePath, xmlFiles, port }: { archivePath: string; xmlFiles: string[]; port: string }) => {
      return edlService.recover9008(archivePath, xmlFiles, port, (msg) => progress('EDL 恢复', 50, msg));
    })
  );

  ipcMain.handle(
    'backup:super-recovery',
    wrap(async (_event, { xmlSets, port }: { xmlSets: string[][]; port: string }) => {
      return edlService.superRecovery(xmlSets, port, (msg) => progress('Super Recovery', 50, msg));
    })
  );

  ipcMain.handle(
    'backup:flash-twrp',
    wrap(async (_event, { innermodel }: { innermodel: string }) => {
      return backupService.autoFlashTwrp(innermodel, (msg) => progress('刷入 TWRP', 50, msg));
    })
  );

  ipcMain.handle(
    'backup:auto-flash-twrp',
    wrap(async (_event, { innermodel }: { innermodel: string }) => {
      return backupService.autoFlashTwrp(innermodel, (msg) => progress('自动刷入 TWRP', 50, msg));
    })
  );

  ipcMain.handle(
    'backup:xposed-install',
    wrap(async () => {
      return backupService.installXposed((msg) => progress('Xposed 安装', 50, msg));
    })
  );
}
