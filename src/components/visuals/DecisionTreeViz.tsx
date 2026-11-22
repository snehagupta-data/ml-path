import { useMemo, useState } from 'react';
import { Badge } from '../ui';
import { mulberry32 } from './seed';

// A small depth-3 churn tree, hand-built with plausible counts (illustrative
// data, not a fitted model — the point is how splits partition the data).
interface TreeNode {
  id: string;
  label: string;
  rule: string;
  samples: number;
  churnRate: number; // 0–1
  prediction: 'Churn' | 'Stay';
  detail: string;
  x: number;
  y: number;
  children?: [string, string];
  edgeLabels?: [string, string];
}

const NODES: TreeNode[] = [
  {
    id: 'root', label: 'Tenure ≤ 12 months?', rule: 'Split on tenure at 12 months',
    samples: 1000, churnRate: 0.26, prediction: 'Stay',
    detail: 'All 1,000 customers. 26% churned overall. The first split is tenure: new customers churn far more than established ones.',
    x: 320, y: 36, children: ['n1', 'n2'], edgeLabels: ['Yes', 'No'],
  },
  {
    id: 'n1', label: 'Monthly charge > $70?', rule: 'Tenure ≤ 12 mo AND monthly charge > $70',
    samples: 420, churnRate: 0.41, prediction: 'Stay',
    detail: 'New customers (420) churn at 41%. Among them, the monthly charge separates the risky group: expensive plans churn much more.',
    x: 160, y: 126, children: ['n3', 'n4'], edgeLabels: ['Yes', 'No'],
  },
  {
    id: 'n2', label: 'Month-to-month contract?', rule: 'Tenure > 12 mo AND contract type',
    samples: 580, churnRate: 0.15, prediction: 'Stay',
    detail: 'Established customers (580) churn at only 15%. Contract type still matters: month-to-month customers can leave any time.',
    x: 480, y: 126, children: ['n5', 'n6'], edgeLabels: ['Yes', 'No'],
  },
  {
    id: 'n3', label: 'Predict: Churn', rule: 'Tenure ≤ 12 mo AND charge > $70',
    samples: 190, churnRate: 0.62, prediction: 'Churn',
    detail: 'The highest-risk leaf: new customers on expensive plans. 62% churned — the tree predicts Churn here. This is the retention priority.',
    x: 80, y: 216,
  },
  {
    id: 'n4', label: 'Predict: Stay', rule: 'Tenure ≤ 12 mo AND charge ≤ $70',
    samples: 230, churnRate: 0.18, prediction: 'Stay',
    detail: 'New customers on cheaper plans churn at 18% — below the overall rate, so the tree predicts Stay.',
    x: 240, y: 216,
  },
  {
    id: 'n5', label: 'Predict: Stay', rule: 'Tenure > 12 mo AND month-to-month',
    samples: 260, churnRate: 0.28, prediction: 'Stay',
    detail: 'Established but uncommitted customers churn at 28% — close to the overall rate, but still a majority stay, so the leaf predicts Stay.',
    x: 400, y: 216,
  },
  {
    id: 'n6', label: 'Predict: Stay', rule: 'Tenure > 12 mo AND 1–2 yr contract',
    samples: 320, churnRate: 0.06, prediction: 'Stay',
    detail: 'The safest leaf: long-tenure customers on fixed contracts churn at just 6%.',
    x: 560, y: 216,
  },
];

const BY_ID = new Map(NODES.map((n) => [n.id, n]));
const NODE_W = 132;
const NODE_H = 46;

// Boundary mini-plot: tenure 0–48 mo (x) vs monthly charge $20–$120 (y).
const BW = 640;
const BH = 240;
const BPAD = { l: 48, r: 16, t: 14, b: 30 };
const bx = (tenure: number): number => BPAD.l + (tenure / 48) * (BW - BPAD.l - BPAD.r);
const by = (charge: number): number => BH - BPAD.b - ((charge - 20) / 100) * (BH - BPAD.t - BPAD.b);

