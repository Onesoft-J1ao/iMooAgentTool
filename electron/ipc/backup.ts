import path from 'node:path';
import fs from 'node:fs';
import { ipcMain } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { backupService } from '../services/BackupService';
import { adbService } from '../services/AdbService';
import { paths } from '../core/paths';
import type { AdbDdMatchResult } from "../../shared/types";

export function registerBackupIpc() {
  ipcMain.handle(
    'backup:dcim-backup',
    wrap(async () => {
      return backupService.backupDcim(paths.cache);
    })
  );

  ipcMain.handle(
    'backup:dcim-recover',
    wrap(async () => {
      return backupService.recoverDcim(paths.cache);
    })
  );

  ipcMain.handle(
    'backup:adbdd-backup',
    wrap(async () => {
      return backupService.backupAdbDd(paths.cache);
    })
  );

  ipcMain.handle(
    'backup:adbdd-recover',
    wrap(async (_event, { zipPath }: { zipPath: string }) => {
      return backupService.recoverAdbDd(zipPath);
    })
  );

  ipcMain.handle(
    'backup:prepare-adbdd-recover',
    wrap(async (_event, { zipPath }: { zipPath: string }): Promise<{ success: boolean; extractDir?: string; match?: { matched: string[]; skipped: string[] }; error?: string }> => {
      return backupService.prepareAdbDdRecover(zipPath);
    })
  );

  ipcMain.handle(
    'backup:execute-adbdd-recover',
    wrap(async (_event, { extractDir, parts }: { extractDir: string; parts: string[] }) => {
      return backupService.executeAdbDdRecover(extractDir, parts);
    })
  );

  ipcMain.handle(
    'backup:flash-twrp',
    wrap(async (_event, { innermodel }: { innermodel: string }) => {
      return backupService.autoFlashTwrp(innermodel);
    })
  );

  ipcMain.handle(
    'backup:xposed-install',
    wrap(async () => {
      return backupService.installXposed();
    })
  );

  ipcMain.handle(
    'backup:adbdd-prepare',
    wrap(async (_event, { zipPath }: { zipPath: string }): Promise<AdbDdMatchResult> => {
      const extractDir = path.join(paths.cache, `adbdd_prepare_${Date.now()}`);
      if (!fs.existsSync(extractDir)) {
        fs.mkdirSync(extractDir, { recursive: true });
      }
      const extractZip = (await import('extract-zip')).default;
      await extractZip(zipPath, { dir: extractDir });
      const files = fs.readdirSync(extractDir);
      const images = files.filter(f => f.endsWith('.img') || f.endsWith('.bin') || f.endsWith('.raw'));
      const matched = images.map(f => path.join(extractDir, f));
      return { matched, skipped: [] };
    })
  );

  ipcMain.handle(
    'backup:adbdd-execute',
    wrap(async (_event, { extractDir, parts }: { extractDir: string; parts: string[] }) => {
      const devices = await adbService.devices();
      const device = devices.find(d => d.state === 'device');
      if (!device) throw new Error('No device connected');
      const serial = device.serial;
      for (const part of parts) {
        const baseName = path.basename(part, path.extname(part));
        const remotePath = `/sdcard/tmp_${baseName}.img`;
        await adbService.push(serial, part, remotePath);
        await adbService.shell(serial, `su -c "dd if=${remotePath} of=/dev/block/by-name/${baseName} bs=4M" 2>/dev/null`);
        await adbService.shell(serial, `rm -f "${remotePath}"`);
      }
    })
  );

  ipcMain.handle(
    'backup:auto-flash-twrp',
    wrap(async (_event, { innermodel }: { innermodel: string }) => {
      return backupService.autoFlashTwrp(innermodel);
    })
  );
}
