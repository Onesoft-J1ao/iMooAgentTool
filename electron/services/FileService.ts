import path from 'node:path';
import fs from 'node:fs';
import { EventEmitter } from 'node:events';
import { paths } from '../core/paths';
import { subprocessPool } from './SubprocessPool';
import { adbService } from './AdbService';

const logger = {
  info: (...args: any[]) => console.log('[FileService]', ...args),
  warn: (...args: any[]) => console.warn('[FileService]', ...args),
};

const TIMEOUT = {
  fileOp: 15000,
  device: 5000,
  shell: 10000,
  flash: 60000,
  install: 120000,
};

class FileServiceClass extends EventEmitter {
  compatMode = false;
  keepMtime = false;
  QUICK_PATHS = [
    { name: '内部存储', path: '/sdcard' },
    { name: 'DCIM 相册', path: '/sdcard/DCIM' },
    { name: '下载', path: '/sdcard/Download' },
    { name: '图片', path: '/sdcard/Pictures' },
    { name: '音乐', path: '/sdcard/Music' },
    { name: '电影', path: '/sdcard/Movies' },
    { name: '文档', path: '/sdcard/Documents' },
    { name: '存储根', path: '/storage' },
    { name: '根目录', path: '/' },
    { name: 'data 分区', path: '/data' },
  ];

  async list(remotePath: string, deviceSerial?: string) {
    const safePath = this.quote(remotePath);
    const flag = this.compatMode ? '-l' : '-lA';
    const out = await this.shellDevice('ls ' + flag + ' ' + safePath, { timeout: TIMEOUT.fileOp }, deviceSerial);
    let entries = this.parseLsOutput(out, remotePath);
    if (this.compatMode) {
      entries = entries.filter((e: any) => e.name !== '.' && e.name !== '..');
    }
    return entries;
  }

  parseLsOutput(output: string, baseDir: string) {
    const entries: any[] = [];
    const lines = output.split('\n').map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (/^total\s+\d+/i.test(line)) continue;
      if (/permission denied|no such file|not a directory|opendir/i.test(line)) continue;
      let m = line.match(/^([dlbcsp-])([rwxst-]{9})\s+(\d+)\s+(\S+)\s+(\S+)\s+(\d+)\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s+(.*)$/);
      let typeChar: string, perms: string, owner: string, group: string, size: number, mtime: string, nameRaw: string;
      if (m) {
        [, typeChar, perms, , owner, group, , mtime, , nameRaw] = m;
        mtime = `${mtime} ${m[8]}`;
        size = parseInt(m[6], 10) || 0;
      } else {
        m = line.match(/^([dlbcsp-])([rwxst-]{9})\s+(\S+)\s+(\S+)\s+(\d+)\s+(\w{3}\s+\d{1,2}\s+[\d:]{4,5})\s+(.*)$/);
        if (m) {
          [, typeChar, perms, owner, group, , mtime, nameRaw] = m;
          size = parseInt(m[5], 10) || 0;
        } else {
          logger.warn('无法解析 ls 行: ' + line);
          continue;
        }
      }
      const isLink = typeChar === 'l';
      let linkTarget: string | undefined;
      let name = nameRaw;
      if (isLink) {
        const arrowIdx = nameRaw.indexOf(' -> ');
        if (arrowIdx >= 0) {
          name = nameRaw.slice(0, arrowIdx);
          linkTarget = nameRaw.slice(arrowIdx + 4);
        }
      }
      if (name === '.' || name === '..') continue;
      const isDir = typeChar === 'd';
      entries.push({
        name,
        path: this.joinPath(baseDir, name),
        isDir,
        isLink,
        linkTarget,
        size: isDir ? 0 : size,
        perms,
        mode: perms,
        type: typeChar,
        owner,
        group,
        mtime,
        modified: mtime,
        ext: isDir || isLink ? '' : this.getExt(name),
      });
    }
    entries.sort((a: any, b: any) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    return entries;
  }

  async stat(remotePath: string, deviceSerial?: string) {
    const safePath = this.quote(remotePath);
    try {
      const out = await this.shellDevice('ls -ld ' + safePath, { timeout: TIMEOUT.device }, deviceSerial);
      const entries = this.parseLsOutput(out, this.parentDir(remotePath));
      return entries.find((e: any) => e.path === remotePath) ?? entries[0] ?? null;
    } catch {
      return null;
    }
  }

  async exists(remotePath: string, deviceSerial?: string) {
    try {
      const out = await this.shellDevice(`[ -e ${this.quote(remotePath)} ] && echo yes || echo no`, { timeout: TIMEOUT.device }, deviceSerial);
      return out.trim() === 'yes';
    } catch {
      return false;
    }
  }