export default function DecisionTreeViz() {
  const [selectedId, setSelectedId] = useState('root');
  const selected = BY_ID.get(selectedId) ?? NODES[0];

  const customers = useMemo(() => {
    const rng = mulberry32(17);
    return Array.from({ length: 70 }, () => {
      const tenure = rng() * 48;
      const charge = 20 + rng() * 100;
      const highRisk = tenure <= 12 && charge > 70;
      const churned = rng() < (highRisk ? 0.62 : 0.12);
      return { tenure, charge, churned };
    });
  }, []);

  return (
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        A decision tree partitions customers with yes/no questions. Click any node to see its split
        rule, sample count and churn rate. Below, the same splits are drawn as regions in
        tenure × monthly-charge space — trees carve the feature space into axis-aligned rectangles.
      </p>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <svg viewBox="0 0 640 250" className="h-auto w-full" role="tree" aria-label="Churn decision tree">
          {NODES.filter((n) => n.children).map((n) =>
            n.children!.map((childId, i) => {
              const c = BY_ID.get(childId)!;
              const midX = (n.x + c.x) / 2;
              const midY = (n.y + NODE_H / 2 + (c.y - NODE_H / 2)) / 2;
              return (
                <g key={`${n.id}-${childId}`}>
                  <line
                    x1={n.x}
                    y1={n.y + NODE_H / 2}
                    x2={c.x}
                    y2={c.y - NODE_H / 2}
                    className="stroke-slate-300 dark:stroke-slate-600"
                    strokeWidth={1.5}
                  />
                  <text x={midX} y={midY} textAnchor="middle" className="fill-slate-500 text-[11px] font-medium dark:fill-slate-400">
                    {n.edgeLabels![i]}
                  </text>
                </g>
              );
            }),
          )}
          {NODES.map((n) => {
            const isLeaf = !n.children;
            const isSelected = n.id === selectedId;
            return (
              <g
                key={n.id}
                role="treeitem"
                aria-selected={isSelected}
                tabIndex={0}
                className="cursor-pointer"
                onClick={() => setSelectedId(n.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedId(n.id);
                  }
                }}
              >
                <rect
                  x={n.x - NODE_W / 2}
                  y={n.y - NODE_H / 2}
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  className={
                    isSelected
                      ? 'fill-blue-50 stroke-blue-600 dark:fill-blue-950 dark:stroke-blue-400'
                      : isLeaf
                        ? 'fill-slate-50 stroke-slate-300 dark:fill-slate-900 dark:stroke-slate-700'
                        : 'fill-white stroke-slate-300 dark:fill-slate-950 dark:stroke-slate-700'
                  }
                  strokeWidth={isSelected ? 2 : 1.5}
                />
                <text x={n.x} y={n.y - 4} textAnchor="middle" className="fill-slate-900 text-[12px] font-semibold dark:fill-white">
                  {n.label}
                </text>
                <text x={n.x} y={n.y + 13} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">
                  n = {n.samples} · churn {(n.churnRate * 100).toFixed(0)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node detail */}
      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{selected.label}</span>
          <Badge tone={selected.prediction === 'Churn' ? 'red' : 'green'}>Predict: {selected.prediction}</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {selected.samples} samples · {(selected.churnRate * 100).toFixed(0)}% churned
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{selected.detail}</p>
        <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400">Rule: {selected.rule}</p>
      </div>

      {/* Decision boundary */}
      <h4 className="mt-5 text-sm font-semibold text-slate-900 dark:text-white">
        Decision boundary: tenure vs monthly charge
      </h4>
      <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <svg viewBox={`0 0 ${BW} ${BH}`} className="h-auto w-full" role="img" aria-label="Decision boundary plot: new customers on expensive plans fall in the churn region">
          {/* Regions */}
          <rect x={bx(0)} y={by(120)} width={bx(12) - bx(0)} height={by(70) - by(120)} fill="#dc2626" fillOpacity={0.12} />
          <rect x={bx(0)} y={by(70)} width={bx(12) - bx(0)} height={by(20) - by(70)} fill="#059669" fillOpacity={0.08} />
          <rect x={bx(12)} y={by(120)} width={bx(48) - bx(12)} height={by(20) - by(120)} fill="#059669" fillOpacity={0.08} />
          {/* Split lines */}
          <line x1={bx(12)} y1={by(20)} x2={bx(12)} y2={by(120)} stroke="#2563eb" strokeWidth={2} />
          <line x1={bx(0)} y1={by(70)} x2={bx(12)} y2={by(70)} stroke="#2563eb" strokeWidth={2} />
          <text x={bx(12)} y={BH - 8} textAnchor="middle" className="fill-blue-600 text-[11px] font-medium dark:fill-blue-400">tenure = 12 mo</text>
          <text x={bx(6)} y={by(70) - 6} textAnchor="middle" className="fill-blue-600 text-[11px] font-medium dark:fill-blue-400">charge = $70</text>
          {/* Axes */}
          {[0, 24, 36, 48].map((t) => (
            <text key={t} x={bx(t)} y={BH - 8} textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">
              {t}
            </text>
          ))}
          {[20, 70, 120].map((c) => (
            <text key={c} x={BPAD.l - 6} y={by(c) + 4} textAnchor="end" className="fill-slate-500 text-[11px] dark:fill-slate-400">${c}</text>
          ))}
          {customers.map((c, i) => (
            <circle
              key={i}
              cx={bx(c.tenure)}
              cy={by(c.charge)}
              r={4}
              fill={c.churned ? '#dc2626' : '#2563eb'}
              fillOpacity={0.75}
            />
          ))}
          <text x={bx(6)} y={by(115)} textAnchor="middle" className="fill-red-600 text-[11px] font-semibold dark:fill-red-400">CHURN region</text>
          <text x={bx(30)} y={by(115)} textAnchor="middle" className="fill-emerald-600 text-[11px] font-semibold dark:fill-emerald-400">STAY region</text>
        </svg>
        <div className="flex flex-wrap gap-4 border-t border-slate-100 px-4 py-2 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-600" /> Churned customer</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-600" /> Stayed customer</span>
          <span>Note: the contract-type split (right branch) is not visible in this 2-D view — it slices a third dimension.</span>
        </div>
      </div>
    </div>
  );
}
