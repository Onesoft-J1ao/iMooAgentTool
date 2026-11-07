import { execFile } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { BrowserWindow } from 'electron';
import { paths } from '../core/paths';
import { checkIsV3 } from '../../shared/isv3';
import type { DeviceInfo, DeviceType } from '../../shared/types';

const MODEL_MAP: Record<string, { model: string; platform: string }> = {
  I25:  { model: 'Z7',     platform: 'otherpass' },
  I25C: { model: 'Z7-C',   platform: 'otherpass' },
  I25D: { model: 'Z7-D',   platform: 'otherpass' },
  I20:  { model: 'Z7-3G',  platform: 'otherpass' },
  I32:  { model: 'Z8',     platform: 'otherpass' },
  I33:  { model: 'Z8-Pro', platform: 'otherpass' },
  ND01: { model: 'Z9',     platform: 'v3pash' },
  ND03: { model: 'Z10',    platform: 'z10' },
  ND07: { model: 'Z10',    platform: 'z10' },
  ND08: { model: 'Z11',    platform: 'z10' },
  ND09: { model: 'Z11',    platform: 'z10' },
  I13:  { model: 'Z6',     platform: 'otherpass' },
  I13C: { model: 'Z6-C',   platform: 'otherpass' },
  I19:  { model: 'Z5',     platform: 'otherpass' },
};

const TIMEOUTS = { device: 10000 };

function spawnTool(cmd: string, args: string[], timeout = TIMEOUTS.device): Promise<{ stdout: string; stderr: string; code: number | null }> {
  return new Promise((resolve, reject) => {
    const proc = execFile(cmd, args, { cwd: paths.bin, timeout, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      if (err && (err as any).code !== undefined) {
        resolve({ stdout, stderr, code: (err as any).code ?? 1 });
        return;
      }
      resolve({ stdout, stderr, code: 0 });
    });
  });
}

function resolveTool(name: string): string | null {
  const isWin = process.platform === 'win32';
  const exe = isWin ? `${name}.exe` : name;
  const p = path.join(paths.bin, exe);
  if (fs.existsSync(p)) return p;
  return isWin ? null : name;
}

export class DeviceService {
  private static _instance: DeviceService;
  private _running = false;
  private currentInfo: DeviceInfo | null = null;
  private listeners = new Set<(info: DeviceInfo | null) => void>();
  private fallbackTimer: NodeJS.Timeout | null = null;
  private debounceTimer: NodeJS.Timeout | null = null;
  private detecting = false;
  private lastNotify = '';

  static get instance(): DeviceService {
    if (!DeviceService._instance) {
      DeviceService._instance = new DeviceService();
    }
    return DeviceService._instance;
  }

  getCurrentDevice(): DeviceInfo | null {
    return this.currentInfo;
  }

  onDeviceChange(cb: (info: DeviceInfo | null) => void): () => void {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  }

