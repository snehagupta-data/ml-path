import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Badge, Button } from '../ui';

// Loss f(x) = (x − 2)² + 0.5, minimum at x = 2. Gradient descent:
//   x ← x − lr · f′(x),  f′(x) = 2(x − 2).
// The update is stable only while |1 − 2·lr| < 1, i.e. lr < 1 —
// a learning rate above 1 diverges, and the viz shows it happening.
const f = (x: number): number => (x - 2) ** 2 + 0.5;
const df = (x: number): number => 2 * (x - 2);
const X0 = -3;
const MAX_STEPS = 60;

const W = 640;
const H = 320;
const PAD = { l: 44, r: 16, t: 16, b: 32 };
const X_MIN = -5;
const X_MAX = 7;
const Y_MAX = 55;

const sx = (x: number): number => PAD.l + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - PAD.l - PAD.r);
const sy = (y: number): number => H - PAD.b - (y / Y_MAX) * (H - PAD.t - PAD.b);

const curvePath = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const x = X_MIN + ((X_MAX - X_MIN) * i) / 120;
    pts.push(`${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`);
  }
  return pts.join(' ');
})();

type Status = 'idle' | 'running' | 'converged' | 'diverged' | 'stopped';

export default function GradientDescentViz() {
  const [lr, setLr] = useState(0.15);
  const [path, setPath] = useState<number[]>([X0]);
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<Status>('idle');

  const currentX = path[path.length - 1];
  const currentLoss = f(currentX);
  const steps = path.length - 1;
  const finished = status === 'converged' || status === 'diverged' || status === 'stopped';

  const stepOnce = () => {
    if (finished) return;
    const next = currentX - lr * df(currentX);
    if (!Number.isFinite(next) || Math.abs(next) > 20) {
      setStatus('diverged');
      setPlaying(false);
      return;
    }
    setPath((prev) => [...prev, next]);
    if (Math.abs(next - 2) < 0.02) {
      setStatus('converged');
      setPlaying(false);
    } else if (steps + 1 >= MAX_STEPS) {
      setStatus('stopped');
      setPlaying(false);
    } else {
      setStatus('running');
    }
  };

  useEffect(() => {
    if (!playing) return undefined;
    const id = setInterval(stepOnce, 400);
    return () => clearInterval(id);
    // stepOnce is intentionally re-created each render so the interval
    // always sees the latest path / learning rate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, path, lr, status]);

  const reset = () => {
    setPath([X0]);
    setPlaying(false);
    setStatus('idle');
  };

  return (
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Gradient descent on the loss curve f(x) = (x − 2)² + 0.5, starting at x = −3. Each step
        moves downhill by the gradient times the learning rate. Try a small rate (slow, steady),
        then a rate above 1.0 — the steps overshoot and the run diverges.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          size="sm"
          onClick={() => setPlaying((p) => !p)}
          disabled={finished}
          aria-label={playing ? 'Pause descent' : 'Play descent'}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? 'Pause' : 'Play'}
        </Button>
        <Button size="sm" variant="secondary" onClick={stepOnce} disabled={finished || playing}>
          <StepForward className="h-4 w-4" /> Step
        </Button>
        <Button size="sm" variant="outline" onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          Learning rate
          <input
            type="range"
            min={0.01}
            max={1.1}
            step={0.01}
            value={lr}
            onChange={(e) => setLr(Number(e.target.value))}
            className="w-36 accent-blue-600"
            aria-label="Learning rate"
          />
          <span className="w-10 font-mono text-xs tabular-nums">{lr.toFixed(2)}</span>
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Loss curve with gradient descent at x equals ${currentX.toFixed(2)}, loss ${currentLoss.toFixed(2)}`}
        >
          {/* Grid + axes */}
          {[-4, -2, 0, 2, 4, 6].map((x) => (
            <g key={x}>
              <line x1={sx(x)} y1={PAD.t} x2={sx(x)} y2={H - PAD.b} className="stroke-slate-100 dark:stroke-slate-800" />
              <text x={sx(x)} y={H - 10} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">{x}</text>
            </g>
          ))}
          {[0, 10, 20, 30, 40, 50].map((y) => (
            <g key={y}>
              <line x1={PAD.l} y1={sy(y)} x2={W - PAD.r} y2={sy(y)} className="stroke-slate-100 dark:stroke-slate-800" />
              <text x={PAD.l - 6} y={sy(y) + 4} textAnchor="end" className="fill-slate-500 text-[11px] dark:fill-slate-400">{y}</text>
            </g>
          ))}
          <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} className="stroke-slate-300 dark:stroke-slate-700" />
          <line x1={sx(2)} y1={PAD.t} x2={sx(2)} y2={H - PAD.b} className="stroke-emerald-500" strokeDasharray="4 4" />
          <text x={sx(2)} y={PAD.t + 10} textAnchor="middle" className="fill-emerald-600 text-[11px] dark:fill-emerald-400">minimum (x = 2)</text>

          {/* Loss curve */}
          <path d={curvePath} fill="none" stroke="#2563eb" strokeWidth={2} />

          {/* Descent trail */}
          {path.slice(0, -1).map((x, i) => (
            <circle key={i} cx={sx(x)} cy={sy(f(x))} r={3} className="fill-slate-400 dark:fill-slate-500" />
          ))}
          {/* Current point */}
          <circle cx={sx(currentX)} cy={sy(currentLoss)} r={7} fill="#2563eb" stroke="#fff" strokeWidth={2} />
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="text-slate-600 dark:text-slate-400">
          Step <span className="font-semibold text-slate-900 tabular-nums dark:text-white">{steps}</span>
        </span>
        <span className="text-slate-600 dark:text-slate-400">
          x = <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">{currentX.toFixed(3)}</span>
        </span>
        <span className="text-slate-600 dark:text-slate-400">
          Loss = <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">{currentLoss.toFixed(3)}</span>
        </span>
        {status === 'converged' && <Badge tone="green">Converged — reached the minimum</Badge>}
        {status === 'diverged' && (
          <Badge tone="red">Diverged — lr {lr.toFixed(2)} is too high, steps overshoot</Badge>
        )}
        {status === 'stopped' && <Badge tone="amber">Stopped after {MAX_STEPS} steps</Badge>}
      </div>
    </div>
  );
}
