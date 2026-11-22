import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Database,
  Info,
  ListChecks,
  RefreshCw,
  Table2,
} from 'lucide-react';
import { DATASETS_BY_ID } from '../content';
import { useStore } from '../store/store';
import { parseCsv, type ParsedCsv } from '../lib/csv';
import { Badge, Button, Card, EmptyState, PageHeader } from '../components/ui';
import { cn } from '../lib/utils';
import type { Dataset, DatasetTask } from '../types';

const STAGE_ORDER: DatasetTask['stage'][] = [
  'EDA',
  'Preprocessing',
  'Modeling',
  'Evaluation',
  'Business',
];

type LoadState = 'loading' | 'ready' | 'error';

interface ColumnStat {
  column: string;
  count: number;
  min: number;
  max: number;
  mean: number;
}

/** A column is numeric when every non-empty value parses as a finite number. */
function computeColumnStats(data: ParsedCsv): ColumnStat[] {
  const stats: ColumnStat[] = [];
  for (const header of data.headers) {
    const values: number[] = [];
    let numeric = true;
    for (const row of data.rows) {
      const raw = row[header]?.trim();
      if (!raw) continue;
      const n = Number(raw);
      if (!Number.isFinite(n)) {
        numeric = false;
        break;
      }
      values.push(n);
    }
    if (!numeric || values.length === 0) continue;
    let min = values[0];
    let max = values[0];
    let sum = 0;
    for (const v of values) {
      if (v < min) min = v;
      if (v > max) max = v;
      sum += v;
    }
    stats.push({ column: header, count: values.length, min, max, mean: sum / values.length });
  }
  return stats;
}

function formatNumber(n: number): string {
  return Number.isInteger(n) ? n.toLocaleString('en-IN') : n.toFixed(2);
}

