import { useState, useEffect, useCallback } from 'react';
import { Minus, Maximize, Minimize, X } from 'lucide-react';
import { api } from '@/lib/api';

interface TitleBarProps {
  title?: string;
}

export function TitleBar({ title = 'iMooAgentTool' }: TitleBarProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    api.system.windowIsMaximized().then(setIsMaximized).catch(() => {});
    const unsub = api.system.onWindowState((maximized) => setIsMaximized(maximized));
    return () => unsub();
  }, []);

  const handleMinimize = useCallback(() => api.system.windowMinimize(), []);
  const handleToggleMaximize = useCallback(() => api.system.windowToggleMaximize(), []);
  const handleClose = useCallback(() => api.system.windowClose(), []);

  return (
    <div className="flex items-center h-10 bg-slate-900/95 border-b border-slate-700/50 select-none" style={{ WebkitAppRegion: 'drag' as unknown as string }}>
      <div className="flex items-center gap-2 px-4 flex-1" style={{ WebkitAppRegion: 'drag' as unknown as string }}>
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span className="text-sm font-semibold text-slate-300 tracking-wide">{title}</span>
      </div>
      <div className="flex h-full" style={{ WebkitAppRegion: 'no-drag' as unknown as string }}>
        <button
          onClick={handleMinimize}
          className="h-full px-4 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={handleToggleMaximize}
          className="h-full px-4 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
        >
          {isMaximized ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
        <button
          onClick={handleClose}
          className="h-full px-4 text-slate-400 hover:text-white hover:bg-red-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
