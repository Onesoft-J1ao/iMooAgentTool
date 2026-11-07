import { useEffect, useState } from 'react';
import {
  Smartphone, HardDrive, RefreshCw, Upload, Download, FolderOpen, Trash2,
  Edit3, Plus, Search, Home, ChevronRight, Package, Monitor, AlertTriangle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useDeviceStore } from '@/stores/deviceStore';

interface FileEntry {
  name: string;
  path: string;
  isDir: boolean;
  size: number;
  mtime: string;
  perms: string;
}

export default function Files() {
  const { currentDevice } = useDeviceStore();
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [currentPath, setCurrentPath] = useState('/sdcard');
  const [quickPaths, setQuickPaths] = useState<Array<{ name: string; path: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FileEntry[]>([]);
  const [searching, setSearching] = useState(false);
  const [transfer, setTransfer] = useState<{ file: string; bytes: number; total: number; speed: number } | null>(null);
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [showMkdir, setShowMkdir] = useState(false);
  const [mkdirName, setMkdirName] = useState('');

  const serial = currentDevice?.serial ?? '';

  const loadFiles = async (path: string) => {
    if (!serial) {
      setFiles([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await api.file.list(path, serial);
      setFiles(Array.isArray(result) ? result : []);
    } catch (e) {
      setError((e as Error).message);
      setFiles([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    api.file.quickPaths().then(setQuickPaths).catch(() => {});
    const unsub = api.file.onTransferProgress(setTransfer);
    return () => unsub();
  }, []);

  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath, serial]);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSearchResults([]);
    setSearchQuery('');
  };

  const navigateUp = () => {
    const parent = currentPath.replace(/\/+$/, '').split('/').slice(0, -1).join('/') || '/';
    navigateTo(parent);
  };

  const handleUpload = async () => {
    if (!serial) return;
    try {
      const file = await api.system.pickFile({ kind: 'open' });
      if (!file) return;
      await api.file.push(file as string, currentPath, serial);
      await loadFiles(currentPath);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDownload = async (entry: FileEntry) => {
    if (!serial) return;
    try {
      const dir = await api.system.pickFile({ kind: 'folder' });
      if (!dir) return;
      await api.file.pull(entry.path, dir as string, serial);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDelete = async (entry: FileEntry) => {
    if (!serial) return;
    if (!confirm(`删除 ${entry.name}？`)) return;
    try {
      await api.file.remove(entry.path, serial);
      await loadFiles(currentPath);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleRename = async (oldPath: string) => {
    if (!serial || !newName.trim()) return;
    try {
      const dir = oldPath.split('/').slice(0, -1).join('/');
      await api.file.rename(oldPath, `${dir}/${newName.trim()}`, serial);
      setRenameTarget(null);
      setNewName('');
      await loadFiles(currentPath);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleMkdir = async () => {
    if (!serial || !mkdirName.trim()) return;
    try {
      await api.file.mkdir(`${currentPath}/${mkdirName.trim()}`, serial);
      setShowMkdir(false);
      setMkdirName('');
      await loadFiles(currentPath);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleChmod = async (entry: FileEntry) => {
    if (!serial) return;
    const mode = prompt('权限 (例如 755):', '755');
    if (!mode) return;
    try {
      await api.file.chmod(entry.path, mode, serial);
      await loadFiles(currentPath);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleSearch = async () => {
    if (!serial || !searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await api.file.search(currentPath, searchQuery.trim(), serial);
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (e) {
      setError((e as Error).message);
    }
    setSearching(false);
  };

  const handleInstallApk = async (entry: FileEntry) => {
    if (!serial) return;
    try {
      const result = await api.file.installApk(entry.path, serial);
      if (!result.success) setError(result.error || '安装失败');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
  };

  const displayEntries = searchResults.length > 0 ? searchResults : files;
  const crumbs = currentPath.split('/').filter(Boolean);

  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-blue-400" />
          文件管理
        </h1>
        <div className="flex gap-2">
          <button onClick={() => loadFiles(currentPath)} disabled={!serial} className="btn-secondary flex items-center gap-1 text-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />刷新
          </button>
          <button onClick={() => setShowMkdir(true)} disabled={!serial} className="btn-secondary flex items-center gap-1 text-sm">
            <Plus className="w-4 h-4" />新建目录
          </button>
          <button onClick={handleUpload} disabled={!serial} className="btn-primary flex items-center gap-1 text-sm">
            <Upload className="w-4 h-4" />上传
          </button>
        </div>
      </div>

      {!currentDevice && (
        <div className="card text-sm text-yellow-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />未连接设备
        </div>
      )}

      {error && <div className="card text-red-400 text-sm">{error}</div>}

      <div className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
        <Home className="w-4 h-4" />
        <button onClick={() => navigateTo('/')} className="hover:text-white">/</button>
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => navigateTo('/' + crumbs.slice(0, i + 1).join('/'))} className="hover:text-white">{crumb}</button>
          </span>
        ))}
        <button onClick={navigateUp} className="ml-auto btn-secondary text-xs">上一级</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {quickPaths.map((q) => (
          <button key={q.path} onClick={() => navigateTo(q.path)}
            className={`px-2.5 py-1 rounded-lg text-xs ${currentPath === q.path ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {q.name}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input className="input pl-9" placeholder="在当前目录搜索..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        </div>
        <button onClick={handleSearch} disabled={searching || !searchQuery.trim()} className="btn-secondary text-sm">
          {searching ? '搜索中...' : '搜索'}
        </button>
      </div>

      {transfer && (
        <div className="card text-sm">
          <p className="text-slate-300">{transfer.file}</p>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${transfer.total > 0 ? Math.min(100, (transfer.bytes / transfer.total) * 100) : 0}%` }} />
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-800/80 border-b border-slate-700/50">
          <span className="col-span-5">名称</span>
          <span className="col-span-2 text-right">大小</span>
          <span className="col-span-3">修改时间</span>
          <span className="col-span-1">权限</span>
          <span className="col-span-1" />
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><RefreshCw className="w-5 h-5 animate-spin text-blue-400" /></div>
        ) : displayEntries.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">空目录</div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {displayEntries.map((entry) => (
              <div key={entry.path} className="grid grid-cols-12 gap-2 px-4 py-2.5 text-sm hover:bg-slate-700/30 items-center">
                <div className="col-span-5 flex items-center gap-2 min-w-0">
                  {entry.isDir ? <FolderOpen className="w-4 h-4 text-yellow-400 shrink-0" /> : <HardDrive className="w-4 h-4 text-blue-400 shrink-0" />}
                  {renameTarget === entry.path ? (
                    <div className="flex gap-1">
                      <input className="input py-0.5 text-xs" value={newName} onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(entry.path)} autoFocus />
                      <button onClick={() => handleRename(entry.path)} className="text-xs text-blue-400">OK</button>
                    </div>
                  ) : (
                    <button onClick={() => entry.isDir && navigateTo(entry.path)} className="truncate text-slate-200 hover:text-white" title={entry.path}>
                      {entry.name}
                    </button>
                  )}
                </div>
                <span className="col-span-2 text-right text-slate-400 text-xs">{entry.isDir ? '-' : formatSize(entry.size)}</span>
                <span className="col-span-3 text-xs text-slate-500 truncate">{entry.mtime || '-'}</span>
                <span className="col-span-1 text-xs text-slate-500">{entry.perms?.slice(-3) || '-'}</span>
                <div className="col-span-1 flex items-center gap-1 justify-end">
                  {!entry.isDir && entry.name.toLowerCase().endsWith('.apk') && (
                    <button onClick={() => handleInstallApk(entry)} className="p-1 hover:bg-slate-600 rounded" title="安装 APK">
                      <Package className="w-3.5 h-3.5 text-green-400" />
                    </button>
                  )}
                  <button onClick={() => handleDownload(entry)} className="p-1 hover:bg-slate-600 rounded" title="下载">
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                  <button onClick={() => { setRenameTarget(entry.path); setNewName(entry.name); }} className="p-1 hover:bg-slate-600 rounded" title="重命名">
                    <Edit3 className="w-3.5 h-3.5 text-yellow-400" />
                  </button>
                  {entry.isDir && (
                    <button onClick={() => handleChmod(entry)} className="p-1 hover:bg-slate-600 rounded" title="修改权限">
                      <Monitor className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(entry)} className="p-1 hover:bg-slate-600 rounded" title="删除">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showMkdir && (
        <div className="modal-overlay" onClick={() => setShowMkdir(false)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">新建目录</h2>
            <input className="input mb-4" placeholder="目录名称" value={mkdirName} onChange={(e) => setMkdirName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleMkdir()} autoFocus />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowMkdir(false)} className="btn-secondary">取消</button>
              <button onClick={handleMkdir} className="btn-primary">创建</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
