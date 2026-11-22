import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Clock, Circle } from 'lucide-react';
import { MODULES_BY_ID, QUESTIONS_BY_ID } from '../content';
import { useStore } from '../store/store';
import { lessonScore } from '../lib/mastery';
import { ModuleIcon } from '../components/ModuleIcon';
import { Badge, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui';

export default function ModuleDetailPage() {
  const { moduleId } = useParams();
  const { state } = useStore();
  const mod = MODULES_BY_ID.get(moduleId ?? '');

  if (!mod) {
    return (
      <div>
        <PageHeader title="Module not found" subtitle="That module does not exist." />
        <EmptyState
          icon={<BookOpen className="h-6 w-6" aria-hidden />}
          title="Module not found"
          detail="The module you are looking for does not exist or has not been published yet."
          action={
            <Link
              to="/modules"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back to modules
            </Link>
          }
        />
      </div>
    );
  }

  const total = mod.lessons.length;
  const completed = mod.lessons.filter((l) => state.lessonsCompleted[l.id]).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const totalMinutes = mod.lessons.reduce((s, l) => s + l.minutes, 0);

  return (
    <div>
      <Link
        to="/modules"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> All modules
      </Link>

      <div className="mb-6 flex flex-wrap items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <ModuleIcon name={mod.icon} className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Module {mod.number}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {mod.title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            {mod.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {mod.skills.map((skill) => (
              <Badge key={skill} tone="blue">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Card className="mb-6 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-medium text-slate-900 dark:text-white">
            {completed} of {total} lessons complete
          </span>
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Clock className="h-4 w-4" aria-hidden /> ~{totalMinutes} min total
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar value={pct} />
        </div>
      </Card>

      <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Lessons</h2>
      {total === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" aria-hidden />}
          title="No lessons yet"
          detail="Lessons for this module have not been published yet."
        />
      ) : (
        <ol className="space-y-2.5">
          {mod.lessons.map((lesson, i) => {
            const isComplete = Boolean(state.lessonsCompleted[lesson.id]);
            const isRead = Boolean(state.lessonsRead[lesson.id]);
            const score = lessonScore(state, lesson, QUESTIONS_BY_ID);
            return (
              <li key={lesson.id}>
                <Link
                  to={`/lesson/${lesson.id}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800"
                >
                  <span
                    className={
                      isComplete
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }
                    aria-hidden
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">
                      <span className="mr-2 text-slate-400 dark:text-slate-500">{i + 1}.</span>
                      {lesson.title}
                    </span>
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {lesson.subtitle}
                    </span>
                  </span>
                  <span className="hidden shrink-0 items-center gap-1 text-xs text-slate-500 dark:text-slate-400 sm:flex">
                    <Clock className="h-3.5 w-3.5" aria-hidden /> {lesson.minutes} min
                  </span>
                  {score !== null ? (
                    <Badge tone={score >= 80 ? 'green' : score >= 60 ? 'blue' : score >= 40 ? 'amber' : 'red'}>
                      {score}% mastery
                    </Badge>
                  ) : isRead ? (
                    <Badge tone="blue">Read</Badge>
                  ) : (
                    <Badge tone="neutral">Not started</Badge>
                  )}
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
