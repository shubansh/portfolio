import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary-dark)] text-[var(--color-text-main)] p-4">
          <div className="glass-panel p-8 max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <AlertTriangle size={64} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-[var(--color-text-muted)] text-sm">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[var(--color-neon-blue)] text-black font-semibold rounded-lg hover:bg-opacity-90 transition-all shadow-[0_0_15px_var(--color-neon-blue)]"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