  async mkdir(remotePath: string, recursive = true, deviceSerial?: string) {
    const flag = recursive ? '-p' : '';
    await this.shellDevice(`mkdir ${flag} ${this.quote(remotePath)}`, { timeout: TIMEOUT.device }, deviceSerial);
  }

  async remove(remotePath: string, recursive = true, deviceSerial?: string) {
    const flag = recursive ? '-rf' : '-f';
    await this.shellDevice(`rm ${flag} ${this.quote(remotePath)}`, { timeout: TIMEOUT.fileOp }, deviceSerial);
  }

  async rename(oldPath: string, newPath: string, deviceSerial?: string) {
    await this.shellDevice(`mv ${this.quote(oldPath)} ${this.quote(newPath)}`, { timeout: TIMEOUT.device }, deviceSerial);
  }

  async copy(srcPath: string, dstPath: string, recursive = true, deviceSerial?: string) {
    const flag = recursive ? '-r' : '';
    await this.shellDevice(`cp ${flag} ${this.quote(srcPath)} ${this.quote(dstPath)}`, { timeout: TIMEOUT.fileOp }, deviceSerial);
  }

  async push(local: string, remote: string, deviceSerial?: string, onProgress?: any) {
    logger.info('push: ' + local + ' -> ' + remote);
    const remoteDir = this.parentDir(remote);
    if (remoteDir && remoteDir !== '/') {
      try { await this.mkdir(remoteDir, true, deviceSerial); } catch { /* ignore */ }
    }
    const args = this.deviceArgs(deviceSerial);
    args.push('push', local, remote);
    await this.spawnWithProgress(args, { local, remote, direction: 'push', onProgress });
    if (this.keepMtime) {
      try {
        const localMtime = await this.getLocalMtime(local);
        if (localMtime) {
          await this.shellDevice(`touch -d '${localMtime}' ${this.quote(remote)}`, { timeout: TIMEOUT.device }, deviceSerial);
        }
      } catch { /* ignore */ }
    }
  }

  async pull(remote: string, local: string, deviceSerial?: string, onProgress?: any) {
    logger.info('pull: ' + remote + ' -> ' + local);
    const args = this.deviceArgs(deviceSerial);
    args.push('pull', remote, local);
    await this.spawnWithProgress(args, { local, remote, direction: 'pull', onProgress });
  }

  async installRemoteApk(remoteApk: string, deviceSerial?: string) {
    const out = await this.shellDevice(`pm install -r ${this.quote(remoteApk)}`, { timeout: TIMEOUT.install }, deviceSerial);
    const success = /\bSuccess\b/i.test(out);
    return { success, output: out, error: success ? undefined : out.trim() || '安装失败' };
  }

  async diskInfo(remotePath = '/sdcard') {
    try {
      const out = await adbService.shell('', 'df -k ' + this.quote(remotePath));
      const lines = out.split('\n').filter((l: string) => l.trim());
      const dataLine = lines[lines.length - 1];
      if (!dataLine) return null;
      const parts = dataLine.split(/\s+/);
      const nums: number[] = [];
      for (const p of parts) {
        const n = parseInt(p, 10);
        if (!isNaN(n) && /^\d+$/.test(p)) nums.push(n);
      }
      if (nums.length < 4) return null;
      const total = nums[0] * 1024;
      const used = nums[1] * 1024;
      const available = nums[2] * 1024;
      const usagePercent = nums[3] > 100 ? Math.round((used / total) * 100) : nums[3];
      return { path: remotePath, total, used, available, free: available, usagePercent };
    } catch {
      return null;
    }
  }

  async readTextFile(remotePath: string, maxBytes = 1024 * 1024) {
    const out = await adbService.shell('', 'cat ' + this.quote(remotePath));
    if (out.length > maxBytes) return out.slice(0, maxBytes) + '\n... [文件过大,已截断]';
    return out;
  }

  async createFile(remotePath: string, content = '') {
    if (content) {
      await this.writeFile(remotePath, content);
    } else {
      await adbService.shell('', 'touch ' + this.quote(remotePath));
    }
  }

