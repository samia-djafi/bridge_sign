import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Copy, Check } from 'lucide-react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorCode: string;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorCode: 'ERR-500',
    copied: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    const code = `ERR-${Math.floor(Math.random() * 899 + 100)}`;
    return { hasError: true, errorCode: code, copied: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught React exception', this.state.errorCode, {
      message: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleCopyDiagnostics = () => {
    const logs = logger.exportAsJson();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(logs);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-app-bg text-app-text">
          <div className="max-w-md w-full p-6 rounded-card bg-app-surface border border-app-border shadow-3 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/40 text-app-error mx-auto flex items-center justify-center">
              <AlertOctagon className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-app-text">Une erreur est survenue</h2>
              <p className="text-sm text-app-muted mt-1">
                L'application a rencontré un problème inattendu.
              </p>
              <p className="text-xs font-mono text-app-muted mt-1">Code : {this.state.errorCode}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={this.handleReload}
                iconStart={<RotateCcw className="w-4 h-4" />}
              >
                Recharger l'application
              </Button>

              <Button
                variant="secondary"
                onClick={this.handleCopyDiagnostics}
                iconStart={
                  this.state.copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />
                }
              >
                {this.state.copied ? 'Copié !' : 'Copier le diagnostic'}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
