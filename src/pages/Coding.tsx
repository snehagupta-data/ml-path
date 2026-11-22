import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Code2, FlaskConical } from 'lucide-react';
import { Badge, EmptyState, PageHeader } from '../components/ui';
import { CHALLENGES } from '../content';
import { useStore } from '../store/store';
import type { Difficulty } from '../types';

const DIFFICULTY_TONE: Record<Difficulty, 'green' | 'amber' | 'red' | 'purple' | 'blue'> = {
  Easy: 'green',
  Medium: 'amber',
  Hard: 'red',
  Interview: 'purple',
  'Real-world': 'blue',
};

type Filter = 'All' | Difficulty;

const FILTERS: Filter[] = ['All', 'Easy', 'Medium', 'Hard', 'Interview', 'Real-world'];

export default function CodingPage() {
  const { state } = useStore();
  const [filter, setFilter] = useState<Filter>('All');

  const attemptsByChallenge = useMemo(() => {
    const map = new Map<string, { passed: boolean; best: number; total: number; count: number }>();
    for (const a of state.challengeAttempts) {
      const prev = map.get(a.challengeId);
      if (!prev) {
        map.set(a.challengeId, {
          passed: a.passed,
          best: a.testsPassed,
          total: a.testsTotal,
          count: 1,
        });
      } else {
        map.set(a.challengeId, {
          passed: prev.passed || a.passed,
          best: Math.max(prev.best, a.testsPassed),
          total: a.testsTotal,
          count: prev.count + 1,
        });
      }
    }
    return map;
  }, [state.challengeAttempts]);

  const passedCount = CHALLENGES.filter((c) => attemptsByChallenge.get(c.id)?.passed).length;

  const visible = CHALLENGES.filter((c) => filter === 'All' || c.difficulty === filter);

  return (
    <div>
      <PageHeader
        title="Coding Challenges"
        subtitle="Real Python, run in your browser with Pyodide — no server, no fake output. Solve each challenge and pass its tests to mark it complete."
        actions={
          CHALLENGES.length > 0 ? (
            <Badge tone="blue">
              {passedCount} of {CHALLENGES.length} passed
            </Badge>
          ) : undefined
        }
      />

      {CHALLENGES.length === 0 ? (
        <EmptyState
          icon={<Code2 className="h-6 w-6" />}
          title="No coding challenges yet"
          detail="Challenges are being authored and will appear here as soon as they are published."
        />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter by difficulty">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  filter === f
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {f}
                {f !== 'All' && (
                  <span className="ml-1.5 opacity-70">
                    {CHALLENGES.filter((c) => c.difficulty === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon={<FlaskConical className="h-6 w-6" />}
              title={`No ${filter} challenges`}
              detail="Try a different difficulty filter."
            />
          ) : (
            <ul className="space-y-3">
              {visible.map((challenge) => {
                const record = attemptsByChallenge.get(challenge.id);
                return (
                  <li key={challenge.id}>
                    <Link
                      to={`/coding/${challenge.id}`}
                      className="block rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
                    >
                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                              {challenge.title}
                            </h2>
                            <Badge tone={DIFFICULTY_TONE[challenge.difficulty]}>{challenge.difficulty}</Badge>
                            {record?.passed ? (
                              <Badge tone="green">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                              </Badge>
                            ) : record ? (
                              <Badge tone="amber">
                                Attempted — best {record.best}/{record.total} tests
                              </Badge>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {challenge.topic}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                            {challenge.description}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            {challenge.needsPackages.length > 0 ? (
                              <Badge tone="blue">needs {challenge.needsPackages.join(', ')}</Badge>
                            ) : (
                              <Badge>pure Python</Badge>
                            )}
                            <span className="text-slate-400 dark:text-slate-500">
                              {challenge.tests.length} test{challenge.tests.length === 1 ? '' : 's'}
                            </span>
                            {challenge.skills.slice(0, 3).map((s) => (
                              <span key={s} className="text-slate-400 dark:text-slate-500">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-400" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
