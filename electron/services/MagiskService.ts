import path from 'node:path';
import fs from 'node:fs';
import https from 'node:https';
import { paths } from '../core/paths';
import { adbService } from './AdbService';

const logger = {
  info: (...args: any[]) => console.log('[MagiskService]', ...args),
  warn: (...args: any[]) => console.warn('[MagiskService]', ...args),
  error: (...args: any[]) => console.error('[MagiskService]', ...args),
};

const TIMEOUT = {
  fileOp: 15000,
  device: 5000,
  flash: 60000,
  shell: 10000,
  install: 120000,
};

class MagiskServiceClass {
  escapeModuleId(id: string) {
    return id.replace(/[^a-zA-Z0-9_\-.]/g, '_');
  }

  async list() {
    const rootResult = await adbService.root('');
    if (!rootResult.granted) {
      throw new Error('没有 root 权限');
    }
    const scriptPath = path.join(paths.scripts, 'list_modules.sh');
    await adbService.push('', scriptPath, '/data/local/tmp/list_modules.sh');
    const output = await adbService.shell('', 'sh /data/local/tmp/list_modules.sh');
    return this.parseModuleList(output);
  }

  parseModuleList(output: string) {
    const modules = [];
    const blocks = output.split(/={40,}/).filter((b) => b.trim());
    for (const block of blocks) {
      const lines = block.trim().split('\n');
      const mod: any = {};
      for (const line of lines) {
        const m = line.match(/^(.+?):\s*(.*)$/);
        if (!m) continue;
        const [, key, value] = m;
        const val = value.trim();
        switch (key.trim()) {
          case '模块ID': mod.id = val; break;
          case '名称': mod.name = val; break;
          case '版本': mod.version = val; break;
          case '内部版本': mod.versionCode = val; break;
          case '作者': mod.author = val; break;
          case '状态': mod.status = val; break;
          case '描述': mod.description = val; break;
          case '更新地址': mod.updateJson = val; break;
        }
      }
      if (mod.id) {
        modules.push(mod);
      }
    }
    return modules;
  }

  async install(zipPath: string, method: string) {
    const rootResult = await adbService.root('');
    if (!rootResult.granted) {
      return { success: false, error: '没有 root 权限' };
    }
    switch (method) {
      case 'magisk':
        return this.installMagisk(zipPath);
      case 'shinst':
        return this.installShinst(zipPath);
      case 'peremptory':
        return this.installPeremptory(zipPath);
    }
    return { success: false, error: '未知安装方式' };
  }

  async installMagisk(zipPath: string) {
    try {
      await adbService.push('', zipPath, '/sdcard/temp_module.zip');
      await adbService.shell('', 'magisk --install-module /sdcard/temp_module.zip');
      await adbService.shell('', 'rm /sdcard/temp_module.zip');
      logger.info('模块安装成功(magisk): ' + zipPath);
      return { success: true };
    } catch (e: any) {
      try { await adbService.shell('', 'rm /sdcard/temp_module.zip'); } catch {}
      return { success: false, error: e.message };
    }
  }

  async installShinst(zipPath: string) {
    try {
      await adbService.push('', zipPath, '/sdcard/temp_module.zip');
      const scriptPath = path.join(paths.scripts, 'module_installer.sh');
      await adbService.push('', scriptPath, '/sdcard/module_installer.sh');
      await adbService.shell('', 'sh /sdcard/module_installer.sh');
      await adbService.shell('', 'rm /sdcard/temp_module.zip /sdcard/module_installer.sh');
      logger.info('模块安装成功(shinst): ' + zipPath);
      return { success: true };
    } catch (e: any) {
      try { await adbService.shell('', 'rm /sdcard/temp_module.zip /sdcard/module_installer.sh'); } catch {}
      return { success: false, error: e.message };
    }
  }

  async installPeremptory(zipPath: string) {
    try {
      const scriptPath = path.join(paths.scripts, 'magisk_force_install.sh');
      await adbService.push('', scriptPath, '/sdcard/magisk_force_install.sh');
      await adbService.push('', zipPath, '/sdcard/temp_module.zip');
      await adbService.shell('', 'sh /sdcard/magisk_force_install.sh');
      await adbService.shell('', 'rm /sdcard/temp_module.zip /sdcard/magisk_force_install.sh');
      logger.info('模块安装成功(peremptory): ' + zipPath);
      return { success: true };
    } catch (e: any) {
      try { await adbService.shell('', 'rm /sdcard/temp_module.zip /sdcard/magisk_force_install.sh'); } catch {}
      return { success: false, error: e.message };
    }
  }

  async uninstall(moduleId: string, method: string) {
    const rootResult = await adbService.root('');
    if (!rootResult.granted) {
      return { success: false, error: '没有 root 权限' };
    }
    const safeId = this.escapeModuleId(moduleId);
    const existsCheck = await adbService.shell('', `[ -d /data/adb/modules/${safeId} ] && echo EXISTS`);
    if (!existsCheck.includes('EXISTS')) {
      return { success: false, error: '模块不存在: ' + moduleId };
    }
    switch (method) {
      case 'mark':
        return this.uninstallMark(moduleId);
      case 'direct':
        return this.uninstallDirect(moduleId);
      case 'script':
        return this.uninstallScript(moduleId);
    }
    return { success: false, error: '未知卸载方式' };
  }

