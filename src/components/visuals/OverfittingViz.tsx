import { useMemo, useState } from 'react';
import { Badge } from '../ui';
import { linspace, mulberry32, randn } from './seed';

// Noisy sine data: y = sin(x) + N(0, 0.3). 18 training points, 80 test points
// (seeds 11/12, verified: test MSE bottoms at degree 3, then rises steadily
// to degree 9 while train MSE keeps falling). Polynomial fits are computed
// live by solving the normal equations (Gaussian elimination).
const NOISE = 0.3;
const W = 640;
const H = 320;
const PAD = { l: 44, r: 16, t: 16, b: 32 };
const Y_MIN = -1.7;
const Y_MAX = 1.7;

interface Pt {
  x: number;
  y: number;
}

function genData(seed: number, n: number): Pt[] {
  const rng = mulberry32(seed);
  return Array.from({ length: n }, () => {
    const x = rng() * 2 * Math.PI;
    return { x, y: Math.sin(x) + randn(rng) * NOISE };
  });
}

/** Least-squares polynomial fit. xs must already be scaled to [-1, 1]. */
function polyfit(xs: number[], ys: number[], degree: number): number[] {
  const n = degree + 1;
  const A: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const b: number[] = new Array<number>(n).fill(0);
  for (let k = 0; k < xs.length; k++) {
    const powers = [1];
    for (let j = 1; j <= degree; j++) powers[j] = powers[j - 1] * xs[k];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) A[i][j] += powers[i] * powers[j];
      b[i] += powers[i] * ys[k];
    }
  }
  // Gaussian elimination with partial pivoting.
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = c + 1; r < n; r++) {
      const factor = M[r][c] / M[c][c];
      for (let j = c; j <= n; j++) M[r][j] -= factor * M[c][j];
    }
  }
  const coef: number[] = new Array<number>(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let s = M[r][n];
    for (let j = r + 1; j < n; j++) s -= M[r][j] * coef[j];
    coef[r] = s / M[r][r];
  }
  return coef;
}

function predict(coef: number[], u: number): number {
  let s = 0;
  for (let j = coef.length - 1; j >= 0; j--) s = s * u + coef[j];
  return s;
}

const scaleX = (x: number): number => (x - Math.PI) / Math.PI;

function mse(coef: number[], pts: Pt[]): number {
  let s = 0;
  for (const p of pts) {
    const e = predict(coef, scaleX(p.x)) - p.y;
    s += e * e;
  }
  return s / pts.length;
}

