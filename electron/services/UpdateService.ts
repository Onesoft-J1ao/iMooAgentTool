import type { UpdateInfo } from "../../shared/types";
import logger from './Logger';
import { APP_META } from "../../shared/types";

const SRC = 'UpdateService';

class UpdateService {
  async checkForUpdate(): Promise<UpdateInfo> {
    const currentVersion = APP_META.version;
    const result: UpdateInfo = {
      hasUpdate: false,
      currentVersion,
    };

    try {
      const response = await fetch(
        'https://api.github.com/repos/Onesoft-J1ao/iMooAgentTool/releases/latest',
        {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(10000),
        }
      );

      if (!response.ok) {
        result.error = `GitHub API returned ${response.status}`;
        return result;
      }

      const data = await response.json();
      const latestVersion = (data.tag_name || data.name || '')
        .replace(/^v/, '')
        .trim();

      if (!latestVersion) {
        result.error = 'Could not parse latest version';
        return result;
      }

      result.latestVersion = latestVersion;
      result.releaseNotes = data.body || '';
      result.releaseUrl = data.html_url || '';

      const currentParts = currentVersion.split('.').map(Number);
      const latestParts = latestVersion.split('.').map(Number);

      for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
        const cp = currentParts[i] || 0;
        const lp = latestParts[i] || 0;
        if (lp > cp) {
          result.hasUpdate = true;
          break;
        }
        if (lp < cp) break;
      }
    } catch (err: any) {
      result.error = err.message || 'Network error';
      logger.warn(SRC, `Update check failed: ${result.error}`);
    }

    return result;
  }
}

export const updateService = new UpdateService();
export default updateService;
