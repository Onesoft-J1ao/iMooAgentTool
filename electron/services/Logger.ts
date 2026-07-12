type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  private static _instance: Logger;

  static get instance(): Logger {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }
    return Logger._instance;
  }

  private formatMessage(source: string, message: string): string {
    const ts = new Date().toISOString();
    return `[${ts}] [${source}] ${message}`;
  }

  debug(source: string, message: string): void {
    console.debug(this.formatMessage(source, message));
  }

  info(source: string, message: string): void {
    console.info(this.formatMessage(source, message));
  }

  warn(source: string, message: string): void {
    console.warn(this.formatMessage(source, message));
  }

  error(source: string, message: string, stack?: string): void {
    console.error(this.formatMessage(source, message));
    if (stack) {
      console.error(stack);
    }
  }
}

export default Logger.instance;
