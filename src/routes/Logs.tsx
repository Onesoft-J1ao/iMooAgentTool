import { useEffect, useRef, useState } from 'react';
import { Terminal, Trash2, Copy, Filter, Search, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { useLogStore } from '@/stores/logStore';
import type { LogLevel, LogEntry } from '@shared/types';

const levelColors: Record<LogLevel, string> = {
  debug: 'text-slate-400',
  info: 'text-blue-400',
  warn: 'text-yellow-400',
  error: 'text-red-400',
};

const levelBg: Record<LogLevel, string> = {
  debug: 'hover:bg-slate-800/30',
  info: 'hover:bg-blue-900/20',
  warn: 'hover:bg-yellow-900/20',
  error: 'hover:bg-red-900/20',
};

export default function Logs() {
  const { logs, addLog, clearLogs, subscribed, setSubscribed } = useLogStore();
  const [filterLevel, setFilterLevel] = useState<LogLevel | 'all'>('all');
  const [searchText, setSearchText] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!subscribed) {
      api.log.subscribe().then(() => setSubscribed(true)).catch(console.error);
    }

    const unsub = api.log.onLine((entry: LogEntry) => {
      addLog(entry);
    });

    return () => {
      unsub();
    };
  }, [subscribed, setSubscribed, addLog]);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter((entry) => {
    if (filterLevel !== 'all' && entry.level !== filterLevel) return false;
    if (searchText && !entry.message.toLowerCase().includes(searchText.toLowerCase()) &&
        !entry.source.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const handleCopy = () => {
    const text = filteredLogs
      .map((e) => `[${new Date(e.ts).toISOString()}] [${e.level.toUpperCase()}] [${e.source}] ${e.message}`)
      .join('\n');
    navigator.clipboard.writeText(text).catch(console.error);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-6 h-6 text-blue-400" />
          日志查看器
        </h1>
        <span className="text-xs text-slate-500">{logs.length} 条记录</span>
      </div>

      <div className="flex items-center gap-2 mb-4 shrink-0 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
          {(['all', 'debug', 'info', 'warn', 'error'] as const).map((level) => (
            <button key={level} onClick={() => setFilterLevel(level)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterLevel === level ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}>
              {level.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input className="input pl-8 py-1.5 text-xs" placeholder="搜索日志..." value={searchText}
            onChange={(e) => setSearchText(e.target.value)} />
        </div>

        <label className="flex items-center gap-1.5 text-xs text-slate-400">
          <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)}
            className="rounded bg-slate-700 border-slate-500 w-3.5 h-3.5" />
          自动滚动
        </label>

        <button onClick={handleCopy} className="btn-secondary text-xs px-2 py-1.5 flex items-center gap-1">
          <Copy className="w-3.5 h-3.5" /> 复制
        </button>
        <button onClick={clearLogs} className="btn-danger text-xs px-2 py-1.5 flex items-center gap-1">
          <Trash2 className="w-3.5 h-3.5" /> 清除
        </button>
      </div>

      <div className="flex-1 card p-0 overflow-hidden flex flex-col min-h-0">
        <div className="grid grid-cols-[auto_auto_1fr] gap-2 px-4 py-2 text-xs font-medium text-slate-500 bg-slate-800/80 border-b border-slate-700/50 shrink-0">
          <span className="w-20">时间</span>
          <span className="w-12">级别</span>
          <span>消息</span>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500">
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              等待日志...
            </div>
          ) : (
            filteredLogs.map((entry, i) => (
              <div key={i}
                className={`grid grid-cols-[auto_auto_1fr] gap-2 px-4 py-1.5 ${levelBg[entry.level]} transition-colors`}>
                <span className="w-20 text-slate-500 shrink-0">
                  {new Date(entry.ts).toLocaleTimeString()}
                </span>
                <span className={`w-12 shrink-0 font-semibold ${levelColors[entry.level]}`}>
                  {entry.level.toUpperCase()}
                </span>
                <span className="text-slate-300 truncate min-w-0">
                  <span className="text-slate-600">[{entry.source}]</span> {entry.message}
                </span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