  async uninstallMark(moduleId: string) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await adbService.shell('', `touch /data/adb/modules/${safeId}/remove`);
      const check = await adbService.shell('', `[ -f /data/adb/modules/${safeId}/remove ] && echo OK`);
      if (!check.includes('OK')) {
        return { success: false, error: '创建标记卸载文件失败' };
      }
      logger.info('模块标记卸载成功: ' + moduleId);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async uninstallDirect(moduleId: string) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await adbService.shell('', `touch /data/adb/modules/${safeId}/disable && sleep 1 && rm -rf /data/adb/modules/${safeId}`);
      const check = await adbService.shell('', `[ ! -d /data/adb/modules/${safeId} ] && echo OK`);
      if (!check.includes('OK')) {
        return { success: false, error: '删除模块目录失败' };
      }
      logger.info('模块直接卸载成功: ' + moduleId);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async uninstallScript(moduleId: string) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await adbService.shell('', `if [ -f /data/adb/modules/${safeId}/uninstall.sh ]; then sh /data/adb/modules/${safeId}/uninstall.sh; else echo NO_SCRIPT; fi; rm -rf /data/adb/modules/${safeId}`);
      const check = await adbService.shell('', `[ ! -d /data/adb/modules/${safeId} ] && echo OK`);
      if (!check.includes('OK')) {
        return { success: false, error: '删除模块目录失败' };
      }
      logger.info('模块脚本卸载成功: ' + moduleId);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async enable(moduleId: string) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await adbService.shell('', `rm /data/adb/modules/${safeId}/disable`);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async disable(moduleId: string) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await adbService.shell('', `touch /data/adb/modules/${safeId}/disable`);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async storeSearch(query: string) {
    if (!query || !query.trim()) {
      return [];
    }
    const url = 'https://api.magiskmodule.com/v1/modules?search=' + encodeURIComponent(query);
    logger.info('搜索 Magisk 模块: ' + query);
    try {
      const data = await this.httpsGetJson(url);
      if (!Array.isArray(data)) {
        return [];
      }
      return data.map((m: any) => ({
        id: String(m.id ?? m.module_id ?? ''),
        name: String(m.name ?? m.title ?? ''),
        description: String(m.description ?? ''),
        author: String(m.author ?? ''),
        version: String(m.version ?? ''),
        versionCode: String(m.version_code ?? m.versionCode ?? ''),
        downloadUrl: String(m.zip_url ?? m.download_url ?? m.link ?? ''),
        homepage: String(m.homepage ?? m.url ?? ''),
        lastUpdate: String(m.last_update ?? m.lastUpdate ?? ''),
      }));
    } catch (e: any) {
      logger.warn('模块商店搜索失败,返回空列表: ' + e.message);
      return [];
    }
  }

  async installFromStore(module: any) {
    if (!module.downloadUrl) {
      return { success: false, error: '模块缺少下载地址' };
    }
    try {
      if (!fs.existsSync(paths.cache)) {
        fs.mkdirSync(paths.cache, { recursive: true });
      }
      const filename = (module.id || 'store_module') + '_' + Date.now() + '.zip';
      const localPath = path.join(paths.cache, filename);
      logger.info('下载商店模块: ' + module.downloadUrl + ' → ' + localPath);
      await this.httpsDownload(module.downloadUrl, localPath);
      const result = await this.install(localPath, 'magisk');
      try { fs.unlinkSync(localPath); } catch {}
      return result;
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  httpsGetJson(url: string) {
    return new Promise((resolve, reject) => {
      const req = https.get(url, {
        headers: { 'User-Agent': 'iMooDesktop/1.0' },
        timeout: TIMEOUT.fileOp,
      }, (res) => {
        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          reject(new Error('HTTP ' + res.statusCode));
          res.resume();
          return;
        }
        let body = '';
        res.setEncoding('utf-8');
        res.on('data', (chunk: string) => { body += chunk; });
        res.on('end', () => {
          try { resolve(JSON.parse(body)); } catch (e: any) { reject(new Error('JSON 解析失败: ' + e.message)); }
        });
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(new Error('请求超时')); });
    });
  }

  httpsDownload(url: string, destPath: string) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(destPath);
      const req = https.get(url, {
        headers: { 'User-Agent': 'iMooDesktop/1.0' },
        timeout: TIMEOUT.install,
      }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          try { fs.unlinkSync(destPath); } catch {}
          this.httpsDownload(res.headers.location, destPath).then(resolve, reject);
          return;
        }
        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          file.close();
          try { fs.unlinkSync(destPath); } catch {}
          reject(new Error('下载失败: HTTP ' + res.statusCode));
          return;
        }
        res.pipe(file);
        file.on('finish', () => { file.close(() => resolve()); });
      });
      req.on('error', (err) => {
        file.close();
        try { fs.unlinkSync(destPath); } catch {}
        reject(err);
      });
      req.on('timeout', () => { req.destroy(new Error('下载超时')); });
    });
  }
}

export const magiskService = new MagiskServiceClass();
export default magiskService;
