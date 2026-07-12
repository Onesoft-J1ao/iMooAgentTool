import path from 'node:path';
import fs from 'node:fs';
import { paths } from '../core/paths';
import { adbService } from './AdbService';
import { magiskService } from './MagiskService';
import { checkIsV3 } from '../../shared/isv3';

const logger = {
  info: (...args: any[]) => console.log('[RootProService]', ...args),
  warn: (...args: any[]) => console.warn('[RootProService]', ...args),
  error: (...args: any[]) => console.error('[RootProService]', ...args),
};

const TIMEOUT = {
  shell: 10000,
};

class RootProServiceClass {
  async run(options: any) {
    const steps = [
      { name: '检查 ADB 设备', status: 'pending' },
      { name: '等待 boot_completed', status: 'pending' },
      { name: '读取设备信息', status: 'pending' },
      { name: '检查 SDK=27', status: 'pending' },
      { name: '检测 isv3', status: 'pending' },
      { name: '检查 SystemUI(pm path)', status: 'pending' },
      { name: '安装拓展应用包', status: 'pending' },
      { name: '安装禁用模式切换桌面', status: 'pending' },
      { name: '刷拓展 magisk 模块', status: 'pending' },
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
    const result: any = { success: false, supported: false, steps };
    let ok = await runStep(0, async () => {
      // @ts-ignore
      const devices = await adbService.devices();
      if (devices.length === 0) {
        throw new Error('未检测到 ADB 设备');
      }
    });
    if (!ok) { result.error = steps[0].message; return result; }
    ok = await runStep(1, async () => {
      await adbService.waitForBoot(120000);
    });
    if (!ok) { result.error = steps[1].message; return result; }
    let innermodel = '';
    let model = '';
    let androidVersion = '';
    let sdkVersion = '';
    let softVersion = '';
    ok = await runStep(2, async () => {
      innermodel = await adbService.getProp('', 'ro.product.innermodel');
      model = await adbService.getProp('', 'ro.product.model');
      androidVersion = await adbService.getProp('', 'ro.build.version.release');
      sdkVersion = await adbService.getProp('', 'ro.build.version.sdk');
      softVersion = await adbService.getProp('', 'ro.product.current.softversion');
      logger.info('innermodel=' + innermodel + ', model=' + model + ', android=' + androidVersion + ', sdk=' + sdkVersion + ', version=' + softVersion);
      result.innermodel = innermodel;
      result.model = model;
      result.androidVersion = androidVersion;
      result.sdkVersion = sdkVersion;
      result.softVersion = softVersion;
    });
    if (!ok) { result.error = steps[2].message; return result; }
    ok = await runStep(3, async () => {
      if (sdkVersion !== '27') {
        throw new Error('你的安卓版本不是 8.1,该功能不支持你的手表');
      }
      result.supported = true;
    });
    if (!ok) { result.error = steps[3].message; return result; }
    let isV3 = false;
    ok = await runStep(4, async () => {
      isV3 = checkIsV3(innermodel, softVersion);
      result.isV3 = isV3;
      logger.info('isV3=' + isV3);
    });
    if (!ok) { result.error = steps[4].message; return result; }
    let haveSystemUI = false;
    ok = await runStep(5, async () => {
      const out = await adbService.shell('', 'pm path com.android.systemui');
      haveSystemUI = out.trim().length > 0 && out.includes('package:');
      result.haveSystemUI = haveSystemUI;
      logger.info('haveSystemUI=' + haveSystemUI);
    });
    if (!ok) { result.error = steps[5].message; return result; }
    if (!options.installApks) {
      skipStep(6, '用户未选择');
    } else {
      ok = await runStep(6, async () => { await this.installRootProApks(); });
      if (!ok) logger.warn('安装拓展应用包失败: ' + steps[6].message);
    }
    if (!options.installDesktop) {
      skipStep(7, '用户未选择');
    } else {
      ok = await runStep(7, async () => { await this.installDesktopApk(isV3, haveSystemUI); });
      if (!ok) logger.warn('安装桌面失败: ' + steps[7].message);
    }
    if (!options.installMods) {
      skipStep(8, '用户未选择');
    } else {
      ok = await runStep(8, async () => { await this.installRootProMods(); });
      if (!ok) logger.warn('安装 magisk 模块失败: ' + steps[8].message);
    }
    result.success = true;
    logger.info('Root 后优化全部完成');
    return result;
  }

  async installRootProApks() {
    const apksDir = path.join(paths.resources, 'rootproapks');
    const txtPath = path.join(apksDir, 'rootproapks.txt');
    if (!fs.existsSync(txtPath)) {
      throw new Error('找不到 rootproapks/rootproapks.txt 无法完成安装');
    }
    const lines = fs.readFileSync(txtPath, 'utf-8').split('\n').map((l: string) => l.trim()).filter(Boolean);
    for (const line of lines) {
      const apkPath = path.join(apksDir, line);
      if (!fs.existsSync(apkPath)) {
        logger.warn('APK 不存在,跳过: ' + apkPath);
        continue;
      }
      logger.info('安装拓展应用: ' + line);
      // @ts-ignore
      const result = await adbService.install(apkPath, 'install');
      if (!result.success) {
        logger.warn('安装失败: ' + line);
      }
    }
  }

  async installDesktopApk(isV3: boolean, haveSystemUI: boolean) {
    const apksDir = path.join(paths.resources, 'rootproapks');
    let apkName: string;
    if (isV3) {
      apkName = haveSystemUI ? '130510_D.apk' : '121750_D.apk';
    } else {
      apkName = '116100_D.apk';
    }
    const apkPath = path.join(apksDir, apkName);
    if (!fs.existsSync(apkPath)) {
      throw new Error('桌面 APK 不存在: ' + apkName);
    }
    logger.info('安装禁用模式切换桌面: ' + apkName + '(isv3=' + isV3 + ', havesystemui=' + haveSystemUI + ')');
    // @ts-ignore
    const result = await adbService.install(apkPath, 'install');
    if (!result.success) {
      throw new Error('安装桌面失败: ' + apkName);
    }
  }

  async installRootProMods() {
    const modsDir = path.join(paths.resources, 'magiskmod');
    const txtPath = path.join(modsDir, 'rootpromods.txt');
    if (!fs.existsSync(txtPath)) {
      throw new Error('找不到 magiskmod/rootpromods.txt 无法完成安装');
    }
    const lines = fs.readFileSync(txtPath, 'utf-8').split('\n').map((l: string) => l.trim()).filter(Boolean);
    for (const line of lines) {
      const zipPath = path.join(modsDir, line);
      if (!fs.existsSync(zipPath)) {
        logger.warn('模块 zip 不存在,跳过: ' + zipPath);
        continue;
      }
      logger.info('刷入拓展 magisk 模块: ' + line);
      const result = await magiskService.install(zipPath, 'magisk');
      if (!result.success) {
        logger.warn('模块安装失败: ' + line + ' - ' + result.error);
      }
    }
  }
}

export const rootProService = new RootProServiceClass();
export default rootProService;
