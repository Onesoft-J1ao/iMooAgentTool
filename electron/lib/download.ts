import path from 'node:path';
import { paths } from '../core/paths';
import { subprocessPool } from '../services/SubprocessPool';
import logger from '../services/Logger';

export interface DownloadProgress {
  total: number;
  completed: number;
  speed: string;
  percent: number;
}

export async function downloadWithAria2(
  url: string,
  destDir: string,
  onProgress?: (p: DownloadProgress) => void,
  taskId?: string
): Promise<string> {
  const aria2c = paths.aria2c();
  const outFilename = path.basename(new URL(url).pathname);
  const dest = path.join(destDir, outFilename);

  let lastProgress: DownloadProgress = { total: 0, completed: 0, speed: '0', percent: 0 };

  const args = [
    '--dir', destDir,
    '--out', outFilename,
    '--continue', 'true',
    '--max-connection-per-server', '16',
    '--split', '16',
    '--console-log-level', 'error',
    '--summary-interval', '0',
    '--human-readable', 'true',
    url,
  ];

  try {
    for await (const line of subprocessPool.spawnStreaming(aria2c, args, { taskId })) {
      const progressMatch = line.match(/\((\d+)%\)/);
      const dlMatch = line.match(/DL:([\d.]+[KMG]?i?B)\s/);
      if (progressMatch) {
        lastProgress.percent = parseInt(progressMatch[1], 10);
        if (dlMatch) lastProgress.speed = dlMatch[1];
        onProgress?.(lastProgress);
      }
    }
  } catch (err: any) {
    const isFileExists = err.message?.includes('aria2') || (await Bun?.file?.(dest)?.exists?.());
    if (!isFileExists) throw err;
  }

  return dest;
}