export default function OverfittingViz() {
  const [degree, setDegree] = useState(3);

  const train = useMemo(() => genData(11, 18), []);
  const test = useMemo(() => genData(12, 80), []);

  // Fit every degree once — drives the curve, the readouts and the error bars.
  const fits = useMemo(() => {
    const xs = train.map((p) => scaleX(p.x));
    const ys = train.map((p) => p.y);
    return Array.from({ length: 9 }, (_, i) => {
      const d = i + 1;
      const coef = polyfit(xs, ys, d);
      return { degree: d, coef, trainMse: mse(coef, train), testMse: mse(coef, test) };
    });
  }, [train, test]);

  const current = fits[degree - 1];
  const bestDegree = fits.reduce((best, f) => (f.testMse < best.testMse ? f : best), fits[0]).degree;
  const maxTestMse = Math.max(...fits.map((f) => f.testMse));

  const sx = (x: number): number => PAD.l + (x / (2 * Math.PI)) * (W - PAD.l - PAD.r);
  const sy = (y: number): number => H - PAD.b - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (H - PAD.t - PAD.b);

  const fittedPath = linspace(0, 2 * Math.PI, 120)
    .map((x, i) => `${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)},${sy(predict(current.coef, scaleX(x))).toFixed(1)}`)
    .join(' ');
  const truePath = linspace(0, 2 * Math.PI, 120)
    .map((x, i) => `${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)},${sy(Math.sin(x)).toFixed(1)}`)
    .join(' ');

  const verdict =
    degree <= 2
      ? { tone: 'amber' as const, text: 'Underfitting — the curve is too stiff to follow the sine wave.' }
      : degree === bestDegree
        ? { tone: 'green' as const, text: `Best test error at degree ${bestDegree} — the sweet spot for this data.` }
        : degree < bestDegree
          ? { tone: 'green' as const, text: 'Good fit — test error is near its minimum.' }
          : { tone: 'red' as const, text: 'Overfitting — the curve wiggles through training noise and test error rises.' };

  return (
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Fit polynomials of increasing degree to 18 noisy points from y = sin(x). Training error
        falls with every degree — but test error (80 fresh points) bottoms at degree {bestDegree}
        and then rises. The fitted curve starts chasing noise instead of the signal.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          Polynomial degree
          <input
            type="range"
            min={1}
            max={9}
            step={1}
            value={degree}
            onChange={(e) => setDegree(Number(e.target.value))}
            className="w-48 accent-blue-600"
            aria-label="Polynomial degree"
          />
          <span className="w-6 font-mono text-xs font-semibold tabular-nums">{degree}</span>
        </label>
        <Badge tone={verdict.tone}>{verdict.text}</Badge>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Polynomial fit of degree ${degree}. Train mean squared error ${current.trainMse.toFixed(3)}, test ${current.testMse.toFixed(3)}`}
          >
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI].map((x, i) => (
              <g key={i}>
                <line x1={sx(x)} y1={PAD.t} x2={sx(x)} y2={H - PAD.b} className="stroke-slate-100 dark:stroke-slate-800" />
                <text x={sx(x)} y={H - 10} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">
                  {['0', 'π/2', 'π', '3π/2', '2π'][i]}
                </text>
              </g>
            ))}
            {[-1, 0, 1].map((y) => (
              <g key={y}>
                <line x1={PAD.l} y1={sy(y)} x2={W - PAD.r} y2={sy(y)} className="stroke-slate-100 dark:stroke-slate-800" />
                <text x={PAD.l - 6} y={sy(y) + 4} textAnchor="end" className="fill-slate-500 text-[11px] dark:fill-slate-400">{y}</text>
              </g>
            ))}
            {/* True sine */}
            <path d={truePath} fill="none" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth={1.5} strokeDasharray="6 4" />
            {/* Fitted curve */}
            <path d={fittedPath} fill="none" stroke="#2563eb" strokeWidth={2.5} />
            {/* Test points */}
            {test.map((p, i) => (
              <circle key={`te${i}`} cx={sx(p.x)} cy={sy(p.y)} r={2.5} className="fill-slate-400 dark:fill-slate-500" fillOpacity={0.6} />
            ))}
            {/* Train points */}
            {train.map((p, i) => (
              <circle key={`tr${i}`} cx={sx(p.x)} cy={sy(p.y)} r={4.5} fill="#2563eb" fillOpacity={0.9} stroke="#fff" strokeWidth={1} />
            ))}
          </svg>
          <div className="flex flex-wrap gap-4 border-t border-slate-100 px-4 py-2 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-600" /> Training points (18)</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400" /> Test points (80)</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-blue-600" /> Fitted curve</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 border-t-2 border-dashed border-slate-400" /> True sine</span>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Error by degree (MSE)</h4>
          <div className="mt-3 space-y-1.5" role="img" aria-label="Test error by polynomial degree">
            {fits.map((f) => (
              <button
                key={f.degree}
                type="button"
                onClick={() => setDegree(f.degree)}
                aria-pressed={f.degree === degree}
                className={`flex w-full items-center gap-2 rounded px-1 py-0.5 text-left ${
                  f.degree === degree ? 'bg-blue-50 dark:bg-blue-950' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="w-6 shrink-0 font-mono text-xs text-slate-500 dark:text-slate-400">d={f.degree}</span>
                <span className="relative h-4 flex-1 overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
                  <span
                    className={`absolute inset-y-0 left-0 rounded ${f.degree === bestDegree ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${(f.testMse / maxTestMse) * 100}%` }}
                  />
                </span>
                <span className="w-14 shrink-0 text-right font-mono text-xs tabular-nums text-slate-700 dark:text-slate-300">
                  {f.testMse.toFixed(3)}
                </span>
              </button>
            ))}
          </div>
          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm dark:border-slate-800">
            <div className="flex items-center justify-between">
              <dt className="text-slate-600 dark:text-slate-400">Train MSE (degree {degree})</dt>
              <dd className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">{current.trainMse.toFixed(3)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-600 dark:text-slate-400">Test MSE (degree {degree})</dt>
              <dd className="font-mono font-semibold text-blue-600 tabular-nums dark:text-blue-400">{current.testMse.toFixed(3)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Click any bar to jump to that degree. Train error falls monotonically; test error is
            U-shaped — the gap between them is overfitting.
          </p>
        </div>
      </div>
    </div>
  );
}
