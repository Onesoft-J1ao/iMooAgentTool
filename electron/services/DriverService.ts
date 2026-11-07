import path from 'node:path';
import fs from 'node:fs';
import { paths } from '../core/paths';
import { subprocessPool } from './SubprocessPool';
import { cloudService } from './CloudService';

const logger = {
  info: (...args: any[]) => console.log('[DriverService]', ...args),
  warn: (...args: any[]) => console.warn('[DriverService]', ...args),
  error: (...args: any[]) => console.error('[DriverService]', ...args),
};

const TIMEOUT = {
  flash: 60000,
  install: 120000,
};

export interface DriverStatusItem {
  name: string;
  installed: boolean;
  version?: string;
}

class DriverServiceClass {
  async check(): Promise<DriverStatusItem[]> {
    const qualcomm = await this.existsGlobInDir('qdbusb*') || await this.existsGlobInDir('qcfilter*') || await this.existsGlobInDir('qcmbn*');
    const adb = await this.existsGlobInDir('android_winusb.inf*');
    const vcRuntime = await this.existsGlobInSystem32('mfc100*') && await this.existsGlobInSystem32('mfc110*') && await this.existsGlobInSystem32('mfc120*');
    logger.info(`驱动检查: qualcomm=${qualcomm}, adb=${adb}, vc=${vcRuntime}`);
    return [
      { name: 'Qualcomm 9008 驱动', installed: qualcomm },
      { name: 'ADB 驱动', installed: adb },
      { name: 'VC++ 运行库', installed: vcRuntime },
    ];
  }

  async installDrivers() {
    const steps = [
      { name: '检查驱动状态', status: 'pending' as string, message: '' },
      { name: '下载 drivers.zip(若未下载)', status: 'pending' as string, message: '' },
      { name: '安装 ADB 驱动(pnputil)', status: 'pending' as string, message: '' },
      { name: '安装 Qualcomm 9008 驱动(9008.bat)', status: 'pending' as string, message: '' },
      { name: '安装 VC 运行库(vc.exe)', status: 'pending' as string, message: '' },
    ];
    const runStep = async (i: number, fn: () => Promise<unknown>) => {
      steps[i].status = 'running';
      try {
        await fn();
        steps[i].status = 'success';
        return true;
      } catch (e) {
        steps[i].status = 'failed';
        steps[i].message = (e as Error).message;
        return false;
      }
    };
    const skipStep = (i: number, reason: string) => {
      steps[i].status = 'skipped';
      steps[i].message = reason;
    };
    const status = await this.check();
    const byName = (name: string) => status.find((s) => s.name.includes(name))?.installed ?? false;
    const ok0 = await runStep(0, async () => undefined);
    if (!ok0) return { success: false, steps, error: steps[0].message };

    const driversDir = path.join(paths.resources, 'drivers');
    if (fs.existsSync(driversDir)) {
      skipStep(1, 'drivers 已存在,跳过下载');
    } else {
      const ok = await runStep(1, async () => {
        await cloudService.download('drivers');
      });
      if (!ok) logger.warn('下载 drivers 失败: ' + steps[1].message);
    }

    if (byName('ADB')) {
      skipStep(2, 'ADB 驱动已安装');
    } else {
      const ok = await runStep(2, async () => {
        const infPath = path.join(driversDir, 'adb', 'android_winusb.inf');
        if (!fs.existsSync(infPath)) throw new Error('ADB 驱动 inf 不存在: ' + infPath);
        await subprocessPool.spawn({
          cmd: 'pnputil.exe',
          args: ['/add-driver', infPath, '/install'],
          encoding: 'gbk',
          timeout: TIMEOUT.flash,
        });
      });
      if (!ok) logger.warn('ADB 驱动安装失败: ' + steps[2].message);
    }

    if (byName('Qualcomm')) {
      skipStep(3, 'Qualcomm 9008 驱动已安装');
    } else {
      const ok = await runStep(3, async () => {
        const batPath = path.join(driversDir, '9008', '9008.bat');
        if (!fs.existsSync(batPath)) throw new Error('9008.bat 不存在: ' + batPath);
        await subprocessPool.spawn({
          cmd: 'cmd.exe',
          args: ['/c', batPath],
          encoding: 'gbk',
          timeout: TIMEOUT.install,
          cwd: path.dirname(batPath),
        });
      });
      if (!ok) logger.warn('Qualcomm 驱动安装失败: ' + steps[3].message);
    }

    if (byName('VC++')) {
      skipStep(4, 'VC 运行库已安装');
    } else {
      const ok = await runStep(4, async () => {
        const vcPath = path.join(driversDir, 'vc.exe');
        if (!fs.existsSync(vcPath)) throw new Error('vc.exe 不存在: ' + vcPath);
        await subprocessPool.spawn({
          cmd: vcPath,
          args: [],
          encoding: 'gbk',
          timeout: TIMEOUT.install,
        });
      });
      if (!ok) logger.warn('VC 运行库安装失败: ' + steps[4].message);
    }

    return { success: true, steps };
  }

  async existsGlobInDir(glob: string) {
    const baseDir = path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'DriverStore', 'FileRepository');
    return this.existsGlob(baseDir, glob);
  }

  async existsGlobInSystem32(glob: string) {
    const baseDir = path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32');
    return this.existsGlob(baseDir, glob);
  }

  async existsGlob(baseDir: string, glob: string) {
    try {
      if (!fs.existsSync(baseDir)) return false;
      const entries = await fs.promises.readdir(baseDir);
      const regex = new RegExp('^' + glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
      return entries.some((e) => regex.test(e));
    } catch {
      return false;
    }
  }
}

export const driverService = new DriverServiceClass();
export default driverService;
