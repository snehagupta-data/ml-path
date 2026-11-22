import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';
import { MODULES } from '../content';
import { useStore } from '../store/store';
import { ModuleIcon } from '../components/ModuleIcon';
import { Badge, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui';

type StatusFilter = 'all' | 'not-started' | 'in-progress' | 'completed';

export default function ModulesPage() {
  const { state } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const q = query.trim().toLowerCase();

  const filtered = MODULES.filter((mod) => {
    // Text search: module title/description or any lesson title.
    if (q) {
      const inModule =
        mod.title.toLowerCase().includes(q) || mod.description.toLowerCase().includes(q);
      const inLessons = mod.lessons.some((l) => l.title.toLowerCase().includes(q));
      if (!inModule && !inLessons) return false;
    }
    // Status filter.
    if (statusFilter !== 'all') {
      const total = mod.lessons.length;
      const completed = mod.lessons.filter((l) => state.lessonsCompleted[l.id]).length;
      const status =
        total > 0 && completed === total
          ? 'completed'
          : completed > 0
            ? 'in-progress'
            : 'not-started';
      if (status !== statusFilter) return false;
    }
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Modules & Lessons"
        subtitle="Browse the full curriculum. Search across module and lesson titles."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block max-w-md flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setSearchParams(v ? { q: v } : {}, { replace: true });
            }}
            placeholder="Search modules or lessons…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            aria-label="Search modules and lessons"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by progress">
          {(
            [
              ['all', 'All'],
              ['not-started', 'Not started'],
              ['in-progress', 'In progress'],
              ['completed', 'Completed'],
            ] as [StatusFilter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              aria-pressed={statusFilter === value}
              className={
                statusFilter === value
                  ? 'rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white dark:bg-blue-500'
                  : 'rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {MODULES.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" aria-hidden />}
          title="No modules yet"
          detail="The curriculum content is still being authored. Modules will appear here once published."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" aria-hidden />}
          title="No matches"
          detail={
            q
              ? `Nothing matches “${query}”. Try a different search term.`
              : 'No modules match this filter.'
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mod) => {
            const total = mod.lessons.length;
            const completed = mod.lessons.filter((l) => state.lessonsCompleted[l.id]).length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            const matchingLessons = q
              ? mod.lessons.filter((l) => l.title.toLowerCase().includes(q)).slice(0, 3)
              : [];
            return (
              <Link key={mod.id} to={`/modules/${mod.id}`} className="block rounded-xl focus:outline-none">
                <Card className="flex h-full flex-col px-5 py-5 transition-colors hover:border-blue-300 dark:hover:border-blue-800">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      <ModuleIcon name={mod.icon} className="h-5 w-5" />
                    </span>
                    <Badge tone="neutral">Module {mod.number}</Badge>
                  </div>
                  <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                    {mod.title}
                  </h2>
                  <p className="mt-1 line-clamp-3 flex-1 text-sm text-slate-600 dark:text-slate-400">
                    {mod.description}
                  </p>
                  {matchingLessons.length > 0 && (
                    <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3 dark:border-slate-800">
                      {matchingLessons.map((l) => (
                        <li key={l.id} className="truncate text-xs text-blue-700 dark:text-blue-300">
                          Lesson: {l.title}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        {total} lesson{total === 1 ? '' : 's'}
                      </span>
                      <span>
                        {completed} complete · {pct}%
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar value={pct} />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
