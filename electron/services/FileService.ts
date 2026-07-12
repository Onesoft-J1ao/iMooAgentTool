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
    { label: '内部存储', path: '/sdcard', icon: 'home' },
    { label: 'DCIM 相册', path: '/sdcard/DCIM', icon: 'image' },
    { label: '下载', path: '/sdcard/Download', icon: 'download' },
    { label: '图片', path: '/sdcard/Pictures', icon: 'image' },
    { label: '音乐', path: '/sdcard/Music', icon: 'music' },
    { label: '电影', path: '/sdcard/Movies', icon: 'film' },
    { label: '文档', path: '/sdcard/Documents', icon: 'file' },
    { label: '存储根', path: '/storage', icon: 'drive' },
    { label: '根目录', path: '/', icon: 'terminal' },
    { label: 'data 分区', path: '/data', icon: 'database' },
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
        mtime = mtime + ' ' + m[8];
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
        if (arrowIdx >= 0) { name = nameRaw.slice(0, arrowIdx); linkTarget = nameRaw.slice(arrowIdx + 4); }
      }
      if (name === '.' || name === '..') continue;
      const isDir = typeChar === 'd';
      const fullPath = this.joinPath(baseDir, name);
      const ext = isDir || isLink ? '' : this.getExt(name);
      entries.push({ name, path: fullPath, isDir, isLink, linkTarget, size: isDir ? 0 : size, perms, type: typeChar, owner, group, mtime, ext });
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
    } catch { return null; }
  }

  async exists(remotePath: string) {
    const safePath = this.quote(remotePath);
    try {
      const out = await adbService.shell('', '[ -e ' + safePath + ' ] && echo yes || echo no');
      return out.trim() === 'yes';
    } catch { return false; }
  }

  async mkdir(remotePath: string, recursive = true) {
    const flag = recursive ? '-p' : '';
    await adbService.shell('', 'mkdir ' + flag + ' ' + this.quote(remotePath));
  }

  async remove(remotePath: string, recursive = true) {
    const flag = recursive ? '-rf' : '-f';
    await adbService.shell('', 'rm ' + flag + ' ' + this.quote(remotePath));
  }

  async rename(oldPath: string, newPath: string) {
    await adbService.shell('', 'mv ' + this.quote(oldPath) + ' ' + this.quote(newPath));
  }

  async copy(srcPath: string, dstPath: string, recursive = true) {
    const flag = recursive ? '-r' : '';
    await adbService.shell('', 'cp ' + flag + ' ' + this.quote(srcPath) + ' ' + this.quote(dstPath));
  }

  async push(local: string, remote: string, deviceSerial?: string, onProgress?: any) {
    logger.info('file', 'push: ' + local + ' -> ' + remote);
    const remoteDir = this.parentDir(remote);
    if (remoteDir && remoteDir !== '/') { try { await this.mkdir(remoteDir, true); } catch {} }
    const args = this.deviceArgs(deviceSerial);
    args.push('push', local, remote);
    await this.spawnWithProgress(args, { local, remote, direction: 'push', onProgress });
    if (this.keepMtime) {
      try {
        const localMtime = await this.getLocalMtime(local);
        if (localMtime) { await this.shellDevice('touch -d \'' + localMtime + '\' ' + this.quote(remote), { timeout: TIMEOUT.device, root: false }, deviceSerial); }
      } catch {}
    }
  }

  async pull(remote: string, local: string, deviceSerial?: string, onProgress?: any) {
    logger.info('file', 'pull: ' + remote + ' -> ' + local);
    const args = this.deviceArgs(deviceSerial);
    args.push('pull', remote, local);
    await this.spawnWithProgress(args, { local, remote, direction: 'pull', onProgress });
  }

  async installRemoteApk(remoteApk: string) {
    try {
      const out = await adbService.shell('', 'pm install -r ' + this.quote(remoteApk));
      const success = out.includes('Success');
      if (!success) { return { success: false, error: out.trim() || '安装失败' }; }
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  }

  async diskInfo(remotePath = '/sdcard') {
    try {
      const out = await adbService.shell('', 'df -k ' + this.quote(remotePath));
      const lines = out.split('\n').filter((l: string) => l.trim());
      const dataLine = lines[lines.length - 1];
      if (!dataLine) return null;
      const parts = dataLine.split(/\s+/);
      const nums: number[] = [];
      for (const p of parts) { const n = parseInt(p, 10); if (!isNaN(n) && /^\d+$/.test(p)) nums.push(n); }
      if (nums.length < 4) return null;
      const total = nums[0] * 1024, used = nums[1] * 1024, available = nums[2] * 1024;
      const usagePercent = nums[3] > 100 ? Math.round(used / total * 100) : nums[3];
      return { path: remotePath, total, used, available, usagePercent };
    } catch { return null; }
  }

  async readTextFile(remotePath: string, maxBytes = 1024 * 1024) {
    const safePath = this.quote(remotePath);
    const out = await adbService.shell('', 'cat ' + safePath);
    if (out.length > maxBytes) { return out.slice(0, maxBytes) + '\n... [文件过大,已截断]'; }
    return out;
  }

  async createFile(remotePath: string, content = '') {
    const safePath = this.quote(remotePath);
    if (content) { const escaped = content.replace(/'/g, "'\\''"); await adbService.shell('', "printf '%s' '" + escaped + "' > " + safePath); } else { await adbService.shell('', 'touch ' + safePath); }
  }

  async writeFile(remotePath: string, content: string) {
    const safePath = this.quote(remotePath);
    const escaped = content.replace(/'/g, "'\\''");
    await adbService.shell('', "printf '%s' '" + escaped + "' > " + safePath);
  }

  async chmod(remotePath: string, mode: string, recursive = false) {
    const flag = recursive ? '-R' : '';
    await adbService.shell('', 'chmod ' + flag + ' ' + mode + ' ' + this.quote(remotePath));
  }

  async batchRemove(paths: string[], recursive = true) {
    const flag = recursive ? '-rf' : '-f';
    const success: string[] = [];
    const failed: any[] = [];
    for (const p of paths) {
      try { await adbService.shell('', 'rm ' + flag + ' ' + this.quote(p)); success.push(p); } catch (e: any) { failed.push({ path: p, error: e.message }); }
    }
    return { success, failed };
  }

  async searchInDir(dir: string, query: string, deviceSerial?: string) {
    const safeDir = this.quote(dir);
    const safeQuery = this.quote('*' + query + '*');
    let out: string;
    try { out = await this.shellDevice('find ' + safeDir + ' -maxdepth 1 -iname ' + safeQuery + ' 2>/dev/null', { timeout: TIMEOUT.fileOp }, deviceSerial); } catch { out = await this.shellDevice('ls ' + safeDir + ' | grep -i ' + this.quote(query), { timeout: TIMEOUT.fileOp }, deviceSerial); }
    const foundPaths = out.split('\n').map((l: string) => l.trim()).filter(Boolean);
    const results = [];
    for (const p of foundPaths) { const e = await this.stat(p, deviceSerial); if (e) results.push(e); }
    return results;
  }

  async listDevices() {
    const result = await subprocessPool.spawn({ cmd: process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb', args: ['devices', '-l'], encoding: 'utf-8', timeout: TIMEOUT.device, cwd: paths.bin });
    const devices: any[] = [];
    const lines = result.stdout.split('\n').slice(1);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parts = trimmed.split(/\s+/);
      if (parts.length < 2) continue;
      const serial = parts[0], state = parts[1];
      if (state !== 'device' && state !== 'unauthorized' && state !== 'offline') continue;
      const modelField = parts.find((p: string) => p.startsWith('model:'));
      const model = modelField ? modelField.slice(6) : undefined;
      devices.push({ serial, state, model });
    }
    return devices;
  }

  deviceArgs(serial?: string) { return serial ? ['-s', serial] : []; }

  async shellDevice(cmd: string, opts: any = {}, deviceSerial?: string) {
    if (!deviceSerial) { return adbService.shell('', cmd); }
    const args = ['-s', deviceSerial, 'shell'];
    if (opts.root) { args.push("su -c '" + cmd.replace(/'/g, "'\\''") + "'"); } else { args.push(cmd); }
    const result = await subprocessPool.spawn({ cmd: process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb', args, encoding: 'gbk', timeout: opts.timeout ?? 30000, cwd: paths.bin });
    return result.stdout;
  }

  async spawnWithProgress(args: string[], ctx: any) {
    let lastPercent = 0;
    await subprocessPool.spawn({ cmd: process.platform === 'win32' ? path.join(paths.bin, 'adb.exe') : 'adb', args, encoding: 'utf-8', timeout: 0, cwd: paths.bin, onStdout: (line: string) => {
      const m = line.match(/\[\s*(\d+)%\]/);
      if (m && ctx.onProgress) { const percent = parseInt(m[1], 10); if (percent !== lastPercent) { lastPercent = percent; ctx.onProgress({ local: ctx.local, remote: ctx.remote, direction: ctx.direction, transferred: 0, total: 0, percent }); } }
    } });
    if (ctx.onProgress && lastPercent < 100) { ctx.onProgress({ local: ctx.local, remote: ctx.remote, direction: ctx.direction, transferred: 0, total: 0, percent: 100 }); }
  }

  async getLocalMtime(localPath: string) {
    try {
      const stat = fs.statSync(localPath);
      const d = stat.mtime;
      const pad = (n: number) => n.toString().padStart(2, '0');
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    } catch { return null; }
  }

  quote(p: string) { return "'" + String(p).replace(/'/g, "'\\''") + "'"; }
  joinPath(base: string, name: string) { if (base.endsWith('/')) return base + name; return base + '/' + name; }
  parentDir(p: string) { const idx = p.lastIndexOf('/'); if (idx <= 0) return '/'; return p.slice(0, idx); }
  getExt(name: string) { const idx = name.lastIndexOf('.'); if (idx <= 0 || idx === name.length - 1) return ''; return name.slice(idx + 1).toLowerCase(); }
}

export const fileService = new FileServiceClass();
export default fileService;
