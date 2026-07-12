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

class DriverServiceClass {
  async check() {
    const qualcomm = await this.existsGlobInDir('qdbusb*') || await this.existsGlobInDir('qcfilter*') || await this.existsGlobInDir('qcmbn*');
    const adb = await this.existsGlobInDir('android_winusb.inf*');
    const vcRuntime = await this.existsGlobInSystem32('mfc100*') && await this.existsGlobInSystem32('mfc110*') && await this.existsGlobInSystem32('mfc120*');
    const status = { qualcomm, adb, vcRuntime };
    const allInstalled = qualcomm && adb && vcRuntime;
    logger.info('驱动检查: qualcomm=' + qualcomm + ', adb=' + adb + ', vc=' + vcRuntime + ', all=' + allInstalled);
    return { success: true, status, allInstalled };
  }

  async installDrivers() {
    const steps = [
      { name: '检查驱动状态', status: 'pending' },
      { name: '下载 drivers.zip(若未下载)', status: 'pending' },
      { name: '安装 ADB 驱动(pnputil)', status: 'pending' },
      { name: '安装 Qualcomm 9008 驱动(9008.bat)', status: 'pending' },
      { name: '安装 VC 运行库(vc.exe)', status: 'pending' },
    ];
    const runStep = async (i: number, fn: () => Promise<any>) => {
      steps[i].status = 'running';
      try {
        await fn();
        steps[i].status = 'success';
        return true;
      } catch (e: any) {
        steps[i].status = 'failed';
        steps[i].message = e.message;
        return false;
      }
    };
    const skipStep = (i: number, reason: string) => {
      steps[i].status = 'skipped';
      steps[i].message = reason;
    };
    let status: any = null;
    let ok = await runStep(0, async () => {
      const r = await this.check();
      status = r.status;
    });
    if (!ok) return { success: false, steps, error: steps[0].message };
    ok = await runStep(1, async () => {
      const driversDir = path.join(paths.resources, 'drivers');
      if (fs.existsSync(driversDir)) {
        skipStep(1, 'drivers 已存在,跳过下载');
        return;
      }
      logger.info('下载 drivers 资源...');
      await cloudService.download('drivers');
    });
    if (status.adb) {
      skipStep(2, 'ADB 驱动已安装');
    } else {
      ok = await runStep(2, async () => {
        const infPath = path.join(paths.resources, 'drivers', 'adb', 'android_winusb.inf');
        if (!fs.existsSync(infPath)) {
          throw new Error('ADB 驱动 inf 不存在: ' + infPath);
        }
        logger.info('安装 ADB 驱动...');
        await subprocessPool.spawn({
          cmd: 'pnputil.exe',
          args: ['/add-driver', infPath, '/install'],
          encoding: 'gbk',
          timeout: TIMEOUT.flash,
        });
      });
      if (!ok) logger.warn('ADB 驱动安装失败: ' + steps[2].message);
    }
    if (status.qualcomm) {
      skipStep(3, 'Qualcomm 9008 驱动已安装');
    } else {
      ok = await runStep(3, async () => {
        const batPath = path.join(paths.resources, 'drivers', '9008', '9008.bat');
        if (!fs.existsSync(batPath)) {
          throw new Error('9008.bat 不存在: ' + batPath);
        }
        logger.info('安装 Qualcomm 9008 驱动...');
        await subprocessPool.spawn({
          cmd: 'cmd.exe',
          args: ['/c', batPath],
          encoding: 'gbk',
          timeout: TIMEOUT.install,
          cwd: path.dirname(batPath),
        });
      });
      if (!ok) logger.warn('Qualcomm 9008 驱动安装失败: ' + steps[3].message);
    }
    if (status.vcRuntime) {
      skipStep(4, 'VC 运行库已安装');
    } else {
      ok = await runStep(4, async () => {
        const vcPath = path.join(paths.resources, 'drivers', 'vc.exe');
        if (!fs.existsSync(vcPath)) {
          throw new Error('vc.exe 不存在: ' + vcPath);
        }
        logger.info('安装 VC 运行库...');
        await subprocessPool.spawn({
          cmd: vcPath,
          args: [],
          encoding: 'gbk',
          timeout: TIMEOUT.install,
        });
      });
      if (!ok) logger.warn('VC 运行库安装失败: ' + steps[4].message);
    }
    logger.info('驱动和环境配置完毕,部分更改可能需要重启电脑以完成安装');
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
