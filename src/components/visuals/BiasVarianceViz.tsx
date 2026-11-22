import { useMemo, useState } from 'react';
import { Badge } from '../ui';

// Illustrative (not fitted) decomposition, following the standard textbook
// shapes: bias² falls with complexity, variance grows with it, noise is
// constant, and expected test error = bias² + variance + noise.
const NOISE = 0.15;
const bias2 = (c: number): number => 1.4 * Math.exp(-0.5 * (c - 1)) + 0.05;
const variance = (c: number): number => 0.012 * c * c;
const testError = (c: number): number => bias2(c) + variance(c) + NOISE;
const trainError = (c: number): number => 0.55 * bias2(c) + 0.09;

const W = 640;
const H = 300;
const PAD = { l: 44, r: 16, t: 16, b: 32 };
const Y_MAX = 2.2;

const sx = (c: number): number => PAD.l + ((c - 1) / 11) * (W - PAD.l - PAD.r);
const sy = (y: number): number => H - PAD.b - (y / Y_MAX) * (H - PAD.t - PAD.b);

function linePath(fn: (c: number) => number): string {
  return Array.from({ length: 12 }, (_, i) => i + 1)
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${sx(c).toFixed(1)},${sy(fn(c)).toFixed(1)}`)
    .join(' ');
}

export default function BiasVarianceViz() {
  const [complexity, setComplexity] = useState(5);

  const best = useMemo(() => {
    let bestC = 1;
    let bestErr = Infinity;
    for (let c = 1; c <= 12; c++) {
      if (testError(c) < bestErr) {
        bestErr = testError(c);
        bestC = c;
      }
    }
    return bestC;
  }, []);

  const b = bias2(complexity);
  const v = variance(complexity);
  const test = testError(complexity);
  const train = trainError(complexity);

  const verdict =
    complexity <= 3
      ? { tone: 'amber' as const, text: 'Underfitting — high bias, the model is too simple to capture the pattern.' }
      : complexity <= 6
        ? { tone: 'green' as const, text: 'Sweet spot — bias and variance are balanced, test error is near its minimum.' }
        : { tone: 'red' as const, text: 'Overfitting — variance dominates, the model chases noise in the training data.' };

  return (
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        As model complexity grows, bias falls but variance rises. Training error keeps dropping —
        but test error is U-shaped, with a minimum at complexity {best}. Drag the slider and watch
        the decomposition change.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          Model complexity
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={complexity}
            onChange={(e) => setComplexity(Number(e.target.value))}
            className="w-48 accent-blue-600"
            aria-label="Model complexity"
          />
          <span className="w-6 font-mono text-xs font-semibold tabular-nums">{complexity}</span>
        </label>
        <Badge tone={verdict.tone}>{verdict.text}</Badge>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Train and test error versus complexity. At complexity ${complexity}, train error ${train.toFixed(2)}, test error ${test.toFixed(2)}`}
          >
            {[0, 0.5, 1, 1.5, 2].map((y) => (
              <g key={y}>
                <line x1={PAD.l} y1={sy(y)} x2={W - PAD.r} y2={sy(y)} className="stroke-slate-100 dark:stroke-slate-800" />
                <text x={PAD.l - 6} y={sy(y) + 4} textAnchor="end" className="fill-slate-500 text-[11px] dark:fill-slate-400">
                  {y.toFixed(1)}
                </text>
              </g>
            ))}
            {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
              <text key={c} x={sx(c)} y={H - 10} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">
                {c}
              </text>
            ))}
            {/* Current-complexity marker */}
            <line x1={sx(complexity)} y1={PAD.t} x2={sx(complexity)} y2={H - PAD.b} className="stroke-slate-300 dark:stroke-slate-600" strokeDasharray="4 4" />
            {/* Curves */}
            <path d={linePath(trainError)} fill="none" stroke="#059669" strokeWidth={2} />
            <path d={linePath(testError)} fill="none" stroke="#2563eb" strokeWidth={2.5} />
            {/* Minimum test error */}
            <circle cx={sx(best)} cy={sy(testError(best))} r={5} fill="#2563eb" stroke="#fff" strokeWidth={2} />
            <text x={sx(best)} y={sy(testError(best)) - 12} textAnchor="middle" className="fill-blue-600 text-[11px] font-medium dark:fill-blue-400">
              lowest test error
            </text>
            {/* Current points */}
            <circle cx={sx(complexity)} cy={sy(train)} r={4} fill="#059669" stroke="#fff" strokeWidth={1.5} />
            <circle cx={sx(complexity)} cy={sy(test)} r={4} fill="#2563eb" stroke="#fff" strokeWidth={1.5} />
          </svg>
          <div className="flex gap-4 border-t border-slate-100 px-4 py-2 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-600" /> Test error</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-600" /> Train error</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            Test error decomposition at complexity {complexity}
          </h4>
          <p className="mt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400">
            test error = bias² + variance + noise
          </p>
          {/* Stacked bar */}
          <div
            className="mt-4 flex h-8 w-full overflow-hidden rounded-md"
            role="img"
            aria-label={`Bias squared ${b.toFixed(2)}, variance ${v.toFixed(2)}, noise ${NOISE.toFixed(2)}`}
          >
            <div className="bg-amber-500" style={{ width: `${(b / test) * 100}%` }} title={`Bias² ${b.toFixed(2)}`} />
            <div className="bg-violet-500" style={{ width: `${(v / test) * 100}%` }} title={`Variance ${v.toFixed(2)}`} />
            <div className="bg-slate-400" style={{ width: `${(NOISE / test) * 100}%` }} title={`Noise ${NOISE.toFixed(2)}`} />
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Bias²</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">{b.toFixed(3)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><span className="h-2.5 w-2.5 rounded-sm bg-violet-500" /> Variance</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">{v.toFixed(3)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><span className="h-2.5 w-2.5 rounded-sm bg-slate-400" /> Irreducible noise</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">{NOISE.toFixed(3)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
              <dt className="font-medium text-slate-900 dark:text-white">Test error</dt>
              <dd className="font-mono font-semibold text-blue-600 tabular-nums dark:text-blue-400">{test.toFixed(3)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-600 dark:text-slate-400">Train error</dt>
              <dd className="font-mono font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">{train.toFixed(3)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
