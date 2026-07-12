import { config } from '../core/config';
import { resourceService } from './ResourceService';
import { paths } from '../core/paths';
import { APP_META } from "../../shared/types";
import type { AppSettings, VerifyResult } from "../../shared/types";
import path from 'node:path';

class SystemService {
  getSettings(): AppSettings {
    return config.getSettings();
  }

  setSettings(partial: Partial<AppSettings>): AppSettings {
    return config.setSettings(partial);
  }

  verifyResources(): VerifyResult[] {
    const manifestPath = path.join(paths.resources, 'manifest.json');
    return resourceService.verify(manifestPath, paths.resources);
  }

  getVersion(): string {
    return APP_META.version;
  }

  getBuildDate(): string {
    return APP_META.buildDate;
  }
}

export const systemService = new SystemService();
export default systemService;
