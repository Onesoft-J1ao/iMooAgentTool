import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useDeviceStore } from '@/stores/deviceStore';

export function useDevice() {
  const currentDevice = useDeviceStore((s) => s.currentDevice);
  const setDevice = useDeviceStore((s) => s.setDevice);

  useEffect(() => {
    api.device.current().then(setDevice).catch(() => setDevice(null));
    const unsub = api.device.onChange((info) => setDevice(info));
    return () => unsub();
  }, [setDevice]);

  return currentDevice;
}
