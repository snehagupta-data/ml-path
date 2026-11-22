import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, NotebookPen, Play } from 'lucide-react';
import type { Mistake } from '../types';
import { QUESTIONS_BY_ID } from '../content';
import { useStore } from '../store/store';
import { Badge, Button, Card, EmptyState, PageHeader } from '../components/ui';
import { formatDate } from '../lib/utils';

type StatusFilter = 'All' | Mistake['revisionStatus'];

const STATUS_TONES: Record<Mistake['revisionStatus'], 'red' | 'amber' | 'green'> = {
  'Needs revision': 'red',
  Revising: 'amber',
  Resolved: 'green',
};

export default function MistakesPage() {
  const { state, resolveMistake } = useStore();
  const [topicFilter, setTopicFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const topics = useMemo(
    () => [...new Set(state.mistakes.map((m) => m.topic))].sort(),
    [state.mistakes],
  );

  const filtered = useMemo(
    () =>
      [...state.mistakes]
        .filter((m) => (topicFilter === 'All' ? true : m.topic === topicFilter))
        .filter((m) => (statusFilter === 'All' ? true : m.revisionStatus === statusFilter))
        .sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt)),
    [state.mistakes, topicFilter, statusFilter],
  );

  const selectClass =
    'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white';

  return (
    <div>
      <PageHeader
        title="Mistake Journal"
        subtitle="Every wrong answer, tracked and reviewed. Mistakes are the fastest signal of what to study next — resolve them deliberately."
      />

      {state.mistakes.length === 0 ? (
        <EmptyState
          icon={<NotebookPen className="h-6 w-6" aria-hidden />}
          title="No mistakes yet"
          detail="Wrong answers from quizzes, lessons, and revision land here automatically, with what you answered versus the correct answer."
          action={
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Play className="h-4 w-4" aria-hidden /> Start practising
            </Link>
          }
        />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-3">
            <div>
              <label htmlFor="mistakes-topic" className="sr-only">
                Filter by topic
              </label>
              <select
                id="mistakes-topic"
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className={selectClass}
              >
                <option value="All">All topics</option>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="mistakes-status" className="sr-only">
                Filter by status
              </label>
              <select
                id="mistakes-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className={selectClass}
              >
                <option value="All">All statuses</option>
                <option value="Needs revision">Needs revision</option>
                <option value="Revising">Revising</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <p className="self-center text-sm text-slate-500 dark:text-slate-400">
              {filtered.length} mistake{filtered.length === 1 ? '' : 's'}
            </p>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<NotebookPen className="h-6 w-6" aria-hidden />}
              title="No mistakes match these filters"
              detail="Try a different topic or status."
            />
          ) : (
            <ul className="space-y-4">
              {filtered.map((m) => (
                <li key={m.id}>
                  <Card className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="red">{m.topic}</Badge>
                      <Badge tone="neutral">{m.difficulty}</Badge>
                      <Badge tone={STATUS_TONES[m.revisionStatus]}>{m.revisionStatus}</Badge>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {m.mistakeType}
                      </span>
                    </div>
                    <p className="mt-2 text-[15px] font-medium leading-snug text-slate-900 dark:text-white">
                      {QUESTIONS_BY_ID.get(m.questionId)?.question ?? m.question}
                    </p>
                    <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                      <div className="rounded-lg bg-red-50 px-3 py-2 dark:bg-red-950/50">
                        <p className="text-xs font-semibold uppercase tracking-wide text-red-700 dark:text-red-300">
                          Your answer
                        </p>
                        <p className="mt-0.5 break-words text-slate-800 dark:text-slate-100">
                          {m.learnerAnswer}
                        </p>
                      </div>
                      <div className="rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-950/50">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                          Correct answer
                        </p>
                        <p className="mt-0.5 break-words text-slate-800 dark:text-slate-100">
                          {m.correctAnswer}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Seen {m.attemptCount} time{m.attemptCount === 1 ? '' : 's'} · first{' '}
                        {formatDate(m.firstSeenAt)} · last {formatDate(m.lastSeenAt)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/practice?topic=${encodeURIComponent(m.topic)}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Play className="h-3.5 w-3.5" aria-hidden /> Practice this topic
                        </Link>
                        {m.revisionStatus !== 'Resolved' && (
                          <Button size="sm" variant="secondary" onClick={() => resolveMistake(m.id)}>
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Mark resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