  async writeFile(remotePath: string, content: string) {
    const escaped = content.replace(/'/g, "'\\''");
    await adbService.shell('', `printf '%s' '${escaped}' > ${this.quote(remotePath)}`);
  }

  async chmod(remotePath: string, mode: string, recursive = false) {
    const flag = recursive ? '-R' : '';
    await adbService.shell('', `chmod ${flag} ${mode} ${this.quote(remotePath)}`);
  }

  async batchRemove(pathsToRemove: string[], recursive = true) {
    const flag = recursive ? '-rf' : '-f';
    const success: string[] = [];
    const failed: Array<{ path: string; error: string }> = [];
    for (const p of pathsToRemove) {
      try {
        await adbService.shell('', `rm ${flag} ${this.quote(p)}`);
        success.push(p);
      } catch (e) {
        failed.push({ path: p, error: (e as Error).message });
      }
    }
    return { success, failed };
  }

  async searchInDir(dir: string, query: string, deviceSerial?: string) {
    const safeDir = this.quote(dir);
    const safeQuery = this.quote('*' + query + '*');
    let out: string;
    try {
      out = await this.shellDevice(`find ${safeDir} -maxdepth 1 -iname ${safeQuery} 2>/dev/null`, { timeout: TIMEOUT.fileOp }, deviceSerial);
    } catch {
      out = await this.shellDevice(`ls ${safeDir} | grep -i ${this.quote(query)}`, { timeout: TIMEOUT.fileOp }, deviceSerial);
    }
    const foundPaths = out.split('\n').map((l: string) => l.trim()).filter(Boolean);
    const results: any[] = [];
    for (const p of foundPaths) {
      const entry = await this.stat(p, deviceSerial);
      if (entry) results.push(entry);
    }
    return results;
  }

  async listDevices() {
    const result = await subprocessPool.spawn({
      cmd: process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb',
      args: ['devices', '-l'],
      encoding: 'utf-8',
      timeout: TIMEOUT.device,
      cwd: paths.bin,
    });
    const devices: any[] = [];
    for (const line of result.stdout.split('\n').slice(1)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parts = trimmed.split(/\s+/);
      if (parts.length < 2) continue;
      const [serial, state] = parts;
      if (!['device', 'unauthorized', 'offline'].includes(state)) continue;
      const modelField = parts.find((p: string) => p.startsWith('model:'));
      devices.push({ serial, state, model: modelField ? modelField.slice(6) : undefined, type: 'adb' });
    }
    return devices;
  }

  deviceArgs(serial?: string) {
    return serial ? ['-s', serial] : [];
  }

  async shellDevice(cmd: string, opts: any = {}, deviceSerial?: string) {
    const args = this.deviceArgs(deviceSerial);
    args.push('shell');
    if (opts.root) {
      args.push("su -c '" + cmd.replace(/'/g, "'\\''") + "'");
    } else {
      args.push(cmd);
    }
    const result = await subprocessPool.spawn({
      cmd: process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb',
      args,
      encoding: 'gbk',
      timeout: opts.timeout ?? 30000,
      cwd: paths.bin,
    });
    return result.stdout;
  }

  async spawnWithProgress(args: string[], ctx: any) {
    let lastPercent = 0;
    await subprocessPool.spawn({
      cmd: process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb',
      args,
      encoding: 'utf-8',
      timeout: 0,
      cwd: paths.bin,
      onStdout: (line: string) => {
        const m = line.match(/\[\s*(\d+)%\]/);
        if (!m) return;
        const percent = parseInt(m[1], 10);
        if (percent === lastPercent) return;
        lastPercent = percent;
        const progress = {
          file: path.basename(ctx.local),
          local: ctx.local,
          remote: ctx.remote,
          direction: ctx.direction,
          percent,
          bytes: percent,
          total: 100,
          speed: 0,
        };
        ctx.onProgress?.(progress);
        this.emit('transfer-progress', progress);
      },
    });
    if (lastPercent < 100) {
      const progress = {
        file: path.basename(ctx.local),
        local: ctx.local,
        remote: ctx.remote,
        direction: ctx.direction,
        percent: 100,
        bytes: 100,
        total: 100,
        speed: 0,
      };
      ctx.onProgress?.(progress);
      this.emit('transfer-progress', progress);
    }
  }

  async getLocalMtime(localPath: string) {
    try {
      const d = fs.statSync(localPath).mtime;
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    } catch {
      return null;
    }
  }

  quote(p: string) {
    return "'" + String(p).replace(/'/g, "'\\''") + "'";
  }

  joinPath(base: string, name: string) {
    return base.endsWith('/') ? base + name : base + '/' + name;
  }

  parentDir(p: string) {
    const idx = p.lastIndexOf('/');
    return idx <= 0 ? '/' : p.slice(0, idx);
  }

  getExt(name: string) {
    const idx = name.lastIndexOf('.');
    return idx <= 0 || idx === name.length - 1 ? '' : name.slice(idx + 1).toLowerCase();
  }
}

export const fileService = new FileServiceClass();
export default fileService;
