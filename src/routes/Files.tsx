import { useEffect, useState, useCallback } from 'react';
import {
  File, Folder, ArrowUp, Upload, Download, Trash2, Edit3, Plus,
  Search, ToggleLeft, ToggleRight, Smartphone, Home, ChevronRight,
  Monitor, Package, RefreshCw
} from 'lucide-react';
import { api } from '@/lib/api';
import { useDeviceStore } from '@/stores/deviceStore';

interface FileEntry {
  name: string;
  path: string;
  isDir: boolean;
  size: number;
  mtime: number;
  mode?: number;
}

interface QuickPath {
  name: string;
  path: string;
}

export default function Files() {
  const { currentDevice } = useDeviceStore();
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [currentPath, setCurrentPath] = useState('/sdcard');
  const [quickPaths, setQuickPaths] = useState<QuickPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [compatMode, setCompatMode] = useState(false);
  const [devices, setDevices] = useState<Array<{ serial: string; type: string }>>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [showMkdir, setShowMkdir] = useState(false);
  const [mkdirName, setMkdirName] = useState('');
  const [transferProgress, setTransferProgress] = useState<{ file: string; bytes: number; total: number; speed: number } | null>(null);

  const loadFiles = useCallback(async (path: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await api.file.list(path, selectedDevice || undefined);
      setFiles(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(String(err));
      setFiles([]);
    }
    setLoading(false);
  }, [selectedDevice]);

  const loadQuickPaths = useCallback(async () => {
    try {
      const result = await api.file.quickPaths();
      setQuickPaths(Array.isArray(result) ? result : []);
    } catch { /* ignore */ }
  }, []);

  const loadDevices = useCallback(async () => {
    try {
      const result = await api.file.listDevices();
      const list = Array.isArray(result) ? result : [];
      setDevices(list.map(d => ({ serial: d.serial, type: d.type })));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    loadFiles(currentPath);
    loadQuickPaths();
    loadDevices();
    const unsub = api.file.onTransferProgress((p) => setTransferProgress(p));
    return () => unsub();
  }, [loadFiles, loadQuickPaths, loadDevices, currentPath]);

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
    try {
      const file = await api.system.pickFile({ kind: 'open', multi: false });
      if (file) {
        await api.file.push(file as string, currentPath, selectedDevice || undefined);
        loadFiles(currentPath);
      }
    } catch (err) { console.error(err); }
  };

  const handleDownload = async (entry: FileEntry) => {
    try {
      const dir = await api.system.pickFile({ kind: 'folder' });
      if (dir) {
        await api.file.pull(entry.path, dir as string, selectedDevice || undefined);
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (entry: FileEntry) => {
    if (!confirm(`删除 ${entry.name}？`)) return;
    try {
      await api.file.remove(entry.path, entry.isDir);
      loadFiles(currentPath);
    } catch (err) { console.error(err); }
  };

  const handleRename = async (oldPath: string) => {
    if (!newName) return;
    try {
      const dir = oldPath.split('/').slice(0, -1).join('/');
      await api.file.rename(oldPath, `${dir}/${newName}`);
      setRenameTarget(null);
      setNewName('');
      loadFiles(currentPath);
    } catch (err) { console.error(err); }
  };

  const handleMkdir = async () => {
    if (!mkdirName) return;
    try {
      await api.file.mkdir(`${currentPath}/${mkdirName}`, true);
      setShowMkdir(false);
      setMkdirName('');
      loadFiles(currentPath);
    } catch (err) { console.error(err); }
  };

  const handleChmod = async (entry: FileEntry) => {
    const mode = prompt('Enter permissions (e.g. 755):', '755');
    if (mode) {
      try {
        await api.file.chmod(entry.path, mode);
        loadFiles(currentPath);
      } catch (err) { console.error(err); }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setSearching(true);
    try {
      const results = await api.file.search(currentPath, searchQuery, selectedDevice || undefined);
      setSearchResults(results);
    } catch (err) { console.error(err); }
    setSearching(false);
  };

  const handleInstallApk = async (entry: FileEntry) => {
    try {
      await api.file.installApk(entry.path);
    } catch (err) { console.error(err); }
  };

  const toggleCompat = async () => {
    const next = !compatMode;
    setCompatMode(next);
    await api.file.setCompatMode(next);
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
    return `${size.toFixed(1)} ${units[i]}`;
  };

  const formatDate = (ts: number): string => {
    return new Date(ts * 1000).toLocaleString();
  };

  const pathParts = currentPath.split('/').filter(Boolean);
  const displayEntries = searchResults.length > 0
    ? searchResults.map(p => ({ name: p.split('/').pop() ?? p, path: p, isDir: false, size: 0, mtime: 0 }))
    : files;

  return (
    <div className="p-6 space-y-4 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <File className="w-6 h-6 text-blue-400" />
        文件管理器
      </h1>

      <div className="flex items-center gap-3 flex-wrap">
        {devices.length > 0 && (
          <select
            className="select w-auto"
            value={selectedDevice}
            onChange={(e) => { setSelectedDevice(e.target.value); setCurrentPath('/sdcard'); }}
          >
            <option value="">内部存储 (ADB)</option>
            {devices.map(d => <option key={d.serial} value={d.serial}>{d.serial} ({d.type})</option>)}
          </select>
        )}
        <button onClick={toggleCompat} className={`btn-secondary text-xs flex items-center gap-1 ${compatMode ? 'bg-blue-600' : ''}`}>
          {compatMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          兼容模式
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm flex-wrap">
        <button onClick={() => navigateTo('/sdcard')} className="text-slate-400 hover:text-white transition-colors">
          <Home className="w-4 h-4" />
        </button>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        {pathParts.map((part, i) => {
          const p = '/' + pathParts.slice(0, i + 1).join('/');
          return (
            <span key={p} className="flex items-center gap-1">
              <button onClick={() => navigateTo(p)} className="text-slate-300 hover:text-white transition-colors">{part}</button>
              {i < pathParts.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600" />}
            </span>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {quickPaths.map(qp => (
          <button key={qp.path} onClick={() => navigateTo(qp.path)}
            className="text-xs px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
            {qp.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input className="input pl-10" placeholder="搜索文件..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
        </div>
        <button onClick={handleSearch} disabled={searching} className="btn-secondary">
          {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
        <button onClick={navigateUp} className="btn-secondary"><ArrowUp className="w-4 h-4" /></button>
        <button onClick={handleUpload} className="btn-primary flex items-center gap-1"><Upload className="w-4 h-4" />上传</button>
        <button onClick={() => setShowMkdir(true)} className="btn-secondary"><Plus className="w-4 h-4" /></button>
      </div>

      {transferProgress && (
        <div className="card text-sm">
          <p className="text-slate-300">{transferProgress.file}</p>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
            <div className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${transferProgress.total > 0 ? (transferProgress.bytes / transferProgress.total) * 100 : 0}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-1">{formatSize(transferProgress.bytes)} / {formatSize(transferProgress.total)} @ {(transferProgress.speed / 1024 / 1024).toFixed(1)} MB/s</p>
        </div>
      )}

      {error && <div className="card text-red-400 text-sm">{error}</div>}

      <div className="card p-0 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-800/80 border-b border-slate-700/50">
          <span className="col-span-5">名称</span>
          <span className="col-span-2 text-right">大小</span>
          <span className="col-span-3">日期</span>
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
              <div key={entry.path} className="grid grid-cols-12 gap-2 px-4 py-2.5 text-sm hover:bg-slate-700/30 transition-colors items-center">
                <div className="col-span-5 flex items-center gap-2 min-w-0">
                  {entry.isDir ? <Folder className="w-4 h-4 text-yellow-400 shrink-0" /> : <File className="w-4 h-4 text-blue-400 shrink-0" />}
                  {renameTarget === entry.path ? (
                    <div className="flex gap-1">
                      <input className="input py-0.5 text-xs" value={newName} onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(entry.path)} autoFocus />
                      <button onClick={() => handleRename(entry.path)} className="text-xs text-blue-400">OK</button>
                    </div>
                  ) : (
                    <button onClick={() => entry.isDir && navigateTo(entry.path)}
                      className="truncate text-slate-200 hover:text-white" title={entry.path}>
                      {entry.name}
                    </button>
                  )}
                </div>
                <span className="col-span-2 text-right text-slate-400 text-xs">{entry.isDir ? '-' : formatSize(entry.size)}</span>
                <span className="col-span-3 text-xs text-slate-500">{entry.mtime ? formatDate(entry.mtime) : '-'}</span>
                <span className="col-span-1 text-xs text-slate-500">{entry.mode?.toString(8).slice(-3) ?? '-'}</span>
                <div className="col-span-1 flex items-center gap-1 justify-end">
                  {!entry.isDir && entry.name.endsWith('.apk') && (
                    <button onClick={() => handleInstallApk(entry)} className="p-1 hover:bg-slate-600 rounded" title="Install APK">
                      <Package className="w-3.5 h-3.5 text-green-400" />
                    </button>
                  )}
                  <button onClick={() => handleDownload(entry)} className="p-1 hover:bg-slate-600 rounded" title="Download">
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                  <button onClick={() => { setRenameTarget(entry.path); setNewName(entry.name); }} className="p-1 hover:bg-slate-600 rounded" title="Rename">
                    <Edit3 className="w-3.5 h-3.5 text-yellow-400" />
                  </button>
                  {entry.isDir && (
                    <button onClick={() => handleChmod(entry)} className="p-1 hover:bg-slate-600 rounded" title="Chmod">
                      <Monitor className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(entry)} className="p-1 hover:bg-slate-600 rounded" title="Delete">
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
