import { join } from 'node:path';
import fs from 'node:fs';
import { paths } from '../core/paths';
import { subprocessPool, SpawnError } from './SubprocessPool';

const ADB_TIMEOUT = 30000;

function adbPath(): string {
  const isWin = process.platform === 'win32';
  const p = join(paths.bin, isWin ? 'adb.exe' : 'adb');
  try { fs.accessSync(p); return p; } catch { return 'adb'; }
}

export interface AdbDevice {
  serial: string;
  state: string;
}

export interface AdbInstallResult {
  success: boolean;
  output: string;
  error?: string;
}

class AdbService {
  async spawn(args: string[], opts?: { timeout?: number; cwd?: string; silent?: boolean }) {
    return subprocessPool.spawn({
      cmd: adbPath(),
      args,
      cwd: opts?.cwd,
      timeout: opts?.timeout ?? ADB_TIMEOUT,
      silent: opts?.silent,
      encoding: 'gbk',
    });
  }

  private withSerial(serial: string, args: string[]): string[] {
    return serial ? ['-s', serial, ...args] : args;
  }

  async devices(): Promise<AdbDevice[]> {
    try {
      const r = await this.spawn(['devices'], { silent: true });
      const list: AdbDevice[] = [];
      for (const line of r.stdout.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || /^List of devices/i.test(trimmed)) continue;
        const m = trimmed.match(/^(\S+)\s+(\S+)/);
        if (m) list.push({ serial: m[1], state: m[2] });
      }
      return list;
    } catch {
      return [];
    }
  }

  async shell(serial: string, cmd: string) {
    const r = await this.spawn(this.withSerial(serial, ['shell', cmd]));
    return r.stdout;
  }

  async shellWithCode(serial: string, cmd: string) {
    try {
      const r = await this.spawn(this.withSerial(serial, ['shell', cmd]));
      return { stdout: r.stdout, stderr: r.stderr, exitCode: r.exitCode };
    } catch (e) {
      if (e instanceof SpawnError) {
        return { stdout: e.stdout, stderr: e.stderr, exitCode: e.exitCode };
      }
      throw e;
    }
  }

  async execOut(serial: string, cmd: string) {
    const r = await this.spawn(this.withSerial(serial, ['exec-out', cmd]));
    return r.stdout;
  }

  async push(serial: string, local: string, remote: string) {
    const r = await this.spawn(this.withSerial(serial, ['push', local, remote]));
    return r.stdout;
  }

  async pull(serial: string, remote: string, local: string) {
    const r = await this.spawn(this.withSerial(serial, ['pull', remote, local]));
    return r.stdout;
  }

  async install(serial: string, apk: string): Promise<AdbInstallResult> {
    try {
      const r = await this.spawn(this.withSerial(serial, ['install', '-r', '-t', '-d', apk]), { timeout: 180000 });
      const output = `${r.stdout}\n${r.stderr}`.trim();
      const success = /\bSuccess\b/i.test(output);
      return { success, output, error: success ? undefined : output || '安装失败' };
    } catch (e) {
      if (e instanceof SpawnError) {
        const output = `${e.stdout}\n${e.stderr}`.trim();
        return { success: false, output, error: output || e.message };
      }
      return { success: false, output: '', error: (e as Error).message };
    }
  }

  async uninstall(serial: string, pkg: string) {
    const r = await this.spawn(this.withSerial(serial, ['uninstall', pkg]));
    return r.stdout;
  }

  async reboot(serial: string, mode = '') {
    const args = ['reboot'];
    if (mode) args.push(mode);
    await this.spawn(this.withSerial(serial, args));
  }

  async root(serial: string): Promise<{ granted: boolean; output: string }> {
    try {
      const r = await this.spawn(this.withSerial(serial, ['root']), { timeout: 15000 });
      const output = `${r.stdout}\n${r.stderr}`.trim();
      const granted = /restarting|already running as root|adbd is already running as root/i.test(output);
      return { granted, output };
    } catch (e) {
      const output = e instanceof SpawnError ? `${e.stdout}\n${e.stderr}`.trim() : (e as Error).message;
      return { granted: /restarting|already running as root/i.test(output), output };
    }
  }

  async waitForBoot(timeout = 120000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const out = await this.shell('', 'getprop sys.boot_completed');
        if (out.trim() === '1') return true;
      } catch { /* device may be restarting */ }
      await new Promise((r) => setTimeout(r, 1000));
    }
    throw new Error('等待设备开机超时');
  }

  async getProp(serial: string, key: string) {
    try {
      const r = await this.spawn(this.withSerial(serial, ['shell', 'getprop', key]), { silent: true });
      return r.stdout.trim();
    } catch {
      return '';
    }
  }

  async forward(serial: string, local: string, remote: string) {
    const r = await this.spawn(this.withSerial(serial, ['forward', local, remote]));
    return r.stdout;
  }

  async tcpip(serial: string, port = 5555) {
    const r = await this.spawn(this.withSerial(serial, ['tcpip', String(port)]));
    return r.stdout;
  }

  async connect(host: string, port = 5555) {
    const r = await this.spawn(['connect', `${host}:${port}`], { timeout: 15000 });
    return r.stdout;
  }

  async disconnect(host: string, port = 5555) {
    const r = await this.spawn(['disconnect', `${host}:${port}`], { timeout: 15000 });
    return r.stdout;
  }

  async pair(host: string, port: number, code: string) {
    const r = await this.spawn(['pair', `${host}:${port}`, code], { timeout: 30000 });
    return r.stdout;
  }

  async listPackages(serial: string, thirdPartyOnly = false) {
    const out = await this.shell(serial, `pm list packages${thirdPartyOnly ? ' -3' : ''}`);
    return out
      .split('\n')
      .map((line: string) => line.trim().replace(/^package:/, ''))
      .filter(Boolean)
      .sort((a: string, b: string) => a.localeCompare(b));
  }

  async packageInfo(serial: string, pkg: string) {
    const out = await this.shell(serial, `dumpsys package ${pkg}`);
    const versionName = out.match(/versionName=([^\s]+)/)?.[1] ?? '';
    const versionCode = out.match(/versionCode=(\d+)/)?.[1] ?? '';
    const label = out.match(/applicationLabel=([^\n]+)/)?.[1]?.trim() ?? '';
    return { packageName: pkg, versionName, versionCode, label };
  }
}

export const adbService = new AdbService();
export default adbService;
