import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

const CHUNK_RELOAD_KEY = 'mlpath-chunk-reload-attempted';

function isChunkLoadError(error: Error): boolean {
  return /ChunkLoadError|Loading chunk \d+ failed|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
    error.message,
  );
}

/**
 * Top-level error boundary. If a page chunk fails to load even after the
 * lazy-import retries (e.g. a deploy replaced the chunk files mid-session),
 * the app reloads once automatically so the user lands on a working page
 * instead of a blank screen. Any other render error shows a friendly
 * recovery screen instead of crashing the whole app.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (isChunkLoadError(error)) {
      try {
        if (!sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
          sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
          window.location.reload();
          return;
        }
      } catch {
        // sessionStorage unavailable — fall through to the recovery screen.
      }
    }
    // eslint-disable-next-line no-console
    console.error('ML Path caught a render error:', error);
  }

  private handleRetry = () => {
    try {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    } catch {
      // Ignore storage errors.
    }
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            This page didn&apos;t load
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Something went wrong while loading this page — usually a brief
            network hiccup or an app update landing mid-session. Your progress
            is saved in this browser and is safe.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={this.handleRetry}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Reload the page
            </button>
            <a
              href="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Go to dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }
}
