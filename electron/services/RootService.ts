import path from 'node:path';
import fs from 'node:fs';
import { EventEmitter } from 'node:events';
import { BrowserWindow, app } from 'electron';
import { paths } from '../core/paths';
import { subprocessPool } from './SubprocessPool';
import { adbService } from './AdbService';
import { fastbootService } from './FastbootService';
import { edlService } from './EdlService';
import { scrcpyService } from './ScrcpyService';
import { backupService } from './BackupService';
import { magiskService } from './MagiskService';
import { magiskPatcher } from './MagiskPatcher';
import { bootPatcher } from './BootPatcher';
import { DeviceService } from './DeviceService';
import { checkIsV3 } from '../../shared/isv3';
import { cloudService } from './CloudService';

const logger = {
  info: (...args: any[]) => console.log('[RootService]', ...args),
  warn: (...args: any[]) => console.warn('[RootService]', ...args),
  error: (...args: any[]) => console.error('[RootService]', ...args),
};

const TIMEOUT = {
  device: 5000,
  shell: 10000,
  fileOp: 15000,
  shellLong: 30000,
  flash: 60000,
  install: 120000,
  transfer: 300000,
  backup: 600000,
};

class RootServiceClass {
  tasks = new Map();
  bus = new EventEmitter();

  constructor() {
    this.bus.setMaxListeners(50);
    this.handlers = {
      'idle': async () => {},
      'preparing-resources': this.preparingResources.bind(this),
      'showing-disclaimer': async () => {},
      'detecting-device': this.detectingDevice.bind(this),
      'selecting-model': async () => {},
      'entering-edl': this.enteringEdl.bind(this),
      'waiting-adb-after-edl': this.waitingAdbAfterEdl.bind(this),
      'reading-device-info': this.readingDeviceInfo.bind(this),
      'detecting-v3': this.detectingV3.bind(this),
      'extracting-root-zip': this.extractingRootZip.bind(this),
      'routing-by-sdk': this.routingBySdk.bind(this),
      'sdk19-backup-dcim': this.sdk19BackupDcim.bind(this),
      'sdk19-flash-boot': this.sdk19FlashBoot.bind(this),
      'sdk19-install-magisk': this.sdk19InstallMagisk.bind(this),
      'sdk19-install-xtcpatch': this.sdk19InstallXtcpatch.bind(this),
      'sdk19-restore-dcim': this.sdk19RestoreDcim.bind(this),
      'sdk19-reboot': this.sdk19Reboot.bind(this),
      'sdk25-backup-dcim': this.sdk25BackupDcim.bind(this),
      'sdk25-select-scheme': async () => {},
      'sdk25-entering-edl': this.sdk25EnteringEdl.bind(this),
      'sdk25-reading-boot': this.sdk25ReadingBoot.bind(this),
      'sdk25-patching-boot': this.sdk25PatchingBoot.bind(this),
      'sdk25-flashing': this.sdk25Flashing.bind(this),
      'sdk25-rebooting': this.sdk25Rebooting.bind(this),
      'sdk25-waiting-boot': this.sdk25WaitingBoot.bind(this),
      'sdk25-install-magisk': this.sdk25InstallMagisk.bind(this),
      'sdk25-install-xtcpatch': this.sdk25InstallXtcpatch.bind(this),
      'sdk25-boot-scheme-second-edl': this.sdk25BootSchemeSecondEdl.bind(this),
      'sdk25-restore-dcim': this.sdk25RestoreDcim.bind(this),
      'sdk27-backup-dcim': this.sdk27BackupDcim.bind(this),
      'sdk27-entering-edl': this.sdk27EnteringEdl.bind(this),
      'sdk27-reading-boot': this.sdk27ReadingBoot.bind(this),
      'sdk27-patching-boot': this.sdk27PatchingBoot.bind(this),
      'sdk27-flashing-rawprogram': this.sdk27FlashingRawprogram.bind(this),
      'sdk27-rebooting-to-fastboot': this.sdk27RebootingToFastboot.bind(this),
      'sdk27-fastboot-flash-boot': this.sdk27FastbootFlashBoot.bind(this),
      'sdk27-fastboot-flash-userdata': this.sdk27FastbootFlashUserdata.bind(this),
      'sdk27-fastboot-flash-misc': this.sdk27FastbootFlashMisc.bind(this),
      'sdk27-waiting-boot': this.sdk27WaitingBoot.bind(this),
      'sdk27-install-preinstall': this.sdk27InstallPreinstall.bind(this),
      'sdk27-enable-charge': this.sdk27EnableCharge.bind(this),
      'sdk27-auto-grant-magisk': this.sdk27AutoGrantMagisk.bind(this),
      'sdk27-activate-systemplus': this.sdk27ActivateSystemplus.bind(this),
      'sdk27-install-xtcpatch': this.sdk27InstallXtcpatch.bind(this),
      'sdk27-install-systemui': this.sdk27InstallSystemui.bind(this),
      'sdk27-install-preinstall-apk': this.sdk27InstallPreinstallApk.bind(this),
      'sdk27-erase-misc-reboot': this.sdk27EraseMiscReboot.bind(this),
      'sdk27-install-bundled-apks': this.sdk27InstallBundledApks.bind(this),
      'sdk27-compile-packages': this.sdk27CompilePackages.bind(this),
      'sdk27-restore-dcim': this.sdk27RestoreDcim.bind(this),
      'nd03-download-zip': this.nd03DownloadZip.bind(this),
      'nd03-extract': this.nd03Extract.bind(this),
      'nd03-entering-edl': this.nd03EnteringEdl.bind(this),
      'nd03-flash-281-recovery': this.nd03Flash281Recovery.bind(this),
      'nd03-flash-root-firmware': this.nd03FlashRootFirmware.bind(this),
      'nd03-erase-boot': this.nd03EraseBoot.bind(this),
      'nd03-reboot-to-fastboot': this.nd03RebootToFastboot.bind(this),
      'nd03-fastboot-flash-boot': this.nd03FastbootFlashBoot.bind(this),
      'nd03-boot-recovery': this.nd03BootRecovery.bind(this),
      'nd03-sideload-dm': this.nd03SideloadDm.bind(this),
      'nd03-flash-misc-reboot': this.nd03FlashMiscReboot.bind(this),
      'nd03-wait-3-reboots': this.nd03Wait3Reboots.bind(this),
      'nd03-auto-grant-magisk': this.nd03AutoGrantMagisk.bind(this),
      'nd03-install-xtcpatch': this.nd03InstallXtcpatch.bind(this),
      'nd03-install-toolkit': this.nd03InstallToolkit.bind(this),
      'nd03-activate-lsposed': this.nd03ActivateLsposed.bind(this),
      'nd03-install-preinstall': this.nd03InstallPreinstall.bind(this),
      'nd03-compile-packages': this.nd03CompilePackages.bind(this),
      'completed': this.completedStage.bind(this),
      'failed': async () => {},
      'cancelled': async () => {},
    };
  }

  async completedStage(ctx: any) {
    if (ctx.dcimBackupDir) {
      this.log(ctx, 'info', 'DCIM 备份已保留: ' + ctx.dcimBackupDir + '(可在备份恢复页手动清理)');
    }
    if (ctx.sdkVersion === '27') {
      this.log(ctx, 'info', '检测到 SDK=27,建议进行预装优化(包括模块和应用,期间需要多次选择)');
      this.log(ctx, 'info', '提示:当手表进入长续航模式、睡眠模式等禁用模式时,划到最后一页,点击打开应用列表,即可绕过禁用模式');
      this.log(ctx, 'info', '提示:你可以在 /sdcard/hidden_app_list.txt 中填写包名以实现隐藏应用');
      this.log(ctx, 'info', '提示:如果需要在手表上安装应用,请在手表端选择弦-安装器,点击始终');
      this.log(ctx, 'info', '请永远不要卸载 SystemPlus 和 XTCPatch,否则手表无法开机');
      this.log(ctx, 'info', '请永远不要删除 magisk 自带的模块,否则手表无法开机');
      this.log(ctx, 'info', '跨越山海 终见曙光');
    }
  }

