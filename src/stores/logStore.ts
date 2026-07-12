import { create } from 'zustand';
import type { LogEntry } from '@shared/types';

interface LogState {
  logs: LogEntry[];
  subscribed: boolean;
  addLog: (entry: LogEntry) => void;
  clearLogs: () => void;
  setSubscribed: (subscribed: boolean) => void;
}

const MAX_LOGS = 5000;

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  subscribed: false,
  addLog: (entry) =>
    set((state) => ({
      logs: [...state.logs.slice(-(MAX_LOGS - 1)), entry],
    })),
  clearLogs: () => set({ logs: [] }),
  setSubscribed: (subscribed) => set({ subscribed }),
}));
