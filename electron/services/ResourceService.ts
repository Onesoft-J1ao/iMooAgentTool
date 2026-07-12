import crypto from 'node:crypto';
import fs from 'fs';
import path from 'node:path';
import type { ManifestEntry, VerifyResult } from "../../shared/types";
import logger from './Logger';

const SRC = 'ResourceService';

class ResourceService {
  verify(manifestPath: string, resourceDir: string): VerifyResult[] {
    const results: VerifyResult[] = [];

    if (!fs.existsSync(manifestPath)) {
      logger.error(SRC, `Manifest not found: ${manifestPath}`);
      return results;
    }

    let manifest: ManifestEntry[];
    try {
      const raw = fs.readFileSync(manifestPath, 'utf-8');
      manifest = JSON.parse(raw);
      if (!Array.isArray(manifest)) {
        manifest = manifest.files || manifest.entries || [];
      }
    } catch (err: any) {
      logger.error(SRC, `Failed to parse manifest: ${err.message}`);
      return results;
    }

    for (const entry of manifest) {
      const filePath = path.join(resourceDir, entry.file);
      const result: VerifyResult = {
        file: entry.file,
        ok: false,
        expected: entry.md5,
        actual: '',
        missing: false,
      };

      if (!fs.existsSync(filePath)) {
        result.missing = true;
        result.actual = 'FILE_NOT_FOUND';
        results.push(result);
        continue;
      }

      try {
        const fileBuffer = fs.readFileSync(filePath);
        const hash = crypto.createHash('md5').update(fileBuffer).digest('hex');
        result.actual = hash;
        result.ok = hash.toLowerCase() === entry.md5.toLowerCase();
      } catch (err: any) {
        result.actual = `ERROR: ${err.message}`;
      }

      results.push(result);
    }

    const okCount = results.filter(r => r.ok).length;
    logger.info(SRC, `Verified ${results.length} resources: ${okCount} OK, ${results.length - okCount} failed`);

    return results;
  }

  verifySingle(filePath: string, expectedMd5: string): boolean {
    if (!fs.existsSync(filePath)) return false;

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const hash = crypto.createHash('md5').update(fileBuffer).digest('hex');
      return hash.toLowerCase() === expectedMd5.toLowerCase();
    } catch {
      return false;
    }
  }

  md5(filePath: string): string | null {
    if (!fs.existsSync(filePath)) return null;
    try {
      const fileBuffer = fs.readFileSync(filePath);
      return crypto.createHash('md5').update(fileBuffer).digest('hex');
    } catch {
      return null;
    }
  }
}

export const resourceService = new ResourceService();
export default resourceService;
