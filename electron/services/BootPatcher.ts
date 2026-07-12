import fs from 'node:fs';

const logger = {
  info: (...args: any[]) => console.log('[BootPatcher]', ...args),
  error: (...args: any[]) => console.error('[BootPatcher]', ...args),
};

class BootPatcherClass {
  patch(kernelPath: string) {
    const patches: string[] = [];
    try {
      if (!fs.existsSync(kernelPath)) {
        logger.error('kernel 文件不存在: ' + kernelPath);
        return { success: false, patches: [], error: 'kernel 文件不存在: ' + kernelPath, output: 'Error' };
      }
      const buf = fs.readFileSync(kernelPath);
      let content = buf.toString('latin1');
      {
        const before = content;
        content = content.replace(/builduser=root/, 'builduser=rootbuilduser=root');
        if (content !== before) {
          patches.push('builduser=root → 追加 builduser=root(确保存在)');
        } else {
          patches.push('builduser=root 未匹配(原样保留)');
        }
      }
      {
        const before = content;
        content = content.replace(/androidboot\.selinux=enforcing/, 'androidboot.selinux=permissive');
        if (content !== before) {
          patches.push('androidboot.selinux=enforcing → permissive');
        } else {
          patches.push('androidboot.selinux= 未匹配 enforcing(原样保留)');
        }
      }
      {
        const before = content;
        content = content.replace(/buildvariant=user /, 'buildvariant=userdebug ');
        if (content !== before) {
          patches.push('buildvariant=user → buildvariant=userdebug');
        } else {
          patches.push('buildvariant=user (带尾空格) 未匹配(原样保留)');
        }
      }
      {
        const before = content;
        content = content.replace(/(buildsoftversion=[\d.]+)\s*/g, '$1');
        if (content !== before) {
          patches.push('buildsoftversion=x.y.z 后空白已移除');
        } else {
          patches.push('buildsoftversion=x.y.z 未匹配(原样保留)');
        }
      }
      const newBuf = Buffer.from(content, 'latin1');
      if (newBuf.length !== buf.length || !newBuf.equals(buf)) {
        fs.writeFileSync(kernelPath, newBuf);
        logger.info('kernel 已修补,共应用 ' + patches.length + ' 条规则');
      } else {
        logger.info('kernel 无变化(所有规则均未匹配)');
      }
      return { success: true, patches, output: 'success' };
    } catch (e: any) {
      logger.error('kernel 修补失败: ' + e.message);
      return { success: false, patches, error: e.message, output: 'Error' };
    }
  }

  async patchAsync(kernelPath: string) {
    const result = this.patch(kernelPath);
    if (!result.success || !result.output.includes('success')) {
      throw new Error('patch_boot 失败: ' + (result.error ?? result.output));
    }
    return result;
  }
}

export const bootPatcher = new BootPatcherClass();
export default bootPatcher;
