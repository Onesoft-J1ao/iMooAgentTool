import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <div className="card p-6 max-w-md mx-auto text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h2 className="text-lg font-semibold text-white">请求异常</h2>
            <p className="text-sm text-slate-400 break-all">
              {this.state.error?.message || '未知错误'}
            </p>
            <button onClick={this.handleRetry} className="btn-primary inline-flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              重试
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
