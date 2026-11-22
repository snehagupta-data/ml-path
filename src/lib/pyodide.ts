// ─── Real Python execution in the browser via Pyodide ──────────────────────
// Pyodide runs CPython compiled to WebAssembly, fully client-side. No code
// is ever sent to a server, and nothing is faked: stdout/stderr are captured
// from the real interpreter. numpy and pandas can be loaded on demand.
// NOTE: scikit-learn is NOT available in Pyodide's default package set, so
// coding challenges are numpy/pandas/pure-Python only.

export type PyodideStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface RunResult {
  stdout: string;
  stderr: string;
  /** true when the snippet ran to completion without an uncaught exception */
  ok: boolean;
  timedOut: boolean;
}

const PYODIDE_VERSION = '0.27.5';
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// Minimal typing for the subset of the Pyodide API we use.
interface PyodideInterface {
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (names: string | string[]) => Promise<void>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

let pyodidePromise: Promise<PyodideInterface> | null = null;
let loadedPackages = new Set<string>();

function loadPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.loadPyodide) return resolve();
    const existing = document.querySelector('script[data-pyodide-loader]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Pyodide script')));
      return;
    }
    const script = document.createElement('script');
    script.src = `${PYODIDE_CDN}pyodide.js`;
    script.dataset.pyodideLoader = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Pyodide from CDN'));
    document.head.appendChild(script);
  });
}

/** Initialize the runtime (idempotent). Takes ~5–15s on first load. */
export async function initPyodide(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await loadPyodideScript();
      if (!window.loadPyodide) throw new Error('Pyodide loader not available');
      const py = await window.loadPyodide({ indexURL: PYODIDE_CDN });
      return py;
    })();
  }
  return pyodidePromise;
}

export async function ensurePackages(names: ('numpy' | 'pandas')[]): Promise<void> {
  const py = await initPyodide();
  const missing = names.filter((n) => !loadedPackages.has(n));
  if (missing.length === 0) return;
  await py.loadPackage(missing);
  missing.forEach((n) => loadedPackages.add(n));
}

const RUN_TIMEOUT_MS = 15000;

/**
 * Run Python code and capture real stdout/stderr. A timeout guard rejects
 * long-running code (infinite loops) — the worker is not interruptible, so
 * after a timeout the runtime is discarded and re-initialized on next use.
 */
export async function runPython(code: string, timeoutMs = RUN_TIMEOUT_MS): Promise<RunResult> {
  const py = await initPyodide();
  let stdout = '';
  let stderr = '';
  py.setStdout({ batched: (s) => { stdout += s + '\n'; } });
  py.setStderr({ batched: (s) => { stderr += s + '\n'; } });

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      py.runPythonAsync(code).then(() => ({ ok: true as const, timedOut: false })),
      new Promise<{ ok: false; timedOut: true }>((resolve) => {
        timer = setTimeout(() => resolve({ ok: false, timedOut: true }), timeoutMs);
      }),
    ]);
    if (result.timedOut) {
      // Discard the runtime so a stuck interpreter cannot poison later runs.
      pyodidePromise = null;
      loadedPackages = new Set();
      return { stdout, stderr: stderr + '\n[Execution timed out after 15s — the runtime was reset.]', ok: false, timedOut: true };
    }
    return { stdout, stderr, ok: true, timedOut: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { stdout, stderr: stderr + message, ok: false, timedOut: false };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Run learner code followed by test snippets. Each test prints PASS on
 * success; any exception or missing PASS counts as a failure.
 */
export async function runChallengeTests(
  learnerCode: string,
  tests: { testCode: string; description: string }[],
): Promise<{ passed: number; total: number; details: { description: string; passed: boolean; output: string }[] }> {
  const details: { description: string; passed: boolean; output: string }[] = [];
  let passed = 0;
  for (const test of tests) {
    const combined = `${learnerCode}\n\n# ─── test ───\n${test.testCode}`;
    const result = await runPython(combined);
    const ok = result.ok && result.stdout.includes('PASS');
    if (ok) passed += 1;
    details.push({
      description: test.description,
      passed: ok,
      output: (result.stdout + result.stderr).trim(),
    });
  }
  return { passed, total: tests.length, details };
}
