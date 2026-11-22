import { useMemo, useState } from 'react';
import { clamp, mulberry32, randn } from './seed';

// Fixed scored sample set: 40 actual positives (scores ~ N(0.68, 0.16)) and
// 60 actual negatives (scores ~ N(0.32, 0.16)), seeded so it never changes.
const W = 640;
const H = 110;
const PAD = { l: 24, r: 24, t: 14, b: 24 };

export default function ConfusionMatrixViz() {
  const [threshold, setThreshold] = useState(0.5);

  const samples = useMemo(() => {
    const rng = mulberry32(42);
    const pos = Array.from({ length: 40 }, () => ({
      score: clamp(0.68 + randn(rng) * 0.16, 0.01, 0.99),
      jitter: (rng() - 0.5) * 14,
    }));
    const neg = Array.from({ length: 60 }, () => ({
      score: clamp(0.32 + randn(rng) * 0.16, 0.01, 0.99),
      jitter: (rng() - 0.5) * 14,
    }));
    return { pos, neg };
  }, []);

  const tp = samples.pos.filter((s) => s.score >= threshold).length;
  const fn = samples.pos.length - tp;
  const fp = samples.neg.filter((s) => s.score >= threshold).length;
  const tn = samples.neg.length - fp;
  const total = samples.pos.length + samples.neg.length;

  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  const accuracy = (tp + tn) / total;

  const sx = (score: number): number => PAD.l + score * (W - PAD.l - PAD.r);

  const cells = [
    { label: 'True Positive', short: 'TP', count: tp, correct: true, detail: 'Predicted positive, actually positive' },
    { label: 'False Negative', short: 'FN', count: fn, correct: false, detail: 'Predicted negative, actually positive' },
    { label: 'False Positive', short: 'FP', count: fp, correct: false, detail: 'Predicted positive, actually negative' },
    { label: 'True Negative', short: 'TN', count: tn, correct: true, detail: 'Predicted negative, actually negative' },
  ];

  return (
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        A classifier scored 100 cases (40 actually positive, 60 negative). Drag the threshold:
        everything at or above it is predicted positive. Lowering the threshold catches more
        positives (recall rises) but also flags more negatives (precision falls).
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
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Predicted positive: <span className="font-semibold text-slate-900 tabular-nums dark:text-white">{tp + fp}</span>
          {' · '}Predicted negative: <span className="font-semibold text-slate-900 tabular-nums dark:text-white">{fn + tn}</span>
        </span>
      </div>

      {/* Score strip */}
      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Score distribution of positive and negative cases with threshold line">
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <g key={t}>
              <line x1={sx(t)} y1={PAD.t} x2={sx(t)} y2={H - PAD.b} className="stroke-slate-100 dark:stroke-slate-800" />
              <text x={sx(t)} y={H - 6} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">{t.toFixed(2)}</text>
            </g>
          ))}
          <text x={PAD.l} y={PAD.t + 4} className="fill-blue-600 text-[11px] font-medium dark:fill-blue-400">Actual positive (40)</text>
          <text x={PAD.l} y={H - PAD.b - 26} className="fill-slate-500 text-[11px] font-medium dark:fill-slate-400">Actual negative (60)</text>
          {samples.pos.map((s, i) => (
            <circle
              key={`p${i}`}
              cx={sx(s.score)}
              cy={30 + s.jitter}
              r={4}
              fill="#2563eb"
              fillOpacity={0.8}
              stroke={s.score < threshold ? '#dc2626' : 'none'}
              strokeWidth={2}
            />
          ))}
          {samples.neg.map((s, i) => (
            <circle
              key={`n${i}`}
              cx={sx(s.score)}
              cy={66 + s.jitter}
              r={4}
              className="fill-slate-400 dark:fill-slate-500"
              fillOpacity={0.8}
              stroke={s.score >= threshold ? '#dc2626' : 'none'}
              strokeWidth={2}
            />
          ))}
          <line x1={sx(threshold)} y1={PAD.t} x2={sx(threshold)} y2={H - PAD.b} stroke="#dc2626" strokeWidth={2} strokeDasharray="5 3" />
          <text x={sx(threshold)} y={PAD.t + 4} textAnchor="middle" className="fill-red-600 text-[11px] font-medium dark:fill-red-400" dx={threshold > 0.85 ? -24 : 24}>
            threshold
          </text>
        </svg>
        <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          Dots with a red ring are mistakes at the current threshold — false negatives (top row) and false positives (bottom row).
        </p>
      </div>

      {/* 2×2 matrix */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="grid grid-cols-[auto_1fr_1fr] items-stretch gap-1.5 text-center text-sm">
            <div />
            <div className="pb-1 text-xs font-medium text-slate-500 dark:text-slate-400">Predicted positive</div>
            <div className="pb-1 text-xs font-medium text-slate-500 dark:text-slate-400">Predicted negative</div>
            <div className="flex items-center pr-1 text-xs font-medium text-slate-500 [writing-mode:vertical-rl] rotate-180 dark:text-slate-400">Actual positive</div>
            {cells.slice(0, 2).map((c) => (
              <div
                key={c.short}
                className={`rounded-lg border px-3 py-4 ${
                  c.correct
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/60'
                    : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60'
                }`}
              >
                <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{c.count}</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{c.label} ({c.short})</div>
                <div className="mt-0.5 text-[11px] leading-tight text-slate-500 dark:text-slate-400">{c.detail}</div>
              </div>
            ))}
            <div className="flex items-center pr-1 text-xs font-medium text-slate-500 [writing-mode:vertical-rl] rotate-180 dark:text-slate-400">Actual negative</div>
            {cells.slice(2).map((c) => (
              <div
                key={c.short}
                className={`rounded-lg border px-3 py-4 ${
                  c.correct
                    ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/60'
                    : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/60'
                }`}
              >
                <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{c.count}</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{c.label} ({c.short})</div>
                <div className="mt-0.5 text-[11px] leading-tight text-slate-500 dark:text-slate-400">{c.detail}</div>
              </div>
            ))}
          </div>
        </div>
        <dl className="grid grid-cols-2 content-start gap-3">
          {[
            { name: 'Precision', value: precision, hint: 'TP / (TP + FP)' },
            { name: 'Recall', value: recall, hint: 'TP / (TP + FN)' },
            { name: 'F1 score', value: f1, hint: 'Harmonic mean of P & R' },
            { name: 'Accuracy', value: accuracy, hint: '(TP + TN) / total' },
          ].map((m) => (
            <div key={m.name} className="rounded-lg border border-slate-200 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-950">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{m.name}</dt>
              <dd className="mt-1 font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                {m.value.toFixed(3)}
              </dd>
              <dd className="text-[11px] text-slate-400 dark:text-slate-500">{m.hint}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
