import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * React.lazy with retries. A lazy page chunk can fail to load on a flaky
 * connection; without a retry the failed import throws during render and —
 * with no error boundary above it — unmounts the whole app into a blank
 * page. Retrying the import twice (with a short back-off) recovers from
 * transient failures before the user ever sees an error.
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  importer: () => Promise<{ default: T }>,
  retries = 2,
): LazyExoticComponent<T> {
  const attempt = (remaining: number): Promise<{ default: T }> =>
    importer().catch((error: unknown) => {
      if (remaining <= 0) throw error;
      const delay = 400 * (retries - remaining + 1);
      return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
        attempt(remaining - 1),
      );
    });
  return lazy(() => attempt(retries));
}
