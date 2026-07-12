import path from 'node:path';
import { paths } from '../core/paths';
import { subprocessPool } from './SubprocessPool';
import { adbService } from './AdbService';
import { scrcpyService } from './ScrcpyService';
import { checkIsV3 } from '../../shared/isv3';

const logger = {
  info: (...args: any[]) => console.log('[OtaService]', ...args),
  warn: (...args: any[]) => console.warn('[OtaService]', ...args),
  error: (...args: any[]) => console.error('[OtaService]', ...args),
};

const TIMEOUT = {
  shell: 10000,
  fileOp: 15000,
};

class OtaServiceClass {
  async start(opts: any) {
    const steps = [
      { name: '检查 ADB 设备', status: 'pending' },
      { name: '读取设备信息(innermodel/softversion)', status: 'pending' },
      { name: '检测 V3 协议(V3 版本无法离线 OTA)', status: 'pending' },
      { name: 'adb root(必须含 "restarting")', status: 'pending' },
      { name: 'adb shell rm -rf /data/ota*', status: 'pending' },
      { name: '推送 OTA zip 到 /sdcard/xtc/ota_f_vota.zip', status: 'pending' },
      { name: 'am start OfflineOtaActivity', status: 'pending' },
      { name: '启动 scrcpy 引导用户点击"开始升级"', status: 'pending' },
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
    let innermodel = '';
    let softVersion = '';
    let ok = await runStep(0, async () => {
      // @ts-ignore
      const devices = await adbService.devices();
      if (devices.length === 0) {
        throw new Error('未检测到 ADB 设备');
      }
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[0].message };
    ok = await runStep(1, async () => {
      innermodel = await adbService.getProp('', 'ro.product.innermodel');
      softVersion = await adbService.getProp('', 'ro.product.current.softversion');
      const model = await adbService.getProp('', 'ro.product.model');
      logger.info('设备 innermodel=' + innermodel + ', model=' + model + ', softversion=' + softVersion);
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[1].message };
    ok = await runStep(2, async () => {
      const isV3 = checkIsV3(innermodel, softVersion);
      if (isV3) {
        throw new Error('你的手表可能是 V3 版本,无需离线 OTA,也无法离线 OTA');
      }
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[2].message };
    ok = await runStep(3, async () => {
      const result = await subprocessPool.spawn({
        cmd: process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb',
        args: ['root'],
        encoding: 'gbk',
        timeout: TIMEOUT.shell,
        cwd: paths.bin,
      });
      if (!result.stdout.includes('restarting') && !result.stdout.includes('already')) {
        throw new Error('当前不是 QMMI 状态下!');
      }
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[3].message };
    ok = await runStep(4, async () => {
      await adbService.shell('', 'rm -rf /data/ota*');
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[4].message };
    ok = await runStep(5, async () => {
      await adbService.shell('', 'mkdir -p /sdcard/xtc');
      await adbService.push('', opts.zipPath, '/sdcard/xtc/ota_f_vota.zip');
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[5].message };
    ok = await runStep(6, async () => {
      await adbService.shell('', 'am start -n com.xtc.setting/.module.secretcode.view.activity.OfflineOtaActivity');
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[6].message };
    let scrcpyStarted = false;
    await runStep(7, async () => {
      const pid = await scrcpyService.launch({
        stayAwake: true,
        showTouches: true,
        windowTitle: '请点击手表上的"开始升级"',
      });
      if (pid > 0) {
        scrcpyStarted = true;
        logger.info('已启动 scrcpy (pid=' + pid + ') 引导用户点击"开始升级"');
      } else {
        throw new Error('scrcpy 启动失败');
      }
    });
    return {
      success: true,
      steps,
      scrcpyStarted,
    };
  }
}

export const otaService = new OtaServiceClass();
export default otaService;
