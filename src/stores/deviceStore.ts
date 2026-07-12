import { create } from 'zustand';
import type { DeviceInfo } from '@shared/types';

interface DeviceState {
  currentDevice: DeviceInfo | null;
  isMonitoring: boolean;
  setDevice: (device: DeviceInfo | null) => void;
  startMonitoring: () => void;
  stopMonitoring: () => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  currentDevice: null,
  isMonitoring: false,
  setDevice: (device) => set({ currentDevice: device }),
  startMonitoring: () => set({ isMonitoring: true }),
  stopMonitoring: () => set({ isMonitoring: false }),
}));