  async start(options: any) {
    const taskId = 'root_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const ctx: any = {
      taskId, stage: 'preparing-resources', options, device: null,
      innermodel: '', isV3: false, smodel: false, sdkVersion: '',
      androidVersion: '', startedAt: Date.now(), paused: false, cancelled: false,
      logs: [], progress: 0, sdk25Scheme: options.sdk25Scheme ?? 'boot',
    };
    this.tasks.set(taskId, ctx);
    logger.info('Root 任务已启动: ' + taskId, JSON.stringify(options));
    setImmediate(() => { this.run(ctx).catch((e: any) => { this.fail(ctx, e); }); });
    return taskId;
  }

  async pause(taskId: string) {
    const ctx = this.tasks.get(taskId);
    if (!ctx) throw new Error('任务不存在: ' + taskId);
    ctx.paused = true;
    this.log(ctx, 'info', '用户已暂停,将在下一个状态边界停止');
    this.emit(ctx);
  }

  async resume(taskId: string) {
    const ctx = this.tasks.get(taskId);
    if (!ctx) throw new Error('任务不存在: ' + taskId);
    ctx.paused = false;
    this.log(ctx, 'info', '用户已恢复');
    this.emit(ctx);
  }

  async cancel(taskId: string) {
    const ctx = this.tasks.get(taskId);
    if (!ctx) throw new Error('任务不存在: ' + taskId);
    ctx.cancelled = true;
    this.log(ctx, 'warn', '用户已取消');
    subprocessPool.kill(taskId);
    this.emit(ctx);
  }

  onStageChange(taskId: string, cb: any) {
    const channel = 'stage-change:' + taskId;
    this.bus.on(channel, cb);
    return () => this.bus.off(channel, cb);
  }

  getContext(taskId: string) {
    return this.tasks.get(taskId) ?? null;
  }

  async run(ctx: any) {
    while (ctx.stage !== 'completed' && ctx.stage !== 'failed' && ctx.stage !== 'cancelled') {
      if (ctx.cancelled) {
        ctx.stage = 'cancelled'; ctx.endedAt = Date.now(); this.emit(ctx); this.scheduleCleanup(ctx); return;
      }
      if (ctx.paused) {
        this.log(ctx, 'info', '已暂停于 stage=' + ctx.stage + ',等待恢复...');
        await this.waitForResume(ctx);
        if (ctx.cancelled) continue;
      }
      ctx.progress = this.computeProgress(ctx);
      const handler = (this as any).handlers[ctx.stage];
      if (!handler) { this.fail(ctx, new Error('未注册的 stage: ' + ctx.stage)); return; }
      try {
        this.log(ctx, 'info', '→ 进入 stage: ' + ctx.stage);
        this.emit(ctx);
        await handler(ctx);
        this.log(ctx, 'info', '← stage 完成: ' + ctx.stage);
      } catch (e: any) { this.fail(ctx, e); return; }
      const next = this.nextStage(ctx);
      if (!next) { this.fail(ctx, new Error('无下一 stage(当前: ' + ctx.stage + ')')); return; }
      ctx.stage = next;
      this.emit(ctx);
    }
    if (ctx.stage === 'completed') { ctx.endedAt = Date.now(); ctx.progress = 100; this.log(ctx, 'info', 'Root 流程已完成'); this.emit(ctx); }
    this.scheduleCleanup(ctx);
  }

  async waitForResume(ctx: any) {
    while (ctx.paused && !ctx.cancelled) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  fail(ctx: any, e: any) {
    ctx.stage = 'failed'; ctx.endedAt = Date.now();
    ctx.error = { stage: ctx.stage, message: e.message, recoverable: false };
    this.log(ctx, 'error', 'Root 流程失败: ' + e.message);
    this.emit(ctx);
    this.scheduleCleanup(ctx);
  }

  emit(ctx: any) {
    this.bus.emit('stage-change:' + ctx.taskId, ctx);
    for (const w of BrowserWindow.getAllWindows()) {
      if (!w.isDestroyed()) {
        w.webContents.send('root:stage-change', ctx);
      }
    }
  }

  scheduleCleanup(ctx: any) {
    const taskId = ctx.taskId;
    const delay = 30 * 60 * 1000;
    setTimeout(() => {
      this.tasks.delete(taskId);
      this.bus.removeAllListeners('stage-change:' + taskId);
      try {
        const workDir = path.join(app.getPath('userData'), 'edl_work');
        if (fs.existsSync(workDir)) {
          for (const f of fs.readdirSync(workDir)) {
            const p = path.join(workDir, f);
            try { fs.rmSync(p, { recursive: true, force: true }); } catch {}
          }
        }
      } catch {}
      logger.info('任务 ' + taskId + ' 已清理(30 分钟后)');
    }, delay);
  }

  log(ctx: any, level: string, msg: string) {
    const entry: any = { ts: Date.now(), level, msg };
    ctx.logs.push(entry);
    if (ctx.logs.length > 500) ctx.logs.shift();
    switch (level) {
      case 'info': logger.info(msg); break;
      case 'warn': logger.warn(msg); break;
      case 'error': logger.error(msg); break;
    }
  }

  computeProgress(ctx: any) {
    const sdk = ctx.sdkVersion;
    let total = 10, current = 1;
    if (sdk === '19') {
      total = 8;
      const stages = ['preparing-resources','detecting-device','reading-device-info','extracting-root-zip','routing-by-sdk','sdk19-backup-dcim','sdk19-flash-boot','sdk19-install-magisk','sdk19-install-xtcpatch','sdk19-restore-dcim'];
      current = stages.indexOf(ctx.stage) + 1;
    } else if (sdk === '25') {
      total = 14;
      const stages = ['preparing-resources','detecting-device','reading-device-info','extracting-root-zip','routing-by-sdk','sdk25-backup-dcim','sdk25-entering-edl','sdk25-reading-boot','sdk25-patching-boot','sdk25-flashing','sdk25-rebooting','sdk25-waiting-boot','sdk25-install-magisk','sdk25-install-xtcpatch','sdk25-boot-scheme-second-edl','sdk25-restore-dcim'];
      current = stages.indexOf(ctx.stage) + 1;
    } else if (sdk === '27') {
      total = 24;
      const stages = ['preparing-resources','detecting-device','reading-device-info','detecting-v3','extracting-root-zip','routing-by-sdk','sdk27-backup-dcim','sdk27-entering-edl','sdk27-reading-boot','sdk27-patching-boot','sdk27-flashing-rawprogram','sdk27-rebooting-to-fastboot','sdk27-fastboot-flash-boot','sdk27-fastboot-flash-userdata','sdk27-fastboot-flash-misc','sdk27-waiting-boot','sdk27-install-preinstall','sdk27-enable-charge','sdk27-auto-grant-magisk','sdk27-activate-systemplus','sdk27-install-xtcpatch','sdk27-install-systemui','sdk27-install-preinstall-apk','sdk27-erase-misc-reboot','sdk27-install-bundled-apks','sdk27-compile-packages','sdk27-restore-dcim'];
      current = stages.indexOf(ctx.stage) + 1;
    } else if (ctx.innermodel === 'ND03') {
      total = 21;
      const stages = ['preparing-resources','detecting-device','reading-device-info','nd03-download-zip','nd03-extract','nd03-entering-edl','nd03-flash-281-recovery','nd03-flash-root-firmware','nd03-erase-boot','nd03-reboot-to-fastboot','nd03-fastboot-flash-boot','nd03-boot-recovery','nd03-sideload-dm','nd03-flash-misc-reboot','nd03-wait-3-reboots','nd03-auto-grant-magisk','nd03-install-xtcpatch','nd03-install-toolkit','nd03-activate-lsposed','nd03-install-preinstall','nd03-compile-packages'];
      current = stages.indexOf(ctx.stage) + 1;
    }
    if (ctx.stage === 'completed') return 100;
    return Math.min(99, Math.round(current / total * 100));
  }

  nextStage(ctx: any) {
    const s = ctx.stage;
    switch (s) {
      case 'preparing-resources': return 'detecting-device';
      case 'detecting-device': return ctx.device?.type === 'qcom_edl' ? 'selecting-model' : 'reading-device-info';
      case 'selecting-model': return 'entering-edl';
      case 'entering-edl': return 'waiting-adb-after-edl';
      case 'waiting-adb-after-edl': return 'reading-device-info';
      case 'reading-device-info':
        if (ctx.androidVersion === '11') { this.log(ctx, 'info', '触发彩蛋:你是怎么运行到这里的?'); return 'failed'; }
        if (ctx.innermodel === 'ND03') return 'nd03-download-zip';
        return 'detecting-v3';
      case 'detecting-v3': return 'extracting-root-zip';
      case 'extracting-root-zip': return 'routing-by-sdk';
      case 'routing-by-sdk':
        if (ctx.sdkVersion === '19') return 'sdk19-backup-dcim';
        if (ctx.sdkVersion === '25') return 'sdk25-backup-dcim';
        if (ctx.sdkVersion === '27') return 'sdk27-backup-dcim';
        this.log(ctx, 'info', '触发彩蛋:这是xtc吗?');
        return 'failed';
      case 'sdk19-backup-dcim': return 'sdk19-flash-boot';
      case 'sdk19-flash-boot': return 'sdk19-install-magisk';
      case 'sdk19-install-magisk': return 'sdk19-install-xtcpatch';
      case 'sdk19-install-xtcpatch': return 'sdk19-restore-dcim';
      case 'sdk19-restore-dcim': return 'sdk19-reboot';
      case 'sdk19-reboot': return 'completed';
      case 'sdk25-backup-dcim': return 'sdk25-select-scheme';
      case 'sdk25-select-scheme': return 'sdk25-entering-edl';
      case 'sdk25-entering-edl': return 'sdk25-reading-boot';
      case 'sdk25-reading-boot': return 'sdk25-patching-boot';
      case 'sdk25-patching-boot': return 'sdk25-flashing';
      case 'sdk25-flashing': return 'sdk25-rebooting';
      case 'sdk25-rebooting': return 'sdk25-waiting-boot';
      case 'sdk25-waiting-boot': return 'sdk25-install-magisk';
      case 'sdk25-install-magisk': return 'sdk25-install-xtcpatch';
      case 'sdk25-install-xtcpatch': return ctx.sdk25Scheme === 'recovery' ? 'sdk25-boot-scheme-second-edl' : 'sdk25-restore-dcim';
      case 'sdk25-boot-scheme-second-edl': return 'sdk25-restore-dcim';
      case 'sdk25-restore-dcim': return 'completed';
      case 'sdk27-backup-dcim': return 'sdk27-entering-edl';
      case 'sdk27-entering-edl': return 'sdk27-reading-boot';
      case 'sdk27-reading-boot': return 'sdk27-patching-boot';
      case 'sdk27-patching-boot': return 'sdk27-flashing-rawprogram';
      case 'sdk27-flashing-rawprogram':
        if (ctx.smodel) return 'sdk27-waiting-boot';
        if (ctx.options.nouserdata) { this.log(ctx, 'warn', '你选择了不刷userdata,不再继续'); return 'completed'; }
        return 'sdk27-rebooting-to-fastboot';
      case 'sdk27-rebooting-to-fastboot': return 'sdk27-fastboot-flash-boot';
      case 'sdk27-fastboot-flash-boot': return 'sdk27-fastboot-flash-userdata';
      case 'sdk27-fastboot-flash-userdata': return 'sdk27-fastboot-flash-misc';
      case 'sdk27-fastboot-flash-misc': return 'sdk27-waiting-boot';
      case 'sdk27-waiting-boot': return 'sdk27-install-preinstall';
      case 'sdk27-install-preinstall': return 'sdk27-enable-charge';
      case 'sdk27-enable-charge': return 'sdk27-auto-grant-magisk';
      case 'sdk27-auto-grant-magisk': return 'sdk27-activate-systemplus';
      case 'sdk27-activate-systemplus': return 'sdk27-install-xtcpatch';
      case 'sdk27-install-xtcpatch': return 'sdk27-install-systemui';
      case 'sdk27-install-systemui': return 'sdk27-install-preinstall-apk';
      case 'sdk27-install-preinstall-apk': return 'sdk27-erase-misc-reboot';
      case 'sdk27-erase-misc-reboot': return 'sdk27-install-bundled-apks';
      case 'sdk27-install-bundled-apks': return 'sdk27-compile-packages';
      case 'sdk27-compile-packages': return 'sdk27-restore-dcim';
      case 'sdk27-restore-dcim': return 'completed';
      case 'nd03-download-zip': return 'nd03-extract';
      case 'nd03-extract': return 'nd03-entering-edl';
      case 'nd03-entering-edl': return 'nd03-flash-281-recovery';
      case 'nd03-flash-281-recovery': return 'nd03-flash-root-firmware';
      case 'nd03-flash-root-firmware': return 'nd03-erase-boot';
      case 'nd03-erase-boot': return 'nd03-reboot-to-fastboot';
      case 'nd03-reboot-to-fastboot': return 'nd03-fastboot-flash-boot';
      case 'nd03-fastboot-flash-boot': return 'nd03-boot-recovery';
      case 'nd03-boot-recovery': return 'nd03-sideload-dm';
      case 'nd03-sideload-dm': return 'nd03-flash-misc-reboot';
      case 'nd03-flash-misc-reboot': return 'nd03-wait-3-reboots';
      case 'nd03-wait-3-reboots': return 'nd03-auto-grant-magisk';
      case 'nd03-auto-grant-magisk': return 'nd03-install-xtcpatch';
      case 'nd03-install-xtcpatch': return 'nd03-install-toolkit';
      case 'nd03-install-toolkit': return 'nd03-activate-lsposed';
      case 'nd03-activate-lsposed': return 'nd03-install-preinstall';
      case 'nd03-install-preinstall': return 'nd03-compile-packages';
      case 'nd03-compile-packages': return 'completed';
      case 'completed': case 'failed': case 'cancelled': return null;
      default: return null;
    }
  }

  async preparingResources(ctx: any) {
    const cacheDir = paths.cache;
    if (!fs.existsSync(cacheDir)) { fs.mkdirSync(cacheDir, { recursive: true }); }
    const required = [
      { name: 'userdata', file: 'userdata.img' },
      { name: 'xtcpatch', file: 'xtcpatch.zip' },
      { name: 'systemui', file: 'systemui.zip' },
    ];
    for (const r of required) {
      const p = path.join(cacheDir, r.file);
      if (!fs.existsSync(p)) { this.log(ctx, 'warn', '资源缺失: ' + r.file + ',请先在"资源下载"页下载'); }
    }
    const apksDir = path.join(paths.resources, 'apks');
    if (!fs.existsSync(apksDir)) { this.log(ctx, 'warn', 'apks 目录不存在,请先在"资源下载"页下载 apks'); }
  }

  async detectingDevice(ctx: any) {
    const device = DeviceService.instance.getCurrentDevice();
    if (!device) { throw new Error('未检测到设备,请连接手表并开启 ADB/9008 模式'); }
    ctx.device = device;
    this.log(ctx, 'info', '设备类型: ' + device.type + ', serial: ' + device.serial);
  }

  async enteringEdl(ctx: any) {
    this.log(ctx, 'info', 'EDL 模式已选型号: ' + (ctx.options.modelChoice ?? '(未选)'));
  }

  async waitingAdbAfterEdl(ctx: any) {
    this.log(ctx, 'info', '等待 ADB 设备连接...');
    const device = await DeviceService.instance.waitFor(['adb'], 120000);
    ctx.device = device;
    this.log(ctx, 'info', 'ADB 设备已连接: ' + device.serial);
  }

  async readingDeviceInfo(ctx: any) {
    if (!ctx.device || ctx.device.type !== 'adb') { throw new Error('需要 ADB 模式设备'); }
    const rawInnermodel = await adbService.getProp('', 'ro.product.innermodel');
    const innermodel = rawInnermodel.replace(/[^a-zA-Z0-9_]/g, '');
    ctx.innermodel = innermodel;
    this.log(ctx, 'info', '设备 innermodel: ' + innermodel);
    if (innermodel === 'I25C') { ctx.smodel = true; this.log(ctx, 'warn', '此型号(I25C/Z7A)ROOT 可能存在不稳定性问题'); }
    const model = await adbService.getProp('', 'ro.product.model');
    const androidVersion = await adbService.getProp('', 'ro.build.version.release');
    const sdkVersion = await adbService.getProp('', 'ro.build.version.sdk');
    const version = await adbService.getProp('', 'ro.product.current.softversion');
    ctx.androidVersion = androidVersion;
    ctx.sdkVersion = sdkVersion;
    this.log(ctx, 'info', '型号: ' + model + ', Android: ' + androidVersion + ', SDK: ' + sdkVersion + ', 版本: ' + version);
  }

  async detectingV3(ctx: any) {
    const softVersion = await adbService.getProp('', 'ro.product.current.softversion');
    ctx.isV3 = checkIsV3(ctx.innermodel, softVersion);
    this.log(ctx, 'info', 'V3 协议: ' + (ctx.isV3 ? '是' : '否') + '(softVersion=' + softVersion + ')');
  }

  async extractingRootZip(ctx: any) {
    const zipPath = path.join(paths.edl, ctx.innermodel + '.zip');
    if (!fs.existsSync(zipPath)) { throw new Error('Root 资源包不存在: ' + ctx.innermodel + '.zip,请先在"资源下载"页下载'); }
    const workDir = path.join(app.getPath('userData'), 'edl_work');
    if (!fs.existsSync(workDir)) { fs.mkdirSync(workDir, { recursive: true }); }
    this.log(ctx, 'info', '解压 ' + ctx.innermodel + '.zip → ' + workDir);
    await subprocessPool.spawn({
      cmd: path.join(paths.bin, '7z.exe'),
      args: ['x', zipPath, '-o' + workDir, '-aoa', '-bsp1'],
      cwd: paths.bin, encoding: 'utf-8', timeout: TIMEOUT.install, taskId: ctx.taskId,
      onStdout: (line: string) => this.log(ctx, 'info', '7z: ' + line),
    });
    this.log(ctx, 'info', '解压完成');
  }

  async routingBySdk(ctx: any) { this.log(ctx, 'info', '路由到 SDK' + ctx.sdkVersion + ' 分支'); }

  async sdk19BackupDcim(ctx: any) {
    const backupDir = path.join(app.getPath('userData'), 'root-backup', ctx.taskId);
    if (!fs.existsSync(backupDir)) { fs.mkdirSync(backupDir, { recursive: true }); }
    ctx.dcimBackupDir = backupDir;
    this.log(ctx, 'info', '正在备份相册...');
    const r = await backupService.backupDcim(backupDir, (msg) => this.log(ctx, 'info', msg));
    if (!r.success) { this.log(ctx, 'warn', '相册备份失败(继续流程): ' + r.error); }
  }

  async sdk19FlashBoot(ctx: any) {
    this.log(ctx, 'info', '正在重启至 Bootloader 模式，设备处于正常状态');
    await adbService.reboot('', 'bootloader');
    this.log(ctx, 'info', '等待 fastboot 设备...');
    await DeviceService.instance.waitFor(['fastboot'], 30000);
    this.log(ctx, 'info', '正在刷入 boot');
    const sbootImg = path.join(app.getPath('userData'), 'edl_work', 'sboot.img');
    if (!fs.existsSync(sbootImg)) { throw new Error('sboot.img 不存在: ' + sbootImg); }
    await fastbootService.flash('boot', sbootImg);
    this.log(ctx, 'info', '重新启动,退出 bootloader 模式');
    await fastbootService.reboot('system');
    this.log(ctx, 'info', '等待设备连接');
    const device = await DeviceService.instance.waitFor(['adb'], 60000);
    ctx.device = device;
  }

  async sdk19InstallMagisk(ctx: any) {
    this.log(ctx, 'info', '请耐心等待 120 秒，设备正在初始化');
    await new Promise((r) => setTimeout(r, 120000));
    this.log(ctx, 'info', '安装管理器');
    const managerApk = path.join(app.getPath('userData'), 'edl_work', 'manager.apk');
    if (fs.existsSync(managerApk)) { await adbService.install('', managerApk, 'install'); } else { this.log(ctx, 'warn', 'manager.apk 不存在: ' + managerApk); }
    this.log(ctx, 'info', '启动管理器');
    await adbService.amStart('com.topjohnwu.magisk/.ui.MainActivity');
    this.log(ctx, 'info', '修复运行环境');
    await adbService.shell('', 'mkdir -p /sdcard/magisk');
    const magiskfileDir = path.join(app.getPath('userData'), 'edl_work', 'magiskfile');
    if (fs.existsSync(magiskfileDir)) { await adbService.push('', magiskfileDir, '/sdcard/magisk'); } else { this.log(ctx, 'warn', 'magiskfile 目录不存在: ' + magiskfileDir); }
    await adbService.shell('', 'rm -rf /data/adb/magisk');
    await adbService.shell('', 'cp -af /sdcard/magisk/* /data/adb/magisk/');
    await adbService.shell('', 'chmod -R 755 /data/adb/magisk/');
  }

  async sdk19InstallXtcpatch(ctx: any) {
    this.log(ctx, 'info', '刷入 xtcpatch 模块(已修复 instmodule2.bat → instmodule.bat)');
    const xtcpatchZip = path.join(paths.cache, 'xtcpatch.zip');
    if (!fs.existsSync(xtcpatchZip)) { throw new Error('xtcpatch.zip 不存在: ' + xtcpatchZip); }
    const r = await magiskService.install(xtcpatchZip, 'magisk');
    if (!r.success) { this.log(ctx, 'warn', 'xtcpatch 安装失败: ' + r.error); }
  }

  async sdk19RestoreDcim(ctx: any) {
    if (!ctx.dcimBackupDir) { this.log(ctx, 'warn', '无 DCIM 备份目录,跳过恢复'); return; }
    this.log(ctx, 'info', '正在恢复相册...');
    const r = await backupService.recoverDcim(ctx.dcimBackupDir, (msg) => this.log(ctx, 'info', msg));
    if (!r.success) { this.log(ctx, 'warn', '相册恢复失败: ' + r.error); }
  }

  async sdk19Reboot(ctx: any) {
    this.log(ctx, 'info', '重启手表');
    await adbService.reboot('', 'system');
    this.log(ctx, 'info', '您的手表 ROOT 完毕');
    try {
      const workDir = path.join(app.getPath('userData'), 'edl_work');
      if (fs.existsSync(workDir)) {
        for (const f of fs.readdirSync(workDir)) {
          const p = path.join(workDir, f);
          try { fs.rmSync(p, { recursive: true, force: true }); } catch {}
        }
      }
    } catch {}
  }

  async sdk25BackupDcim(ctx: any) {
    const backupDir = path.join(app.getPath('userData'), 'root-backup', ctx.taskId);
    if (!fs.existsSync(backupDir)) { fs.mkdirSync(backupDir, { recursive: true }); }
    ctx.dcimBackupDir = backupDir;
    this.log(ctx, 'info', '正在备份相册...');
    const r = await backupService.backupDcim(backupDir, (msg) => this.log(ctx, 'info', msg));
    if (!r.success) { this.log(ctx, 'warn', '相册备份失败(继续流程): ' + r.error); }
  }

  async sdk25EnteringEdl(ctx: any) {
    this.log(ctx, 'info', '重启手表至 9008');
    await adbService.reboot('', 'edl');
    this.log(ctx, 'info', '等待 9008 设备...');
    const port = await edlService.waitForEdl(60000);
    ctx.edlPort = port;
    this.log(ctx, 'info', '9008 端口: ' + port);
    this.log(ctx, 'info', '发送引导: msm8909w.mbn');
    await edlService.loadFirehose({ port, loader: 'msm8909w.mbn' });
    await new Promise((r) => setTimeout(r, 2000));
  }

  async sdk25ReadingBoot(ctx: any) {
    if (!ctx.edlPort) throw new Error('未获取 9008 端口');
    const bootXml = path.join(app.getPath('userData'), 'edl_work', 'boot.xml');
    if (!fs.existsSync(bootXml)) { throw new Error('boot.xml 不存在: ' + bootXml); }
    this.log(ctx, 'info', '读取 boot 分区...');
    await edlService.readPartitions({ port: ctx.edlPort, loader: 'msm8909w.mbn', xmlPath: bootXml, outputDir: path.join(app.getPath('userData'), 'edl_work') });
    const srcBoot = path.join(app.getPath('userData'), 'edl_work', 'boot.img');
    const dstBoot = path.join(paths.cache, 'boot.img');
    if (!fs.existsSync(srcBoot)) { throw new Error('fh_loader 读取 boot.img 失败: ' + srcBoot + ' 不存在'); }
    if (fs.existsSync(dstBoot)) fs.unlinkSync(dstBoot);
    fs.renameSync(srcBoot, dstBoot);
    this.log(ctx, 'info', 'boot.img 已读取 → ' + dstBoot);
  }

  async sdk25PatchingBoot(ctx: any) {
    this.log(ctx, 'info', '开始修补 boot(magiskpatch 21)');
    const inputBoot = path.join(paths.cache, 'boot.img');
    const patchedBoot = path.join(app.getPath('userData'), 'edl_work', 'boot.img');
    const r = await magiskPatcher.patch(inputBoot, patchedBoot, 21, path.join(app.getPath('userData'), 'edl_work'), ctx.taskId);
    if (!r.success) { throw new Error('magiskpatch 失败: ' + r.error); }
    ctx.patchedBootPath = patchedBoot;
    this.log(ctx, 'info', 'magiskpatch 完成(status=' + r.status + ')');
    this.log(ctx, 'info', '解包 boot');
    await this.runMagiskboot(ctx, ['unpack', '-h', 'boot.img']);
    this.log(ctx, 'info', '替换 adbd');
    const adbdSrc = path.join(paths.bin, '711_adbd');
    const adbdDst = path.join(app.getPath('userData'), 'edl_work', '711_adbd');
    if (fs.existsSync(adbdSrc) && !fs.existsSync(adbdDst)) { fs.copyFileSync(adbdSrc, adbdDst); }
    await this.runMagiskboot(ctx, ['cpio', 'ramdisk.cpio', 'add 0750 sbin/adbd 711_adbd']);
    this.log(ctx, 'info', '宽容 selinux(patch_boot)');
    const kernelPath = path.join(app.getPath('userData'), 'edl_work', 'kernel');
    const patchResult = bootPatcher.patch(kernelPath);
    if (!patchResult.success || !patchResult.output.includes('success')) { throw new Error('patch_boot 失败: ' + (patchResult.error ?? patchResult.output)); }
    for (const p of patchResult.patches) { this.log(ctx, 'info', 'patch_boot: ' + p); }
    this.log(ctx, 'info', '打包 boot');
    await this.runMagiskboot(ctx, ['repack', 'boot.img']);
    this.log(ctx, 'info', 'BOOT 处理完成');
    const newBootPath = path.join(app.getPath('userData'), 'edl_work', 'new-boot.img');
    if (!fs.existsSync(newBootPath)) { throw new Error('magiskboot repack 未生成 new-boot.img'); }
    if (fs.existsSync(patchedBoot)) fs.unlinkSync(patchedBoot);
    fs.renameSync(newBootPath, patchedBoot);
    const tmpBoot = path.join(paths.cache, 'boot.img');
    try { if (fs.existsSync(tmpBoot)) fs.unlinkSync(tmpBoot); } catch {}
  }

  async sdk25Flashing(ctx: any) {
    if (!ctx.edlPort) throw new Error('未获取 9008 端口');
    const workDir = path.join(app.getPath('userData'), 'edl_work');
    const scheme = ctx.sdk25Scheme ?? 'boot';
    if (scheme === 'boot') {
      this.log(ctx, 'info', '刷入 BOOT');
      const bootXml = path.join(workDir, 'boot.xml');
      await edlService.flashPartitions({ port: ctx.edlPort, loader: 'msm8909w.mbn', xmlPath: bootXml, imagesDir: workDir });
      this.log(ctx, 'info', 'boot 刷入完毕');
    } else {
      this.log(ctx, 'info', '刷入 BOOT 至 Recovery 分区');
      const srcBoot = path.join(workDir, 'boot.img');
      const dstRecovery = path.join(workDir, 'recovery.img');
      if (fs.existsSync(srcBoot)) { fs.copyFileSync(srcBoot, dstRecovery); }
      const recoveryXml = path.join(workDir, 'recovery.xml');
      await edlService.flashPartitions({ port: ctx.edlPort, loader: 'msm8909w.mbn', xmlPath: recoveryXml, imagesDir: workDir });
      this.log(ctx, 'info', '刷入 misc');
      const miscXml = path.join(workDir, 'misc.xml');
      await edlService.flashPartitions({ port: ctx.edlPort, loader: 'msm8909w.mbn', xmlPath: miscXml, imagesDir: workDir });
    }
    this.log(ctx, 'info', '重启手表(9008)');
    await edlService.reboot({ port: ctx.edlPort, loader: 'msm8909w.mbn' });
    this.log(ctx, 'info', '请耐心等待设备响应');
  }

  async sdk25Rebooting(ctx: any) { this.log(ctx, 'info', '已发送重启指令'); }

  async sdk25WaitingBoot(ctx: any) {
    this.log(ctx, 'info', '等待 ADB 设备连接...');
    const device = await DeviceService.instance.waitFor(['adb'], 180000);
    ctx.device = device;
    this.log(ctx, 'info', '等待开机完成...');
    await adbService.waitForBoot(180000);
  }

  async sdk25InstallMagisk(ctx: any) {
    this.log(ctx, 'info', '安装管理器');
    const managerApk = path.join(app.getPath('userData'), 'edl_work', 'manager.apk');
    if (fs.existsSync(managerApk)) { await adbService.install('', managerApk, 'install'); } else { this.log(ctx, 'warn', 'manager.apk 不存在: ' + managerApk); }
    this.log(ctx, 'info', '启动管理器[等待五秒]');
    await new Promise((r) => setTimeout(r, 5000));
    await adbService.amStart('com.topjohnwu.magisk/a.c');
    const xtcpatchDir = path.join(app.getPath('userData'), 'edl_work', 'xtcpatch');
    if (fs.existsSync(xtcpatchDir)) { this.log(ctx, 'info', 'push xtcpatch → /sdcard/'); await adbService.push('', xtcpatchDir, '/sdcard/'); }
    const magiskfileDir = path.join(app.getPath('userData'), 'edl_work', 'magiskfile');
    if (fs.existsSync(magiskfileDir)) { this.log(ctx, 'info', 'push magiskfile → /sdcard/'); await adbService.push('', magiskfileDir, '/sdcard/'); }
    this.log(ctx, 'info', '复制运行环境及刷入模块');
    const setupSh = path.join(paths.scripts, 'setup_magisk_env.sh');
    if (fs.existsSync(setupSh)) {
      await adbService.push('', setupSh, '/sdcard/setup_magisk_env.sh');
      await adbService.shell('', 'sh /sdcard/setup_magisk_env.sh');
    } else { this.log(ctx, 'warn', 'setup_magisk_env.sh 不存在: ' + setupSh); }
  }

  async sdk25InstallXtcpatch(ctx: any) {
    this.log(ctx, 'info', '刷入 xtcpatch 模块(shinst)');
    const xtcpatchZip = path.join(paths.cache, 'xtcpatch.zip');
    if (fs.existsSync(xtcpatchZip)) { const r = await magiskService.install(xtcpatchZip, 'shinst'); if (!r.success) { this.log(ctx, 'warn', 'xtcpatch 安装失败: ' + r.error); } } else { this.log(ctx, 'warn', 'xtcpatch.zip 不存在: ' + xtcpatchZip); }
    this.log(ctx, 'info', '安装第三方应用商店');
    const apksDir = path.join(paths.resources, 'apks');
    const apkFiles = ['appstore.apk','appstore2.apk','appstore3.apk','appstore4.apk','MoyeInstaller.apk'];
    for (const f of apkFiles) { const p = path.join(apksDir, f); if (fs.existsSync(p)) { this.log(ctx, 'info', '安装: ' + f); await adbService.install('', p, 'install'); } }
  }

  async sdk25BootSchemeSecondEdl(ctx: any) {
    this.log(ctx, 'info', '重启手表至 9008(二次 EDL)');
    await adbService.reboot('', 'edl');
    const port = await edlService.waitForEdl(60000);
    ctx.edlPort = port;
    this.log(ctx, 'info', '9008 端口: ' + port);
    this.log(ctx, 'info', '发送引导: msm8909w.mbn');
    await edlService.loadFirehose({ port, loader: 'msm8909w.mbn' });
    const workDir = path.join(app.getPath('userData'), 'edl_work');
    this.log(ctx, 'info', '刷入 BOOT 至 Recovery 分区');
    await edlService.flashPartitions({ port, loader: 'msm8909w.mbn', xmlPath: path.join(workDir, 'recovery.xml'), imagesDir: workDir });
    this.log(ctx, 'info', '刷入 misc');
    await edlService.flashPartitions({ port, loader: 'msm8909w.mbn', xmlPath: path.join(workDir, 'misc.xml'), imagesDir: workDir });
    this.log(ctx, 'info', '重启手表');
    await edlService.reboot({ port, loader: 'msm8909w.mbn' });
  }

  async sdk25RestoreDcim(ctx: any) {
    this.log(ctx, 'info', '等待 ADB 设备连接...');
    const device = await DeviceService.instance.waitFor(['adb', 'qcom_edl'], 180000);
    if (device.type === 'adb') { ctx.device = device; this.log(ctx, 'info', '等待开机完成...'); await adbService.waitForBoot(180000); this.log(ctx, 'info', '重启手表'); await adbService.reboot('', 'system'); const device2 = await DeviceService.instance.waitFor(['adb', 'qcom_edl'], 180000); if (device2.type === 'adb') { ctx.device = device2; await adbService.waitForBoot(180000); } }
    if (ctx.dcimBackupDir) { this.log(ctx, 'info', '正在恢复相册...'); const r = await backupService.recoverDcim(ctx.dcimBackupDir, (msg) => this.log(ctx, 'info', msg)); if (!r.success) { this.log(ctx, 'warn', '相册恢复失败: ' + r.error); } }
    this.log(ctx, 'info', '正在检查 magisk');
    let retry = 0;
    while (retry < 3) { const rootResult = await adbService.root(''); if (rootResult.granted) { this.log(ctx, 'info', 'Magisk 已就绪'); return; } retry++; this.log(ctx, 'warn', 'Magisk 检查失败(' + retry + '/3),5 秒后重试'); await new Promise((r) => setTimeout(r, 5000)); }
    this.log(ctx, 'error', 'ROOT 失败!发生错误,无法获取 magisk,请尝试换方案再次 root');
    throw new Error('ROOT 失败:无法获取 magisk,请尝试换方案再次 root');
  }

  async runMagiskboot(ctx: any, args: string[]) {
    const magiskbootExe = path.join(paths.bin, 'magiskboot.exe');
    await subprocessPool.spawn({ cmd: magiskbootExe, args, cwd: path.join(app.getPath('userData'), 'edl_work'), encoding: 'utf-8', timeout: TIMEOUT.flash, taskId: ctx.taskId, onStdout: (line: string) => this.log(ctx, 'info', 'magiskboot: ' + line), onStderr: (line: string) => this.log(ctx, 'warn', 'magiskboot stderr: ' + line) });
  }

  async instappImportant(ctx: any, apkPath: string) {
    if (!fs.existsSync(apkPath)) { this.log(ctx, 'warn', 'APK 不存在: ' + apkPath + '(跳过)'); return; }
    this.log(ctx, 'info', '正在安装(important): ' + path.basename(apkPath));
    for (let retry = 0; retry < 6; retry++) {
      const r = await adbService.install('', apkPath, 'install');
      if (r.success) { this.log(ctx, 'info', '安装成功'); return; }
      if (retry < 5) { this.log(ctx, 'warn', '安装失败,30 秒后重试(' + (retry + 1) + '/6)'); await new Promise((s) => setTimeout(s, 30000)); }
    }
    throw new Error('安装失败(重试 6 次): ' + path.basename(apkPath));
  }

  async instappOptional(ctx: any, apkPath: string) {
    if (!fs.existsSync(apkPath)) return;
    this.log(ctx, 'info', '安装: ' + path.basename(apkPath));
    const r = await adbService.install('', apkPath, 'install');
    if (!r.success) { this.log(ctx, 'warn', '安装失败: ' + path.basename(apkPath)); }
  }

  async waitForAdbCheckXse(ctx: any, timeout = 180000) {
    this.log(ctx, 'info', '等待 ADB/fastboot 设备连接...');
    const device = await DeviceService.instance.waitFor(['adb', 'fastboot'], timeout);
    if (device.type !== 'adb') { this.log(ctx, 'error', '您的设备可能触发了Xse限制!请重新进行root'); throw new Error('您的设备可能触发了Xse限制!请重新进行root'); }
    ctx.device = device;
  }

  async waitForAdbOrEdl(ctx: any, timeout = 180000) {
    this.log(ctx, 'info', '等待 ADB/9008 设备连接...');
    const device = await DeviceService.instance.waitFor(['adb', 'qcom_edl'], timeout);
    ctx.device = device;
  }

  async startScrcpy(ctx: any) {
    try { const pid = await scrcpyService.launch({ showTouches: true }); this.log(ctx, 'info', 'scrcpy 已启动(pid=' + pid + '),请在投屏窗口手动操作'); this.log(ctx, 'info', '提示:如果手表息屏,在投屏窗口单击右键即可'); return pid; } catch (e: any) { this.log(ctx, 'warn', 'scrcpy 启动失败: ' + e.message); return null; }
  }

  async checkMagiskReady(ctx: any) {
    try { const out = await adbService.shell('', 'magisk -v'); const ready = /magisk/i.test(out) && out.trim().length > 0; if (ready) { this.log(ctx, 'info', 'magisk -v: ' + out.trim()); } return ready; } catch { return false; }
  }

  async autoMagiskSdk27(ctx: any) {
    this.log(ctx, 'info', '正在自动打开自动响应,请稍后');
    await adbService.amStart('com.topjohnwu.magisk/.ui.MainActivity');
    await new Promise((r) => setTimeout(r, 10000));
    await adbService.shell('', 'input keyevent 4');
    await adbService.amStart('com.topjohnwu.magisk/.ui.MainActivity');
    const device = await DeviceService.instance.waitFor(['adb'], 30000);
    ctx.device = device;
    await adbService.shell('', 'input tap 304 26');
    for (let i = 0; i < 5; i++) { await adbService.shell('', 'input swipe 160 300 160 60 100'); }
    await adbService.shell('', 'input tap 200 100');
    await adbService.shell('', 'input tap 200 230');
    await adbService.shell('', 'input tap 200 300');
    await adbService.shell('', 'input tap 200 140');
    if (await this.checkMagiskReady(ctx)) return;
    this.log(ctx, 'error', '自动授予出错及手动授予权限');
    await this.startScrcpy(ctx);
    this.log(ctx, 'info', '请打开 Magisk 右上角设置,往下滑,找到自动响应,修改为允许,然后找到超级用户通知,修改为无');
    this.log(ctx, 'info', '然后在主页点击超级用户,将所有开关打开');
    this.log(ctx, 'info', '操作完成后请等待自动重新检查(60 秒)');
    for (let retry = 0; retry < 3; retry++) { await new Promise((r) => setTimeout(r, 60000)); if (await this.checkMagiskReady(ctx)) return; this.log(ctx, 'warn', '授予出错,请重新授予(' + (retry + 1) + '/3)'); }
    throw new Error('自动授予 Magisk 失败,请手动操作后重试');
  }

  async autoMagiskNd03(ctx: any) {
    this.log(ctx, 'info', '正在自动打开自动响应,请稍后');
    await adbService.amStart('com.xtc.b/com.topjohnwu.magisk.ui.MainActivity');
    await new Promise((r) => setTimeout(r, 2000));
    await adbService.amStart('com.xtc.b/com.topjohnwu.magisk.ui.MainActivity');
    const device = await DeviceService.instance.waitFor(['adb'], 30000);
    ctx.device = device;
    await new Promise((r) => setTimeout(r, 5000));
    await adbService.shell('', 'input tap 376 51');
    await new Promise((r) => setTimeout(r, 500));
    for (let i = 0; i < 8; i++) { await adbService.shell('', 'input swipe 200 400 200 100 0'); }
    await new Promise((r) => setTimeout(r, 500));
    await adbService.shell('', 'input tap 200 330');
    await new Promise((r) => setTimeout(r, 500));
    await adbService.shell('', 'input tap 200 180');
    await new Promise((r) => setTimeout(r, 500));
    await adbService.shell('', 'input swipe 200 200 200 300 0');
    await new Promise((r) => setTimeout(r, 500));
    await adbService.shell('', 'input tap 200 150');
    await new Promise((r) => setTimeout(r, 500));
    await adbService.shell('', 'input tap 200 315');
    if (await this.checkMagiskReady(ctx)) return;
    this.log(ctx, 'error', '自动授予出错及手动授予权限');
    await adbService.amStart('com.xtc.b/com.topjohnwu.magisk.ui.MainActivity');
    await DeviceService.instance.waitFor(['adb'], 30000);
    await this.startScrcpy(ctx);
    this.log(ctx, 'info', '请打开 Magisk 右上角设置,往下滑,找到自动响应,修改为允许,然后找到超级用户通知,修改为无');
    this.log(ctx, 'info', '然后在主页点击超级用户,将所有开关打开');
    this.log(ctx, 'info', '操作完成后请等待自动重新检查(60 秒)');
    for (let retry = 0; retry < 3; retry++) { await new Promise((r) => setTimeout(r, 60000)); if (await this.checkMagiskReady(ctx)) return; this.log(ctx, 'warn', '授予出错,请重新授予(' + (retry + 1) + '/3)'); }
    throw new Error('自动授予 Magisk 失败,请手动操作后重试');
  }

  async autoSystemPlus(ctx: any) {
    this.log(ctx, 'info', '正在自动激活,请稍后');
    await new Promise((r) => setTimeout(r, 10000));
    const autoSh = path.join(paths.scripts, 'autosystemplus.sh');
    if (fs.existsSync(autoSh)) { await adbService.push('', autoSh, '/sdcard/autosystemplus.sh'); try { await adbService.shell('', 'sh /sdcard/autosystemplus.sh'); } catch (e: any) { this.log(ctx, 'warn', 'autosystemplus.sh 执行失败: ' + e.message); } } else { this.log(ctx, 'warn', 'autosystemplus.sh 不存在: ' + autoSh); }
    const systemplusSh = path.join(paths.scripts, 'systemplus.sh');
    const toolkitSh = path.join(paths.scripts, 'toolkit.sh');
    let retry = 0;
    while (retry < 3) {
      if (fs.existsSync(systemplusSh)) {
        await adbService.push('', systemplusSh, '/sdcard/systemplus.sh');
        this.log(ctx, 'info', '开始检查 SystemPlus 激活状态...');
        let systemplusOut = '';
        try { systemplusOut = await adbService.shell('', 'sh /sdcard/systemplus.sh'); } catch (e: any) { this.log(ctx, 'warn', 'systemplus.sh 执行失败: ' + e.message); }
        if (systemplusOut.trim() === '1') {
          this.log(ctx, 'error', '未激活'); this.log(ctx, 'error', '没有激活 SystemPlus!请手动激活后重试');
          await this.startScrcpy(ctx); try { await adbService.shell('', 'am start -n com.huanli233.systemplus/.ActiveSelfActivity'); } catch {}
          this.log(ctx, 'info', '请往下滑,找到自激活,然后点击激活 SystemPlus 与激活核心破解');
          this.log(ctx, 'info', '操作完成后请等待自动重新检查(60 秒)');
          await new Promise((r) => setTimeout(r, 60000)); retry++; continue;
        }
        this.log(ctx, 'info', '已激活');
      } else { this.log(ctx, 'warn', 'systemplus.sh 不存在: ' + systemplusSh); break; }
      if (fs.existsSync(toolkitSh)) {
        await adbService.push('', toolkitSh, '/sdcard/toolkit.sh');
        this.log(ctx, 'info', '开始检查核心破解激活状态...');
        let toolkitOut = '';
        try { toolkitOut = await adbService.shell('', 'sh /sdcard/toolkit.sh'); } catch (e: any) { this.log(ctx, 'warn', 'toolkit.sh 执行失败: ' + e.message); }
        if (toolkitOut.trim() === '1') {
          this.log(ctx, 'error', '未激活'); this.log(ctx, 'error', '没有激活核心破解!请手动激活后重试');
          await this.startScrcpy(ctx); try { await adbService.shell('', 'am start -n com.huanli233.systemplus/.ActiveSelfActivity'); } catch {}
          this.log(ctx, 'info', '请往下滑,找到自激活,然后点击激活 SystemPlus 与激活核心破解');
          this.log(ctx, 'info', '操作完成后请等待自动重新检查(60 秒)');
          await new Promise((r) => setTimeout(r, 60000)); retry++; continue;
        }
        this.log(ctx, 'info', '已激活');
      } else { this.log(ctx, 'warn', 'toolkit.sh 不存在: ' + toolkitSh); }
      return;
    }
    throw new Error('SystemPlus/核心破解激活失败,请手动操作后重试');
  }

  async activateLsposed(ctx: any) {
    this.log(ctx, 'info', '正在勾选作用域,请稍后');
    try { await adbService.shell('', 'am start -n org.lsposed.manager/.ui.activity.MainActivity'); } catch (e: any) { this.log(ctx, 'warn', '启动 LSPosed 失败: ' + e.message); }
    await new Promise((r) => setTimeout(r, 5000));
    const taps = [[115,271],[122,433],[200,173],[180,200],[25,30],[200,250],[180,200],[25,30]];
    for (let i = 0; i < taps.length; i++) { const [x, y] = taps[i]; await adbService.shell('', 'input tap ' + x + ' ' + y); if (i < taps.length - 1) { await new Promise((r) => setTimeout(r, 500)); } }
  }

  writeMiscBin(ctx: any) {
    const miscBin = path.join(paths.cache, 'misc.bin');
    fs.writeFileSync(miscBin, 'ffbm-02\r\n', 'latin1');
    this.log(ctx, 'info', '已写入 misc.bin: ' + miscBin);
    return miscBin;
  }

  async sdk27BackupDcim(ctx: any) {
    const backupDir = path.join(app.getPath('userData'), 'root-backup', ctx.taskId);
    if (!fs.existsSync(backupDir)) { fs.mkdirSync(backupDir, { recursive: true }); }
    ctx.dcimBackupDir = backupDir;
    this.log(ctx, 'info', '正在备份相册...');
    const r = await backupService.backupDcim(backupDir, (msg) => this.log(ctx, 'info', msg));
    if (!r.success) { this.log(ctx, 'warn', '相册备份失败(继续流程): ' + r.error); }
  }

  async sdk27EnteringEdl(ctx: any) {
    this.log(ctx, 'info', '重启手表至 9008');
    await adbService.reboot('', 'edl');
    this.log(ctx, 'info', '等待 9008 设备...');
    const port = await edlService.waitForEdl(60000);
    ctx.edlPort = port;
    this.log(ctx, 'info', '9008 端口: ' + port);
    this.log(ctx, 'info', '发送引导: msm8937.mbn');
    await edlService.loadFirehose({ port, loader: 'msm8937.mbn' });
    await new Promise((r) => setTimeout(r, 2000));
  }

  async sdk27ReadingBoot(ctx: any) {
    if (!ctx.edlPort) throw new Error('未获取 9008 端口');
    const bootXml = path.join(app.getPath('userData'), 'edl_work', 'boot.xml');
    if (!fs.existsSync(bootXml)) { throw new Error('boot.xml 不存在: ' + bootXml); }
    this.log(ctx, 'info', '读取 boot 分区...');
    await edlService.readPartitions({ port: ctx.edlPort, loader: 'msm8937.mbn', xmlPath: bootXml, outputDir: path.join(app.getPath('userData'), 'edl_work') });
    const srcBoot = path.join(app.getPath('userData'), 'edl_work', 'boot.img');
    const dstBoot = path.join(paths.cache, 'boot.img');
    if (!fs.existsSync(srcBoot)) { this.log(ctx, 'error', '移动 boot.img 文件失败'); this.log(ctx, 'error', '这是一个致命问题,可能数据线连接不稳定,没有成功读取 boot'); throw new Error('移动 boot.img 文件失败(可能数据线连接不稳定)'); }
    if (fs.existsSync(dstBoot)) fs.unlinkSync(dstBoot);
    fs.renameSync(srcBoot, dstBoot);
    this.log(ctx, 'info', 'boot.img 已读取 → ' + dstBoot);
  }

  async sdk27PatchingBoot(ctx: any) {
    await new Promise((r2) => setTimeout(r2, 1000));
    this.log(ctx, 'info', '开始修补 boot(magiskpatch 25)');
    const inputBoot = path.join(paths.cache, 'boot.img');
    const patchedBoot = path.join(app.getPath('userData'), 'edl_work', 'boot.img');
    const r = await magiskPatcher.patch(inputBoot, patchedBoot, 25, path.join(app.getPath('userData'), 'edl_work'), ctx.taskId);
    if (!r.success) { this.log(ctx, 'error', '修补 boot 失败,按任意键退出'); throw new Error('magiskpatch 失败: ' + r.error); }
    ctx.patchedBootPath = patchedBoot;
    this.log(ctx, 'info', 'magiskpatch 完成(status=' + r.status + ')');
    this.log(ctx, 'info', '解包 boot');
    await this.runMagiskboot(ctx, ['unpack', '-h', 'boot.img']);
    this.log(ctx, 'info', '替换 adbd(810_adbd)');
    const adbdSrc = path.join(paths.bin, '810_adbd');
    const adbdDst = path.join(app.getPath('userData'), 'edl_work', '810_adbd');
    if (fs.existsSync(adbdSrc) && !fs.existsSync(adbdDst)) { fs.copyFileSync(adbdSrc, adbdDst); }
    await this.runMagiskboot(ctx, ['cpio', 'ramdisk.cpio', 'add 0750 sbin/adbd 810_adbd']);
    this.log(ctx, 'info', '添加 xse.rc overlay');
    const xseRcSrc = path.join(paths.bin, 'xse.rc');
    const xseRcDst = path.join(app.getPath('userData'), 'edl_work', 'xse.rc');
    if (fs.existsSync(xseRcSrc) && !fs.existsSync(xseRcDst)) { fs.copyFileSync(xseRcSrc, xseRcDst); }
    await this.runMagiskboot(ctx, ['cpio', 'ramdisk.cpio', 'add 0750 overlay.d/xse.rc xse.rc']);
    this.log(ctx, 'info', '宽容 selinux(patch_boot)');
    const kernelPath = path.join(app.getPath('userData'), 'edl_work', 'kernel');
    const patchResult = bootPatcher.patch(kernelPath);
    if (!patchResult.success || !patchResult.output.includes('success')) { this.log(ctx, 'error', 'patch_boot.exe 无法运行,请尝试安装 VC 运行库合集'); throw new Error('patch_boot 失败: ' + (patchResult.error ?? patchResult.output)); }
    for (const p of patchResult.patches) { this.log(ctx, 'info', 'patch_boot: ' + p); }
    this.log(ctx, 'info', '打包 boot');
    await this.runMagiskboot(ctx, ['repack', 'boot.img']);
    this.log(ctx, 'info', 'BOOT 处理完成!!!');
    const newBootPath = path.join(app.getPath('userData'), 'edl_work', 'new-boot.img');
    if (!fs.existsSync(newBootPath)) { throw new Error('magiskboot repack 未生成 new-boot.img'); }
    const sbootImg = path.join(app.getPath('userData'), 'edl_work', 'sboot.img');
    if (fs.existsSync(sbootImg)) fs.unlinkSync(sbootImg);
    fs.copyFileSync(newBootPath, sbootImg);
    this.log(ctx, 'info', '已生成 sboot.img: ' + sbootImg);
    const tmpBoot = path.join(paths.cache, 'boot.img');
    try { if (fs.existsSync(tmpBoot)) fs.unlinkSync(tmpBoot); } catch {}
  }

  async sdk27FlashingRawprogram(ctx: any) {
    if (!ctx.edlPort) throw new Error('未获取 9008 端口');
    const workDir = path.join(app.getPath('userData'), 'edl_work');
    if (ctx.smodel) {
      this.log(ctx, 'info', '刷入 recovery');
      const sbootImg = path.join(workDir, 'sboot.img');
      const recoveryImg = path.join(workDir, 'recovery.img');
      if (fs.existsSync(sbootImg)) { fs.copyFileSync(sbootImg, recoveryImg); }
      const recoveryXml = path.join(workDir, 'recovery.xml');
      await edlService.flashPartitions({ port: ctx.edlPort, loader: 'msm8937.mbn', xmlPath: recoveryXml, imagesDir: workDir });
      this.log(ctx, 'info', '刷入 boot,aboot,userdata,misc');
      const rawprogramXml2 = path.join(workDir, 'rawprogram0.xml');
      await edlService.flashPartitions({ port: ctx.edlPort, loader: 'msm8937.mbn', xmlPath: rawprogramXml2, imagesDir: workDir });
      this.log(ctx, 'info', '重启手表(9008)');
      await edlService.reboot({ port: ctx.edlPort, loader: 'msm8937.mbn' });
      return;
    }
    this.log(ctx, 'info', '刷入 recovery,aboot');
    const rawprogramXml = path.join(workDir, 'rawprogram0.xml');
    await edlService.flashPartitions({ port: ctx.edlPort, loader: 'msm8937.mbn', xmlPath: rawprogramXml, imagesDir: workDir });
    if (ctx.options.nouserdata) { this.log(ctx, 'info', '重启手表'); await edlService.reboot({ port: ctx.edlPort, loader: 'msm8937.mbn' }); this.log(ctx, 'info', '你选择了不刷 userdata,不再继续'); return; }
    this.log(ctx, 'info', '擦除 boot');
    const ebootSrc = path.join(paths.edl, 'eboot.img');
    const tmpBoot = path.join(paths.cache, 'boot.img');
    if (fs.existsSync(ebootSrc)) { fs.copyFileSync(ebootSrc, tmpBoot); } else { this.log(ctx, 'warn', 'eboot.img 不存在: ' + ebootSrc + '(将尝试继续)'); }
    const bootXml = path.join(workDir, 'boot.xml');
    await edlService.flashPartitions({ port: ctx.edlPort, loader: 'msm8937.mbn', xmlPath: bootXml, imagesDir: paths.cache });
    this.log(ctx, 'info', '等待重启手表并进入 fastboot');
    await edlService.reboot({ port: ctx.edlPort, loader: 'msm8937.mbn' });
    this.log(ctx, 'info', '等待开机并进入 fastboot');
    this.log(ctx, 'warn', '设备即将进入 Fastboot 模式，如长时间无响应请检查驱动');
    this.log(ctx, 'warn', '如果一直卡在这里,可能需要安装驱动');
  }

  async sdk27RebootingToFastboot(ctx: any) {
    this.log(ctx, 'info', '等待 fastboot 设备...');
    const device = await DeviceService.instance.waitFor(['fastboot'], 120000);
    ctx.device = device;
    this.log(ctx, 'warn', '设备处于正常刷写状态，请勿断开数据线');
    this.log(ctx, 'warn', '设备处于正常刷写状态，请勿断开数据线');
    this.log(ctx, 'warn', '设备处于正常刷写状态，请勿断开数据线');
    this.log(ctx, 'warn', '设备即将进入 Fastboot 模式，如长时间无响应请检查驱动');
  }

  async sdk27FastbootFlashBoot(ctx: any) {
    this.log(ctx, 'info', '刷入 boot');
    const newBoot = path.join(app.getPath('userData'), 'edl_work', 'new-boot.img');
    if (!fs.existsSync(newBoot)) {
      const sboot = path.join(app.getPath('userData'), 'edl_work', 'sboot.img');
      if (fs.existsSync(sboot)) { this.log(ctx, 'warn', 'new-boot.img 不存在,使用 sboot.img'); await fastbootService.flash('boot', sboot); return; }
      throw new Error('new-boot.img 不存在: ' + newBoot);
    }
    await fastbootService.flash('boot', newBoot);
  }

  async sdk27FastbootFlashUserdata(ctx: any) {
    this.log(ctx, 'info', '刷入 userdata');
    const userdataImg = path.join(paths.cache, 'userdata.img');
    if (!fs.existsSync(userdataImg)) { throw new Error('userdata.img 不存在: ' + userdataImg + ',请先在"资源下载"页下载'); }
    await fastbootService.flash('userdata', userdataImg);
  }

  async sdk27FastbootFlashMisc(ctx: any) {
    this.log(ctx, 'info', '刷入 misc(ffbm-02)');
    const miscBin = this.writeMiscBin(ctx);
    await fastbootService.flash('misc', miscBin);
    this.log(ctx, 'info', 'fastboot reboot');
    await fastbootService.reboot('system');
    this.log(ctx, 'info', '请耐心等待设备响应');
    await this.waitForAdbCheckXse(ctx, 180000);
    this.log(ctx, 'warn', '在工具给出进一步提示前，请勿在手表上进行任何操作');
    this.log(ctx, 'warn', '请 不要 点击重启-重启并进入正常启动模式');
    this.log(ctx, 'info', '稍等片刻,即将进入 qmmi');
    await adbService.waitForBoot(180000);
    this.log(ctx, 'info', '已进入 qmmi');
    this.log(ctx, 'warn', '在工具给出进一步提示前，请勿在手表上进行任何操作');
    this.log(ctx, 'warn', '请 不要 点击重启-重启并进入正常启动模式');
  }

  async sdk27WaitingBoot(ctx: any) {
    if (ctx.smodel) {
      this.log(ctx, 'info', '请耐心等待设备响应');
      await this.waitForAdbOrEdl(ctx, 180000);
      this.log(ctx, 'info', '稍等片刻,即将开始');
      await adbService.waitForBoot(180000);
      this.log(ctx, 'info', 'busybox sleep 15');
      await new Promise((r) => setTimeout(r, 15000));
    } else {
      if (!ctx.device || ctx.device.type !== 'adb') { await this.waitForAdbOrEdl(ctx, 60000); }
    }
  }

  async sdk27InstallPreinstall(ctx: any) {
    if (!ctx.smodel) return;
    const apk = path.join(paths.resources, 'apks', '54850.apk');
    await this.instappImportant(ctx, apk);
  }

  async sdk27EnableCharge(ctx: any) {
    let hasSystemUI = false;
    try { const out = await adbService.shell('', 'pm path com.android.systemui'); hasSystemUI = out.trim().length > 0; } catch {}
    if (hasSystemUI) { this.log(ctx, 'info', '系统已存在 SystemUI'); } else { this.log(ctx, 'info', '系统不存在 SystemUI,将为你安装 SystemUI 模块'); }
    this.log(ctx, 'warn', '请一定要根据工具的提示来,root 未完成前禁止联网,禁止重复绑定!');
    await adbService.shell('', 'setprop persist.sys.charge.usable true');
    this.log(ctx, 'info', '充电可用已开启');
    await adbService.shell('', 'dumpsys battery unplug');
    this.log(ctx, 'info', '已模拟未充电状态');
    await adbService.shell('', 'svc wifi disable');
    await adbService.shell('', 'wm density 200');
  }

  async sdk27AutoGrantMagisk(ctx: any) {
    await this.autoMagiskSdk27(ctx);
    this.log(ctx, 'info', '正在自动打开 EdXposed Installer,请稍后');
    await this.waitForAdbOrEdl(ctx, 60000);
    await adbService.amStart('com.solohsu.android.edxp.manager/de.robv.android.xposed.installer.WelcomeActivity');
    await new Promise((r) => setTimeout(r, 7000));
  }

  async sdk27ActivateSystemplus(ctx: any) { await this.autoSystemPlus(ctx); }

  async sdk27InstallXtcpatch(ctx: any) {
    this.log(ctx, 'info', '------------------------------------');
    this.log(ctx, 'info', '后续步骤将由工具自动完成');
    this.log(ctx, 'info', '开始安装 XTC Patch 模块');
    await adbService.shell('', 'setprop persist.sys.rooting true');
    const xtcpatchZip = path.join(paths.cache, 'xtcpatch.zip');
    if (!fs.existsSync(xtcpatchZip)) { this.log(ctx, 'warn', 'xtcpatch.zip 不存在: ' + xtcpatchZip); } else { const r = await magiskService.install(xtcpatchZip, 'magisk'); if (!r.success) { this.log(ctx, 'warn', 'xtcpatch 安装失败: ' + r.error); } }
    await adbService.shell('', 'setprop persist.sys.rooting false');
    this.log(ctx, 'info', '安装 XTC Patch 模块成功');
  }

  async sdk27InstallSystemui(ctx: any) {
    if (!(ctx.isV3 && ctx.innermodel !== 'I20')) { this.log(ctx, 'info', '跳过 SystemUI 模块安装(isv3=' + (ctx.isV3 ? 1 : 0) + ', innermodel=' + ctx.innermodel + ')'); return; }
    this.log(ctx, 'info', '开始安装 systemui 模块');
    const systemuiZip = path.join(paths.cache, 'systemui.zip');
    if (!fs.existsSync(systemuiZip)) { this.log(ctx, 'warn', 'systemui.zip 不存在: ' + systemuiZip); return; }
    const r = await magiskService.install(systemuiZip, 'magisk');
    if (!r.success) { this.log(ctx, 'warn', 'systemui 安装失败: ' + r.error); } else { this.log(ctx, 'info', '安装 systemui 模块成功'); }
  }

  async sdk27InstallPreinstallApk(ctx: any) {
    this.log(ctx, 'info', 'wm density reset + pm clear packageinstaller');
    await adbService.shell('', 'wm density reset');
    await adbService.shell('', 'pm clear com.android.packageinstaller');
  }

  async sdk27EraseMiscReboot(ctx: any) {
    this.log(ctx, 'info', '重启手表');
    await adbService.reboot('', 'system');
    this.log(ctx, 'info', '请耐心等待设备开机');
    const device = await DeviceService.instance.waitFor(['adb', 'qcom_edl', 'fastboot'], 180000);
    if (device.type === 'fastboot') { this.log(ctx, 'error', '您的设备可能触发了Xse限制!请重新进行root'); throw new Error('您的设备可能触发了Xse限制!请重新进行root'); }
    ctx.device = device;
    await adbService.waitForBoot(180000);
    if (ctx.smodel) {
      await new Promise((r) => setTimeout(r, 5000));
      this.log(ctx, 'info', '激活 SystemPlus 模块');
      await adbService.shell('', 'sh /data/adb/modules/XTCPatch/active_module.sh com.huanli233.systemplus');
      this.log(ctx, 'info', '激活 XTCPatch 模块');
      await adbService.shell('', 'sh /data/adb/modules/XTCPatch/active_module.sh com.zcg.xtcpatch');
      this.log(ctx, 'info', '重启手表');
      await adbService.reboot('', 'system');
      await this.waitForAdbOrEdl(ctx, 180000);
      await adbService.waitForBoot(180000);
      await new Promise((r) => setTimeout(r, 5000));
    }
    await new Promise((r) => setTimeout(r, 5000));
    this.log(ctx, 'info', '开始安装系统应用[请勿跳过]');
    const apksDir = path.join(paths.resources, 'apks');
    if (ctx.isV3) {
      if (ctx.innermodel === 'I20') { await this.instappImportant(ctx, path.join(apksDir, '121750.apk')); } else { await this.instappImportant(ctx, path.join(apksDir, '130510.apk')); }
    } else { await this.instappImportant(ctx, path.join(apksDir, '116100.apk')); }
    this.log(ctx, 'info', '系统应用安装完成');
    if (ctx.smodel) { this.log(ctx, 'info', '重启手表'); await adbService.reboot('', 'system'); } else {
      this.log(ctx, 'info', '擦除 misc 并重启');
      await adbService.reboot('', 'bootloader');
      this.log(ctx, 'info', '等待 fastboot 设备...');
      const device2 = await DeviceService.instance.waitFor(['adb', 'fastboot'], 60000);
      if (device2.type === 'adb') { ctx.device = device2; this.log(ctx, 'warn', '设备仍为 ADB 模式,再次尝试重启到 bootloader'); await adbService.reboot('', 'bootloader'); await DeviceService.instance.waitFor(['fastboot'], 60000); }
      await fastbootService.erase('misc');
      await fastbootService.reboot('system');
    }
  }

  async sdk27InstallBundledApks(ctx: any) {
    this.log(ctx, 'info', '等待 ADB 设备连接...');
    const device = await DeviceService.instance.waitFor(['adb'], 120000);
    ctx.device = device;
    await adbService.waitForBoot(120000);
    this.log(ctx, 'info', '开始安装预装应用');
    const apksDir = path.join(paths.resources, 'apks');
    await this.instappImportant(ctx, path.join(apksDir, 'selftest.apk'));
    await this.instappImportant(ctx, path.join(apksDir, 'settings.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'wxzf.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'MoyeInstaller.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'appsettings.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'personalcenter.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'appmanager.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'wcp2.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'appstore.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'appstore2.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'appstore3.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'appstore4.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'weichat.apk'));
    this.log(ctx, 'info', '预装应用安装完成');
  }

  async sdk27CompilePackages(ctx: any) {
    this.log(ctx, 'info', '正在执行提前编译,可能需要一些时间');
    await adbService.shell('', 'cmd package compile -m everything-profile -f com.xtc.i3launcher');
    await adbService.shell('', 'cmd package compile -m everything-profile -f com.xtc.setting');
  }

  async sdk27RestoreDcim(ctx: any) {
    if (!ctx.dcimBackupDir) { this.log(ctx, 'warn', '无 DCIM 备份目录,跳过恢复'); return; }
    this.log(ctx, 'info', '正在恢复相册...');
    const r = await backupService.recoverDcim(ctx.dcimBackupDir, (msg) => this.log(ctx, 'info', msg));
    if (!r.success) { this.log(ctx, 'warn', '相册恢复失败: ' + r.error); }
    this.log(ctx, 'warn', '切勿卸载 SystemPlus 和 XTCPatch，否则设备将无法启动');
    this.log(ctx, 'warn', '切勿卸载 SystemPlus 和 XTCPatch，否则设备将无法启动');
    this.log(ctx, 'warn', '切勿删除 Magisk 内置模块，否则设备将无法启动');
    this.log(ctx, 'warn', '切勿删除 Magisk 内置模块，否则设备将无法启动');
    this.log(ctx, 'info', '历经千帆，终达彼岸');
    this.log(ctx, 'info', '提示:当手表进入长续航模式、睡眠模式等禁用模式时,划到最后一页,点击打开应用列表,即可绕过禁用模式');
    this.log(ctx, 'info', '提示:你可以在 /sdcard/hidden_app_list.txt 中填写包名以实现隐藏应用');
    this.log(ctx, 'info', '提示:如果需要在手表上安装应用,请在手表端选择弦-安装器,点击始终');
    this.log(ctx, 'info', '您的手表已 ROOT 完毕');
    this.log(ctx, 'info', '是否进行预装优化[包括模块和应用,期间需要多次选择]?');
    this.log(ctx, 'info', '(可选,需用户在 Tools 页手动触发 rootpro)');
  }

  async nd03DownloadZip(ctx: any) {
    this.log(ctx, 'info', '免责声明:');
    this.log(ctx, 'info', 'Root 会自动超级恢复到 2.8.1 版本');
    this.log(ctx, 'info', 'Root 后版本为 3.0.2,底包 2.8.1');
    this.log(ctx, 'info', 'Root 文件为网络搜集而来');
    this.log(ctx, 'info', '正在为你准备开始');
    const workDir = path.join(app.getPath('userData'), 'edl_work');
    try { if (fs.existsSync(workDir)) { for (const f of fs.readdirSync(workDir)) { try { fs.rmSync(path.join(workDir, f), { recursive: true, force: true }); } catch {} } } else { fs.mkdirSync(workDir, { recursive: true }); } } catch {}
    for (const f of ['boot.img','header','kernel_dtb','kernel','ramdisk.cpio','port_trace.txt']) { try { const p = path.join(paths.cache, f); if (fs.existsSync(p)) fs.unlinkSync(p); } catch {} }
    this.log(ctx, 'info', '开始准备文件');
    const nd03Zip = path.join(paths.edl, 'ND03.zip');
    if (!fs.existsSync(nd03Zip)) { this.log(ctx, 'info', '下载 Z10 资源(ND03.zip)...'); try { await cloudService.download('Z10'); } catch (e: any) { throw new Error('下载 ND03.zip 失败: ' + e.message); } if (!fs.existsSync(nd03Zip)) { throw new Error('ND03.zip 下载后仍未存在: ' + nd03Zip); } }
  }

  async nd03Extract(ctx: any) {
    this.log(ctx, 'info', '正在解压文件...');
    const nd03Zip = path.join(paths.edl, 'ND03.zip');
    if (!fs.existsSync(nd03Zip)) { throw new Error('ND03.zip 不存在: ' + nd03Zip); }
    const workDir = path.join(app.getPath('userData'), 'edl_work');
    if (!fs.existsSync(workDir)) { fs.mkdirSync(workDir, { recursive: true }); }
    await subprocessPool.spawn({ cmd: path.join(paths.bin, '7z.exe'), args: ['x', nd03Zip, '-o' + workDir, '-aoa', '-bsp1'], cwd: paths.bin, encoding: 'utf-8', timeout: TIMEOUT.install, taskId: ctx.taskId, onStdout: (line: string) => this.log(ctx, 'info', '7z: ' + line) });
    this.log(ctx, 'info', '准备完成,即将开始 root');
  }

  async nd03EnteringEdl(ctx: any) {
    this.log(ctx, 'info', '等待 9008 设备连接...');
    const port = await edlService.waitForEdl(120000);
    ctx.edlPort = port;
    this.log(ctx, 'info', '获取 9008 端口: ' + port);
    this.log(ctx, 'info', '发送引导: prog_firehose_ddr.elf');
    await edlService.loadFirehose({ port, loader: 'prog_firehose_ddr.elf' });
    await new Promise((r) => setTimeout(r, 2000));
  }

  async nd03Flash281Recovery(ctx: any) {
    if (!ctx.edlPort) throw new Error('未获取 9008 端口');
    const workDir = path.join(app.getPath('userData'), 'edl_work');
    this.log(ctx, 'info', '刷入恢复固件(281/rawprogram0.xml)');
    const raw281 = path.join(workDir, '281', 'rawprogram0.xml');
    if (!fs.existsSync(raw281)) { throw new Error('281/rawprogram0.xml 不存在: ' + raw281); }
    await edlService.flashPartitions({ port: ctx.edlPort, loader: 'prog_firehose_ddr.elf', xmlPath: raw281, imagesDir: path.join(workDir, '281') });
    this.log(ctx, 'info', '刷入 281/patch0.xml');
    const patch281 = path.join(workDir, '281', 'patch0.xml');
    if (fs.existsSync(patch281)) { await edlService.flashPartitions({ port: ctx.edlPort, loader: 'prog_firehose_ddr.elf', xmlPath: patch281, imagesDir: path.join(workDir, '281') }); } else { this.log(ctx, 'warn', '281/patch0.xml 不存在(跳过): ' + patch281); }
  }

  async nd03FlashRootFirmware(ctx: any) {
    if (!ctx.edlPort) throw new Error('未获取 9008 端口');
    const workDir = path.join(app.getPath('userData'), 'edl_work');
    this.log(ctx, 'info', '刷入 root 固件');
    const rawprogramXml = path.join(workDir, 'rawprogram0.xml');
    if (!fs.existsSync(rawprogramXml)) { throw new Error('rawprogram0.xml 不存在: ' + rawprogramXml); }
    await edlService.flashPartitions({ port: ctx.edlPort, loader: 'prog_firehose_ddr.elf', xmlPath: rawprogramXml, imagesDir: workDir });
    const ebootSrc = path.join(paths.edl, 'eboot.img');
    const ebootDst = path.join(workDir, 'eboot.img');
    if (fs.existsSync(ebootSrc)) { fs.copyFileSync(ebootSrc, ebootDst); this.log(ctx, 'info', '已复制 eboot.img → ' + ebootDst); } else { this.log(ctx, 'warn', 'eboot.img 源文件不存在: ' + ebootSrc); }
  }

  async nd03EraseBoot(ctx: any) {
    if (!ctx.edlPort) throw new Error('未获取 9008 端口');
    this.log(ctx, 'info', '清除 boot');
    const workDir = path.join(app.getPath('userData'), 'edl_work');
    const ebootXml = path.join(workDir, 'eboot.xml');
    if (!fs.existsSync(ebootXml)) { throw new Error('eboot.xml 不存在: ' + ebootXml); }
    await edlService.flashPartitions({ port: ctx.edlPort, loader: 'prog_firehose_ddr.elf', xmlPath: ebootXml, imagesDir: workDir });
  }

  async nd03RebootToFastboot(ctx: any) {
    if (!ctx.edlPort) throw new Error('未获取 9008 端口');
    this.log(ctx, 'info', '重启手表');
    await edlService.reboot({ port: ctx.edlPort, loader: 'prog_firehose_ddr.elf' });
    this.log(ctx, 'warn', '设备处于正常刷写状态，请勿断开数据线');
    this.log(ctx, 'warn', '设备处于正常刷写状态，请勿断开数据线');
    this.log(ctx, 'warn', '设备处于正常刷写状态，请勿断开数据线');
    this.log(ctx, 'warn', '设备即将进入 Fastboot 模式，如长时间无响应请检查驱动');
    this.log(ctx, 'info', '等待 fastboot 连接...');
    const device = await DeviceService.instance.waitFor(['fastboot'], 120000);
    ctx.device = device;
  }

  async nd03FastbootFlashBoot(ctx: any) {
    this.log(ctx, 'info', '刷入 boot');
    const bootImg = path.join(app.getPath('userData'), 'edl_work', 'boot.img');
    if (!fs.existsSync(bootImg)) { throw new Error('boot.img 不存在: ' + bootImg); }
    await fastbootService.flash('boot', bootImg);
  }

  async nd03BootRecovery(ctx: any) {
    this.log(ctx, 'info', '重启并进入 recovery');
    const recoveryImg = path.join(app.getPath('userData'), 'edl_work', 'recovery.img');
    if (!fs.existsSync(recoveryImg)) { throw new Error('recovery.img 不存在: ' + recoveryImg); }
    await fastbootService.boot(recoveryImg);
    this.log(ctx, 'info', '请耐心等待设备响应');
    this.log(ctx, 'info', '进入 sideload');
    const start = Date.now();
    while (Date.now() - start < 120000) {
      try {
        const result = await subprocessPool.spawn({ cmd: process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb', args: ['get-state'], encoding: 'utf-8', timeout: TIMEOUT.device, cwd: paths.bin, silent: true });
        if (result.stdout.trim() === 'sideload') { this.log(ctx, 'info', '设备已进入 sideload 模式'); return; }
      } catch {}
      await new Promise((r) => setTimeout(r, 2000));
    }
    throw new Error('等待 sideload 模式超时');
  }

  async nd03SideloadDm(ctx: any) {
    this.log(ctx, 'info', '正在刷 dm,请等待 20 秒...');
    const dmZip = path.join(app.getPath('userData'), 'edl_work', 'Dm.zip');
    if (!fs.existsSync(dmZip)) { throw new Error('Dm.zip 不存在: ' + dmZip); }
    try { await subprocessPool.spawn({ cmd: process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb', args: ['sideload', dmZip], encoding: 'utf-8', timeout: TIMEOUT.transfer, cwd: paths.bin, taskId: ctx.taskId, onStdout: (line: string) => this.log(ctx, 'info', 'sideload: ' + line) }); } catch (e: any) { this.log(ctx, 'info', 'sideload 已超时(预期行为,设备端继续): ' + e.message); }
    try { await subprocessPool.spawn({ cmd: process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb', args: ['kill-server'], encoding: 'utf-8', timeout: TIMEOUT.device, cwd: paths.bin, silent: true }); await subprocessPool.spawn({ cmd: process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb', args: ['start-server'], encoding: 'utf-8', timeout: TIMEOUT.device, cwd: paths.bin, silent: true }); } catch {}
  }

  async nd03FlashMiscReboot(ctx: any) {
    this.log(ctx, 'warn', '设备处于正常刷写状态，请勿断开数据线');
    this.log(ctx, 'warn', '设备处于正常刷写状态，请勿断开数据线');
    this.log(ctx, 'warn', '设备处于正常刷写状态，请勿断开数据线');
    this.log(ctx, 'warn', '设备即将进入 Fastboot 模式，如长时间无响应请检查驱动');
    this.log(ctx, 'info', '等待 fastboot 连接...');
    const device = await DeviceService.instance.waitFor(['fastboot'], 120000);
    ctx.device = device;
    this.log(ctx, 'info', '刷入 misc 并重启');
    const miscBin = this.writeMiscBin(ctx);
    await fastbootService.flash('misc', miscBin);
    await fastbootService.reboot('system');
    this.log(ctx, 'info', '让我们等待重启三次修复环境');
  }

  async nd03Wait3Reboots(ctx: any) {
    this.log(ctx, 'info', '等待 bin.mt.plus 安装完成(循环检测)');
    const start = Date.now();
    let installed = false;
    while (Date.now() - start < 600000) {
      try { const out = await adbService.shell('', 'pm path bin.mt.plus'); if (out.trim().length > 0) { installed = true; break; } } catch {}
      await new Promise((r) => setTimeout(r, 3000));
    }
    if (!installed) { throw new Error('等待 bin.mt.plus 安装超时(10 分钟)'); }
    await new Promise((r) => setTimeout(r, 5000));
    this.log(ctx, 'info', '等待开机完成...');
    await adbService.waitForBoot(180000);
    await new Promise((r) => setTimeout(r, 5000));
    await adbService.shell('', 'wm density 288');
    await adbService.shell('', 'settings put system screen_off_timeout 2147483647');
    this.log(ctx, 'info', '正在自动打开自动响应,请稍后');
    await new Promise((r) => setTimeout(r, 5000));
    await adbService.amStart('com.xtc.b/com.topjohnwu.magisk.ui.MainActivity');
    await new Promise((r) => setTimeout(r, 2000));
    await adbService.amStart('com.xtc.b/com.topjohnwu.magisk.ui.MainActivity');
    const device = await DeviceService.instance.waitFor(['adb'], 60000);
    ctx.device = device;
    await new Promise((r) => setTimeout(r, 5000));
  }

  async nd03AutoGrantMagisk(ctx: any) { await this.autoMagiskNd03(ctx); }

  async nd03InstallXtcpatch(ctx: any) {
    const device = await DeviceService.instance.waitFor(['adb'], 60000);
    ctx.device = device;
    this.log(ctx, 'info', '------------------------------------');
    this.log(ctx, 'info', '后续步骤将由工具自动完成');
    this.log(ctx, 'info', '开始安装 XTC Patch 模块');
    const xtcpatchZip = path.join(paths.cache, 'xtcpatch.zip');
    if (!fs.existsSync(xtcpatchZip)) { throw new Error('xtcpatch.zip 不存在: ' + xtcpatchZip); }
    await adbService.push('', xtcpatchZip, '/sdcard/xtcpatch.zip');
    await adbService.shell('', 'magisk --install-module /sdcard/xtcpatch.zip');
    await adbService.shell('', 'rm -rf /sdcard/xtcpatch.zip');
    this.log(ctx, 'info', '安装 XTC Patch 模块成功');
    await adbService.shell('', 'pm clear com.android.packageinstaller');
  }

  async nd03InstallToolkit(ctx: any) {
    this.log(ctx, 'info', '开始安装核心破解和 systemplus');
    const apksDir = path.join(paths.resources, 'apks');
    await this.instappImportant(ctx, path.join(apksDir, 'toolkit_4.8.apk'));
    await this.instappImportant(ctx, path.join(apksDir, 'Z10_SystemPlus.apk'));
    this.log(ctx, 'info', '正在勾选作用域,请稍后');
    try { await adbService.shell('', 'am start -n org.lsposed.manager/.ui.activity.MainActivity'); } catch (e: any) { this.log(ctx, 'warn', '启动 LSPosed 失败: ' + e.message); }
    await new Promise((r) => setTimeout(r, 5000));
  }

  async nd03ActivateLsposed(ctx: any) { await this.activateLsposed(ctx); }

  async nd03InstallPreinstall(ctx: any) {
    await adbService.reboot('', 'system');
    this.log(ctx, 'info', '等待 ADB 设备连接...');
    const device = await DeviceService.instance.waitFor(['adb'], 180000);
    ctx.device = device;
    await adbService.waitForBoot(180000);
    await new Promise((r) => setTimeout(r, 5000));
    this.log(ctx, 'info', '即将完成');
    await adbService.shell('', 'wm density reset');
    await adbService.shell('', 'settings put system screen_off_timeout 30');
    this.log(ctx, 'info', '擦除 misc 并重启');
    await adbService.reboot('', 'bootloader');
    this.log(ctx, 'info', '等待 fastboot 设备...');
    const device2 = await DeviceService.instance.waitFor(['adb', 'fastboot'], 60000);
    if (device2.type === 'adb') { ctx.device = device2; this.log(ctx, 'warn', '设备仍为 ADB 模式,再次尝试重启到 bootloader'); await adbService.reboot('', 'bootloader'); await DeviceService.instance.waitFor(['fastboot'], 60000); }
    await fastbootService.erase('misc');
    await fastbootService.reboot('system');
    this.log(ctx, 'info', '等待 ADB 设备连接...');
    const device3 = await DeviceService.instance.waitFor(['adb'], 180000);
    ctx.device = device3;
    await adbService.waitForBoot(180000);
    await new Promise((r) => setTimeout(r, 5000));
    this.log(ctx, 'info', '开始安装预装应用');
    const apksDir = path.join(paths.resources, 'apks');
    await this.instappOptional(ctx, path.join(apksDir, 'appsettings-ND03.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'appmanager.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'poke.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'appstore.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'appstore2.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'appstore3.apk'));
    await this.instappOptional(ctx, path.join(apksDir, 'appstore4.apk'));
    this.log(ctx, 'info', '预装应用安装完成');
  }

  async nd03CompilePackages(ctx: any) {
    this.log(ctx, 'info', '正在执行提前编译,可能需要一些时间');
    await adbService.shell('', 'cmd package compile -m everything-profile -f com.xtc.i3launcher');
    await adbService.shell('', 'cmd package compile -m everything-profile -f com.xtc.setting');
    this.log(ctx, 'info', '历经千帆，终达彼岸');
    this.log(ctx, 'info', '您的手表已 ROOT 完毕');
  }
}

export const rootService = new RootServiceClass();
export default rootService;
