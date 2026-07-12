import { join } from 'node:path';
import { paths } from '../core/paths';
import { subprocessPool } from './SubprocessPool';

const ADB_TIMEOUT = 30000;

function adbPath(): string {
  const isWin = process.platform === 'win32';
  const p = join(paths.bin, isWin ? 'adb.exe' : 'adb');
  try { require('fs').accessSync(p); return p; } catch { return 'adb'; }
}

class AdbService {
  async spawn(args: string[], opts?: { timeout?: number; cwd?: string; silent?: boolean }) {
    return subprocessPool.spawn({ cmd: adbPath(), args, cwd: opts?.cwd, timeout: opts?.timeout ?? ADB_TIMEOUT, silent: opts?.silent, encoding: 'gbk' });
  }

  async devices() {
    try {
      const r = await this.spawn(['devices'], { silent: true });
      const list: { serial: string; state: string }[] = [];
      for (const line of r.stdout.split('\n')) {
        const m = line.match(/^(\S+)\s+(\S+)$/);
        if (m) list.push({ serial: m[1], state: m[2] });
      }
      return list;
    } catch { return []; }
  }

  async shell(serial: string, cmd: string) {
    const r = await this.spawn(['-s', serial, 'shell', cmd]);
    return r.stdout;
  }

  async execOut(serial: string, cmd: string) {
    const r = await this.spawn(['-s', serial, 'exec-out', cmd]);
    return r.stdout;
  }

  async push(serial: string, local: string, remote: string) {
    const r = await this.spawn(['-s', serial, 'push', local, remote]);
    return r.stdout;
  }

  async pull(serial: string, remote: string, local: string) {
    const r = await this.spawn(['-s', serial, 'pull', remote, local]);
    return r.stdout;
  }

  async install(serial: string, apk: string) {
    const r = await this.spawn(['-s', serial, 'install', '-r', '-d', apk]);
    return r.stdout;
  }

  async uninstall(serial: string, pkg: string) {
    const r = await this.spawn(['-s', serial, 'uninstall', pkg]);
    return r.stdout;
  }

  async reboot(serial: string, mode = '') {
    const args = ['-s', serial, 'reboot'];
    if (mode) args.push(mode);
    await this.spawn(args);
  }

  async root(serial: string) {
    await this.spawn(['-s', serial, 'root']);
  }

  async getProp(serial: string, key: string) {
    try {
      const r = await this.spawn(['-s', serial, 'shell', 'getprop', key], { silent: true });
      return r.stdout.trim();
    } catch { return ''; }
  }
}

export const adbService = new AdbService();
export default adbService;
