import { Cloud, RefreshCw, Download, Search, FolderOpen, CheckCircle, AlertTriangle, HardDrive } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { CloudResource } from '@shared/types';

interface UpdateState {
  resource: CloudResource;
  updateAvailable: boolean;
}

export default function CloudPage() {
  const [resources, setResources] = useState<CloudResource[]>([]);
  const [updates, setUpdates] = useState<UpdateState[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number; file: string } | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const list = await api.cloud.list();
      setResources(Array.isArray(list) ? list : []);
    } catch (e) {
      setMessage((e as Error).message);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const unsub = api.cloud.onProgress(setProgress);
    return () => unsub();
  }, []);

  const handleDownload = async (resource: CloudResource) => {
    setDownloading(resource.name);
    setProgress({ current: 0, total: 100, file: resource.filename });
    try {
      const result = await api.cloud.download(resource);
      if (result && typeof result === 'object' && 'error' in result) {
        setMessage(String(result.error));
      } else {
        setMessage(`已下载 ${resource.name}`);
        await load();
      }
    } catch (e) {
      setMessage((e as Error).message);
    }
    setDownloading(null);
  };

  const handleCheckUpdates = async () => {
    setLoading(true);
    try {
      const result = await api.cloud.checkUpdates();
      setUpdates(Array.isArray(result) ? result : []);
      setMessage(`检测完成：${(result as UpdateState[]).filter((r) => r.updateAvailable).length} 项可更新`);
    } catch (e) {
      setMessage((e as Error).message);
    }
    setLoading(false);
  };

  const categories = ['全部', ...Array.from(new Set(resources.map((r) => r.category).filter(Boolean)))];
  const filtered = resources.filter((r) => {
    if (category !== '全部' && r.category !== category) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Cloud className="w-6 h-6 text-blue-400" />
          资源管理
        </h1>
        <div className="flex gap-2">
          <button onClick={handleCheckUpdates} disabled={loading} className="btn-secondary text-sm flex items-center gap-1.5">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />检查更新
          </button>
          <button onClick={load} disabled={loading} className="btn-primary text-sm flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" />刷新列表
          </button>
        </div>
      </div>

      {message && <div className="card text-sm text-slate-300">{message}</div>}

      {progress && (
        <div className="card text-sm">
          <p className="text-slate-300">{progress.file}</p>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
            <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, progress.current)}%` }} />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input className="input pl-9" placeholder="搜索资源..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${category === cat ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {cat}
          </button>
        ))}
      </div>

      {loading && resources.length === 0 ? (
        <div className="flex justify-center py-10"><RefreshCw className="w-6 h-6 animate-spin text-blue-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-10 text-slate-500 text-sm">没有找到资源。</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((resource) => {
            const update = updates.find((u) => u.resource.name === resource.name)?.updateAvailable;
            return (
              <div key={resource.name} className="card flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold text-white">{resource.name}</h2>
                    <p className="text-xs text-slate-500">{resource.filename}</p>
                  </div>
                  {resource.required ? <span className="badge-error">必需</span> : <span className="badge-info">{resource.category}</span>}
                </div>
                <p className="text-xs text-slate-400 flex-1">{resource.description}</p>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>本地版本: {resource.localVersion || '未下载'}</p>
                  {resource.cloudVersion && <p>云端版本: {resource.cloudVersion}</p>}
                  {update && <p className="text-yellow-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />有更新</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDownload(resource)} disabled={downloading === resource.name}
                    className="btn-primary text-xs flex items-center gap-1">
                    {downloading === resource.name ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    {resource.localVersion ? '重新下载' : '下载'}
                  </button>
                  {resource.localVersion && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />已就绪</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card text-xs text-slate-500 flex items-start gap-2">
        <HardDrive className="w-4 h-4 shrink-0" />
        <span>资源会下载并解压到应用目录；首次使用 Root、TWRP、驱动或 Xposed 前，请先在此下载对应资源。</span>
      </div>
    </div>
  );
}
