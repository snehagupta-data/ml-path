import { useSearchParams } from 'react-router-dom';
import { Eye, LineChart } from 'lucide-react';
import { Card, PageHeader } from '../components/ui';
import VisualRenderer from '../components/visuals/VisualRenderer';
import type { VisualId } from '../types';

interface VisualMeta {
  id: VisualId;
  title: string;
  tagline: string;
  notice: string;
}

const VISUALS: VisualMeta[] = [
  {
    id: 'gradient-descent',
    title: 'Gradient Descent',
    tagline: 'Walking downhill on a loss curve',
    notice:
      'Watch how the step size changes with the learning rate. A rate above 1.0 overshoots the minimum and diverges — the same failure mode as a too-large step in real training.',
  },
  {
    id: 'linear-regression',
    title: 'Linear Regression',
    tagline: 'Least squares, live',
    notice:
      'The fitted line is recomputed from the points every time. Add noise and R² falls even though the true relationship is unchanged — R² measures fit quality, not truth.',
  },
  {
    id: 'bias-variance',
    title: 'Bias–Variance Tradeoff',
    tagline: 'Why test error is U-shaped',
    notice:
      'Training error falls monotonically, but test error has a minimum. Left of it you underfit (high bias), right of it you overfit (high variance) — the noise floor can never be beaten.',
  },
  {
    id: 'confusion-matrix',
    title: 'Confusion Matrix',
    tagline: 'One threshold, four counts',
    notice:
      'Lowering the threshold trades precision for recall: you catch more positives but flag more negatives too. Accuracy alone hides that tradeoff — check precision and recall together.',
  },
  {
    id: 'roc',
    title: 'ROC Curve & AUC',
    tagline: 'Performance across all thresholds',
    notice:
      'The curve is threshold-independent; the slider only moves the operating point along it. AUC is the probability a random positive outscores a random negative — 0.5 is guessing.',
  },
  {
    id: 'kmeans',
    title: 'K-Means Clustering',
    tagline: 'Assign, move, repeat',
    notice:
      'Each iteration lowers the within-cluster sum of squares, and the run stops when assignments stop changing. Try K = 2 and K = 4 on the same points — K is a choice, not a discovery.',
  },
  {
    id: 'decision-tree',
    title: 'Decision Tree',
    tagline: 'Splits that partition the data',
    notice:
      'Every node is a yes/no question and every leaf is a prediction. The boundary plot shows the same splits as rectangles — trees can only draw axis-aligned boundaries.',
  },
  {
    id: 'knn',
    title: 'k-Nearest Neighbours',
    tagline: 'Classify by your neighbours',
    notice:
      'Click near the boundary between the two classes and vary k. Small k follows local quirks; large k smooths them away. The vote counts show exactly why a point was classified.',
  },
  {
    id: 'pca',
    title: 'Principal Component Analysis',
    tagline: 'Finding the directions of spread',
    notice:
      'PC1 points along the cloud\'s long axis and holds most of the variance. Projecting onto it collapses 2-D data to a line — and the variance-explained % says how much survives.',
  },
  {
    id: 'overfitting',
    title: 'Overfitting',
    tagline: 'When fitting harder makes things worse',
    notice:
      'Train error falls with every degree, but test error bottoms at degree 3 and then rises. The gap between the two curves is overfitting — the model memorises noise, not signal.',
  },
];

const VALID_IDS = new Set<string>(VISUALS.map((v) => v.id));

export default function VisualsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get('v');
  const activeId: VisualId = param && VALID_IDS.has(param) ? (param as VisualId) : 'gradient-descent';
  const active = VISUALS.find((v) => v.id === activeId) ?? VISUALS[0];

  return (
    <div>
      <PageHeader
        title="Interactive Visualizations"
        subtitle="See how the algorithms actually work. Every visual is computed live from seeded data — drag the sliders, press play, and break things on purpose."
      />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Selector */}
        <nav aria-label="Visualizations" className="lg:sticky lg:top-6 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {VISUALS.map((v) => {
              const isActive = v.id === activeId;
              return (
                <li key={v.id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setSearchParams({ v: v.id })}
                    aria-current={isActive ? 'true' : undefined}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className={`block text-sm font-semibold ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white'}`}>
                      {v.title}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{v.tagline}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Active visual */}
        <div className="min-w-0">
          <Card className="p-5 sm:p-6">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <LineChart className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{active.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{active.tagline}</p>
              </div>
            </div>
            <VisualRenderer visual={active.id} />
          </Card>

          <Card className="mt-4 border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/40">
            <div className="flex items-start gap-2.5">
              <Eye className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">What to notice</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-blue-800 dark:text-blue-200">{active.notice}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
