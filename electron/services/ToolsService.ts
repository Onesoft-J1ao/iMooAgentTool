import path from 'node:path';
import fs from 'node:fs';
import { paths } from '../core/paths';
import { adbService } from './AdbService';
import { driverService } from './DriverService';
import { otaService } from './OtaService';
import { rootProService } from './RootProService';
import { atbmodService } from './AtbmodService';
import { updateService } from './UpdateService';
import type { UpdateInfo } from '../../shared/types';

class ToolsService {
  async openCharge(serial: string): Promise<string> {
    return adbService.shell(serial, 'svc power stayon true');
  }

  async readBuildProps(serial: string): Promise<string> {
    return adbService.shell(serial, 'getprop');
  }

  async wifiEnable(serial: string): Promise<string> {
    await adbService.shell(serial, 'svc wifi enable');
    return adbService.tcpip(serial, 5555);
  }

  async wifiConnect(host: string, port = 5555): Promise<string> {
    return adbService.connect(host, port);
  }

  async otaStart(serial: string, zipPath: string) {
    return otaService.start({ serial, zipPath });
  }

  async rootPro(serial: string) {
    return rootProService.run({ serial });
  }

  async checkDrivers() {
    return driverService.check();
  }

  async installDrivers() {
    return driverService.installDrivers();
  }

  async atbmodScan(serial: string) {
    return atbmodService.scan();
  }

  async atbmodInstall(serial: string, file: string) {
    return atbmodService.install(file, serial);
  }

  async atbmodList(serial: string) {
    return atbmodService.listInstalled();
  }

  async atbmodUninstall(serial: string, modid: string) {
    return atbmodService.uninstall(modid, serial);
  }

  async checkAppUpdate(): Promise<UpdateInfo> {
    return updateService.checkForUpdate();
  }
}

export const toolsService = new ToolsService();
export default toolsService;
