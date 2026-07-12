import path from 'node:path';
import { EventEmitter } from 'node:events';
import { spawn } from 'node:child_process';
import { paths } from '../core/paths';

const logger = {
  info: (...args: any[]) => console.log('[ScrcpyService]', ...args),
  warn: (...args: any[]) => console.warn('[ScrcpyService]', ...args),
  error: (...args: any[]) => console.error('[ScrcpyService]', ...args),
  debug: (...args: any[]) => console.debug('[ScrcpyService]', ...args),
};

class ScrcpyServiceClass extends EventEmitter {
  scrcpyPath = path.join(paths.bin, 'scrcpy.exe');
  running = new Map();

  async launch(opts: any) {
    const args = this.buildArgs(opts);
    logger.info('启动 scrcpy: ' + args.join(' '));
    const proc = spawn(this.scrcpyPath, args, {
      cwd: paths.bin,
      windowsHide: false,
      detached: false,
    });
    const pid = proc.pid ?? -1;
    const entry = { pid, opts, process: proc, startedAt: Date.now() };
    this.running.set(pid, entry);
    this.emit('process-change', { type: 'launch', pid });
    proc.on('error', (err: any) => {
      logger.error('scrcpy 启动失败: ' + err.message);
      this.running.delete(pid);
      this.emit('process-change', { type: 'exit', pid });
    });
    proc.on('exit', (code: number | null) => {
      logger.info('scrcpy 退出(pid=' + pid + ', code=' + code + ')');
      if (this.running.has(pid)) {
        this.running.delete(pid);
        this.emit('process-change', { type: 'exit', pid, code: code ?? undefined });
      }
    });
    return pid;
  }

  async stop(pid: number) {
    const entry = this.running.get(pid);
    if (!entry) {
      logger.warn('scrcpy pid=' + pid + ' 不存在');
      return;
    }
    this.running.delete(pid);
    try {
      entry.process.kill();
      logger.info('已停止 scrcpy pid=' + pid);
    } catch (e: any) {
      logger.error('停止 scrcpy 失败: ' + e.message);
    }
    this.emit('process-change', { type: 'exit', pid });
  }

  async stopAll() {
    for (const pid of Array.from(this.running.keys())) {
      await this.stop(pid);
    }
  }

  listRunning() {
    return Array.from(this.running.values()).map((e: any) => ({
      pid: e.pid,
      opts: e.opts,
      startedAt: e.startedAt,
    }));
  }

  buildArgs(opts: any) {
    const args: string[] = [];
    if (opts.noControl) args.push('--no-control');
    if (opts.turnScreenOff) args.push('--turn-screen-off');
    if (opts.stayAwake) args.push('--stay-awake');
    if (opts.record) args.push('--record', opts.record);
    if (opts.noAudio) args.push('--no-audio');
    if (opts.audio) args.push('--audio');
    if (opts.noClipboardAutosync) args.push('--no-clipboard-autosync');
    if (opts.legacyPaste) args.push('--legacy-paste');
    if (opts.showTouches) args.push('--show-touches');
    if (opts.maxFps) args.push('--max-fps', String(opts.maxFps));
    if (opts.alwaysOnTop) args.push('--always-on-top');
    if (opts.fullscreen) args.push('--fullscreen');
    if (opts.windowBorderless) args.push('--window-borderless');
    if (opts.recordFormat) args.push('--record-format', opts.recordFormat);
    if (opts.bitRate) args.push('--bit-rate', String(opts.bitRate));
    if (opts.crop) args.push('--crop', opts.crop);
    if (opts.windowTitle) args.push('--window-title', opts.windowTitle);
    if (opts.maxSize) args.push('--max-size', String(opts.maxSize));
    return args;
  }
}

export const scrcpyService = new ScrcpyServiceClass();
export default scrcpyService;
