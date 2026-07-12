import { app } from 'electron';
import { join } from 'node:path';

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
};
