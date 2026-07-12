import { spawn } from 'node:child_process';
import path from 'node:path';
import { paths } from '../core/paths';
import { subprocessPool } from './SubprocessPool';
import logger from './Logger';
import { TIMEOUTS } from '../lib/timeouts';
import { decodeGbk } from '../lib/gbk';

const SRC = 'EdlService';

class EdlService {
  async loadFirehose(progPath: string, port: string): Promise<void> {
    const qsahara = paths.qsahara();
    const args = ['--tool=2', '--port=' + port, '--sahara=' + progPath];
    logger.info(SRC, `Loading firehose on ${port}`);

    try {
      for await (const _line of subprocessPool.spawnStreaming(qsahara, args, {
        timeout: TIMEOUTS.EDL_LOAD_FIREHOSE,
      })) {
      }
    } catch (err: any) {
      logger.error(SRC, `loadFirehose failed: ${err.message}`);
      throw err;
    }
  }

  async flashPartitions(
    xmlFiles: string[],
    port: string,
    onProgress?: (msg: string) => void
  ): Promise<void> {
    const fhLoader = paths.fhLoader();
    const args = [
      '--port=' + port,
      '--convertprogram2read=0',
      '--memoryname=emmc',
      '--resetafter=0',
      '--maxpayloadsizemb=2048',
      '--zlpawarehost=1',
      '--waitforprocesstimeout=5000',
      ...xmlFiles.map(x => '--xml=' + x),
    ];

    logger.info(SRC, `Flashing partitions on ${port}`);
    try {
      for await (const line of subprocessPool.spawnStreaming(fhLoader, args, {
        timeout: TIMEOUTS.EDL_FLASH,
      })) {
        onProgress?.(line);
      }
    } catch (err: any) {
      logger.error(SRC, `flashPartitions failed: ${err.message}`);
      throw err;
    }
  }

  async readPartitions(
    xmlFiles: string[],
    port: string,
    onProgress?: (msg: string) => void
  ): Promise<void> {
    const fhLoader = paths.fhLoader();
    const args = [
      '--port=' + port,
      '--convertprogram2read=1',
      '--memoryname=emmc',
      '--resetafter=0',
      '--maxpayloadsizemb=2048',
      '--zlpawarehost=1',
      '--waitforprocesstimeout=5000',
      ...xmlFiles.map(x => '--xml=' + x),
    ];

    logger.info(SRC, `Reading partitions on ${port}`);
    try {
      for await (const line of subprocessPool.spawnStreaming(fhLoader, args, {
        timeout: TIMEOUTS.EDL_READ,
      })) {
        onProgress?.(line);
      }
    } catch (err: any) {
      logger.error(SRC, `readPartitions failed: ${err.message}`);
      throw err;
    }
  }

  async reboot(port: string): Promise<void> {
    const fhLoader = paths.fhLoader();
    const args = [
      '--port=' + port,
      '--convertprogram2read=0',
      '--memoryname=emmc',
      '--resetafter=1',
      '--maxpayloadsizemb=2048',
      '--zlpawarehost=1',
      '--waitforprocesstimeout=5000',
    ];

    try {
      for await (const _line of subprocessPool.spawnStreaming(fhLoader, args, {
        timeout: TIMEOUTS.EDL_REBOOT,
      })) {
      }
    } catch (err: any) {
      logger.error(SRC, `EDL reboot failed: ${err.message}`);
      throw err;
    }
  }

  findPort(): Promise<string | null> {
    return new Promise((resolve) => {
      try {
        const proc = spawn('wmic', [
          'path', 'Win32_PnPEntity', 'get', 'Name', '/format:list',
        ], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });

        let output = '';
        proc.stdout.on('data', (data: Buffer) => {
          output += decodeGbk(data);
        });

        proc.on('close', () => {
          if (output.includes('QDLoader') || output.includes('Qualcomm') || output.includes('9008')) {
            const match = output.match(/COM(\d+)/);
            resolve(match ? `COM${match[1]}` : null);
          } else {
            resolve(null);
          }
        });
        proc.on('error', () => resolve(null));
      } catch {
        resolve(null);
      }
    });
  }

  async waitForEdl(timeout: number = TIMEOUTS.EDL_WAIT): Promise<string> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const port = await this.findPort();
      if (port) return port;
      await new Promise(r => setTimeout(r, 1000));
    }
    throw new Error('Timeout waiting for EDL device');
  }

  async backup9008(
    xmlFiles: string[],
    backupDir: string,
    port: string,
    onProgress?: (msg: string) => void
  ): Promise<string> {
    await this.readPartitions(xmlFiles, port, onProgress);
    const sevenZip = paths.sevenZip();
    const archiveName = `edl_backup_${Date.now()}.7z`;
    const archivePath = path.join(backupDir, archiveName);

    const args = ['a', '-t7z', '-mx=5', archivePath, ...xmlFiles.map(x => path.dirname(x))];
    try {
      for await (const line of subprocessPool.spawnStreaming(sevenZip, args, {
        timeout: TIMEOUTS.BACKUP_EDL,
      })) {
        onProgress?.(line);
      }
    } catch (err: any) {
      logger.error(SRC, `Backup compression failed: ${err.message}`);
      throw err;
    }

    return archivePath;
  }

  async recover9008(
    archivePath: string,
    xmlFiles: string[],
    port: string,
    onProgress?: (msg: string) => void
  ): Promise<void> {
    const sevenZip = paths.sevenZip();
    const extractDir = path.dirname(xmlFiles[0]);

    const args = ['x', archivePath, '-o' + extractDir, '-y'];
    try {
      for await (const line of subprocessPool.spawnStreaming(sevenZip, args, {
        timeout: TIMEOUTS.RECOVERY_EDL,
      })) {
        onProgress?.(line);
      }
    } catch (err: any) {
      logger.error(SRC, `Recovery extraction failed: ${err.message}`);
      throw err;
    }

    await this.flashPartitions(xmlFiles, port, onProgress);
  }

  async superRecovery(
    xmlSets: string[][],
    port: string,
    onProgress?: (msg: string) => void
  ): Promise<void> {
    for (let i = 0; i < xmlSets.length; i++) {
      onProgress?.(`Super recovery stage ${i + 1}/${xmlSets.length}`);
      await this.flashPartitions(xmlSets[i], port, onProgress);
    }
  }

  async flashTwrp(twrpImg: string, port: string): Promise<void> {
    const xmlDir = path.dirname(twrpImg);
    const rawprogram = path.join(xmlDir, 'rawprogram0.xml');
    const patch = path.join(xmlDir, 'patch0.xml');

    const xmls: string[] = [];
    if (require('fs').existsSync(rawprogram)) xmls.push(rawprogram);
    if (require('fs').existsSync(patch)) xmls.push(patch);

    if (xmls.length === 0) {
      throw new Error('No XML files found for TWRP flash');
    }

    await this.loadFirehose(xmls[0], port);
    await this.flashPartitions(xmls, port);
  }

  async flashMisc(miscImg: string, port: string): Promise<void> {
    const xmlDir = path.dirname(miscImg);
    const rawprogram = path.join(xmlDir, 'rawprogram0.xml');
    const patch = path.join(xmlDir, 'patch0.xml');

    const xmls: string[] = [];
    if (require('fs').existsSync(rawprogram)) xmls.push(rawprogram);
    if (require('fs').existsSync(patch)) xmls.push(patch);

    if (xmls.length === 0) {
      throw new Error('No XML files found for misc flash');
    }

    await this.loadFirehose(xmls[0], port);
    await this.flashPartitions(xmls, port);
  }
}

export const edlService = new EdlService();
export default edlService;
