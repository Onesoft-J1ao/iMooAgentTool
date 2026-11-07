import path from 'node:path';
import fs from 'node:fs';
import { app } from 'electron';
import { paths } from '../core/paths';
import { adbService } from './AdbService';
import { fastbootService } from './FastbootService';
import { edlService } from './EdlService';
import { DeviceService } from './DeviceService';

const logger = {
  info: (...args: any[]) => console.log('[RebootService]', ...args),
  warn: (...args: any[]) => console.warn('[RebootService]', ...args),
  error: (...args: any[]) => console.error('[RebootService]', ...args),
};

class RebootServiceClass {
  async reboot(opts: any) {
    logger.info('执行重启: mode=' + opts.mode + ', innermodel=' + (opts.innermodel ?? '-') + ', platform=' + (opts.platform ?? '-'));
    switch (opts.mode) {
      case 'system':
        return this.rebootSystem();
      case 'bootloader':
        return this.rebootBootloader();
      case 'recovery':
        return this.rebootRecovery(opts.innermodel);
      case 'edl':
        return this.rebootEdl(opts.innermodel);
      case 'twrp-temp':
        return this.rebootTwrpTemp(opts.innermodel);
      case 'qmmi':
      case 'ffbm':
      case 'wipe-data':
      case 'fastbootd':
        return this.flashMisc(opts.mode, opts.platform, opts.innermodel);
    }
  }

  async rebootSystem() {
    const device = DeviceService.instance.getCurrentDevice();
    if (!device) {
      throw new Error('未检测到设备');
    }
    if (device.type === 'adb') {
      await adbService.reboot('', 'system');
    } else if (device.type === 'fastboot') {
      await fastbootService.reboot('system');
    } else if (device.type === 'qcom_edl') {
      await this.edlReboot();
    } else {
      throw new Error('当前设备状态不支持重启至系统: ' + device.type);
    }
    logger.info('已发送重启至系统指令');
  }

  async rebootBootloader() {
    const device = DeviceService.instance.getCurrentDevice();
    if (!device) {
      throw new Error('未检测到设备');
    }
    if (device.type === 'adb') {
      await adbService.reboot('', 'bootloader');
    } else if (device.type === 'fastboot') {
      await fastbootService.reboot('bootloader');
    } else {
      throw new Error('当前设备状态不支持重启至 Bootloader: ' + device.type);
    }
    logger.info('已发送重启至 Bootloader 指令');
  }

  async rebootRecovery(innermodel: string) {
    const device = DeviceService.instance.getCurrentDevice();
    if (!device) {
      throw new Error('未检测到设备');
    }
    if (device.type === 'adb') {
      await adbService.reboot('', 'recovery');
    } else if (device.type === 'fastboot') {
      if (!innermodel) {
        throw new Error('Fastboot 设备重启至 Recovery 需要选择型号');
      }
      await this.bootTwrpAndWaitAdb(innermodel);
      await adbService.reboot('', 'recovery');
    } else {
      throw new Error('当前设备状态不支持重启至 Recovery: ' + device.type);
    }
    logger.info('已发送重启至 Recovery 指令');
  }

  async rebootEdl(innermodel: string) {
    const device = DeviceService.instance.getCurrentDevice();
    if (!device) {
      throw new Error('未检测到设备');
    }
    if (device.type === 'adb') {
      await adbService.reboot('', 'edl');
    } else if (device.type === 'fastboot') {
      if (!innermodel) {
        throw new Error('Fastboot 设备重启至 9008 需要选择型号');
      }
      await this.bootTwrpAndWaitAdb(innermodel);
      await adbService.reboot('', 'edl');
    } else {
      throw new Error('当前设备状态不支持重启至 9008: ' + device.type);
    }
    logger.info('已发送重启至 9008 指令');
  }

