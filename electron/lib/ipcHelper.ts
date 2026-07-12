import { BrowserWindow } from 'electron';
import { DeviceService } from '../services/DeviceService';

interface WrapOptions {
  needDevice?: boolean;
  deviceTypes?: string[];
}

export function wrap<TArgs = any, TResult = any>(
  handler: (event: Electron.IpcMainInvokeEvent, args: TArgs) => TResult | Promise<TResult>,
  options: WrapOptions = {}
): (event: Electron.IpcMainInvokeEvent, args: TArgs) => Promise<TResult | { error: string }> {
  return async (event, args) => {
    try {
      if (options.needDevice) {
        const device = DeviceService.instance.getCurrentDevice();
        if (!device) {
          throw new Error('No device connected');
        }
        if (options.deviceTypes && !options.deviceTypes.includes(device.type)) {
          throw new Error(`Device type ${device.type} not supported for this operation`);
        }
      }
      return await handler(event, args);
    } catch (err: any) {
      return { error: err.message || 'Unknown error' };
    }
  };
}

export function wrapNoArgs<TResult = any>(
  handler: () => TResult | Promise<TResult>,
  options: WrapOptions = {}
): (event: Electron.IpcMainInvokeEvent) => Promise<TResult | { error: string }> {
  return async (event) => {
    try {
      if (options.needDevice) {
        const device = DeviceService.instance.getCurrentDevice();
        if (!device) {
          throw new Error('No device connected');
        }
        if (options.deviceTypes && !options.deviceTypes.includes(device.type)) {
          throw new Error(`Device type ${device.type} not supported for this operation`);
        }
      }
      return await handler();
    } catch (err: any) {
      return { error: err.message || 'Unknown error' };
    }
  };
}
