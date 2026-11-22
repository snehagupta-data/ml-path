import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Map as MapIcon, PlayCircle } from 'lucide-react';
import { MODULES, QUESTIONS_BY_ID } from '../content';
import { useStore } from '../store/store';
import { lessonScore } from '../lib/mastery';
import { ModuleIcon } from '../components/ModuleIcon';
import { Badge, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui';
import { cn } from '../lib/utils';

export default function RoadmapPage() {
  const { state } = useStore();
  const modules = [...MODULES].sort((a, b) => a.number - b.number);

  if (modules.length === 0) {
    return (
      <div>
        <PageHeader
          title="Learning Roadmap"
          subtitle="Foundations to interview readiness, in order."
        />
        <EmptyState
          icon={<MapIcon className="h-6 w-6" aria-hidden />}
          title="No modules yet"
          detail="The curriculum content is still being authored. The roadmap will appear here once modules are published."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Learning Roadmap"
        subtitle="Foundations to interview readiness, in order. Nothing is hard-locked — work in any order, but the sequence is designed to build on itself."
      />

      <ol className="relative space-y-5 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
        {modules.map((mod) => {
          const total = mod.lessons.length;
          const completed = mod.lessons.filter((l) => state.lessonsCompleted[l.id]).length;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
          const status =
            total > 0 && completed === total
              ? 'Completed'
              : completed > 0
                ? 'In progress'
                : 'Not started';
          const scores = mod.lessons
            .map((l) => lessonScore(state, l, QUESTIONS_BY_ID))
            .filter((s): s is number => s !== null);
          const mastery =
            scores.length > 0
              ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
              : null;

          return (
            <li key={mod.id} className="relative pl-12">
              <span
                className={cn(
                  'absolute left-0 top-5 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-900',
                  status === 'Completed'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : status === 'In progress'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-slate-300 text-slate-400 dark:border-slate-700',
                )}
                aria-hidden
              >
                {status === 'Completed' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : status === 'In progress' ? (
                  <PlayCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </span>
              <Link to={`/modules/${mod.id}`} className="block rounded-xl focus:outline-none">
                <Card className="px-5 py-4 transition-colors hover:border-blue-300 dark:hover:border-blue-800">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        <ModuleIcon name={mod.icon} className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                          Module {mod.number}
                        </p>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                          {mod.title}
                        </h2>
                        <p className="mt-0.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                          {mod.description}
                        </p>
                      </div>
                    </div>
                    <Badge
                      tone={
                        status === 'Completed'
                          ? 'green'
                          : status === 'In progress'
                            ? 'blue'
                            : 'neutral'
                      }
                    >
                      {status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {completed} / {total} lessons complete
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Mastery:{' '}
                      <span className="font-medium text-slate-900 dark:text-white">
                        {mastery === null ? 'No quiz data yet' : `${mastery}%`}
                      </span>
                    </span>
                    <div className="min-w-40 flex-1">
                      <ProgressBar value={pct} tone={status === 'Completed' ? 'green' : 'blue'} />
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
