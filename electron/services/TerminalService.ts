import { spawn } from 'node:child_process';
import { paths } from '../core/paths';
import logger from './Logger';

const SRC = 'TerminalService';

class TerminalService {
  open(): void {
    const binDir = paths.bin;

    if (!binDir) {
      logger.error(SRC, 'Bin directory not configured');
      return;
    }

    logger.info(SRC, `Opening terminal in: ${binDir}`);

    try {
      const proc = spawn('cmd.exe', ['/k', `cd /d "${binDir}"`], {
        windowsHide: false,
        detached: true,
        stdio: 'ignore',
      });

      proc.unref();
    } catch (err: any) {
      logger.error(SRC, `Failed to open terminal: ${err.message}`);
    }
  }
}

export const terminalService = new TerminalService();
export default terminalService;
