import path from 'node:path';
import fs from 'node:fs';
import { paths } from '../core/paths';
import { subprocessPool } from './SubprocessPool';

const logger = {
  info: (...args: any[]) => console.log('[AtbmodService]', ...args),
  warn: (...args: any[]) => console.warn('[AtbmodService]', ...args),
  error: (...args: any[]) => console.error('[AtbmodService]', ...args),
  debug: (...args: any[]) => console.debug('[AtbmodService]', ...args),
};

const TIMEOUT = {
  flash: 60000,
  transfer: 300000,
};

class AtbmodServiceClass {
  get modDir() {
    return path.join(paths.bin, 'mod');
  }

  get sevenZip() {
    return path.join(paths.bin, '7z.exe');
  }

  async scan() {
    const result = [];
    try {
      const entries = await fs.promises.readdir(paths.bin);
      for (const entry of entries) {
        if (!entry.toLowerCase().endsWith('.atbmod')) continue;
        const full = path.join(paths.bin, entry);
        try {
          const stat = await fs.promises.stat(full);
          if (stat.isFile()) {
            result.push({ path: full, filename: entry, size: stat.size });
          }
        } catch {}
      }
    } catch (e: any) {
      logger.warn('扫描 .atbmod 文件失败: ' + e.message);
    }
    return result;
  }

  async install(file: string, serial?: string) {
    if (!fs.existsSync(file)) {
      return { success: false, error: '文件已不存在,跳过' };
    }
    if (!fs.existsSync(this.modDir)) {
      fs.mkdirSync(this.modDir, { recursive: true });
    }
    const nutime = String(Date.now());
    const tempDir = path.join(this.modDir, 'atbmod_' + nutime + '_tmp');
    fs.mkdirSync(tempDir, { recursive: true });
    try {
      await subprocessPool.spawn({
        cmd: this.sevenZip,
        args: ['x', file, '-o' + tempDir, '-y'],
        encoding: 'utf-8',
        timeout: TIMEOUT.flash,
        cwd: paths.bin,
      });
    } catch (e: any) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: '解压失败,模块可能已损坏: ' + e.message };
    }
    const propPath = path.join(tempDir, 'atbmod.prop');
    if (!fs.existsSync(propPath)) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: '模块不完整或格式不正确,缺少 atbmod.prop' };
    }
    const prop = this.parseProp(propPath);
    if (!prop.modid) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: '模块不完整或格式不正确,缺少 modid' };
    }
    if (!prop.modversioncode) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: '模块不完整或格式不正确,缺少 modversioncode' };
    }
    logger.info('模块名称: ' + prop.modname + ', 版本: ' + prop.modversion + ', 类型: ' + prop.modtype);
    let installer: string | null = null;
    const installBat = path.join(tempDir, 'install.bat');
    const installExe = path.join(tempDir, 'install.exe');
    if (fs.existsSync(installBat)) {
      installer = installBat;
    } else if (fs.existsSync(installExe)) {
      installer = installExe;
    }
    if (!installer) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: '模块不完整或格式不正确,缺少 install.bat/install.exe' };
    }
    let exitCode = 0;
    try {
      if (installer.toLowerCase().endsWith('.bat')) {
        const result = await subprocessPool.spawn({
          cmd: 'cmd.exe',
          args: ['/c', installer],
          encoding: 'gbk',
          timeout: TIMEOUT.transfer,
          cwd: tempDir,
          onStdout: (line: string) => logger.debug('atbmod install: ' + line),
        });
        exitCode = result.exitCode ?? 0;
      } else {
        const result = await subprocessPool.spawn({
          cmd: installer,
          args: [],
          encoding: 'gbk',
          timeout: TIMEOUT.transfer,
          cwd: tempDir,
        });
        exitCode = result.exitCode ?? 0;
      }
    } catch (e: any) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: '安装出错: ' + e.message };
    }
    if (exitCode !== 0) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: '安装出错,错误码 ' + exitCode };
    }
    const targetDir = path.join(this.modDir, prop.modid);
    if (fs.existsSync(targetDir)) {
      const oldDir = path.join(this.modDir, prop.modid + '_old');
      if (fs.existsSync(oldDir)) {
        this.rmdir(oldDir);
      }
      fs.renameSync(targetDir, oldDir);
    }
    fs.renameSync(tempDir, targetDir);
    this.markAsEnd(file);
    logger.info('模块安装完成: ' + prop.modid);
    return { success: true, modid: prop.modid };
  }

  async listInstalled(): Promise<Array<{ modid: string; dir: string; hasProp: boolean; prop?: any }>> {
    const result: Array<{ modid: string; dir: string; hasProp: boolean; prop?: any }> = [];
    if (!fs.existsSync(this.modDir)) {
      return result;
    }
    const entries = await fs.promises.readdir(this.modDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.endsWith('_old') || entry.name.endsWith('_tmp')) continue;
      const dir = path.join(this.modDir, entry.name);
      const propPath = path.join(dir, 'atbmod.prop');
      const hasProp = fs.existsSync(propPath);
      const item: any = { modid: entry.name, dir, hasProp };
      if (hasProp) {
        item.prop = this.parseProp(propPath);
      }
      result.push(item);
    }
    return result;
  }

  async uninstall(modid: string, serial?: string) {
    const targetDir = path.join(this.modDir, modid);
    if (!fs.existsSync(targetDir)) {
      return { success: false, error: '模块不存在: ' + modid };
    }
    try {
      this.rmdir(targetDir);
      logger.info('已卸载 atbmod 模块: ' + modid);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  parseProp(propPath: string) {
    const prop: any = { modid: '', modname: '', modversion: '', modversioncode: '', modtype: '' };
    try {
      const content = fs.readFileSync(propPath, 'utf-8');
      for (const line of content.split('\n')) {
        const m = line.match(/^([^=]+)=(.*)$/);
        if (!m) continue;
        const key = m[1].trim().toLowerCase();
        const value = m[2].trim();
        switch (key) {
          case 'modid': prop.modid = value; break;
          case 'modname': prop.modname = value; break;
          case 'modversion': prop.modversion = value; break;
          case 'modversioncode': prop.modversioncode = value; break;
          case 'modtype': prop.modtype = value; break;
        }
      }
    } catch (e: any) {
      logger.warn('解析 atbmod.prop 失败: ' + e.message);
    }
    return prop;
  }

  rmdir(dir: string) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (e: any) {
      logger.warn('删除目录失败: ' + dir + ' - ' + e.message);
    }
  }

  markAsEnd(file: string) {
    try {
      fs.renameSync(file, file + '.end');
    } catch (e: any) {
      logger.warn('重命名 .atbmod 为 .end 失败: ' + e.message);
    }
  }
}

export const atbmodService = new AtbmodServiceClass();
export default atbmodService;
