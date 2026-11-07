import Store from 'electron-store';
import type { AppSettings } from '../../shared/types';
import { DEFAULT_SETTINGS } from '../../shared/types';

interface ConfigSchema {
  settings: AppSettings;
  windowBounds?: { x: number; y: number; width: number; height: number };
  lastDeviceSerial?: string;
  windowOpacity: number;
}

const store = new Store<ConfigSchema>({
  name: 'imooagenttool-config',
  defaults: {
    settings: { ...DEFAULT_SETTINGS },
    windowBounds: { x: 0, y: 0, width: 1200, height: 800 },
    lastDeviceSerial: '',
    windowOpacity: 100,
  },
});

export const config = {
  get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return store.get(key);
  },

  set<T extends keyof ConfigSchema>(key: T, value: ConfigSchema[T]): void {
    store.set(key, value);
  },

  reset(): void {
    store.clear();
  },

  getSettings(): AppSettings {
    return { ...DEFAULT_SETTINGS, ...store.get('settings') };
  },

  setSettings(partial: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const merged: AppSettings = { ...current, ...partial };
    store.set('settings', merged);
    return merged;
  },
};
