import { spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';
import * as iconv from 'iconv-lite';

const logger = { debug: () => {}, warn: (...a: any[]) => console.warn(...a), error: (...a: any[]) => console.error(...a) };

class SpawnError extends Error {
  exitCode: number; stdout: string; stderr: string; duration: number; killed: boolean;
  constructor(msg: string, code: number, stdout: string, stderr: string, duration: number, _cancelled: boolean, killed: boolean) {
    super(msg); this.exitCode = code; this.stdout = stdout; this.stderr = stderr; this.duration = duration; this.killed = killed; this.name = 'SpawnError';
  }
}

interface SpawnOpts {
  cmd: string; args: string[]; cwd?: string; timeout?: number; encoding?: string;
  taskId?: string; env?: Record<string, string>; captureStdout?: boolean; silent?: boolean;
  onStdout?: (line: string) => void; onStderr?: (line: string) => void;
}

function decode(chunk: Buffer, encoding: string): string {
  if (encoding === 'gbk') {
    try { return decodeGbk(chunk); } catch { /* fall through */ }
  }
  return chunk.toString('utf-8');
}

function decodeGbk(buf: Buffer): string {
  try { return iconv.decode(buf, 'GBK'); } catch { return buf.toString('utf-8'); }
}

class SubprocessPoolClass {
  tasks = new Map<string, any>();
  bus = new EventEmitter();

  async spawn(opts: SpawnOpts) {
    const { cmd, args, cwd, timeout = 0, encoding = 'gbk', taskId, env } = opts;
    const captureStdout = opts.captureStdout !== false;
    const silent = opts.silent ?? false;
    const start = Date.now();
    return new Promise<any>((resolve, reject) => {
      const proc = spawn(cmd, args, { cwd, env: { ...process.env, ...env } as any, windowsHide: true, shell: false });
      if (taskId) this.tasks.set(taskId, { taskId, cmd, args, startedAt: start, process: proc });
      const stdoutChunks: Buffer[] = [];
      const stderrChunks: Buffer[] = [];
      let stdoutStr = '', stderrStr = '', stdoutBuf = '', stderrBuf = '';
      let killed = false, timeoutHandle: any;

      const processLine = (buf: string, chunk: Buffer, cb?: (line: string) => void) => {
        const decoded = decode(chunk, encoding);
        const combined = buf + decoded;
        const lines = combined.split(/\r?\n/);
        const remaining = lines.pop() ?? '';
        for (const line of lines) {
          if (line.trim()) {
            cb?.(line);
            this.bus.emit('line', { taskId, line, stream: 'stdout' });
          }
        }
        return remaining;
      };

      proc.stdout?.on('data', (chunk: Buffer) => {
        if (captureStdout) stdoutChunks.push(chunk);
        stdoutBuf = processLine(stdoutBuf, chunk, opts.onStdout);
        try { stdoutStr += decode(chunk, encoding); } catch { stdoutStr += chunk.toString('utf-8'); }
      });
      proc.stderr?.on('data', (chunk: Buffer) => {
        if (captureStdout) stderrChunks.push(chunk);
        stderrBuf = processLine(stderrBuf, chunk, opts.onStderr);
        try { stderrStr += decode(chunk, encoding); } catch { stderrStr += chunk.toString('utf-8'); }
      });

      if (timeout > 0) {
        timeoutHandle = setTimeout(() => {
          killed = true;
          proc.kill('SIGTERM');
          setTimeout(() => { if (!proc.killed) proc.kill('SIGKILL'); }, 5000);
        }, timeout);
      }

      proc.on('error', (err: any) => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (taskId) this.tasks.delete(taskId);
        reject(new SpawnError(`启动失败: ${err.message}`, -1, '', '', 0, false, killed));
      });

      proc.on('close', (code: number | null) => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (taskId) this.tasks.delete(taskId);
        if (stdoutBuf.trim()) { opts.onStdout?.(stdoutBuf); this.bus.emit('line', { taskId, line: stdoutBuf, stream: 'stdout' }); }
        if (stderrBuf.trim()) { opts.onStderr?.(stderrBuf); this.bus.emit('line', { taskId, line: stderrBuf, stream: 'stderr' }); }
        const duration = Date.now() - start;
        const result = {
          exitCode: code,
          stdout: captureStdout ? Buffer.concat(stdoutChunks).toString('utf-8') || stdoutStr : stdoutStr,
          stderr: captureStdout ? Buffer.concat(stderrChunks).toString('utf-8') || stderrStr : stderrStr,
          duration, signal: undefined as any, killed,
        };
        if (code === 0 && !killed) resolve(result);
        else if (killed) reject(new SpawnError(`进程被 kill: ${cmd}`, code ?? -1, result.stdout, result.stderr, duration, false, true));
        else reject(new SpawnError(`退出码 ${code}: ${cmd} ${args.join(' ')}`, code ?? -1, result.stdout, result.stderr, duration, false, false));
      });
    });
  }

  async *spawnStreaming(opts: SpawnOpts) {
    const queue: string[] = [];
    let done = false, error: any = null, waiter: ((v: any) => void) | null = null;
    const onLine = (line: string) => {
      queue.push(line);
      waiter?.(true); waiter = null;
    };
    this.spawn({ ...opts, onStdout: onLine, onStderr: onLine, captureStdout: false }).then(() => {
      done = true; waiter?.(true); waiter = null;
    }).catch((e) => { error = e; done = true; waiter?.(true); waiter = null; });
    while (true) {
      if (queue.length > 0) { yield queue.shift()!; continue; }
      if (done) { if (error) throw error; return; }
      await new Promise((resolve) => { waiter = resolve; });
    }
  }

  kill(taskId: string, signal: NodeJS.Signals = 'SIGTERM') {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    return task.process.kill(signal);
  }

  list() { return Array.from(this.tasks.values()); }

  onLine(cb: (data: { taskId?: string; line: string; stream: string }) => void) {
    this.bus.on('line', cb);
    return () => this.bus.off('line', cb);
  }
}

export const subprocessPool = new SubprocessPoolClass();
export default subprocessPool;
export { SpawnError };
export type { SpawnOpts };
