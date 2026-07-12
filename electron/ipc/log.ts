import { ipcMain, BrowserWindow } from 'electron';
import { EventEmitter } from 'node:events';
import { wrap } from '../lib/ipcHelper';
import logger from '../services/Logger';
import type { LogEntry } from "../../shared/types";

const logBus = new EventEmitter();

const origDebug = logger.debug.bind(logger);
const origInfo = logger.info.bind(logger);
const origWarn = logger.warn.bind(logger);
const origError = logger.error.bind(logger);

logger.debug = (source: string, message: string) => {
  origDebug(source, message);
  logBus.emit('line', { ts: Date.now(), level: 'debug', source, message } satisfies LogEntry);
};
logger.info = (source: string, message: string) => {
  origInfo(source, message);
  logBus.emit('line', { ts: Date.now(), level: 'info', source, message } satisfies LogEntry);
};
logger.warn = (source: string, message: string) => {
  origWarn(source, message);
  logBus.emit('line', { ts: Date.now(), level: 'warn', source, message } satisfies LogEntry);
};
logger.error = (source: string, message: string, stack?: string) => {
  origError(source, message, stack);
  logBus.emit('line', { ts: Date.now(), level: 'error', source, message, raw: stack } satisfies LogEntry);
};

export function registerLogIpc() {
  const subscriptions = new Set<string>();

  ipcMain.handle(
    'log:subscribe',
    wrap(async (event) => {
      const id = `${event.sender.id}`;
      if (subscriptions.has(id)) return;
      subscriptions.add(id);

      const win = BrowserWindow.fromWebContents(event.sender);
      const sendLog = (entry: LogEntry) => {
        if (win && !win.isDestroyed()) {
          win.webContents.send('log:line', entry);
        }
      };

      logBus.on('line', sendLog);

      event.sender.on('destroyed', () => {
        subscriptions.delete(id);
        logBus.off('line', sendLog);
      });
    })
  );

  ipcMain.handle(
    'log:unsubscribe',
    wrap(async (event) => {
      subscriptions.delete(`${event.sender.id}`);
    })
  );
}
