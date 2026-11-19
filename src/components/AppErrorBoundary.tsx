import { Component, type ReactNode } from 'react';

type State = { hasError: boolean };

class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: unknown) { console.error('App error:', error); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center bg-background">
        <p className="text-lg font-bold text-foreground">Algo não carregou direito</p>
        <p className="text-sm text-muted-foreground">Toque no botão para abrir a versão mais nova do Mamãe Zen.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold shadow-[0_0_20px_hsl(var(--primary)/0.6)]"
        >
          Recarregar Mamãe Zen
        </button>
      </div>
    );
  }
}

export default AppErrorBoundary;
