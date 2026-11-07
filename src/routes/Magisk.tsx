import { useEffect, useState, useCallback } from 'react';
import {
  Database, RefreshCw, Upload, Trash2, ToggleLeft, ToggleRight,
  Search, Download, CheckCircle, XCircle, Smartphone
} from 'lucide-react';
import { api } from '@/lib/api';
import { useDeviceStore } from '@/stores/deviceStore';
import type { MagiskModule, StoreModule, InstallMethod, UninstallMethod } from '@shared/types';

export default function Magisk() {
  const { currentDevice } = useDeviceStore();
  const [modules, setModules] = useState<MagiskModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'modules' | 'store'>('modules');
  const [storeQuery, setStoreQuery] = useState('');
  const [storeResults, setStoreResults] = useState<StoreModule[]>([]);
  const [searching, setSearching] = useState(false);
  const [operating, setOperating] = useState<string | null>(null);

  const loadModules = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.magisk.list();
      if (result && typeof result === 'object' && 'error' in result) {
        throw new Error(String(result.error));
      }
      setModules(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(String(err));
      setModules([]);
    }
    setLoading(false);
  }, [currentDevice]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const handleInstall = async (method: InstallMethod) => {
    try {
      const file = await api.system.pickFile({ kind: 'open', filter: 'ZIP files (*.zip)', multi: false });
      if (file) {
        setOperating(`install:${method}`);
        await api.magisk.install(file as string, method);
        loadModules();
      }
    } catch (err) { console.error(err); }
    setOperating(null);
  };

  const handleUninstall = async (id: string, method: UninstallMethod) => {
    setOperating(`uninstall:${id}:${method}`);
    try {
      await api.magisk.uninstall(id, method);
      loadModules();
    } catch (err) { console.error(err); }
    setOperating(null);
  };

  const handleToggle = async (mod: MagiskModule) => {
    setOperating(`toggle:${mod.id}`);
    try {
      if (mod.status === 'enabled') {
        await api.magisk.disable(mod.id);
      } else {
        await api.magisk.enable(mod.id);
      }
      loadModules();
    } catch (err) { console.error(err); }
    setOperating(null);
  };

  const handleStoreSearch = async () => {
    if (!storeQuery.trim()) return;
    setSearching(true);
    try {
      const results = await api.magisk.storeSearch(storeQuery);
      setStoreResults(Array.isArray(results) ? results : []);
    } catch (err) { console.error(err); }
    setSearching(false);
  };

  const handleStoreInstall = async (mod: StoreModule) => {
    setOperating(`store:${mod.id}`);
    try {
      await api.magisk.storeInstall(mod);
      loadModules();
    } catch (err) { console.error(err); }
    setOperating(null);
  };

  const installMethods: InstallMethod[] = ['magisk', 'shinst', 'peremptory'];
  const uninstallMethods: UninstallMethod[] = ['mark', 'direct', 'script'];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Database className="w-6 h-6 text-blue-400" />
        Magisk 模块管理
      </h1>

      {currentDevice ? (
        <div className="card text-sm flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-medium">{currentDevice.serial}</span>
          <span className="badge-success ml-auto">{currentDevice.type}</span>
        </div>
      ) : (
        <div className="card text-sm text-yellow-400">未连接设备</div>
      )}

      <div className="flex gap-2 border-b border-slate-700">
        <button onClick={() => setTab('modules')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${tab === 'modules' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}>
          模块
        </button>
        <button onClick={() => setTab('store')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${tab === 'store' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}>
          商店
        </button>
      </div>

      {error && <div className="card text-red-400 text-sm">{error}</div>}

      {tab === 'modules' && (
        <>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-400 self-center mr-2">安装：</span>
            {installMethods.map((m) => (
              <button key={m} onClick={() => handleInstall(m)} disabled={!!operating || !currentDevice}
                className="btn-primary text-xs flex items-center gap-1">
                <Upload className="w-3 h-3" />
                {m}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-8"><RefreshCw className="w-6 h-6 animate-spin text-blue-400" /></div>
          ) : modules.length === 0 ? (
            <div className="card text-center py-8 text-slate-500">未安装模块。</div>
          ) : (
            <div className="space-y-2">
              {modules.map((mod) => (
                <div key={mod.id} className="card flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{mod.name}</span>
                      <span className="text-xs text-slate-400">v{mod.version}</span>
                      {mod.status === 'enabled' ? (
                        <span className="badge-success">已启用</span>
                      ) : (
                        <span className="badge-error">已禁用</span>
                      )}
                    </div>
                    {mod.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{mod.description}</p>}
                    <p className="text-xs text-slate-500 mt-1">{mod.author} · {mod.id}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleToggle(mod)} disabled={operating === `toggle:${mod.id}`}
                      className="p-1.5 hover:bg-slate-600 rounded" title={mod.status === 'enabled' ? '禁用' : '启用'}>
                      {mod.status === 'enabled' ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                    </button>
                    <div className="relative group">
                      <button className="p-1.5 hover:bg-slate-600 rounded" title="卸载">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl hidden group-hover:block z-10">
                        {uninstallMethods.map((m) => (
                          <button key={m} onClick={() => handleUninstall(mod.id, m)}
                            disabled={operating === `uninstall:${mod.id}:${m}`}
                            className="block w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 whitespace-nowrap">
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'store' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input className="input flex-1" placeholder="搜索 Magisk 模块商店..."
              value={storeQuery} onChange={(e) => setStoreQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStoreSearch()} />
            <button onClick={handleStoreSearch} disabled={searching} className="btn-primary flex items-center gap-2">
              {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              搜索
            </button>
          </div>

          {storeResults.length > 0 ? (
            <div className="space-y-2">
              {storeResults.map((mod) => (
                <div key={mod.id} className="card flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-white">{mod.name}</span>
                    {mod.version && <span className="text-xs text-slate-400 ml-2">v{mod.version}</span>}
                    <p className="text-xs text-slate-400 mt-1">{mod.description}</p>
                    <p className="text-xs text-slate-500 mt-1">{mod.author}</p>
                  </div>
                  <button onClick={() => handleStoreInstall(mod)} disabled={operating === `store:${mod.id}`}
                    className="btn-success text-xs flex items-center gap-1 shrink-0">
                    <Download className="w-3 h-3" />
                    安装
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">
              {searching ? '搜索中...' : '在 Magisk 模块商店中搜索模块。'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
