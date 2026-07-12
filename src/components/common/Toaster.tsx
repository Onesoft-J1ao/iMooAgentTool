import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToasterProvider');
  return ctx;
}

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle size={20} className="text-green-400" />,
  error: <XCircle size={20} className="text-red-400" />,
  info: <Info size={20} className="text-blue-400" />,
};

const bgColors: Record<ToastType, string> = {
  success: 'border-green-500/30 bg-green-500/10',
  error: 'border-red-500/30 bg-red-500/10',
  info: 'border-blue-500/30 bg-blue-500/10',
};

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    if (t.duration === 0) return;
    const timer = setTimeout(() => onDismiss(t.id), t.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [t, onDismiss]);

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-md shadow-lg ${bgColors[t.type]} animate-in slide-in-from-right`}
      style={{ animation: 'slideIn 0.3s ease-out' }}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[t.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200">{t.title}</p>
        {t.message && <p className="text-xs text-slate-400 mt-0.5">{t.message}</p>}
      </div>
      <button onClick={() => onDismiss(t.id)} className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
}

export function Toaster({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message?: string, duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
  }, []);

  const toast: ToastContextValue = {
    toast: addToast,
    success: (title, message) => addToast('success', title, message),
    error: (title, message) => addToast('error', title, message),
    info: (title, message) => addToast('info', title, message),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-14 right-4 z-[9999] flex flex-col gap-2 w-80 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
