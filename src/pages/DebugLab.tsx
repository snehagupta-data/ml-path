import { useState } from 'react';
import {
  Bug,
  CheckCircle2,
  Circle,
  Lightbulb,
  RotateCcw,
  Wrench,
  XCircle,
} from 'lucide-react';
import { DEBUGGING_CASES } from '../content';
import { useStore } from '../store/store';
import { Badge, Button, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui';
import { cn } from '../lib/utils';
import type { DebuggingCase } from '../types';

function difficultyTone(d: DebuggingCase['difficulty']): 'green' | 'amber' | 'red' | 'purple' {
  switch (d) {
    case 'Easy':
      return 'green';
    case 'Medium':
      return 'amber';
    case 'Hard':
      return 'red';
    default:
      return 'purple';
  }
}

function CaseRunner({ debugCase }: { debugCase: DebuggingCase }) {
  const { state, recordDebug } = useStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const previous = state.debugAttempts[debugCase.id];
  const correct = submitted && selected === debugCase.correctIndex;

  const handleSubmit = () => {
    if (selected === null) return;
    recordDebug(debugCase.id, selected === debugCase.correctIndex);
    setSubmitted(true);
  };

  const handleRetry = () => {
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="blue">{debugCase.bugType}</Badge>
          <Badge tone={difficultyTone(debugCase.difficulty)}>{debugCase.difficulty}</Badge>
          {previous && !submitted && (
            <Badge tone={previous.correct ? 'green' : 'red'}>
              {previous.correct ? 'Solved previously' : 'Missed previously'}
            </Badge>
          )}
        </div>
        <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
          {debugCase.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {debugCase.scenario}
        </p>
      </Card>

      <Card className="overflow-hidden">
        <p className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
          Broken code
        </p>
        <div className="overflow-x-auto bg-slate-950 p-4">
          <pre className="code-block text-slate-100">{debugCase.brokenCode}</pre>
        </div>
      </Card>

      <Card className="p-5">
        <fieldset>
          <legend className="text-sm font-semibold text-slate-900 dark:text-white">
            What is the bug?
          </legend>
          <div className="mt-3 space-y-2" role="radiogroup" aria-label="Diagnosis options">
            {debugCase.options.map((option, i) => {
              const isSelected = selected === i;
              const isCorrectOption = submitted && i === debugCase.correctIndex;
              const isWrongPick = submitted && isSelected && i !== debugCase.correctIndex;
              return (
                <label
                  key={option}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm',
                    isCorrectOption
                      ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
                      : isWrongPick
                        ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/40'
                        : isSelected
                          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700',
                    submitted && 'cursor-default',
                  )}
                >
                  <input
                    type="radio"
                    name={`diagnosis-${debugCase.id}`}
                    value={i}
                    checked={isSelected}
                    disabled={submitted}
                    onChange={() => setSelected(i)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                  />
                  <span className="text-slate-800 dark:text-slate-200">{option}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {!submitted ? (
          <Button className="mt-4" onClick={handleSubmit} disabled={selected === null}>
            Submit diagnosis
          </Button>
        ) : (
          <Button variant="secondary" className="mt-4" onClick={handleRetry}>
            <RotateCcw className="h-4 w-4" aria-hidden />
            Try again
          </Button>
        )}
      </Card>

      {submitted && (
        <>
          <Card
            className={cn(
              'flex items-start gap-3 p-5',
              correct
                ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/30'
                : 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30',
            )}
          >
            <div role="status" className="flex items-start gap-3">
            {correct ? (
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
            ) : (
              <XCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
                aria-hidden
              />
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {correct ? 'Correct diagnosis' : 'Not quite — the bug is elsewhere'}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {debugCase.explanation}
              </p>
            </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <p className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
              <Wrench className="h-3.5 w-3.5" aria-hidden />
              Fixed code
            </p>
            <div className="overflow-x-auto bg-slate-950 p-4">
              <pre className="code-block text-slate-100">{debugCase.fixedCode}</pre>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default function DebugLabPage() {
  const { state } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (DEBUGGING_CASES.length === 0) {
    return (
      <div>
        <PageHeader
          title="Debugging Lab"
          subtitle="Diagnose intentionally broken pipelines. Read the scenario, inspect the code, and identify the bug before seeing the fix."
        />
        <EmptyState
          icon={<Bug className="h-6 w-6" aria-hidden />}
          title="No debugging cases yet"
          detail="Debugging cases are still being written. Check back once the lab is stocked."
        />
      </div>
    );
  }

  const selected = DEBUGGING_CASES.find((c) => c.id === selectedId) ?? DEBUGGING_CASES[0];
  const attempted = DEBUGGING_CASES.filter((c) => state.debugAttempts[c.id]);
  const correctCount = attempted.filter((c) => state.debugAttempts[c.id]?.correct).length;
  const scorePct =
    attempted.length > 0 ? Math.round((correctCount / attempted.length) * 100) : 0;

  return (
    <div>
      <PageHeader
        title="Debugging Lab"
        subtitle="Diagnose intentionally broken pipelines. Read the scenario, inspect the code, and identify the bug before seeing the fix."
      />

      <Card className="mb-6 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden />
            Score: {correctCount} of {attempted.length} diagnosed correctly
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {attempted.length} of {DEBUGGING_CASES.length} cases attempted
          </p>
        </div>
        <ProgressBar value={scorePct} className="mt-3" tone={scorePct >= 70 ? 'green' : 'blue'} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <nav aria-label="Debugging cases" className="space-y-2">
          {DEBUGGING_CASES.map((c) => {
            const attempt = state.debugAttempts[c.id];
            const active = c.id === selected.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors',
                  active
                    ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700',
                )}
              >
                {attempt ? (
                  attempt.correct ? (
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                      aria-label="Solved correctly"
                    />
                  ) : (
                    <XCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-red-500 dark:text-red-400"
                      aria-label="Attempted, not solved"
                    />
                  )
                ) : (
                  <Circle
                    className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600"
                    aria-label="Not attempted"
                  />
                )}
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-slate-900 dark:text-white">
                    {c.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                    {c.bugType} · {c.difficulty}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <CaseRunner key={selected.id} debugCase={selected} />
      </div>
    </div>
  );
}
