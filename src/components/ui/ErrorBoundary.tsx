import { Component, type ReactNode } from 'react';

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark p-8">
          <div className="max-w-md text-center">
            <p className="text-6xl mb-4">:(</p>
            <h1 className="text-xl font-bold dark:text-white mb-2">页面出错了</h1>
            <pre className="text-sm text-red-500 dark:text-red-400 mb-4 whitespace-pre-wrap break-all">
              {this.state.error.message}
            </pre>
            <button
              onClick={() => {
                this.setState({ error: null });
                window.location.reload();
              }}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:brightness-110 transition-all"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
