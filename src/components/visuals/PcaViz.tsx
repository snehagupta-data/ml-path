import { useMemo, useState } from 'react';
import { mulberry32, randn } from './seed';

// Elongated 2-D cloud: most spread along a 35° axis, little spread across it.
// The covariance matrix and its eigen-decomposition are computed from the
// data (closed form for 2×2) — PC1, PC2 and the variance-explained figures
// are real, not hard-coded.
const W = 640;
const H = 360;
const PAD = 28;
const ANGLE = (35 * Math.PI) / 180;

interface Pt {
  x: number;
  y: number;
}

export default function PcaViz() {
  const [alpha, setAlpha] = useState(0); // 0 = original, 1 = fully projected onto PC1

  const { points, center, pc1, pc2, lambda1, lambda2, varExplained1 } = useMemo(() => {
    const rng = mulberry32(11);
    const dir = { x: Math.cos(ANGLE), y: Math.sin(ANGLE) };
    const perp = { x: -Math.sin(ANGLE), y: Math.cos(ANGLE) };
    const raw: Pt[] = Array.from({ length: 60 }, () => {
      const t = randn(rng) * 3;
      const p = randn(rng) * 0.9;
      return { x: 5 + dir.x * t + perp.x * p, y: 5 + dir.y * t + perp.y * p };
    });
    const cx = raw.reduce((s, p) => s + p.x, 0) / raw.length;
    const cy = raw.reduce((s, p) => s + p.y, 0) / raw.length;
    const centered = raw.map((p) => ({ x: p.x - cx, y: p.y - cy }));
    const n = raw.length;
    const sxx = centered.reduce((s, p) => s + p.x * p.x, 0) / n;
    const syy = centered.reduce((s, p) => s + p.y * p.y, 0) / n;
    const sxy = centered.reduce((s, p) => s + p.x * p.y, 0) / n;
    // Eigenvalues of [[sxx, sxy], [sxy, syy]]
    const tr = sxx + syy;
    const det = sxx * syy - sxy * sxy;
    const disc = Math.sqrt(Math.max(0, (tr / 2) ** 2 - det));
    const l1 = tr / 2 + disc;
    const l2 = tr / 2 - disc;
    // Eigenvector for λ1: (λ1 − syy, sxy), normalized (fall back to (1, 0)).
    let v1 = { x: l1 - syy, y: sxy };
    const norm = Math.hypot(v1.x, v1.y);
    v1 = norm < 1e-9 ? { x: 1, y: 0 } : { x: v1.x / norm, y: v1.y / norm };
    const v2 = { x: -v1.y, y: v1.x };
    return {
      points: centered,
      center: { x: cx, y: cy },
      pc1: v1,
      pc2: v2,
      lambda1: l1,
      lambda2: l2,
      varExplained1: l1 / (l1 + l2),
    };
  }, []);

  const sx = (x: number): number => PAD + (x / 10) * (W - 2 * PAD);
  const sy = (y: number): number => H - PAD - (y / 10) * (H - 2 * PAD);

  // Displayed point: interpolate between the original position and its
  // projection onto PC1 (through the centre).
  const displayed = points.map((p) => {
    const t = p.x * pc1.x + p.y * pc1.y; // coordinate along PC1
    const proj = { x: pc1.x * t, y: pc1.y * t };
    return {
      x: center.x + p.x + alpha * (proj.x - p.x),
      y: center.y + p.y + alpha * (proj.y - p.y),
    };
  });

  const arrowLen1 = 1.6 * Math.sqrt(lambda1);
  const arrowLen2 = 1.6 * Math.sqrt(lambda2);

  return (
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        PCA finds the directions of greatest spread. This cloud is stretched along a diagonal, so
        the first principal component (PC1) captures most of the variance. Drag the slider to
        project every point onto PC1 — the cloud collapses onto a line, and the variance explained
        tells you how much information survives.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          Project onto PC1
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(alpha * 100)}
            onChange={(e) => setAlpha(Number(e.target.value) / 100)}
            className="w-48 accent-blue-600"
            aria-label="Projection onto first principal component"
          />
          <span className="w-10 font-mono text-xs font-semibold tabular-nums">{Math.round(alpha * 100)}%</span>
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={`PCA plot. PC1 explains ${(varExplained1 * 100).toFixed(1)} percent of the variance`}
        >
          {[0, 2, 4, 6, 8, 10].map((v) => (
            <g key={v}>
              <line x1={sx(v)} y1={PAD} x2={sx(v)} y2={H - PAD} className="stroke-slate-100 dark:stroke-slate-800" />
              <line x1={PAD} y1={sy(v)} x2={W - PAD} y2={sy(v)} className="stroke-slate-100 dark:stroke-slate-800" />
            </g>
          ))}
          <defs>
            <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L7,3 L0,6 Z" fill="#2563eb" />
            </marker>
            <marker id="arrow-amber" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L7,3 L0,6 Z" fill="#d97706" />
            </marker>
          </defs>
          {displayed.map((p, i) => (
            <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={4.5} fill="#2563eb" fillOpacity={0.7} />
          ))}
          {/* PC1 axis */}
          <line
            x1={sx(center.x - pc1.x * arrowLen1)}
            y1={sy(center.y - pc1.y * arrowLen1)}
            x2={sx(center.x + pc1.x * arrowLen1)}
            y2={sy(center.y + pc1.y * arrowLen1)}
            stroke="#2563eb"
            strokeWidth={2.5}
            markerEnd="url(#arrow-blue)"
          />
          <text
            x={sx(center.x + pc1.x * (arrowLen1 + 0.4))}
            y={sy(center.y + pc1.y * (arrowLen1 + 0.4))}
            className="fill-blue-600 text-xs font-semibold dark:fill-blue-400"
          >
            PC1 ({(varExplained1 * 100).toFixed(1)}%)
          </text>
          {/* PC2 axis */}
          <line
            x1={sx(center.x - pc2.x * arrowLen2)}
            y1={sy(center.y - pc2.y * arrowLen2)}
            x2={sx(center.x + pc2.x * arrowLen2)}
            y2={sy(center.y + pc2.y * arrowLen2)}
            stroke="#d97706"
            strokeWidth={2}
            markerEnd="url(#arrow-amber)"
          />
          <text
            x={sx(center.x + pc2.x * (arrowLen2 + 0.4))}
            y={sy(center.y + pc2.y * (arrowLen2 + 0.4))}
            className="fill-amber-600 text-xs font-semibold dark:fill-amber-400"
          >
            PC2 ({((1 - varExplained1) * 100).toFixed(1)}%)
          </text>
          {/* Centre */}
          <circle cx={sx(center.x)} cy={sy(center.y)} r={4} className="fill-slate-900 dark:fill-white" />
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="text-slate-600 dark:text-slate-400">
          Variance explained by PC1 ={' '}
          <span className="font-mono font-semibold text-blue-600 tabular-nums dark:text-blue-400">
            {(varExplained1 * 100).toFixed(1)}%
          </span>
        </span>
        <span className="text-slate-600 dark:text-slate-400">
          by PC2 ={' '}
          <span className="font-mono font-semibold text-amber-600 tabular-nums dark:text-amber-400">
            {((1 - varExplained1) * 100).toFixed(1)}%
          </span>
        </span>
        <span className="text-slate-600 dark:text-slate-400">
          λ₁ = <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">{lambda1.toFixed(2)}</span>
          {' · '}λ₂ = <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">{lambda2.toFixed(2)}</span>
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        At 100% projection the cloud becomes a 1-D line. Because PC1 holds most of the variance,
        that line still separates the points almost as well as the original 2-D cloud.
      </p>
    </div>
  );
}
