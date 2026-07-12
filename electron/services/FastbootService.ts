import path from 'node:path';
import { paths } from '../core/paths';
import { subprocessPool } from './SubprocessPool';

const logger = {
  info: (...args: any[]) => console.log('[FastbootService]', ...args),
  warn: (...args: any[]) => console.warn('[FastbootService]', ...args),
  error: (...args: any[]) => console.error('[FastbootService]', ...args),
  debug: (...args: any[]) => console.debug('[FastbootService]', ...args),
};

const TIMEOUT = {
  device: 5000,
  install: 120000,
  shellLong: 30000,
  shell: 10000,
};

class FastbootServiceClass {
  fastbootPath = process.platform === 'win32' ? path.join(paths.bin, 'fastboot.exe') : 'fastboot';
  async devices() {
    const result = await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ['devices'],
      encoding: 'utf-8',
      timeout: TIMEOUT.device,
      cwd: paths.bin,
    });
    return result.stdout.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0 && l.includes('fastboot'));
  }
  async flash(partition: string, img: string) {
    await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ['flash', partition, img],
      encoding: 'gbk',
      timeout: TIMEOUT.install,
      cwd: paths.bin,
      onStdout: (line: string) => logger.info(`flash ${partition}: ${line}`),
    });
  }
  async erase(partition: string) {
    await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ['erase', partition],
      encoding: 'gbk',
      timeout: TIMEOUT.shellLong,
      cwd: paths.bin,
    });
  }
  async boot(img: string) {
    await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ['boot', img],
      encoding: 'gbk',
      timeout: TIMEOUT.shellLong,
      cwd: paths.bin,
    });
  }
  async reboot(target: string) {
    const arg = target === 'system' ? 'reboot' : `reboot ${target}`;
    await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: arg.split(' '),
      encoding: 'utf-8',
      timeout: TIMEOUT.shell,
      cwd: paths.bin,
    });
  }
  async getVar(name: string) {
    const result = await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ['getvar', name],
      encoding: 'utf-8',
      timeout: TIMEOUT.shell,
      cwd: paths.bin,
    });
    return result.stdout.trim();
  }
  async oem(cmd: string) {
    await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ['oem', cmd],
      encoding: 'gbk',
      timeout: TIMEOUT.shellLong,
      cwd: paths.bin,
    });
  }
}

export const fastbootService = new FastbootServiceClass();
export default fastbootService;
