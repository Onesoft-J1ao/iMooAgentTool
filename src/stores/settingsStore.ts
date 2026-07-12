import { create } from 'zustand';
import type { AppSettings } from '@shared/types';
import { DEFAULT_SETTINGS } from '@shared/types';
import { api } from '@/lib/api';

interface SettingsState {
  settings: AppSettings;
  loaded: boolean;
  load: () => Promise<void>;
  update: (partial: Partial<AppSettings>) => Promise<void>;
  reset: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },
  loaded: false,
  load: async () => {
    try {
      const result = await api.system.getSettings() as any;
      if (result && result.error) {
        set({ settings: { ...DEFAULT_SETTINGS }, loaded: true });
        return;
      }
      set({ settings: result as AppSettings, loaded: true });
    } catch {
      set({ settings: { ...DEFAULT_SETTINGS }, loaded: true });
    }
  },
  update: async (partial) => {
    const current = get().settings;
    const merged = { ...current, ...partial };
    try {
      const result = await api.system.setSettings(partial) as any;
      if (result && result.error) {
        set({ settings: merged });
        return;
      }
      set({ settings: result as AppSettings });
    } catch {
      set({ settings: merged });
    }
  },
  reset: async () => {
    try {
      const result = await api.system.setSettings({ ...DEFAULT_SETTINGS }) as any;
      if (result && result.error) {
        set({ settings: { ...DEFAULT_SETTINGS } });
        return;
      }
      set({ settings: result as AppSettings });
    } catch {
      set({ settings: { ...DEFAULT_SETTINGS } });
    }
  },
}));
