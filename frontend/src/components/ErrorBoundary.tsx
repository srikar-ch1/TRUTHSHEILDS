import { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
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

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("TRUTHSHIELD Error Boundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-100 mb-3">
              Something went wrong
            </h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              An unexpected error occurred. This has been logged for review.
            </p>
            {this.state.error && (
              <div className="mb-6 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30 text-left">
                <p className="text-xs text-red-400 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-semibold text-sm hover:from-cyan-400 hover:to-indigo-400 transition-all shadow-lg shadow-cyan-500/25"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
