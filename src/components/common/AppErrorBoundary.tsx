import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ errorInfo: info });
    console.error('AppErrorBoundary:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-[99999]">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-lg mx-4 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <Bug className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-white">应用发生错误</h1>
            <p className="text-sm text-slate-400">
              应用程序遇到了意外错误，请尝试刷新页面或重启应用。
            </p>
            <div className="bg-slate-900/50 rounded-lg p-3 text-left max-h-24 overflow-y-auto">
              <p className="text-xs text-red-300 font-mono break-all">
                {this.state.error?.name}: {this.state.error?.message}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={this.handleReset} className="btn-secondary inline-flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                重试
              </button>
              <button onClick={this.handleReload} className="btn-primary inline-flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                刷新页面
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
