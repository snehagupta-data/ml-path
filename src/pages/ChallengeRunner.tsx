import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Eye, Lightbulb } from 'lucide-react';
import { Badge, Button, Card, EmptyState, PageHeader } from '../components/ui';
import CodeRunner, { type TestOutcome } from '../components/code/CodeRunner';
import { CHALLENGES, CHALLENGES_BY_ID } from '../content';
import { useStore } from '../store/store';
import type { Difficulty } from '../types';

const DIFFICULTY_TONE: Record<Difficulty, 'green' | 'amber' | 'red' | 'purple' | 'blue'> = {
  Easy: 'green',
  Medium: 'amber',
  Hard: 'red',
  Interview: 'purple',
  'Real-world': 'blue',
};

export default function ChallengeRunnerPage() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { state, recordChallenge } = useStore();
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionShown, setSolutionShown] = useState(false);
  const [lastOutcome, setLastOutcome] = useState<TestOutcome | null>(null);

  const challenge = challengeId ? CHALLENGES_BY_ID.get(challengeId) : undefined;
  const index = challenge ? CHALLENGES.findIndex((c) => c.id === challenge.id) : -1;
  const nextChallenge = index >= 0 && index + 1 < CHALLENGES.length ? CHALLENGES[index + 1] : undefined;
  const prevChallenge = index > 0 ? CHALLENGES[index - 1] : undefined;

  const attempts = useMemo(
    () => (challenge ? state.challengeAttempts.filter((a) => a.challengeId === challenge.id) : []),
    [state.challengeAttempts, challenge],
  );
  const everPassed = attempts.some((a) => a.passed);
  const bestAttempt = attempts.reduce((best, a) => Math.max(best, a.testsPassed), 0);

  if (!challenge) {
    return (
      <div>
        <PageHeader title="Coding Challenge" />
        <EmptyState
          icon={<ArrowLeft className="h-6 w-6" />}
          title="Challenge not found"
          detail="This challenge doesn't exist or hasn't been published yet."
          action={
            <Link to="/coding">
              <Button variant="secondary">Back to challenges</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const handleTestsComplete = (outcome: TestOutcome) => {
    setLastOutcome(outcome);
    recordChallenge({
      challengeId: challenge.id,
      passed: outcome.passed === outcome.total && outcome.total > 0,
      testsPassed: outcome.passed,
      testsTotal: outcome.total,
    });
  };

  return (
    <div>
      <Link
        to="/coding"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> All challenges
      </Link>
      <PageHeader
        title={challenge.title}
        subtitle={challenge.topic}
        actions={
          <div className="flex flex-wrap gap-2">
            <Badge tone={DIFFICULTY_TONE[challenge.difficulty]}>{challenge.difficulty}</Badge>
            {challenge.needsPackages.length > 0 && (
              <Badge tone="blue">needs {challenge.needsPackages.join(', ')}</Badge>
            )}
            {everPassed && (
              <Badge tone="green">
                <CheckCircle2 className="h-3.5 w-3.5" /> Passed
              </Badge>
            )}
          </div>
        }
      />

      {lastOutcome !== null && lastOutcome.passed === lastOutcome.total && lastOutcome.total > 0 && (
        <Card className="mb-5 border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/60">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="h-5 w-5" />
            All {lastOutcome.total} tests passed — challenge complete.
          </p>
          {nextChallenge && (
            <Link to={`/coding/${nextChallenge.id}`} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300">
              Next: {nextChallenge.title} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left: description, hints, solution */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card className="p-5">
            <h2 className="text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Task
            </h2>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
              {challenge.description}
            </p>
            <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {challenge.tests.length} test{challenge.tests.length === 1 ? '' : 's'} to pass
                {attempts.length > 0 && (
                  <>
                    {' · '}
                    {attempts.length} attempt{attempts.length === 1 ? '' : 's'} so far, best {bestAttempt}/
                    {challenge.tests.length}
                  </>
                )}
              </p>
              <ul className="mt-2 space-y-1">
                {challenge.tests.map((t, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-mono text-slate-400">{i + 1}.</span> {t.description}
                  </li>
                ))}
              </ul>
            </div>
            {challenge.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {challenge.skills.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Lightbulb className="h-4 w-4 text-amber-500" /> Hints
            </h2>
            {hintsShown === 0 ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Stuck? Reveal hints one at a time — each one gives a little more away.
              </p>
            ) : (
              <ol className="mt-2 space-y-2">
                {challenge.hints.slice(0, hintsShown).map((hint, i) => (
                  <li key={i} className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/60 dark:text-amber-100">
                    <span className="font-semibold">Hint {i + 1}:</span> {hint}
                  </li>
                ))}
              </ol>
            )}
            {hintsShown < 3 && (
              <Button size="sm" variant="outline" className="mt-3" onClick={() => setHintsShown((n) => n + 1)}>
                <ChevronDown className="h-4 w-4" />
                {hintsShown === 0 ? 'Reveal a hint' : 'Reveal next hint'}
              </Button>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Eye className="h-4 w-4" /> Reference solution
            </h2>
            {solutionShown ? (
              <>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Reference solution — compare it with your approach after attempting the challenge.
                </p>
                <pre className="code-block mt-3 max-h-96 overflow-auto rounded-lg bg-slate-50 p-3 whitespace-pre-wrap text-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  {challenge.solution}
                </pre>
                <Button size="sm" variant="ghost" className="mt-2" onClick={() => setSolutionShown(false)}>
                  Hide solution
                </Button>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Only look after you&apos;ve tried — struggling with the problem is where the
                  learning happens.
                </p>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setSolutionShown(true)}>
                  Show solution
                </Button>
              </>
            )}
          </Card>
        </div>

        {/* Right: code runner */}
        <div className="min-w-0">
          <CodeRunner
            key={challenge.id}
            challengeId={challenge.id}
            initialCode={challenge.starterCode}
            needsPackages={challenge.needsPackages}
            tests={challenge.tests}
            onTestsComplete={handleTestsComplete}
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Tip: press Tab in the editor to indent (inserts two spaces). Your code runs locally in
            your browser via Pyodide.
          </p>

          {/* Prev / next navigation */}
          <div className="mt-6 flex flex-wrap justify-between gap-3">
            {prevChallenge ? (
              <Link to={`/coding/${prevChallenge.id}`}>
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4" /> {prevChallenge.title}
                </Button>
              </Link>
            ) : (
              <span />
            )}
            {nextChallenge && (
              <Link to={`/coding/${nextChallenge.id}`}>
                <Button variant="secondary">
                  Next: {nextChallenge.title} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
