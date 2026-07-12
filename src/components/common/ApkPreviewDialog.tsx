import { useState, useEffect } from 'react';
import { Package, X, Download, Smartphone, Shield, FileCode } from 'lucide-react';
import { api } from '@/lib/api';

interface ApkInfo {
  package: string;
  name: string;
  version: string;
  icon?: string;
}

interface ApkPreviewDialogProps {
  apkPath: string;
  open: boolean;
  onClose: () => void;
  onInstall?: (path: string) => void;
}

export function ApkPreviewDialog({ apkPath, open, onClose, onInstall }: ApkPreviewDialogProps) {
  const [apkInfo, setApkInfo] = useState<ApkInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !apkPath) return;
    setLoading(true);
    setError(null);
    api.file.parseApk(apkPath)
      .then(setApkInfo)
      .catch((e) => setError(e?.message ?? '解析 APK 失败'))
      .finally(() => setLoading(false));
  }, [open, apkPath]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Package size={22} className="text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-white">APK 预览</h2>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X size={20} />
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">解析 APK 中...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {apkInfo && !loading && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg">
                {apkInfo.icon ? (
                  <img src={apkInfo.icon} alt={apkInfo.name} className="w-16 h-16 rounded-xl" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center">
                    <Smartphone size={28} className="text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white truncate">{apkInfo.name}</h3>
                  <p className="text-sm text-slate-400 truncate">{apkInfo.package}</p>
                  <p className="text-xs text-slate-500 mt-0.5">版本: {apkInfo.version}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                  <Shield size={16} className="text-slate-500" />
                  <div>
                    <p className="text-[10px] text-slate-500">包名</p>
                    <p className="text-xs text-slate-300 truncate max-w-[120px]">{apkInfo.package}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                  <FileCode size={16} className="text-slate-500" />
                  <div>
                    <p className="text-[10px] text-slate-500">版本</p>
                    <p className="text-xs text-slate-300">{apkInfo.version}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 mb-1">文件路径</p>
                <p className="text-xs text-slate-400 break-all font-mono">{apkPath}</p>
              </div>

              {onInstall && (
                <button onClick={() => onInstall(apkPath)} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Download size={16} />
                  安装应用
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
