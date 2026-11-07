import { useState, useEffect, useCallback } from 'react';
import {
  Shield, Play, Square, Pause, RotateCcw, Smartphone,
  ChevronDown, AlertTriangle, RefreshCw, Terminal
} from 'lucide-react';
import { api } from '@/lib/api';
import { useDeviceStore } from '@/stores/deviceStore';
import { getDisplayName, getAllModels } from '@/lib/models';
import type { RootOptions, RootContext } from '@shared/types';

const sdkBranches: { value: RootOptions['sdkBranch']; label: string }[] = [
  { value: 19, label: 'SDK 19' },
  { value: 25, label: 'SDK 25' },
  { value: 27, label: 'SDK 27' },
  { value: 'nd03', label: 'ND03' },
  { value: 'nd08', label: 'ND08' },
];

export default function Root() {
  const { currentDevice } = useDeviceStore();
  const [options, setOptions] = useState<RootOptions>({});
  const [taskId, setTaskId] = useState<string | null>(null);
  const [context, setContext] = useState<RootContext | null>(null);
  const [running, setRunning] = useState(false);
  const [showModels, setShowModels] = useState(false);

  useEffect(() => {
    if (currentDevice?.innermodel) {
      setOptions(prev => ({ ...prev, innermodel: currentDevice.innermodel }));
    }
  }, [currentDevice]);

  useEffect(() => {
    const unsub = api.root.onStageChange((ctx) => {
      setContext(ctx);
    });
    return () => unsub();
  }, []);

  const pollContext = useCallback(async (id: string) => {
    try {
      const ctx = await api.root.getContext(id);
      setContext(ctx);
      if (!ctx || ctx.error) setRunning(false);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!taskId || !running) return;
    const interval = setInterval(() => pollContext(taskId), 1000);
    return () => clearInterval(interval);
  }, [taskId, running, pollContext]);

  const handleStart = async () => {
    try {
      const effectiveOptions: RootOptions = {
        ...options,
        innermodel: options.modelChoice || options.innermodel || currentDevice?.innermodel,
        sdkBranch: options.sdkBranch || (Number(currentDevice?.sdkVersion) as RootOptions['sdkBranch']) || 25,
        softVersion: currentDevice?.softVersion,
      };
      if (!effectiveOptions.innermodel) {
        throw new Error('请先选择型号');
      }
      const id = await api.root.start(effectiveOptions);
      if (typeof id !== 'string') throw new Error('启动 Root 任务失败');
      setTaskId(id);
      setRunning(true);
      setContext(null);
    } catch (err) {
      console.error('Root start failed:', err);
    }
  };

  const handleCancel = async () => {
    if (!taskId) return;
    try {
      await api.root.cancel(taskId);
      setRunning(false);
      setTaskId(null);
    } catch (err) { console.error(err); }
  };

  const handlePause = async () => {
    if (!taskId) return;
    try {
      await api.root.pause(taskId);
    } catch (err) { console.error(err); }
  };

  const handleResume = async () => {
    if (!taskId) return;
    try {
      await api.root.resume(taskId);
    } catch (err) { console.error(err); }
  };

  const models = getAllModels();

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Shield className="w-6 h-6 text-blue-400" />
        Root 工具
      </h1>

      {currentDevice ? (
        <div className="card text-sm flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-medium">{getDisplayName(currentDevice.innermodel ?? '')}</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-400">{currentDevice.serial}</span>
          <span className="text-slate-400">SDK {currentDevice.sdkVersion}</span>
          <span className="badge-success ml-auto">{currentDevice.type}</span>
        </div>
      ) : (
        <div className="card text-sm text-yellow-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          未连接设备
        </div>
      )}

      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-white">Root 选项</h2>

        <div>
          <label className="label">SDK 分支</label>
          <div className="flex flex-wrap gap-2">
            {sdkBranches.map((b) => (
              <button key={String(b.value)} onClick={() => setOptions(prev => ({ ...prev, sdkBranch: b.value }))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  options.sdkBranch === b.value ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}>
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <label className="label">型号选择</label>
          <button onClick={() => setShowModels(!showModels)}
            className="input flex items-center justify-between">
            <span>{options.modelChoice ? getDisplayName(options.modelChoice) : '自动检测'}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          {showModels && (
            <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg max-h-48 overflow-y-auto shadow-xl">
              <button onClick={() => { setOptions(prev => ({ ...prev, modelChoice: undefined })); setShowModels(false); }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700">
                自动检测 ({currentDevice?.innermodel ? getDisplayName(currentDevice.innermodel) : '无'})
              </button>
              {models.map(([key, entry]) => (
                <button key={key} onClick={() => { setOptions(prev => ({ ...prev, modelChoice: key })); setShowModels(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700">
                  {entry.displayName} ({key})
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={!!options.nouserdata} onChange={(e) => setOptions(prev => ({ ...prev, nouserdata: e.target.checked }))}
              className="rounded bg-slate-700 border-slate-500" />
            nouserdata（保留用户数据）
          </label>
          <div>
            <label className="label">SDK 25 方案</label>
            <div className="flex gap-2">
              {(['boot', 'recovery'] as const).map((s) => (
                <button key={s} onClick={() => setOptions(prev => ({ ...prev, sdk25Scheme: s }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    options.sdk25Scheme === s ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleStart} disabled={running || !currentDevice}
          className="btn-success flex items-center gap-2">
          <Play className="w-4 h-4" /> 开始
        </button>
        <button onClick={handlePause} disabled={!running}
          className="btn-secondary flex items-center gap-2">
          <Pause className="w-4 h-4" /> 暂停
        </button>
        <button onClick={handleResume} disabled={!running}
          className="btn-primary flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> 继续
        </button>
        <button onClick={handleCancel} disabled={!taskId}
          className="btn-danger flex items-center gap-2">
          <Square className="w-4 h-4" /> 取消
        </button>
      </div>

      {context && (
        <div className="card space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-300">{context.stage}</span>
              <span className="text-slate-400">{context.progress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all"
                style={{ width: `${context.progress}%` }} />
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <p>阶段：<span className="text-slate-200">{context.stage}</span></p>
            <p>内部型号：<span className="text-slate-200">{context.innermodel}</span></p>
            <p>是否 V3：<span className="text-slate-200">{String(context.isV3)}</span></p>
            <p>SMode：<span className="text-slate-200">{String(context.smodel)}</span></p>
          </div>

          {context.error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2 text-red-400 font-medium mb-1">
                <AlertTriangle className="w-4 h-4" />
                错误阶段：{context.error.stage}
              </div>
              <p className="text-red-300">{context.error.message}</p>
              {context.error.recoverable && (
                <p className="text-yellow-400 text-xs mt-1">此错误可以恢复。</p>
              )}
            </div>
          )}
        </div>
      )}

      {context && context.logs.length > 0 && (
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4" />
            Root 日志
          </h2>
          <div className="max-h-60 overflow-y-auto space-y-0.5 font-mono text-xs bg-black/40 rounded-lg p-3">
            {context.logs.map((log, i) => (
              <div key={i} className={`${
                log.level === 'error' ? 'text-red-400' :
                log.level === 'warn' ? 'text-yellow-400' :
                log.level === 'info' ? 'text-blue-300' : 'text-slate-400'
              }`}>
                <span className="text-slate-600">[{new Date(log.ts).toLocaleTimeString()}]</span>
                {' '}{log.msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
