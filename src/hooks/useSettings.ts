import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';

export function useSettings() {
  const settings = useSettingsStore((s) => s.settings);
  const loaded = useSettingsStore((s) => s.loaded);
  const load = useSettingsStore((s) => s.load);
  const update = useSettingsStore((s) => s.update);
  const reset = useSettingsStore((s) => s.reset);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  return { settings, loaded, update, reset };
}
