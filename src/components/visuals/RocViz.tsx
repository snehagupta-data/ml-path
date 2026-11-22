import { useMemo, useState } from 'react';
import { clamp, mulberry32, randn } from './seed';

// Fixed scored sample set: 50 positives ~ N(0.70, 0.18), 50 negatives
// ~ N(0.30, 0.18). The ROC curve is built by sweeping the threshold over
// every observed score; AUC is the trapezoid area under the curve.
const W = 560;
const H = 420;
const PAD = { l: 48, r: 20, t: 20, b: 44 };

export default function RocViz() {
  const [threshold, setThreshold] = useState(0.5);

  const { pos, neg } = useMemo(() => {
    const rng = mulberry32(99);
    return {
      pos: Array.from({ length: 50 }, () => clamp(0.7 + randn(rng) * 0.18, 0.01, 0.99)),
      neg: Array.from({ length: 50 }, () => clamp(0.3 + randn(rng) * 0.18, 0.01, 0.99)),
    };
  }, []);

  const { curve, auc } = useMemo(() => {
    const thresholds = [...new Set([...pos, ...neg])].sort((a, b) => b - a);
    const pts: { fpr: number; tpr: number }[] = [{ fpr: 0, tpr: 0 }];
    for (const t of thresholds) {
      const tpr = pos.filter((s) => s >= t).length / pos.length;
      const fpr = neg.filter((s) => s >= t).length / neg.length;
      const last = pts[pts.length - 1];
      if (fpr !== last.fpr || tpr !== last.tpr) pts.push({ fpr, tpr });
    }
    pts.push({ fpr: 1, tpr: 1 });
    let area = 0;
    for (let i = 1; i < pts.length; i++) {
      area += (pts[i].fpr - pts[i - 1].fpr) * ((pts[i].tpr + pts[i - 1].tpr) / 2);
    }
    return { curve: pts, auc: area };
  }, [pos, neg]);

  const tpr = pos.filter((s) => s >= threshold).length / pos.length;
  const fpr = neg.filter((s) => s >= threshold).length / neg.length;

  const sx = (f: number): number => PAD.l + f * (W - PAD.l - PAD.r);
  const sy = (t: number): number => H - PAD.b - t * (H - PAD.t - PAD.b);
  const path = curve.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.fpr).toFixed(1)},${sy(p.tpr).toFixed(1)}`).join(' ');

  return (
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        The ROC curve plots true positive rate against false positive rate as the threshold sweeps
        from 1 down to 0. A perfect classifier hugs the top-left corner; the diagonal is random
        guessing (AUC 0.5). Drag the threshold to move the operating point along the curve.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          Threshold
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-48 accent-blue-600"
            aria-label="Classification threshold"
          />
          <span className="w-10 font-mono text-xs font-semibold tabular-nums">{threshold.toFixed(2)}</span>
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`ROC curve with area under curve ${auc.toFixed(3)}. At threshold ${threshold.toFixed(2)}, true positive rate ${tpr.toFixed(2)}, false positive rate ${fpr.toFixed(2)}`}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <g key={v}>
                <line x1={sx(v)} y1={PAD.t} x2={sx(v)} y2={H - PAD.b} className="stroke-slate-100 dark:stroke-slate-800" />
                <line x1={PAD.l} y1={sy(v)} x2={W - PAD.r} y2={sy(v)} className="stroke-slate-100 dark:stroke-slate-800" />
                <text x={sx(v)} y={H - PAD.b + 18} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">{v.toFixed(2)}</text>
                <text x={PAD.l - 8} y={sy(v) + 4} textAnchor="end" className="fill-slate-500 text-[11px] dark:fill-slate-400">{v.toFixed(2)}</text>
              </g>
            ))}
            <text x={(W + PAD.l) / 2} y={H - 6} textAnchor="middle" className="fill-slate-600 text-xs dark:fill-slate-400">
              False positive rate
            </text>
            <text
              x={14}
              y={(H - PAD.b + PAD.t) / 2}
              textAnchor="middle"
              transform={`rotate(-90 14 ${(H - PAD.b + PAD.t) / 2})`}
              className="fill-slate-600 text-xs dark:fill-slate-400"
            >
              True positive rate
            </text>
            {/* Diagonal: random guessing */}
            <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(1)} className="stroke-slate-400 dark:stroke-slate-500" strokeWidth={1.5} strokeDasharray="6 4" />
            <text x={sx(0.62)} y={sy(0.5)} className="fill-slate-500 text-[11px] dark:fill-slate-400">random guessing</text>
            {/* ROC curve */}
            <path d={path} fill="none" stroke="#2563eb" strokeWidth={2.5} strokeLinejoin="round" />
            {/* Operating point */}
            <line x1={sx(fpr)} y1={sy(tpr)} x2={sx(fpr)} y2={H - PAD.b} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={PAD.l} y1={sy(tpr)} x2={sx(fpr)} y2={sy(tpr)} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={sx(fpr)} cy={sy(tpr)} r={6} fill="#dc2626" stroke="#fff" strokeWidth={2} />
          </svg>
        </div>

        <dl className="grid grid-cols-2 content-start gap-3">
          {[
            { name: 'AUC', value: auc.toFixed(3), hint: 'Trapezoid area under the curve' },
            { name: 'Threshold', value: threshold.toFixed(2), hint: 'Current operating point' },
            { name: 'True positive rate', value: tpr.toFixed(2), hint: 'Recall at this threshold' },
            { name: 'False positive rate', value: fpr.toFixed(2), hint: '1 − specificity' },
          ].map((m) => (
            <div key={m.name} className="rounded-lg border border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-950">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{m.name}</dt>
              <dd className="mt-1 font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white">{m.value}</dd>
              <dd className="text-[11px] text-slate-400 dark:text-slate-500">{m.hint}</dd>
            </div>
          ))}
          <p className="col-span-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            AUC is threshold-independent: it is the probability that a randomly chosen positive
            scores higher than a randomly chosen negative. This classifier scores{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{auc.toFixed(3)}</span>,
            well above the 0.5 of random guessing.
          </p>
        </dl>
      </div>
    </div>
  );
}
