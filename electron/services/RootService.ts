import path from 'node:path';
import fs from 'node:fs';
import { EventEmitter } from 'node:events';
import { BrowserWindow, app } from 'electron';
import { paths } from '../core/paths';
import { adbService } from './AdbService';
import { fastbootService } from './FastbootService';
import { edlService } from './EdlService';
import { edlPartitionService } from './EdlPartitionService';
import { magiskService } from './MagiskService';
import { magiskPatcher } from './MagiskPatcher';
import { bootPatcher } from './BootPatcher';
import { DeviceService } from './DeviceService';
import { checkIsV3 } from '../../shared/isv3';

const logger = {
  info: (...args: any[]) => console.log('[RootService]', ...args),
  warn: (...args: any[]) => console.warn('[RootService]', ...args),
  error: (...args: any[]) => console.error('[RootService]', ...args),
};

const MAX_LOGS = 800;

class RootServiceClass {
  tasks = new Map<string, any>();
  bus = new EventEmitter();

  async start(options: any) {
    const taskId = `root_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const ctx: any = {
      taskId,
      stage: 'preparing-resources',
      options,
      device: null,
      innermodel: '',
      isV3: false,
      smodel: false,
      sdkVersion: '',
      androidVersion: '',
      startedAt: Date.now(),
      paused: false,
      cancelled: false,
      logs: [],
      progress: 0,
    };
    this.tasks.set(taskId, ctx);
    logger.info(`Root 任务已启动: ${taskId}`, JSON.stringify(options));
    setImmediate(() => {
      this.run(ctx).catch((e) => this.fail(ctx, e));
    });
    return taskId;
  }

  async pause(taskId: string) {
    const ctx = this.tasks.get(taskId);
    if (!ctx) throw new Error('任务不存在: ' + taskId);
    ctx.paused = true;
    this.log(ctx, 'info', '用户已暂停，将在下一个阶段边界停止');
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
    this.emit(ctx);
  }

  getContext(taskId: string) {
    return this.tasks.get(taskId) ?? null;
  }

  private async run(ctx: any) {
    try {
      await this.checkDevice(ctx);
      await this.readDeviceInfo(ctx);
      await this.enterEdl(ctx);
      await this.readBoot(ctx);
      await this.patchBoot(ctx);
      await this.flashPatchedBoot(ctx);
      await this.waitForSystem(ctx);
      await this.installRootApps(ctx);
      await this.finish(ctx);
    } catch (e) {
      this.fail(ctx, e);
    }
  }

  private async checkDevice(ctx: any) {
    this.setStage(ctx, 'detecting-device', 5);
    const device = DeviceService.instance.getCurrentDevice();
    if (!device) throw new Error('未检测到设备');
    ctx.device = device;
    this.log(ctx, 'info', `当前设备: ${device.type} ${device.serial}`);
  }

  private async readDeviceInfo(ctx: any) {
    this.setStage(ctx, 'reading-device-info', 12);
    ctx.innermodel = ctx.options.innermodel || ctx.device?.innermodel || '';
    ctx.sdkVersion = String(ctx.options.sdkBranch || ctx.device?.sdkVersion || '');
    if (!ctx.innermodel) throw new Error('请选择型号');
    ctx.isV3 = checkIsV3(ctx.innermodel, ctx.options.softVersion || ctx.device?.softVersion || '');
    ctx.androidVersion = ctx.device?.androidVersion || '';
    this.log(ctx, 'info', `型号=${ctx.innermodel}, SDK=${ctx.sdkVersion}, isV3=${ctx.isV3}`);
  }

  private async enterEdl(ctx: any) {
    this.setStage(ctx, 'entering-edl', 20);
    const device = DeviceService.instance.getCurrentDevice();
    if (device?.type === 'qcom_edl') {
      ctx.edlPort = device.port;
      this.log(ctx, 'info', '设备已在 EDL 模式: ' + ctx.edlPort);
      return;
    }
    if (device?.type === 'adb') {
      this.log(ctx, 'info', '从 ADB 重启到 EDL 9008...');
      await adbService.reboot('', 'edl');
    } else if (device?.type === 'fastboot') {
      this.log(ctx, 'info', '从 Fastboot 重启到 EDL...');
      await fastbootService.reboot('edl');
    } else {
      throw new Error('当前设备状态不支持进入 EDL: ' + (device?.type || 'unknown'));
    }
    ctx.edlPort = await edlService.waitForEdl(90000);
    this.log(ctx, 'info', 'EDL 端口: ' + ctx.edlPort);
  }

  private async readBoot(ctx: any) {
    this.setStage(ctx, 'reading-boot', 30);
    const workDir = path.join(app.getPath('userData'), 'edl_work');
    const resourceDir = path.join(paths.cache, 'edl_work');
    if (fs.existsSync(workDir)) fs.rmSync(workDir, { recursive: true, force: true });
    fs.mkdirSync(workDir, { recursive: true });
    if (fs.existsSync(resourceDir)) {
      fs.cpSync(resourceDir, workDir, { recursive: true, force: true });
      this.log(ctx, 'info', '已合并 Root 资源目录: ' + resourceDir);
    }
    ctx.workDir = workDir;
    const loader = path.join(paths.edl, ctx.isV3 ? 'msm8937.mbn' : 'msm8909w.mbn');
    if (!fs.existsSync(loader)) throw new Error('Firehose loader 不存在: ' + loader);
    await edlService.loadFirehose(loader, ctx.edlPort);
    const bootPath = path.join(workDir, 'boot.img');
    this.log(ctx, 'info', '读取 boot 分区...');
    const result = await edlPartitionService.backupPartition({
      loader,
      label: 'boot',
      outputFile: bootPath,
      onProgress: (msg: string) => this.log(ctx, 'info', msg),
    });
    if (!result.success || !fs.existsSync(bootPath)) {
      throw new Error('读取 boot 分区失败: ' + (result.error || '文件未生成'));
    }
    ctx.bootPath = bootPath;
    this.log(ctx, 'info', 'boot 已读取: ' + bootPath);
  }

  private async patchBoot(ctx: any) {
    this.setStage(ctx, 'patching-boot', 45);
    const magiskVer = ctx.sdkVersion === '19' ? 21 : 25;
    const outputPath = path.join(ctx.workDir, 'boot_patched.img');
    this.log(ctx, 'info', `使用 Magisk ${magiskVer} 修补 boot...`);
    const result = await magiskPatcher.patch(ctx.bootPath, outputPath, magiskVer, ctx.workDir, ctx.taskId);
    if (!result.success || !fs.existsSync(outputPath)) {
      throw new Error('boot 修补失败: ' + (result.error || '输出文件未生成'));
    }
    ctx.patchedBoot = outputPath;

    const unpackDir = path.join(ctx.workDir, 'ramdisk');
    if (fs.existsSync(unpackDir)) fs.rmSync(unpackDir, { recursive: true, force: true });
    fs.mkdirSync(unpackDir, { recursive: true });
    try {
      const { spawn } = await import('node:child_process');
      const magiskboot = path.join(paths.bin, 'magiskboot.exe');
      await new Promise<void>((resolve, reject) => {
        const proc = spawn(magiskboot, ['unpack', '-h', outputPath], { cwd: unpackDir, windowsHide: true });
        proc.on('error', reject);
        proc.on('close', (code) => code === 0 ? resolve() : reject(new Error('magiskboot unpack 失败: ' + code)));
      });
      const kernel = path.join(unpackDir, 'kernel');
      if (fs.existsSync(kernel)) {
        await bootPatcher.patchAsync(kernel);
        await new Promise<void>((resolve, reject) => {
          const proc = spawn(magiskboot, ['repack', outputPath, 'boot_patched.img'], { cwd: unpackDir, windowsHide: true });
          proc.on('error', reject);
          proc.on('close', (code) => code === 0 ? resolve() : reject(new Error('magiskboot repack 失败: ' + code)));
        });
        fs.copyFileSync(path.join(unpackDir, 'boot_patched.img'), outputPath);
      }
      this.log(ctx, 'info', '内核补丁完成');
    } catch (e) {
      this.log(ctx, 'warn', '内核补丁步骤跳过: ' + (e as Error).message);
    }
    this.log(ctx, 'info', 'boot 修补完成: ' + outputPath);
  }

  private async flashPatchedBoot(ctx: any) {
    this.setStage(ctx, 'flashing-boot', 60);
    const loader = path.join(paths.edl, ctx.isV3 ? 'msm8937.mbn' : 'msm8909w.mbn');
    const workDir = ctx.workDir as string;
    const image = ctx.patchedBoot as string;
    const targetName = ctx.isV3 ? 'boot.img' : 'sboot.img';
    fs.copyFileSync(image, path.join(workDir, targetName));

    const rawXml = path.join(paths.edl, 'rooting', 'boot.xml');
    if (fs.existsSync(rawXml)) {
      const xml = fs.readFileSync(rawXml, 'utf-8');
      const adjusted = xml.replace(/filename="[^"]*"/g, `filename="${targetName}"`);
      fs.writeFileSync(path.join(workDir, 'boot.xml'), adjusted);
      this.log(ctx, 'info', '刷入修补后的 boot...');
      await edlService.flashPartitions([path.join(workDir, 'boot.xml')], ctx.edlPort, (msg) => this.log(ctx, 'info', msg), workDir);
    } else {
      this.log(ctx, 'warn', '缺少 boot.xml，尝试直接按分区名刷入 boot');
      const { spawn } = await import('node:child_process');
      const edlNg = path.join(paths.bin, 'edl-ng', 'edl-ng.exe');
      const loader = path.join(paths.edl, ctx.isV3 ? 'msm8937.mbn' : 'msm8909w.mbn');
      await new Promise<void>((resolve, reject) => {
        const proc = spawn(edlNg, ['--loader', loader, '--memory', 'Sdcc', 'write-part', 'boot', image], { cwd: path.dirname(edlNg), windowsHide: true });
        proc.on('error', reject);
        proc.on('close', (code) => code === 0 ? resolve() : reject(new Error('edl-ng write-part 失败: ' + code)));
      });
    }
    this.log(ctx, 'info', '重启设备...');
    await edlService.reboot(ctx.edlPort);
  }

  private async waitForSystem(ctx: any) {
    this.setStage(ctx, 'waiting-boot', 75);
    const device = await DeviceService.instance.waitFor(['adb', 'fastboot'], 300000);
    ctx.device = device;
    this.log(ctx, 'info', '设备已重新连接: ' + device.type);
    if (device.type === 'adb') {
      await adbService.waitForBoot(300000);
      this.log(ctx, 'info', '系统已启动');
    }
  }

  private async installRootApps(ctx: any) {
    this.setStage(ctx, 'installing-root-apps', 88);
    const apksDir = path.join(ctx.workDir, 'apks');
    if (fs.existsSync(apksDir)) {
      for (const name of fs.readdirSync(apksDir).filter((f) => f.toLowerCase().endsWith('.apk'))) {
        this.log(ctx, 'info', '安装: ' + name);
        const result = await adbService.install('', path.join(apksDir, name));
        if (!result.success) this.log(ctx, 'warn', `${name} 安装失败: ${result.error}`);
      }
    } else {
      this.log(ctx, 'warn', 'Root 资源没有 apks 目录，跳过应用安装');
    }

    const moduleCandidates = [
      path.join(paths.cache, 'xtcpatch.zip'),
      path.join(paths.cache, 'systemui.zip'),
    ];
    for (const modulePath of moduleCandidates) {
      if (!fs.existsSync(modulePath)) {
        this.log(ctx, 'warn', '模块不存在，跳过: ' + modulePath);
        continue;
      }
      this.log(ctx, 'info', '刷入模块: ' + path.basename(modulePath));
      const result = await magiskService.install(modulePath, 'magisk');
      if (!result.success) this.log(ctx, 'warn', path.basename(modulePath) + ' 刷入失败: ' + result.error);
    }
  }

  private async finish(ctx: any) {
    this.setStage(ctx, 'completed', 100);
    this.log(ctx, 'info', 'Root 流程完成');
    if (ctx.device?.type === 'adb') {
      try { await adbService.reboot('', 'system'); } catch { /* ignore */ }
    }
    this.cleanup(ctx);
  }

  private setStage(ctx: any, stage: string, progress: number) {
    ctx.stage = stage;
    ctx.progress = progress;
    this.log(ctx, 'info', `→ ${stage}`);
    this.emit(ctx);
  }

  private fail(ctx: any, e: any) {
    ctx.stage = 'failed';
    ctx.error = { stage: ctx.stage, message: e.message, recoverable: false };
    this.log(ctx, 'error', 'Root 流程失败: ' + e.message);
    this.emit(ctx);
    this.cleanup(ctx);
  }

  private cleanup(ctx: any) {
    const timer = setTimeout(() => this.tasks.delete(ctx.taskId), 30 * 60 * 1000);
    timer.unref?.();
  }

  private log(ctx: any, level: string, msg: string) {
    const entry = { ts: Date.now(), level, msg };
    ctx.logs.push(entry);
    if (ctx.logs.length > MAX_LOGS) ctx.logs.shift();
    if (level === 'error') logger.error(msg);
    else if (level === 'warn') logger.warn(msg);
    else logger.info(msg);
  }

  private emit(ctx: any) {
    for (const win of BrowserWindow.getAllWindows()) {
      if (!win.isDestroyed()) win.webContents.send('root:stage-change', ctx);
    }
  }
}

export const rootService = new RootServiceClass();
export default rootService;
