import { useEffect, useState } from 'react';
import { Download, FileText, HardDrive, RefreshCw, Upload, Trash2, CheckCircle, AlertTriangle, RotateCcw, Clock, Smartphone } from 'lucide-react';
import { api } from '@/lib/api';
import { useDeviceStore } from '@/stores/deviceStore';

interface Loader { name: string; path: string; description: string }
interface Partition { label: string; sizeBytes: number; firstLba: number; lun?: number }
interface HistoryEntry { timestamp: number; type: string; label: string; success: boolean; message: string }

export default function EdlPartitions() {
  const { currentDevice } = useDeviceStore();
  const [loaders, setLoaders] = useState<Loader[]>([]);
  const [selectedLoader, setSelectedLoader] = useState('');
  const [partitions, setPartitions] = useState<Partition[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [edlFound, setEdlFound] = useState(false);
  const [progress, setProgress] = useState<{ stage: string; percent: number; message: string } | null>(null);
  const [operating, setOperating] = useState<string | null>(null);

  const init = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.edlPartition.listLoaders();
      const list = Array.isArray(result) ? result : [];
      setLoaders(list);
      if (list.length > 0 && !selectedLoader) setSelectedLoader(list[0].path);
      const edl = await api.edlPartition.checkEdlDevice();
      setEdlFound(!!edl.found);
      setHistory(await api.edlPartition.getHistory());
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  useEffect(() => {
    init();
    const unsub = api.edlPartition.onProgress(setProgress);
    return () => unsub();
  }, []);

  const handlePrintGpt = async () => {
    if (!selectedLoader) return;
    setLoading(true);
    setError('');
    try {
      const result = await api.edlPartition.printGpt(selectedLoader);
      setPartitions(result.partitions || []);
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  const pickSavePath = async (label: string) => {
    const dir = await api.system.pickFile({ kind: 'folder' });
    if (!dir || Array.isArray(dir)) return null;
    return `${dir}\\${label}_${Date.now()}.img`;
  };

  const handleBackup = async (label: string) => {
    const outputFile = await pickSavePath(label);
    if (!outputFile) return;
    setOperating(`backup:${label}`);
    setError('');
    try {
      const result = await api.edlPartition.backupPartition({ loader: selectedLoader, label, outputFile });
      if (!result.success) setError(result.error || '备份失败');
    } catch (e) {
      setError((e as Error).message);
    }
    setOperating(null);
    setHistory(await api.edlPartition.getHistory());
  };

  const handleRestore = async (label: string) => {
    const file = await api.system.pickFile({ kind: 'open' });
    if (!file || Array.isArray(file)) return;
    setOperating(`restore:${label}`);
    setError('');
    try {
      const dir = await api.system.pickFile({ kind: 'folder' });
      if (!dir || Array.isArray(dir)) return;
      const result = await api.edlPartition.restorePartition({
        loader: selectedLoader,
        label,
        inputFile: file,
        backupBeforeRestore: true,
        backupOutputDir: dir,
      });
      if (!result.success) setError(result.error || '恢复失败');
    } catch (e) {
      setError((e as Error).message);
    }
    setOperating(null);
    setHistory(await api.edlPartition.getHistory());
  };

  const handleErase = async (label: string) => {
    if (!confirm(`擦除分区 "${label}"？此操作不可撤销。`)) return;
    setOperating(`erase:${label}`);
    setError('');
    try {
      const result = await api.edlPartition.erasePartition({ loader: selectedLoader, label });
      if (!result.success) setError(result.error || '擦除失败');
    } catch (e) {
      setError((e as Error).message);
    }
    setOperating(null);
    setHistory(await api.edlPartition.getHistory());
  };

  const handleVerify = async (label: string) => {
    const file = await api.system.pickFile({ kind: 'open' });
    if (!file || Array.isArray(file)) return;
    setOperating(`verify:${label}`);
    setError('');
    try {
      const result = await api.edlPartition.verifyPartition({ loader: selectedLoader, label, filePath: file });
      if (!result.success) setError(result.error || '校验失败');
      else if (!result.matched) setError(`分区 ${label} 与文件不一致`);
    } catch (e) {
      setError((e as Error).message);
    }
    setOperating(null);
    setHistory(await api.edlPartition.getHistory());
  };

  const handleReset = async () => {
    if (!confirm('重置设备？设备将从 EDL 模式重启。')) return;
    setError('');
    try {
      const result = await api.edlPartition.resetDevice(selectedLoader);
      if (!result.success) setError(result.error || '重启失败');
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
    return `${size.toFixed(1)} ${units[i]}`;
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <HardDrive className="w-6 h-6 text-blue-400" />
        EDL 分区管理
      </h1>

      <div className="flex items-center gap-3 text-sm">
        <span className={`flex items-center gap-1.5 ${edlFound ? 'text-green-400' : 'text-red-400'}`}>
          <AlertTriangle className="w-4 h-4" />EDL 设备：{edlFound ? '已找到' : '未找到'}
        </span>
        {currentDevice && <span className="text-slate-500 flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" />{currentDevice.serial}</span>}
        <button onClick={init} className="btn-secondary text-xs ml-auto flex items-center gap-1"><RefreshCw className="w-3 h-3" />刷新</button>
      </div>

      {error && <div className="card text-red-400 text-sm">{error}</div>}

      {progress && (
        <div className="card text-sm">
          <p className="text-slate-300">{progress.stage}: {progress.message}</p>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, progress.percent)}%` }} />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[260px]">
          <label className="label">Firehose Loader</label>
          <select className="select" value={selectedLoader} onChange={(e) => setSelectedLoader(e.target.value)}>
            <option value="">-- 选择加载器 --</option>
            {loaders.map((loader) => (
              <option key={loader.path} value={loader.path}>{loader.name} — {loader.description}</option>
            ))}
          </select>
        </div>
        <button onClick={handlePrintGpt} disabled={!selectedLoader || loading} className="btn-primary flex items-center gap-2">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          读取 GPT
        </button>
        <button onClick={handleReset} disabled={!selectedLoader} className="btn-danger flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />重置设备
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-800/80 border-b border-slate-700/50">
          <span className="col-span-5">分区名</span>
          <span className="col-span-2 text-right">大小</span>
          <span className="col-span-2 text-right">起始 LBA</span>
          <span className="col-span-3 text-right">操作</span>
        </div>
        {partitions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">读取 GPT 后显示分区列表。</div>
        ) : (
          <div className="divide-y divide-slate-700/50 max-h-[480px] overflow-y-auto">
            {partitions.map((part) => (
              <div key={`${part.lun ?? 0}:${part.label}`} className="grid grid-cols-12 gap-2 px-4 py-2.5 text-sm hover:bg-slate-700/30 items-center">
                <span className="col-span-5 text-slate-200 font-mono truncate">{part.label}</span>
                <span className="col-span-2 text-right text-slate-400 text-xs">{formatSize(part.sizeBytes)}</span>
                <span className="col-span-2 text-right text-slate-400 text-xs">{part.firstLba}</span>
                <div className="col-span-3 flex justify-end gap-1">
                  <button onClick={() => handleBackup(part.label)} disabled={!!operating} title="备份" className="p-1.5 hover:bg-slate-600 rounded">
                    {operating === `backup:${part.label}` ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                  <button onClick={() => handleRestore(part.label)} disabled={!!operating} title="恢复" className="p-1.5 hover:bg-slate-600 rounded">
                    {operating === `restore:${part.label}` ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-green-400" />}
                  </button>
                  <button onClick={() => handleErase(part.label)} disabled={!!operating} title="擦除" className="p-1.5 hover:bg-slate-600 rounded">
                    {operating === `erase:${part.label}` ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 text-red-400" />}
                  </button>
                  <button onClick={() => handleVerify(part.label)} disabled={!!operating} title="校验" className="p-1.5 hover:bg-slate-600 rounded">
                    {operating === `verify:${part.label}` ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 text-yellow-400" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3"><Clock className="w-4 h-4" />操作历史</h2>
        {history.length === 0 ? <p className="text-slate-500 text-sm">暂无历史记录。</p> : (
          <div className="space-y-1 max-h-44 overflow-y-auto">
            {history.map((item, i) => (
              <div key={i} className="text-xs text-slate-400">
                <span className="text-slate-600">{new Date(item.timestamp).toLocaleString()}</span>{' '}
                <span className={item.success ? 'text-green-400' : 'text-red-400'}>[{item.type}]</span>{' '}
                {item.label} — {item.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
