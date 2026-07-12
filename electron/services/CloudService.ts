import path from 'node:path';
import fs from 'node:fs';
import { paths } from '../core/paths';
import { subprocessPool } from './SubprocessPool';

const logger = {
  info: (...args: any[]) => console.log('[CloudService]', ...args),
  warn: (...args: any[]) => console.warn('[CloudService]', ...args),
  error: (...args: any[]) => console.error('[CloudService]', ...args),
  debug: (...args: any[]) => console.debug('[CloudService]', ...args),
};

const TIMEOUT = {
  install: 120000,
};

class CloudServiceClass {
  linksConfig: any = null;

  loadConfig() {
    if (this.linksConfig) return this.linksConfig;
    try {
      const content = fs.readFileSync(path.join(paths.data, 'links.json'), 'utf-8');
      const config = JSON.parse(content);
      this.linksConfig = config;
      return config;
    } catch (e: any) {
      logger.error('加载 links.json 失败: ' + e.message);
      return { mirrors: [], resources: {} };
    }
  }

  async list() {
    const config = this.loadConfig();
    return Object.entries(config.resources)
      .filter(([, r]: any) => r.category !== '版本' && r.category !== '工具箱')
      .map(([name, r]: any) => ({
        name,
        ...r,
        localVersion: this.getLocalVersion(name),
      }));
  }

  async listByCategory() {
    const all = await this.list();
    const grouped: any = {};
    for (const r of all) {
      if (!grouped[r.category]) grouped[r.category] = [];
      grouped[r.category].push(r);
    }
    return grouped;
  }

  async download(name: string, onProgress?: (p: number) => void) {
    const config = this.loadConfig();
    const res = config.resources[name];
    if (!res) {
      throw new Error('未知资源: ' + name);
    }
    const urls = config.mirrors.map((m: string) => `${m}${res.filename}`);
    if (urls.length === 0) {
      throw new Error('无可用镜像');
    }
    const outputDir = res.extractTo ? path.join(paths.resources, res.extractTo) : paths.cache;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    logger.info('下载资源: ' + name + ' → ' + outputDir + '/' + res.filename);
    const aria2cPath = path.join(paths.bin, 'aria2c.exe');
    const args = [
      '--uri-selector=adaptive',
      '--console-log-level=notice',
      '--summary-interval=0',
      '--check-certificate=false',
      '--max-connection-per-server=8',
      '--split=8',
      '--continue=false',
      '--allow-overwrite=true',
      '--lowest-speed-limit=1M',
      '--user-agent=pan.baidu.com',
      '--dir=' + outputDir,
      '--out=' + res.filename,
      ...urls,
    ];
    await subprocessPool.spawn({
      cmd: aria2cPath,
      args,
      encoding: 'utf-8',
      timeout: TIMEOUT.install,
      cwd: paths.bin,
      onStdout: (line: string) => {
        const m = line.match(/\((\d+)%\)/);
        if (m && onProgress) onProgress(Number(m[1]));
      },
    });
    if (res.extract) {
      const zipPath = path.join(outputDir, res.filename);
      const extractTo = path.join(paths.resources, res.extractTo ?? '');
      if (!fs.existsSync(extractTo)) {
        fs.mkdirSync(extractTo, { recursive: true });
      }
      logger.info('解压: ' + zipPath + ' → ' + extractTo);
      await subprocessPool.spawn({
        cmd: path.join(paths.bin, '7z.exe'),
        args: ['x', zipPath, '-o' + extractTo, '-aoa'],
        encoding: 'utf-8',
        timeout: TIMEOUT.install,
        cwd: paths.bin,
        onStdout: (line: string) => logger.debug('7z: ' + line),
      });
    }
    logger.info('资源 ' + name + ' 处理完成');
  }

  async downloadMultiple(names: string[], onProgress?: (name: string, p: number) => void) {
    for (const name of names) {
      await this.download(name, (p) => onProgress?.(name, p));
    }
  }

  getLocalVersion(name: string) {
    try {
      const content = fs.readFileSync(path.join(paths.data, 'resversion.json'), 'utf-8');
      const versions = JSON.parse(content);
      return versions[name];
    } catch {
      return undefined;
    }
  }

  async checkUpdates() {
    const local = await this.list();
    const cloudVersions: any = {};
    try {
      const config = this.loadConfig();
      const urls = config.mirrors.map((m: string) => `${m}resversion.txt`);
      const tmpDir = paths.cache;
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      const aria2cPath = path.join(paths.bin, 'aria2c.exe');
      await subprocessPool.spawn({
        cmd: aria2cPath,
        args: [
          '--uri-selector=adaptive',
          '--console-log-level=notice',
          '--summary-interval=0',
          '--check-certificate=false',
          '--max-connection-per-server=8',
          '--split=8',
          '--continue=false',
          '--allow-overwrite=true',
          '--lowest-speed-limit=1M',
          '--user-agent=pan.baidu.com',
          '--dir=' + tmpDir,
          '--out=resversion.txt',
          ...urls,
        ],
        encoding: 'utf-8',
        timeout: TIMEOUT.install,
        cwd: paths.bin,
      });
      const content = fs.readFileSync(path.join(tmpDir, 'resversion.txt'), 'utf-8');
      for (const line of content.split('\n')) {
        const m = line.match(/^(\S+?)=(.+)$/);
        if (m) {
          cloudVersions[m[1]] = m[2].trim();
        }
      }
    } catch (e: any) {
      logger.warn('拉取云端版本失败: ' + e.message);
    }
    return local.map((r: any) => ({
      resource: { ...r, cloudVersion: cloudVersions[r.name] },
      updateAvailable: Boolean(cloudVersions[r.name] && cloudVersions[r.name] !== r.localVersion),
    }));
  }
}

export const cloudService = new CloudServiceClass();
export default cloudService;
