import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Play, RefreshCw, RotateCcw, XCircle } from 'lucide-react';
import { Badge, Button } from '../ui';
import {
  ensurePackages,
  initPyodide,
  runChallengeTests,
  runPython,
  type PyodideStatus,
  type RunResult,
} from '../../lib/pyodide';
import type { TestCase } from '../../types';

export interface TestOutcome {
  passed: number;
  total: number;
  details: { description: string; passed: boolean; output: string }[];
}

interface CodeRunnerProps {
  initialCode: string;
  needsPackages: ('numpy' | 'pandas')[];
  tests?: TestCase[];
  onTestsComplete?: (result: TestOutcome) => void;
  challengeId?: string;
  readOnly?: boolean;
}

/**
 * Real Python in the browser via Pyodide. Output shown here is the actual
 * stdout/stderr from the interpreter — nothing is simulated or faked.
 */
export default function CodeRunner({
  initialCode,
  needsPackages,
  tests,
  onTestsComplete,
  challengeId,
  readOnly = false,
}: CodeRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState<PyodideStatus>('idle');
  const [running, setRunning] = useState(false);
  const [runningTests, setRunningTests] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [testOutcome, setTestOutcome] = useState<TestOutcome | null>(null);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mountedRef = useRef(true);

  // Reset the editor when the challenge changes.
  useEffect(() => {
    setCode(initialCode);
    setResult(null);
    setTestOutcome(null);
  }, [initialCode, challengeId]);

  const startRuntime = useCallback(async () => {
    setStatus('loading');
    try {
      await initPyodide();
      if (mountedRef.current) setStatus('ready');
    } catch {
      if (mountedRef.current) setStatus('error');
    }
  }, []);

  // Start the runtime on mount so it is ready when the learner hits Run.
  useEffect(() => {
    mountedRef.current = true;
    void startRuntime();
    return () => {
      mountedRef.current = false;
    };
  }, [startRuntime]);

  const busy = running || runningTests || packagesLoading;

  const handleRun = async () => {
    if (busy || status !== 'ready') return;
    setRunning(true);
    setResult(null);
    try {
      if (needsPackages.length > 0) {
        setPackagesLoading(true);
        await ensurePackages(needsPackages);
        setPackagesLoading(false);
      }
      const res = await runPython(code);
      setResult(res);
    } catch (err) {
      setResult({
        stdout: '',
        stderr: err instanceof Error ? err.message : String(err),
        ok: false,
        timedOut: false,
      });
    } finally {
      setRunning(false);
      setPackagesLoading(false);
    }
  };

  const handleRunTests = async () => {
    if (!tests || busy || status !== 'ready') return;
    setRunningTests(true);
    setTestOutcome(null);
    try {
      if (needsPackages.length > 0) {
        setPackagesLoading(true);
        await ensurePackages(needsPackages);
        setPackagesLoading(false);
      }
      const outcome = await runChallengeTests(code, tests);
      setTestOutcome(outcome);
      onTestsComplete?.(outcome);
    } catch (err) {
      setTestOutcome({
        passed: 0,
        total: tests.length,
        details: tests.map((t) => ({
          description: t.description,
          passed: false,
          output: err instanceof Error ? err.message : String(err),
        })),
      });
    } finally {
      setRunningTests(false);
      setPackagesLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    const next = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
    setCode(next);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = selectionStart + 2;
    });
  };

  const resetCode = () => {
    setCode(initialCode);
    setResult(null);
    setTestOutcome(null);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-3 py-2.5 dark:border-slate-800">
        <Button size="sm" onClick={handleRun} disabled={busy || status !== 'ready'}>
          <Play className="h-4 w-4" />
          {running ? 'Running…' : 'Run'}
        </Button>
        {tests && tests.length > 0 && (
          <Button size="sm" variant="secondary" onClick={handleRunTests} disabled={busy || status !== 'ready'}>
            <CheckCircle2 className="h-4 w-4" />
            {runningTests ? 'Running tests…' : `Run tests (${tests.length})`}
          </Button>
        )}
        {!readOnly && (
          <Button size="sm" variant="ghost" onClick={resetCode} disabled={busy}>
            <RotateCcw className="h-4 w-4" /> Reset code
          </Button>
        )}
        <div className="ml-auto flex items-center gap-2">
          {needsPackages.length > 0 && (
            <Badge tone="blue">needs {needsPackages.join(', ')}</Badge>
          )}
          {status === 'loading' && <Badge tone="amber">Starting Python runtime…</Badge>}
          {status === 'ready' && <Badge tone="green">Python ready</Badge>}
          {status === 'error' && <Badge tone="red">Runtime failed to load</Badge>}
        </div>
      </div>

      {/* Runtime status banners */}
      {status === 'loading' && (
        <p className="border-b border-slate-200 bg-amber-50 px-4 py-2 text-xs text-amber-800 dark:border-slate-800 dark:bg-amber-950/60 dark:text-amber-200" role="status">
          Starting Python runtime… this takes a few seconds on first use. Code runs entirely in
          your browser — nothing is sent to a server.
        </p>
      )}
      {status === 'error' && (
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-red-50 px-4 py-2.5 dark:border-slate-800 dark:bg-red-950/60" role="alert">
          <p className="text-xs text-red-800 dark:text-red-200">
            Python runtime couldn't load — check your connection and retry.
          </p>
          <Button size="sm" variant="outline" onClick={() => void startRuntime()}>
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </div>
      )}
      {packagesLoading && (
        <p className="border-b border-slate-200 bg-blue-50 px-4 py-2 text-xs text-blue-800 dark:border-slate-800 dark:bg-blue-950/60 dark:text-blue-200" role="status">
          Loading {needsPackages.join(', ')}… first load takes a few seconds.
        </p>
      )}

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        spellCheck={false}
        aria-label="Python code editor"
        className="code-block block h-72 w-full resize-y bg-slate-50 p-4 text-slate-900 outline-none dark:bg-slate-950 dark:text-slate-100"
        placeholder="# Write your Python here…"
      />

      {/* Output */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-4 pt-3">
          <h4 className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Output
          </h4>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Runs time out after 15s (infinite loops are stopped and the runtime resets).
          </span>
        </div>
        {result === null && testOutcome === null && (
          <p className="px-4 py-4 text-sm text-slate-400 dark:text-slate-500">
            Run your code to see real output here.
          </p>
        )}
        {result !== null && (
          <pre className="code-block max-h-64 overflow-auto px-4 py-3 whitespace-pre-wrap text-slate-800 dark:text-slate-200">
            {result.stdout}
            {result.stderr && (
              <span className="text-red-600 dark:text-red-400">{result.stderr}</span>
            )}
            {!result.stdout && !result.stderr && (
              <span className="text-slate-400 dark:text-slate-500">
                (no output — the code ran without printing anything)
              </span>
            )}
            {result.timedOut && (
              <span className="text-red-600 dark:text-red-400">
                {'\n'}[Execution timed out — the runtime was reset. Check for infinite loops.]
              </span>
            )}
          </pre>
        )}

        {/* Test results */}
        {testOutcome !== null && (
          <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {testOutcome.passed === testOutcome.total ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  All {testOutcome.total} tests passed
                </span>
              ) : (
                <span>
                  {testOutcome.passed} of {testOutcome.total} tests passed
                </span>
              )}
            </p>
            <ul className="mt-2 space-y-2">
              {testOutcome.details.map((d, i) => (
                <li key={i} className="rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">
                  <div className="flex items-start gap-2 text-sm">
                    {d.passed ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    )}
                    <span className="font-medium text-slate-800 dark:text-slate-100">{d.description}</span>
                    <Badge tone={d.passed ? 'green' : 'red'} className="ml-auto shrink-0">
                      {d.passed ? 'PASS' : 'FAIL'}
                    </Badge>
                  </div>
                  {!d.passed && d.output && (
                    <pre className="code-block mt-2 max-h-40 overflow-auto rounded bg-slate-50 p-2 whitespace-pre-wrap text-red-600 dark:bg-slate-950 dark:text-red-400">
                      {d.output}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
