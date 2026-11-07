import path from 'node:path';
import fs from 'node:fs';
import { paths } from '../core/paths';
import { subprocessPool } from '../services/SubprocessPool';

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
  const outFilename = path.basename(new URL(url).pathname);
  const dest = path.join(destDir, outFilename);
  const aria2c = paths.aria2c();
  if (!fs.existsSync(aria2c)) {
    throw new Error('aria2c.exe 不存在: ' + aria2c);
  }

  const progress: DownloadProgress = { total: 0, completed: 0, speed: '0', percent: 0 };
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

  for await (const line of subprocessPool.spawnStreaming({
    cmd: aria2c,
    args,
    taskId,
    encoding: 'utf-8',
  })) {
    const progressMatch = line.match(/\((\d+)%\)/);
    const dlMatch = line.match(/DL:([\d.]+[KMG]?i?B)\s/);
    if (!progressMatch) continue;
    progress.percent = parseInt(progressMatch[1], 10);
    if (dlMatch) progress.speed = dlMatch[1];
    onProgress?.(progress);
  }

  if (!fs.existsSync(dest)) {
    throw new Error('下载完成后文件不存在: ' + dest);
  }
  return dest;
}
