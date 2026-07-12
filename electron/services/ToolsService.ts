import path from 'node:path';
import { adbService } from './AdbService';
import { driverService } from './DriverService';
import { otaService } from './OtaService';
import { rootProService } from './RootProService';
import { atbmodService } from './AtbmodService';
import { updateService } from './UpdateService';
import { paths } from '../core/paths';
import type { DriverStatus } from './DriverService';
import type { AtbModule } from './AtbmodService';
import type { UpdateInfo } from "../../shared/types";

class ToolsService {
  async openCharge(serial: string): Promise<string> {
    return adbService.shell(serial, 'svc power stayon true');
  }

  async readBuildProps(serial: string): Promise<string> {
    return adbService.shell(serial, 'getprop');
  }

  async wifiEnable(serial: string): Promise<string> {
    return adbService.shell(serial, 'svc wifi enable');
  }

  async wifiConnect(serial: string, ssid: string, password: string): Promise<string> {
    return adbService.shell(
      serial,
      `am start -a android.intent.action.MAIN -e ssid "${ssid}" -e password "${password}" --ez connect true`
    );
  }

  async otaStart(serial: string, zipPath: string): Promise<void> {
    return otaService.flashOfflineOta(serial, zipPath);
  }

  async rootPro(serial: string): Promise<void> {
    return rootProService.optimize(serial);
  }

  async checkDrivers(): Promise<DriverStatus> {
    return driverService.checkAll();
  }

  async installDrivers(): Promise<void> {
    await driverService.installQualcommDriver();
    await driverService.installAdbDriver();
    await driverService.installVcRuntime();
  }

  async atbmodScan(serial: string): Promise<AtbModule[]> {
    return atbmodService.scan(path.join(paths.resources, 'modules'));
  }

  async atbmodInstall(serial: string, file: string): Promise<void> {
    return atbmodService.install(serial, file);
  }

  async atbmodList(serial: string): Promise<AtbModule[]> {
    return atbmodService.list(serial);
  }

  async atbmodUninstall(serial: string, modid: string): Promise<void> {
    return atbmodService.uninstall(serial, modid);
  }

  async checkAppUpdate(): Promise<UpdateInfo> {
    return updateService.checkForUpdate();
  }
}

export const toolsService = new ToolsService();
export default toolsService;
