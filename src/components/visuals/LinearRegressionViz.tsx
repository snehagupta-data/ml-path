import { useMemo, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '../ui';
import { mulberry32, randn } from './seed';

// True relationship: y = 2x + 1 + noise. The fit line is computed live by
// ordinary least squares from the points on screen — no hard-coded line.
const W = 640;
const H = 340;
const PAD = { l: 44, r: 16, t: 16, b: 32 };

export default function LinearRegressionViz() {
  const [seed, setSeed] = useState(7);
  const [sigma, setSigma] = useState(1.5);
  const [showResiduals, setShowResiduals] = useState(false);

  const points = useMemo(() => {
    const rng = mulberry32(seed);
    return Array.from({ length: 30 }, () => {
      const x = rng() * 10;
      return { x, y: 2 * x + 1 + randn(rng) * sigma };
    });
  }, [seed, sigma]);

  const fit = useMemo(() => {
    const n = points.length;
    const mx = points.reduce((a, p) => a + p.x, 0) / n;
    const my = points.reduce((a, p) => a + p.y, 0) / n;
    let sxx = 0;
    let sxy = 0;
    for (const p of points) {
      sxx += (p.x - mx) ** 2;
      sxy += (p.x - mx) * (p.y - my);
    }
    const slope = sxx === 0 ? 0 : sxy / sxx;
    const intercept = my - slope * mx;
    let ssRes = 0;
    let ssTot = 0;
    for (const p of points) {
      const pred = slope * p.x + intercept;
      ssRes += (p.y - pred) ** 2;
      ssTot += (p.y - my) ** 2;
    }
    const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;
    return { slope, intercept, r2 };
  }, [points]);

  const yMin = Math.min(-1, ...points.map((p) => p.y)) - 1;
  const yMax = Math.max(22, ...points.map((p) => p.y)) + 1;
  const sx = (x: number): number => PAD.l + (x / 10) * (W - PAD.l - PAD.r);
  const sy = (y: number): number => H - PAD.b - ((y - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);

  return (
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Thirty points from the true line y = 2x + 1 plus Gaussian noise. The blue line is the
        least-squares fit, recomputed from the points every time the data changes. Add noise and
        watch R² fall — the fit gets less certain even though the true relationship never changed.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button size="sm" variant="secondary" onClick={() => setSigma((s) => Math.min(4.5, s + 0.75))}>
          <Plus className="h-4 w-4" /> Add noise
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setSigma(1.5)}>
          Reset noise
        </Button>
        <Button size="sm" variant="outline" onClick={() => setSeed((s) => s + 1)}>
          <RefreshCw className="h-4 w-4" /> Regenerate data
        </Button>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={showResiduals}
            onChange={(e) => setShowResiduals(e.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
          Show residuals
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Scatter plot with least squares fit line, slope ${fit.slope.toFixed(2)}, R squared ${fit.r2.toFixed(2)}`}
        >
          {[0, 2, 4, 6, 8, 10].map((x) => (
            <g key={x}>
              <line x1={sx(x)} y1={PAD.t} x2={sx(x)} y2={H - PAD.b} className="stroke-slate-100 dark:stroke-slate-800" />
              <text x={sx(x)} y={H - 10} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">{x}</text>
            </g>
          ))}
          {Array.from({ length: 6 }, (_, i) => yMin + ((yMax - yMin) * i) / 5).map((y, i) => (
            <g key={i}>
              <line x1={PAD.l} y1={sy(y)} x2={W - PAD.r} y2={sy(y)} className="stroke-slate-100 dark:stroke-slate-800" />
              <text x={PAD.l - 6} y={sy(y) + 4} textAnchor="end" className="fill-slate-500 text-[11px] dark:fill-slate-400">
                {y.toFixed(0)}
              </text>
            </g>
          ))}

          {/* Residuals */}
          {showResiduals &&
            points.map((p, i) => (
              <line
                key={i}
                x1={sx(p.x)}
                y1={sy(p.y)}
                x2={sx(p.x)}
                y2={sy(fit.slope * p.x + fit.intercept)}
                stroke="#d97706"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            ))}

          {/* Fit line */}
          <line
            x1={sx(0)}
            y1={sy(fit.intercept)}
            x2={sx(10)}
            y2={sy(fit.slope * 10 + fit.intercept)}
            stroke="#2563eb"
            strokeWidth={2.5}
          />
          {/* True line (reference) */}
          <line
            x1={sx(0)}
            y1={sy(1)}
            x2={sx(10)}
            y2={sy(21)}
            className="stroke-slate-400 dark:stroke-slate-500"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />

          {points.map((p, i) => (
            <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={4.5} fill="#2563eb" fillOpacity={0.75} />
          ))}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="text-slate-600 dark:text-slate-400">
          Slope = <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">{fit.slope.toFixed(3)}</span>
          <span className="text-slate-400"> (true: 2.000)</span>
        </span>
        <span className="text-slate-600 dark:text-slate-400">
          Intercept = <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">{fit.intercept.toFixed(3)}</span>
          <span className="text-slate-400"> (true: 1.000)</span>
        </span>
        <span className="text-slate-600 dark:text-slate-400">
          R² = <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">{fit.r2.toFixed(3)}</span>
        </span>
        <span className="text-slate-600 dark:text-slate-400">
          Noise σ = <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">{sigma.toFixed(2)}</span>
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Dashed grey line is the true relationship; solid blue is the fitted line.
      </p>
    </div>
  );
}
