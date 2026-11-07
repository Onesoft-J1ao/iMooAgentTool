const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const localDist = path.join(root, 'electron-dist');

const isWindows = process.platform === 'win32';
const builderJs = path.join(root, 'node_modules', 'electron-builder', 'cli.js');

if (!fs.existsSync(builderJs)) {
  console.error('electron-builder 未安装，请先执行 npm install');
  process.exit(1);
}

const args = [builderJs, '--win', '--x64', '--publish', 'never'];
const env = { ...process.env };

if (fs.existsSync(path.join(localDist, 'electron.exe'))) {
  args.push(`-c.electronDist=${localDist}`);
  console.log(`使用本地 Electron: ${localDist}`);
} else if (isWindows) {
  console.log('使用 electron-builder 默认 Electron 下载');
} else {
  console.log('使用 electron-builder 默认 Electron 下载');
}

execFileSync(process.execPath, args, { cwd: root, stdio: 'inherit', env });
