import { app } from 'electron';
import { join } from 'node:path';
import fs from 'node:fs';

const isDev = !app.isPackaged;

function getUnpackedPath(): string {
  if (isDev) return app.getAppPath();
  return join(process.resourcesPath, 'app.asar.unpacked');
}

const appPath = app.getAppPath();
const unpackedPath = getUnpackedPath();

export const paths = {
  isDev,
  root: appPath,
  resources: join(appPath, 'resources'),
  bin: join(unpackedPath, 'resources', 'bin'),
  edl: join(unpackedPath, 'resources', 'edl'),
  scripts: join(unpackedPath, 'resources', 'scripts'),
  data: join(appPath, 'resources', 'data'),
  assets: join(appPath, 'resources', 'assets'),
  cache: join(app.getPath('userData'), 'cache'),
  logs: join(app.getPath('userData'), 'logs'),
  dist: join(appPath, 'dist'),
  preload: join(appPath, 'dist-electron', 'preload', 'preload.js'),

  adb(): string { return join(this.bin, process.platform === 'win32' ? 'adb.exe' : 'adb'); },
  fastboot(): string { return join(this.bin, process.platform === 'win32' ? 'fastboot.exe' : 'fastboot'); },
  aria2c(): string { return join(this.bin, process.platform === 'win32' ? 'aria2c.exe' : 'aria2c'); },
  sevenZip(): string { return join(this.bin, process.platform === 'win32' ? '7z.exe' : '7z'); },
  qsahara(): string { return join(this.bin, 'QSaharaServer.exe'); },
  fhLoader(): string { return join(this.bin, 'fh_loader.exe'); },
  scrcpy(): string { return join(this.bin, 'scrcpy.exe'); },
  ensure(dir: string): string {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
  },
};
