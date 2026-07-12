import { useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useLogStore } from '@/stores/logStore';

export function useLogs() {
  const logs = useLogStore((s) => s.logs);
  const subscribed = useLogStore((s) => s.subscribed);
  const addLog = useLogStore((s) => s.addLog);
  const clearLogs = useLogStore((s) => s.clearLogs);
  const setSubscribed = useLogStore((s) => s.setSubscribed);

  const subscribe = useCallback(async () => {
    if (subscribed) return;
    try {
      await api.log.subscribe();
      setSubscribed(true);
    } catch {
      // ignore
    }
  }, [subscribed, setSubscribed]);

  const unsubscribe = useCallback(async () => {
    if (!subscribed) return;
    try {
      await api.log.unsubscribe();
      setSubscribed(false);
    } catch {
      // ignore
    }
  }, [subscribed, setSubscribed]);

  useEffect(() => {
    subscribe();
    const unsub = api.log.onLine((entry) => addLog(entry));
    return () => {
      unsub();
      unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { logs, clearLogs, subscribe, unsubscribe, subscribed };
}