  async waitFor(types: DeviceType[], timeout = 60000): Promise<DeviceInfo> {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const check = () => {
        const info = this.currentInfo;
        if (info && types.includes(info.type)) {
          resolve(info);
          return;
        }
        if (Date.now() - start > timeout) {
          reject(new Error(`等待设备超时(${timeout}ms)`));
          return;
        }
        setTimeout(check, 500);
      };
      check();
    });
  }

  start(): void {
    if (this._running) return;
    this._running = true;
    setImmediate(() => this.detectAndUpdate());
    this.fallbackTimer = setInterval(() => this.detectAndUpdate(), 10000);
  }

  stop(): void {
    this._running = false;
    if (this.fallbackTimer) { clearInterval(this.fallbackTimer); this.fallbackTimer = null; }
    if (this.debounceTimer) { clearTimeout(this.debounceTimer); this.debounceTimer = null; }
  }

  private scheduleDetect(delay: number) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null;
      this.detectAndUpdate();
    }, delay);
  }

  private async detectAndUpdate() {
    if (this.detecting) return;
    this.detecting = true;
    try {
      const info = await this.detectOnce();
      this.update(info);
    } catch { /* ignore */ } finally {
      this.detecting = false;
    }
  }

  private async detectOnce(): Promise<DeviceInfo | null> {
    const adbInfo = await this.detectAdb();
    if (adbInfo) return adbInfo;
    const fbInfo = await this.detectFastboot();
    if (fbInfo) return fbInfo;
    const edlInfo = await this.detectEdl();
    if (edlInfo) return edlInfo;
    return null;
  }

  private async detectAdb(): Promise<DeviceInfo | null> {
    const adb = resolveTool('adb');
    if (!adb) return null;
    try {
      const result = await spawnTool(adb, ['devices']);
      const lines = result.stdout.split('\n').slice(1).map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        const m = line.match(/^(\S+)\s+(\S+)$/);
        if (!m) continue;
        const [, serial, state] = m;
        let type: DeviceType;
        if (serial.startsWith('emulator-')) type = 'emulator';
        else if (state === 'unauthorized') type = 'unauthorized';
        else if (state === 'offline') type = 'offline';
        else if (state === 'device') type = 'adb';
        else continue;
        const info: DeviceInfo = { type, serial, connectedAt: Date.now() };
        if (type === 'adb') await this.fillAdbProps(info, adb);
        return info;
      }
    } catch { /* ignore */ }
    return null;
  }

  private async fillAdbProps(info: DeviceInfo, adbPath: string) {
    try {
      const props = [
        'ro.product.innermodel', 'ro.product.model', 'ro.build.version.release',
        'ro.build.version.sdk', 'ro.product.current.softversion', 'ro.product.cpu.abi',
        'ro.sf.lcd_density', 'ro.build.id', 'ro.build.date',
      ];
      const result = await spawnTool(adbPath, ['shell', 'getprop']);
      const map: Record<string, string> = {};
      for (const line of result.stdout.split('\n')) {
        const m = line.match(/^\[([^\]]+)\]:\s*\[([^\]]*)\]/);
        if (m) map[m[1]] = m[2];
      }
      if (!map['ro.product.innermodel'] && !map['ro.product.model']) {
        for (const p of props) {
          try {
            const fb = await spawnTool(adbPath, ['shell', 'getprop', p]);
            const val = fb.stdout.trim();
            if (val) map[p] = val;
          } catch { /* skip */ }
        }
      }
      info.innermodel = map['ro.product.innermodel'] || undefined;
      info.model = map['ro.product.model'] || undefined;
      info.androidVersion = map['ro.build.version.release'] || undefined;
      info.sdkVersion = map['ro.build.version.sdk'] || undefined;
      info.softVersion = map['ro.product.current.softversion'] || undefined;
      info.cpuAbi = map['ro.product.cpu.abi'] || undefined;
      info.density = map['ro.sf.lcd_density'] || undefined;
      info.buildId = map['ro.build.id'] || undefined;
      info.buildDate = map['ro.build.date'] || undefined;
      if (info.innermodel && info.softVersion) {
        info.isV3 = checkIsV3(info.innermodel, info.softVersion);
        info.innermodelName = MODEL_MAP[info.innermodel]?.model;
        info.platform = (MODEL_MAP[info.innermodel]?.platform as any) || undefined;
      }
    } catch { /* ignore */ }
    try {
      const batResult = await spawnTool(adbPath, ['shell', 'dumpsys', 'battery']);
      const levelMatch = batResult.stdout.match(/level:\s*(\d+)/i);
      if (levelMatch) info.batteryLevel = parseInt(levelMatch[1], 10);
    } catch { /* ignore */ }
    try {
      const dfResult = await spawnTool(adbPath, ['shell', 'df', '/sdcard']);
      const lines = dfResult.stdout.split('\n').filter(l => l.trim());
      if (lines.length >= 2) {
        const parts = lines[lines.length - 1].split(/\s+/);
        if (parts.length >= 4) {
          const totalKb = parseInt(parts[1], 10);
          const availKb = parseInt(parts[3], 10);
          if (!isNaN(totalKb)) info.storageTotal = totalKb * 1024;
          if (!isNaN(availKb)) info.storageAvailable = availKb * 1024;
        }
      }
    } catch { /* ignore */ }
  }

  private async detectFastboot(): Promise<DeviceInfo | null> {
    const fb = resolveTool('fastboot');
    if (!fb) return null;
    try {
      const result = await spawnTool(fb, ['devices']);
      for (const line of result.stdout.split('\n').map(l => l.trim()).filter(Boolean)) {
        const m = line.match(/^(\S+)\s+fastboot/);
        if (m) return { type: 'fastboot', serial: m[1], connectedAt: Date.now() };
      }
    } catch { /* ignore */ }
    return null;
  }

  private async detectEdl(): Promise<DeviceInfo | null> {
    const lsusb = resolveTool('lsusb');
    if (!lsusb) return null;
    try {
      const result = await spawnTool(lsusb, []);
      for (const line of result.stdout.split('\n')) {
        if (line.includes('Qualcomm HS-USB QDLoader 9008')) {
          const portMatch = line.match(/COM(\d+)/i);
          const port = portMatch ? `COM${portMatch[1]}` : undefined;
          return { type: 'qcom_edl', serial: '9008', port, connectedAt: Date.now() };
        }
      }
    } catch { /* ignore */ }
    return null;
  }

  private update(info: DeviceInfo | null) {
    const key = info ? `${info.type}:${info.serial}:${info.port ?? ''}` : 'none';
    if (key === this.lastNotify) return;
    this.lastNotify = key;
    this.currentInfo = info;
    for (const cb of this.listeners) {
      try { cb(info); } catch { /* ignore */ }
    }
    for (const w of BrowserWindow.getAllWindows()) {
      if (!w.isDestroyed()) {
        w.webContents.send('device:change', info);
      }
    }
  }
}