function TaskChecklist({ dataset }: { dataset: Dataset }) {
  const { state, toggleDatasetTask } = useStore();
  const doneCount = dataset.tasks.filter(
    (t) => state.datasetTaskDone[`${dataset.id}:${t.id}`],
  ).length;

  return (
    <section aria-labelledby="tasks-heading">
      <h2
        id="tasks-heading"
        className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"
      >
        <ListChecks className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />
        Guided tasks
        <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
          ({doneCount} of {dataset.tasks.length} done)
        </span>
      </h2>
      <div className="space-y-5">
        {STAGE_ORDER.map((stage) => {
          const tasks = dataset.tasks.filter((t) => t.stage === stage);
          if (tasks.length === 0) return null;
          const stageDone = tasks.filter(
            (t) => state.datasetTaskDone[`${dataset.id}:${t.id}`],
          ).length;
          return (
            <Card key={stage} className="p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{stage}</h3>
                <Badge tone={stageDone === tasks.length ? 'green' : 'neutral'}>
                  {stageDone} of {tasks.length} done
                </Badge>
              </div>
              <ul className="mt-3 space-y-2">
                {tasks.map((task) => {
                  const done = Boolean(state.datasetTaskDone[`${dataset.id}:${task.id}`]);
                  return (
                    <li
                      key={task.id}
                      className={cn(
                        'rounded-lg border p-4',
                        done
                          ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/30'
                          : 'border-slate-200 dark:border-slate-800',
                      )}
                    >
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => toggleDatasetTask(`${dataset.id}:${task.id}`)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                        />
                        <span className="min-w-0">
                          <span
                            className={cn(
                              'block text-sm font-medium',
                              done
                                ? 'text-slate-500 line-through dark:text-slate-400'
                                : 'text-slate-900 dark:text-white',
                            )}
                          >
                            {task.title}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {task.task}
                          </span>
                        </span>
                      </label>
                      {task.hint && (
                        <details className="ml-7 mt-2">
                          <summary className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            Show hint
                          </summary>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                            {task.hint}
                          </p>
                        </details>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export default function DatasetDetailPage() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const dataset = datasetId ? DATASETS_BY_ID.get(datasetId) : undefined;

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [data, setData] = useState<ParsedCsv | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const fileUrl = dataset
    ? dataset.file.startsWith('/')
      ? dataset.file
      : `/data/${dataset.file}`
    : null;

  useEffect(() => {
    if (!fileUrl) return;
    let cancelled = false;
    const controller = new AbortController();
    setLoadState('loading');
    setData(null);
    fetch(fileUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        setData(parseCsv(text));
        setLoadState('ready');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setLoadState('error');
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [fileUrl, reloadKey]);

  const stats = useMemo(() => (data ? computeColumnStats(data) : []), [data]);

  if (!dataset) {
    return (
      <div>
        <Link
          to="/datasets"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to datasets
        </Link>
        <EmptyState
          icon={<Database className="h-6 w-6" aria-hidden />}
          title="Dataset not found"
          detail="This dataset does not exist, or its content has not been published yet."
        />
      </div>
    );
  }

  const previewRows = data?.rows.slice(0, 10) ?? [];

  return (
    <div>
      <Link
        to="/datasets"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to datasets
      </Link>

      <PageHeader
        title={dataset.name}
        subtitle={dataset.businessContext}
        actions={
          <div className="flex flex-wrap gap-2">
            <Badge tone="blue">{dataset.rows.toLocaleString('en-IN')} rows</Badge>
            <Badge tone="neutral">Target: {dataset.target}</Badge>
          </div>
        }
      />

      <Card className="mb-8 flex items-start gap-3 border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
        <Info
          className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
          aria-hidden
        />
        <p className="text-sm text-slate-700 dark:text-slate-300">
          This data is synthetic, generated for learning. The patterns are realistic, but the
          rows do not describe real people, customers, or transactions.
        </p>
      </Card>

      <div className="space-y-8">
        {/* Data preview + stats */}
        <section aria-labelledby="preview-heading">
          <h2
            id="preview-heading"
            className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"
          >
            <Table2 className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />
            Data preview
          </h2>

          {loadState === 'loading' && (
            <Card className="px-6 py-12 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400" role="status" aria-live="polite">
                Loading the dataset file…
              </p>
            </Card>
          )}

          {loadState === 'error' && (
            <Card className="flex flex-col items-center px-6 py-12 text-center">
              <AlertTriangle className="mb-3 h-8 w-8 text-amber-500" aria-hidden />
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Couldn&apos;t load the dataset file. Please retry.
              </p>
              <Button variant="secondary" className="mt-4" onClick={() => setReloadKey((k) => k + 1)}>
                <RefreshCw className="h-4 w-4" aria-hidden />
                Retry
              </Button>
            </Card>
          )}

          {loadState === 'ready' && data && (
            <div className="space-y-5">
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                        {data.headers.map((h) => (
                          <th
                            key={h}
                            scope="col"
                            className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                        >
                          {data.headers.map((h) => (
                            <td
                              key={h}
                              className="whitespace-nowrap px-4 py-2 text-slate-700 dark:text-slate-300"
                            >
                              {row[h] === '' ? (
                                <span className="text-slate-400 dark:text-slate-500">—</span>
                              ) : (
                                row[h]
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="border-t border-slate-100 px-4 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  Showing first {previewRows.length} of {data.rows.length.toLocaleString('en-IN')}{' '}
                  loaded rows
                </p>
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Column stats — numeric columns
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Computed from the loaded rows, not from the data dictionary.
                </p>
                {stats.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                    No numeric columns in this dataset.
                  </p>
                ) : (
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                          <th
                            scope="col"
                            className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                          >
                            Column
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                          >
                            Values
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                          >
                            Min
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                          >
                            Max
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                          >
                            Mean
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.map((s) => (
                          <tr
                            key={s.column}
                            className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                          >
                            <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">
                              {s.column}
                            </td>
                            <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-300">
                              {s.count.toLocaleString('en-IN')}
                            </td>
                            <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-300">
                              {formatNumber(s.min)}
                            </td>
                            <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-300">
                              {formatNumber(s.max)}
                            </td>
                            <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-300">
                              {formatNumber(s.mean)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          )}
        </section>

        {/* Data dictionary */}
        <section aria-labelledby="dictionary-heading">
          <h2
            id="dictionary-heading"
            className="mb-3 text-lg font-semibold text-slate-900 dark:text-white"
          >
            Data dictionary
          </h2>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                    <th
                      scope="col"
                      className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                    >
                      Column
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
                    >
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.columns.map((col) => (
                    <tr
                      key={col.name}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">
                        {col.name}
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge tone="neutral">{col.type}</Badge>
                      </td>
                      <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">
                        {col.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Verified facts */}
        {dataset.facts.length > 0 && (
          <section aria-labelledby="facts-heading">
            <h2
              id="facts-heading"
              className="mb-3 text-lg font-semibold text-slate-900 dark:text-white"
            >
              Verified facts
            </h2>
            <Card className="p-5">
              <ul className="space-y-2">
                {dataset.facts.map((fact) => (
                  <li
                    key={fact}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                      aria-hidden
                    />
                    {fact}
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}

        <TaskChecklist dataset={dataset} />
      </div>
    </div>
  );
}
