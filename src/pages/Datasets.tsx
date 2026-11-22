import { Link } from 'react-router-dom';
import { ArrowRight, Database, ListChecks, Rows3 } from 'lucide-react';
import { DATASETS } from '../content';
import { useStore } from '../store/store';
import { Badge, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui';
import type { Dataset } from '../types';

function DatasetCard({ dataset }: { dataset: Dataset }) {
  const { state } = useStore();
  const doneCount = dataset.tasks.filter(
    (t) => state.datasetTaskDone[`${dataset.id}:${t.id}`],
  ).length;
  const progress =
    dataset.tasks.length > 0 ? Math.round((doneCount / dataset.tasks.length) * 100) : 0;

  return (
    <Card className="flex flex-col p-5 transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="blue">
          <Rows3 className="h-3 w-3" aria-hidden />
          {dataset.rows.toLocaleString('en-IN')} rows
        </Badge>
        <Badge tone="neutral">{dataset.columns.length} columns</Badge>
      </div>
      <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
        {dataset.name}
      </h2>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {dataset.businessContext}
      </p>
      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
        <span className="font-medium">Target:</span> {dataset.target}
      </p>

      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
            <ListChecks className="h-3.5 w-3.5 text-slate-400" aria-hidden />
            Guided tasks
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {doneCount} of {dataset.tasks.length} done · {progress}%
          </span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <Link
        to={`/datasets/${dataset.id}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        aria-label={`Open dataset: ${dataset.name}`}
      >
        Explore dataset
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </Card>
  );
}

export default function DatasetsPage() {
  if (DATASETS.length === 0) {
    return (
      <div>
        <PageHeader
          title="Dataset Lab"
          subtitle="Real data, real tasks. Load a dataset, explore it, and work through guided tasks from EDA to business recommendations."
        />
        <EmptyState
          icon={<Database className="h-6 w-6" aria-hidden />}
          title="No datasets yet"
          detail="Dataset content is still being written. Check back once the dataset library is published."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dataset Lab"
        subtitle="Real data, real tasks. Load a dataset, explore it, and work through guided tasks from EDA to business recommendations."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {DATASETS.map((d) => (
          <DatasetCard key={d.id} dataset={d} />
        ))}
      </div>
    </div>
  );
}
