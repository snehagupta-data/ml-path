import { useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Play, RotateCcw } from 'lucide-react';
import type { Question } from '../types';
import { QUESTIONS_BY_ID } from '../content';
import { useStore } from '../store/store';
import QuizRunner from '../components/QuizRunner';
import { Badge, Button, Card, EmptyState, PageHeader } from '../components/ui';
import { relativeDue } from '../lib/utils';

export default function RevisionPage() {
  const { state } = useStore();
  const [session, setSession] = useState<{
    questions: Question[];
    revisionIdMap: Map<string, string>;
    key: number;
  } | null>(null);

  const now = new Date();
  const due = useMemo(
    () =>
      state.revision
        .filter((r) => !r.completed && new Date(r.dueDate) <= now)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.revision],
  );
  const upcoming = useMemo(
    () =>
      state.revision
        .filter((r) => !r.completed && new Date(r.dueDate) > now)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.revision],
  );

  function startRevision() {
    const questions: Question[] = [];
    const revisionIdMap = new Map<string, string>();
    for (const item of due) {
      const q = QUESTIONS_BY_ID.get(item.questionId);
      if (q) {
        questions.push(q);
        revisionIdMap.set(item.questionId, item.id);
      }
    }
    setSession({ questions, revisionIdMap, key: Date.now() });
  }

  return (
    <div>
      <PageHeader
        title="Revision Queue"
        subtitle="Spaced repetition for the questions you got wrong. Get one right and its interval grows (1 → 3 → 7 → 14 → 30 days); get it wrong and it comes back tomorrow."
      />

      {session ? (
        <div>
          <Button variant="ghost" className="mb-4 -ml-2" onClick={() => setSession(null)}>
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to revision list
          </Button>
          <QuizRunner
            key={session.key}
            questions={session.questions}
            source="revision"
            revisionIdMap={session.revisionIdMap}
            title="Revision session"
          />
        </div>
      ) : (
        <>
          <Card className="px-5 py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  {due.length === 0
                    ? 'Nothing due right now'
                    : `${due.length} item${due.length === 1 ? '' : 's'} due for revision`}
                </h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {due.length === 0
                    ? 'Revision items appear here the day after a wrong answer.'
                    : 'Clearing due items first protects what you already learned.'}
                </p>
              </div>
              <Button onClick={startRevision} disabled={due.length === 0}>
                <Play className="h-4 w-4" aria-hidden /> Start revision
              </Button>
            </div>
          </Card>

          {due.length === 0 && upcoming.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={<RotateCcw className="h-6 w-6" aria-hidden />}
                title="Revision queue is empty"
                detail="Answer quiz questions and any you get wrong will be scheduled here for spaced repetition."
              />
            </div>
          ) : (
            <>
              {due.length > 0 && (
                <section className="mt-8" aria-label="Due now">
                  <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
                    Due now
                  </h2>
                  <ul className="space-y-2.5">
                    {due.map((item) => {
                      const q = QUESTIONS_BY_ID.get(item.questionId);
                      return (
                        <li
                          key={item.id}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone="amber">{relativeDue(item.dueDate)}</Badge>
                            <Badge tone="neutral">{item.topic}</Badge>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Interval {item.intervalDays} day{item.intervalDays === 1 ? '' : 's'} ·{' '}
                              {item.mistakes} mistake{item.mistakes === 1 ? '' : 's'}
                            </span>
                          </div>
                          <p className="mt-1.5 line-clamp-2 text-sm text-slate-800 dark:text-slate-100">
                            {q?.question ?? 'Question text unavailable'}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {upcoming.length > 0 && (
                <section className="mt-8" aria-label="Coming up">
                  <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                    <Calendar className="h-4 w-4 text-slate-400" aria-hidden /> Coming up
                  </h2>
                  <ul className="space-y-2.5">
                    {upcoming.map((item) => {
                      const q = QUESTIONS_BY_ID.get(item.questionId);
                      return (
                        <li
                          key={item.id}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone="blue">{relativeDue(item.dueDate)}</Badge>
                            <Badge tone="neutral">{item.topic}</Badge>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Interval {item.intervalDays} day{item.intervalDays === 1 ? '' : 's'} ·{' '}
                              {item.mistakes} mistake{item.mistakes === 1 ? '' : 's'}
                            </span>
                          </div>
                          <p className="mt-1.5 line-clamp-2 text-sm text-slate-800 dark:text-slate-100">
                            {q?.question ?? 'Question text unavailable'}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
