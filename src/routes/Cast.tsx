import { Smartphone, MonitorPlay, RefreshCw, Square, Play, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useDeviceStore } from '@/stores/deviceStore';

export default function Cast() {
  const { currentDevice } = useDeviceStore();
  const [running, setRunning] = useState<Array<{ pid: number; serial: string; startedAt: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState({
    stayAwake: true,
    turnScreenOff: false,
    alwaysOnTop: false,
    fullscreen: false,
    showTouches: false,
    noControl: false,
    maxFps: 60,
    maxSize: 0,
  });

  const load = async () => {
    try {
      const result = await api.scrcpy.list();
      setRunning(Array.isArray(result) ? result : []);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    load();
    const unsub = api.scrcpy.onProcessChange(() => load());
    return () => unsub();
  }, []);

  const handleLaunch = async () => {
    if (!currentDevice?.serial) return;
    setLoading(true);
    setError('');
    try {
      const result = await api.scrcpy.launch(currentDevice.serial, {
        stayAwake: options.stayAwake,
        turnScreenOff: options.turnScreenOff,
        alwaysOnTop: options.alwaysOnTop,
        fullscreen: options.fullscreen,
        showTouches: options.showTouches,
        noControl: options.noControl,
        maxFps: options.maxFps || undefined,
        maxSize: options.maxSize || undefined,
        windowTitle: `iMooAgentTool - ${currentDevice.innermodel || currentDevice.serial}`,
      });
      if (typeof result !== 'number' || result <= 0) throw new Error('scrcpy 启动失败');
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  const handleStop = async (pid: number) => {
    try {
      await api.scrcpy.stop(pid);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleStopAll = async () => {
    try {
      await api.scrcpy.stopAll();
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MonitorPlay className="w-6 h-6 text-blue-400" />投屏控制
        </h1>
        <button onClick={load} className="btn-secondary text-sm flex items-center gap-1.5">
          <RefreshCw className="w-4 h-4" />刷新
        </button>
      </div>

      {currentDevice ? (
        <div className="card text-sm flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-medium">{currentDevice.innermodel || currentDevice.model || '已连接设备'}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">{currentDevice.serial}</span>
          <span className="badge-success ml-auto">{currentDevice.type}</span>
        </div>
      ) : (
        <div className="card text-sm text-yellow-400">未连接设备</div>
      )}

      {error && <div className="card text-sm text-red-400">{error}</div>}

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-slate-300">启动选项</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {[
            ['stayAwake', '保持设备唤醒'],
            ['turnScreenOff', '启动时关闭屏幕'],
            ['alwaysOnTop', '窗口置顶'],
            ['fullscreen', '全屏启动'],
            ['showTouches', '显示触摸点'],
            ['noControl', '仅观看不控制'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-slate-300">
              <input type="checkbox" checked={options[key as keyof typeof options] as boolean}
                onChange={(e) => setOptions((prev) => ({ ...prev, [key]: e.target.checked }))}
                className="accent-blue-500" />
              {label}
            </label>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="label">最大帧率</label>
            <input className="input" type="number" value={options.maxFps}
              onChange={(e) => setOptions((prev) => ({ ...prev, maxFps: parseInt(e.target.value, 10) || 0 }))} />
          </div>
          <div>
            <label className="label">最大画面尺寸（0 = 不限制）</label>
            <input className="input" type="number" value={options.maxSize}
              onChange={(e) => setOptions((prev) => ({ ...prev, maxSize: parseInt(e.target.value, 10) || 0 }))} />
          </div>
        </div>
        <button onClick={handleLaunch} disabled={!currentDevice || loading} className="btn-primary flex items-center gap-2">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          启动投屏
        </button>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300">运行中的窗口</h2>
          {running.length > 0 && (
            <button onClick={handleStopAll} className="btn-danger text-xs flex items-center gap-1">
              <Square className="w-3 h-3" />全部停止
            </button>
          )}
        </div>
        {running.length === 0 ? (
          <p className="text-sm text-slate-500">当前没有投屏窗口。</p>
        ) : (
          <div className="space-y-2">
            {running.map((session) => (
              <div key={session.pid} className="flex items-center gap-3 bg-slate-900/40 rounded-lg px-3 py-2">
                <MonitorPlay className="w-4 h-4 text-blue-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate">{session.serial || '设备'}</p>
                  <p className="text-xs text-slate-500">PID {session.pid} · {new Date(session.startedAt).toLocaleTimeString()}</p>
                </div>
                <button onClick={() => handleStop(session.pid)} className="btn-secondary text-xs">停止</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card text-xs text-slate-500 flex items-center gap-2">
        <ExternalLink className="w-4 h-4" />
        <span>投屏由 scrcpy 提供。若启动失败，请确认设备已授权 USB 调试，且 resources/bin/scrcpy.exe 存在。</span>
      </div>
    </div>
  );
}
