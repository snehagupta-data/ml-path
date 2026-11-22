import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RefreshCw, RotateCcw, StepForward } from 'lucide-react';
import { Badge, Button } from '../ui';
import { mulberry32, randn } from './seed';

interface Pt {
  x: number;
  y: number;
}

const COLORS = ['#2563eb', '#d97706', '#059669', '#7c3aed'];
const W = 640;
const H = 360;
const PAD = { l: 28, r: 28, t: 20, b: 28 };
const MAX_ITER = 25;

const BLOBS: Pt[] = [
  { x: 2.2, y: 2.4 },
  { x: 7.8, y: 2.6 },
  { x: 2.6, y: 7.6 },
  { x: 7.6, y: 7.4 },
];

function genPoints(seed: number): Pt[] {
  const rng = mulberry32(seed);
  const pts: Pt[] = [];
  for (const c of BLOBS) {
    for (let i = 0; i < 9; i++) {
      pts.push({
        x: Math.min(9.7, Math.max(0.3, c.x + randn(rng) * 0.85)),
        y: Math.min(9.7, Math.max(0.3, c.y + randn(rng) * 0.85)),
      });
    }
  }
  return pts;
}

function nearest(p: Pt, centroids: Pt[]): number {
  let best = 0;
  let bestD = Infinity;
  centroids.forEach((c, i) => {
    const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

export default function KMeansViz() {
  const [seed, setSeed] = useState(5);
  const [k, setK] = useState(3);
  const [centroids, setCentroids] = useState<Pt[]>([]);
  const [assignments, setAssignments] = useState<number[] | null>(null);
  const [iter, setIter] = useState(0);
  const [converged, setConverged] = useState(false);
  const [playing, setPlaying] = useState(false);

  const points = useMemo(() => genPoints(seed), [seed]);
  const stateRef = useRef({ centroids, assignments, iter, converged });
  stateRef.current = { centroids, assignments, iter, converged };

  const init = useCallback(
    (kVal: number) => {
      const rng = mulberry32(seed * 131 + kVal * 17 + 5);
      const idxs = new Set<number>();
      while (idxs.size < kVal) idxs.add(Math.floor(rng() * points.length));
      setCentroids([...idxs].map((i) => points[i]));
      setAssignments(null);
      setIter(0);
      setConverged(false);
      setPlaying(false);
    },
    [points, seed],
  );

  useEffect(() => {
    init(k);
  }, [init, k]);

  const stepOnce = useCallback(() => {
    const { centroids: c, assignments: a, iter: it, converged: done } = stateRef.current;
    if (done || it >= MAX_ITER || c.length === 0) return;
    const next = points.map((p) => nearest(p, c));
    const nextCentroids = c.map((centroid, ki) => {
      const members = points.filter((_, i) => next[i] === ki);
      if (members.length === 0) return centroid;
      return {
        x: members.reduce((s, p) => s + p.x, 0) / members.length,
        y: members.reduce((s, p) => s + p.y, 0) / members.length,
      };
    });
    const same = a !== null && a.every((v, i) => v === next[i]);
    setAssignments(next);
    setCentroids(nextCentroids);
    setIter(it + 1);
    if (same || it + 1 >= MAX_ITER) {
      setConverged(true);
      setPlaying(false);
    }
  }, [points]);

  useEffect(() => {
    if (!playing || converged) return undefined;
    const id = setInterval(stepOnce, 700);
    return () => clearInterval(id);
  }, [playing, converged, stepOnce]);

  const inertia = useMemo(() => {
    if (!assignments) return null;
    return points.reduce((sum, p, i) => {
      const c = centroids[assignments[i]];
      return sum + (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
    }, 0);
  }, [points, assignments, centroids]);

  const sx = (x: number): number => PAD.l + (x / 10) * (W - PAD.l - PAD.r);
  const sy = (y: number): number => H - PAD.b - (y / 10) * (H - PAD.t - PAD.b);

  return (
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        K-means alternates two steps: assign every point to its nearest centroid, then move each
        centroid to the mean of its points. Press Play and watch the centroids walk to the centres
        of the blobs. Try K = 2 or K = 4 — the "right" K depends on the data, not the algorithm.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={() => setPlaying((p) => !p)} disabled={converged}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? 'Pause' : 'Play'}
        </Button>
        <Button size="sm" variant="secondary" onClick={stepOnce} disabled={converged || playing}>
          <StepForward className="h-4 w-4" /> Step
        </Button>
        <Button size="sm" variant="outline" onClick={() => init(k)}>
          <RotateCcw className="h-4 w-4" /> Reset centroids
        </Button>
        <Button size="sm" variant="outline" onClick={() => setSeed((s) => s + 1)}>
          <RefreshCw className="h-4 w-4" /> Regenerate points
        </Button>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          K
          <span className="flex gap-1" role="group" aria-label="Number of clusters">
            {[2, 3, 4].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setK(v)}
                aria-pressed={k === v}
                className={`h-8 w-8 rounded-md border text-sm font-medium transition-colors ${
                  k === v
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {v}
              </button>
            ))}
          </span>
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={`K-means clustering with K equals ${k}, iteration ${iter}${converged ? ', converged' : ''}`}
        >
          {[0, 2, 4, 6, 8, 10].map((v) => (
            <g key={v}>
              <line x1={sx(v)} y1={PAD.t} x2={sx(v)} y2={H - PAD.b} className="stroke-slate-100 dark:stroke-slate-800" />
              <line x1={PAD.l} y1={sy(v)} x2={W - PAD.r} y2={sy(v)} className="stroke-slate-100 dark:stroke-slate-800" />
            </g>
          ))}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={sx(p.x)}
              cy={sy(p.y)}
              r={5}
              fill={assignments ? COLORS[assignments[i]] : '#94a3b8'}
              fillOpacity={0.85}
            />
          ))}
          {centroids.map((c, i) => (
            <g key={i}>
              <circle cx={sx(c.x)} cy={sy(c.y)} r={11} fill="#fff" stroke={COLORS[i]} strokeWidth={3} />
              <circle cx={sx(c.x)} cy={sy(c.y)} r={3.5} fill={COLORS[i]} />
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="text-slate-600 dark:text-slate-400">
          Iteration <span className="font-semibold text-slate-900 tabular-nums dark:text-white">{iter}</span>
        </span>
        {inertia !== null && (
          <span className="text-slate-600 dark:text-slate-400">
            Within-cluster sum of squares ={' '}
            <span className="font-mono font-semibold text-slate-900 tabular-nums dark:text-white">{inertia.toFixed(1)}</span>
            <span className="text-slate-400"> (falls each iteration)</span>
          </span>
        )}
        {converged && <Badge tone="green">Converged — assignments stopped changing</Badge>}
        {!converged && assignments === null && (
          <span className="text-slate-500 dark:text-slate-400">Centroids placed at random points — press Play or Step.</span>
        )}
      </div>
    </div>
  );
}