  async bootTwrpAndWaitAdb(innermodel: string) {
    const twrpDir = path.join(paths.edl, 'twrp');
    if (!fs.existsSync(twrpDir)) {
      throw new Error('TWRP 镜像未下载,请先在"资源下载"页下载 TWRP');
    }
    const twrpImg = path.join(twrpDir, innermodel + '.img');
    if (!fs.existsSync(twrpImg)) {
      throw new Error('TWRP 镜像不存在: ' + innermodel + '.img');
    }
    const workDir = path.join(app.getPath('userData'), 'edl_work');
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    const dstImg = path.join(workDir, 'recovery.img');
    fs.copyFileSync(twrpImg, dstImg);
    await fastbootService.boot(dstImg);
    logger.info('已临时启动 TWRP,等待 ADB...');
    await DeviceService.instance.waitFor(['adb'], 30000);
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
      fs.mkdirSync(workDir, { recursive: true });
    } catch {}
  }

  async rebootTwrpTemp(innermodel: string) {
    if (!innermodel) {
      throw new Error('临时启动 TWRP 需要选择型号');
    }
    const device = DeviceService.instance.getCurrentDevice();
    if (!device) {
      throw new Error('未检测到设备');
    }
    if (device.type === 'adb') {
      await adbService.reboot('', 'bootloader');
      logger.info('等待 Fastboot 设备...');
      await DeviceService.instance.waitFor(['fastboot'], 30000);
    }
    const currentDevice = DeviceService.instance.getCurrentDevice();
    if (currentDevice?.type !== 'fastboot' && currentDevice?.type !== 'adb') {
      throw new Error('临时启动 TWRP 需要 ADB 或 Fastboot 设备');
    }
    const twrpDir = path.join(paths.edl, 'twrp');
    if (!fs.existsSync(twrpDir)) {
      throw new Error('TWRP 镜像未下载,请先在"资源下载"页下载 TWRP');
    }
    const twrpImg = path.join(twrpDir, innermodel + '.img');
    if (!fs.existsSync(twrpImg)) {
      throw new Error('TWRP 镜像不存在: ' + innermodel + '.img');
    }
    const workDir = path.join(app.getPath('userData'), 'edl_work');
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    const dstImg = path.join(workDir, 'recovery.img');
    fs.copyFileSync(twrpImg, dstImg);
    await fastbootService.boot(dstImg);
    logger.info('已临时启动 TWRP');
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
      fs.mkdirSync(workDir, { recursive: true });
    } catch {}
  }

  async flashMisc(mode: string, platform: string, innermodel: string) {
    if (!innermodel || !platform) {
      throw new Error(mode + ' 需要选择型号和平台');
    }
    let port = await edlService.findPort();
    if (!port) {
      const device = DeviceService.instance.getCurrentDevice();
      if (device?.type === 'adb') {
        logger.info('设备在 ADB 模式,重启至 9008...');
        await adbService.reboot('', 'edl');
        port = await edlService.waitForEdl(60000);
      } else {
        throw new Error('未检测到 9008 设备,请将设备进入 9008 模式');
      }
    }
    const edlMode = mode === 'wipe-data' ? 'wipe' : mode;
    const miscDir = path.join(paths.edl, 'misc');
    const imageSrc = edlMode === 'ffbm' ? 'ffbm.img' : edlMode === 'wipe' ? 'wipe.img' : edlMode === 'fastbootd' ? 'fastbootd.img' : 'misc.img';
    const xmlSrc = platform === 'z10' ? 'misc_ND03.xml' : `misc_${innermodel}.xml`;
    const workDir = path.join(paths.edl, 'rooting');
    if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });
    const imgExt = platform === 'otherpass' ? 'mbn' : 'img';
    const workXml = path.join(workDir, 'misc.xml');
    fs.copyFileSync(path.join(miscDir, xmlSrc), workXml);
    fs.copyFileSync(path.join(miscDir, imageSrc), path.join(workDir, `misc.${imgExt}`));
    await edlService.loadFirehose(path.join(paths.edl, platform === 'z10' ? 'prog_firehose_ddr.elf' : platform === 'v3pash' ? 'msm8937.mbn' : 'msm8909w.mbn'), port);
    await edlService.flashPartitions([workXml], port, undefined, workDir);
    await edlService.reboot(port);
    const modeLabel: any = {
      qmmi: 'QMMI',
      ffbm: 'FFBM',
      wipe: '恢复出厂设置',
      fastbootd: 'fastbootd',
    };
    logger.info('已进入 ' + modeLabel[edlMode]);
  }

  async edlReboot() {
    const port = await edlService.findPort();
    if (!port) {
      throw new Error('未检测到 9008 设备');
    }
    const loaders = ['msm8937.mbn', 'msm8909w.mbn', 'prog_firehose_ddr.elf'];
    let loaded = false;
    for (const loader of loaders) {
      try {
        await edlService.loadFirehose(path.join(paths.edl, loader), port);
        loaded = true;
        break;
      } catch {}
    }
    if (!loaded) {
      throw new Error('所有 firehose loader 加载失败');
    }
    await edlService.reboot(port);
  }
}

export const rebootService = new RebootServiceClass();
export default rebootService;
