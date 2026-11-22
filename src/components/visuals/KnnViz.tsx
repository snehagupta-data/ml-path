import { useMemo, useRef, useState } from 'react';
import { MousePointerClick } from 'lucide-react';
import { Badge, Button } from '../ui';
import { mulberry32, randn } from './seed';

interface Pt {
  x: number;
  y: number;
  cls: 0 | 1;
}

const W = 560;
const H = 420;
const PAD = 28;
const CLASS_COLORS = ['#2563eb', '#d97706'];
const CLASS_NAMES = ['Class A', 'Class B'];

export default function KnnViz() {
  const [k, setK] = useState(5);
  const [query, setQuery] = useState<Pt | null>({ x: 5.1, y: 4.9, cls: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const points = useMemo(() => {
    const rng = mulberry32(5);
    const pts: Pt[] = [];
    for (let i = 0; i < 14; i++) {
      pts.push({ x: 3 + randn(rng) * 1.1, y: 7 + randn(rng) * 1.1, cls: 0 });
      pts.push({ x: 7 + randn(rng) * 1.1, y: 3 + randn(rng) * 1.1, cls: 1 });
    }
    return pts.map((p) => ({
      ...p,
      x: Math.min(9.7, Math.max(0.3, p.x)),
      y: Math.min(9.7, Math.max(0.3, p.y)),
    }));
  }, []);

  const sx = (x: number): number => PAD + (x / 10) * (W - 2 * PAD);
  const sy = (y: number): number => H - PAD - (y / 10) * (H - 2 * PAD);

  const ranked = useMemo(() => {
    if (!query) return [];
    return points
      .map((p, i) => ({ i, p, d: Math.hypot(p.x - query.x, p.y - query.y) }))
      .sort((a, b) => a.d - b.d);
  }, [points, query]);

  const neighbors = ranked.slice(0, k);
  const neighborIdx = new Set(neighbors.map((n) => n.i));
  const votes = [0, 0];
  for (const n of neighbors) votes[n.p.cls] += 1;
  const tie = votes[0] === votes[1] && neighbors.length > 0;
  const prediction: 0 | 1 =
    neighbors.length === 0 ? 0 : tie ? ranked[0].p.cls : votes[0] > votes[1] ? 0 : 1;

  const placeQuery = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * W;
    const py = ((clientY - rect.top) / rect.height) * H;
    const x = Math.min(10, Math.max(0, ((px - PAD) / (W - 2 * PAD)) * 10));
    const y = Math.min(10, Math.max(0, 10 - ((py - PAD) / (H - 2 * PAD)) * 10));
    setQuery({ x, y, cls: 0 });
  };

  const randomQuery = () => {
    setQuery({
      x: 1 + Math.random() * 8,
      y: 1 + Math.random() * 8,
      cls: 0,
    });
  };

  return (
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        k-NN classifies a point by the majority class of its k nearest neighbours. Click anywhere
        on the plot to place a query point, then change k — small k follows local quirks, large k
        smooths them away. Ties are broken by the single nearest neighbour.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          k (neighbours)
          <input
            type="range"
            min={1}
            max={9}
            step={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="w-36 accent-blue-600"
            aria-label="Number of neighbours k"
          />
          <span className="w-6 font-mono text-xs font-semibold tabular-nums">{k}</span>
        </label>
        <Button size="sm" variant="outline" onClick={randomQuery}>
          <MousePointerClick className="h-4 w-4" /> Random query point
        </Button>
        {query && (
          <Badge tone={prediction === 0 ? 'blue' : 'amber'}>
            Predicted: {CLASS_NAMES[prediction]} — votes A {votes[0]} : B {votes[1]}
            {tie ? ' (tie, broken by nearest)' : ''}
          </Badge>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full cursor-crosshair"
          role="img"
          aria-label={`k-NN scatter plot. Query point predicted as ${CLASS_NAMES[prediction]} with k equals ${k}`}
          onClick={(e) => placeQuery(e.clientX, e.clientY)}
        >
          {[0, 2, 4, 6, 8, 10].map((v) => (
            <g key={v}>
              <line x1={sx(v)} y1={PAD} x2={sx(v)} y2={H - PAD} className="stroke-slate-100 dark:stroke-slate-800" />
              <line x1={PAD} y1={sy(v)} x2={W - PAD} y2={sy(v)} className="stroke-slate-100 dark:stroke-slate-800" />
            </g>
          ))}
          {/* Lines to neighbours */}
          {query &&
            neighbors.map((n) => (
              <line
                key={n.i}
                x1={sx(query.x)}
                y1={sy(query.y)}
                x2={sx(n.p.x)}
                y2={sy(n.p.y)}
                stroke={CLASS_COLORS[n.p.cls]}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                opacity={0.7}
              />
            ))}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={sx(p.x)}
              cy={sy(p.y)}
              r={neighborIdx.has(i) ? 7 : 5}
              fill={CLASS_COLORS[p.cls]}
              fillOpacity={neighborIdx.has(i) ? 1 : 0.75}
              stroke={neighborIdx.has(i) ? '#0f172a' : 'none'}
              strokeWidth={2}
            />
          ))}
          {query && (
            <g>
              <rect
                x={sx(query.x) - 8}
                y={sy(query.y) - 8}
                width={16}
                height={16}
                transform={`rotate(45 ${sx(query.x)} ${sy(query.y)})`}
                className="fill-slate-900 stroke-white dark:fill-white dark:stroke-slate-900"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>
        <div className="flex flex-wrap gap-4 border-t border-slate-100 px-4 py-2 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Class A (14 points)</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-600" /> Class B (14 points)</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rotate-45 bg-slate-900 dark:bg-white" /> Query point</span>
          <span>Ringed points are the k nearest neighbours.</span>
        </div>
      </div>

      {query && (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
          <span>
            Query at ({query.x.toFixed(1)}, {query.y.toFixed(1)})
          </span>
          <span>
            Nearest neighbour distance ={' '}
            <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">
              {ranked.length > 0 ? ranked[0].d.toFixed(2) : '—'}
            </span>
          </span>
          <span>
            Votes — {CLASS_NAMES[0]}: <span className="font-semibold text-blue-600">{votes[0]}</span>
            {' · '}
            {CLASS_NAMES[1]}: <span className="font-semibold text-amber-600">{votes[1]}</span>
          </span>
        </div>
      )}
    </div>
  );
}
