import type { VisualId } from '../../types';
import GradientDescentViz from './GradientDescentViz';
import LinearRegressionViz from './LinearRegressionViz';
import BiasVarianceViz from './BiasVarianceViz';
import ConfusionMatrixViz from './ConfusionMatrixViz';
import RocViz from './RocViz';
import KMeansViz from './KMeansViz';
import DecisionTreeViz from './DecisionTreeViz';
import KnnViz from './KnnViz';
import PcaViz from './PcaViz';
import OverfittingViz from './OverfittingViz';

/**
 * Renders the interactive visualization for a lesson.
 * Stable contract: exported name `VisualRenderer`, props `{ visual: VisualId }`.
 */
export default function VisualRenderer({ visual }: { visual: VisualId }) {
  switch (visual) {
    case 'gradient-descent':
      return <GradientDescentViz />;
    case 'linear-regression':
      return <LinearRegressionViz />;
    case 'bias-variance':
      return <BiasVarianceViz />;
    case 'confusion-matrix':
      return <ConfusionMatrixViz />;
    case 'roc':
      return <RocViz />;
    case 'kmeans':
      return <KMeansViz />;
    case 'decision-tree':
      return <DecisionTreeViz />;
    case 'knn':
      return <KnnViz />;
    case 'pca':
      return <PcaViz />;
    case 'overfitting':
      return <OverfittingViz />;
    default:
      return (
        <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Unknown visualization: {visual}
        </div>
      );
  }
}
