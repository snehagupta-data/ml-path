import { useState } from 'react';
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  Circle,
  RotateCcw,
} from 'lucide-react';
import { BUSINESS_CASES } from '../content';
import { useStore } from '../store/store';
import { Badge, Button, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui';
import { cn } from '../lib/utils';
import type { BusinessCase, CaseDecision } from '../types';

function marksFor(decision: CaseDecision, picked: number): number {
  if (picked === decision.bestIndex) return 1;
  if (decision.acceptableIndex !== undefined && picked === decision.acceptableIndex) return 0.5;
  return 0;
}

function CaseRunner({ businessCase }: { businessCase: BusinessCase }) {
  const { state, recordCase } = useStore();
  const [decisionIdx, setDecisionIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [points, setPoints] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const previous = state.caseAttempts[businessCase.id];
  const total = businessCase.decisions.length;
  const decision = businessCase.decisions[decisionIdx];
  const earned = points.reduce((a, b) => a + b, 0);

  const handleConfirm = () => {
    if (selected === null || !decision) return;
    const gained = marksFor(decision, selected);
    const nextPoints = [...points, gained];
    setPoints(nextPoints);
    setConfirmed(true);
    if (decisionIdx === total - 1) {
      const score =
        total > 0
          ? Math.round((nextPoints.reduce((a, b) => a + b, 0) / total) * 100)
          : 0;
      setFinalScore(score);
      setFinished(true);
      recordCase(businessCase.id, score);
    }
  };

  const handleNext = () => {
    setDecisionIdx((i) => i + 1);
    setSelected(null);
    setConfirmed(false);
  };

  const handleRestart = () => {
    setDecisionIdx(0);
    setSelected(null);
    setConfirmed(false);
    setPoints([]);
    setFinished(false);
    setFinalScore(null);
  };

  if (total === 0) {
    return (
      <Card className="p-5">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This case has no decisions defined yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="blue">{businessCase.company}</Badge>
          {previous && (
            <Badge tone="neutral">Previous attempt: {previous.score}%</Badge>
          )}
        </div>
        <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
          {businessCase.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {businessCase.scenario}
        </p>
        {businessCase.context.length > 0 && (
          <ul className="mt-4 space-y-2">
            {businessCase.context.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {finished
                ? `Case complete — ${earned} of ${total} marks`
                : `Decision ${decisionIdx + 1} of ${total}`}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {earned} mark{earned === 1 ? '' : 's'} earned
            </span>
          </div>
          <ProgressBar value={(points.length / total) * 100} />
        </div>
      </Card>

      {!finished && decision && (
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {decision.label}
          </p>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-900 dark:text-white">
            {decision.prompt}
          </p>

          <fieldset className="mt-4">
            <legend className="sr-only">Options for this decision</legend>
            <div className="space-y-2" role="radiogroup" aria-label="Decision options">
              {decision.options.map((option, i) => {
                const isSelected = selected === i;
                const isBest = confirmed && i === decision.bestIndex;
                const isAcceptable =
                  confirmed &&
                  decision.acceptableIndex !== undefined &&
                  i === decision.acceptableIndex;
                const isWrongPick = confirmed && isSelected && marksFor(decision, i) === 0;
                return (
                  <label
                    key={option}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm',
                      isBest
                        ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
                        : isAcceptable
                          ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40'
                          : isWrongPick
                            ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/40'
                            : isSelected
                              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
                              : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700',
                      confirmed && 'cursor-default',
                    )}
                  >
                    <input
                      type="radio"
                      name={`decision-${businessCase.id}-${decision.id}`}
                      value={i}
                      checked={isSelected}
                      disabled={confirmed}
                      onChange={() => setSelected(i)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                    />
                    <span className="text-slate-800 dark:text-slate-200">
                      {option}
                      {confirmed && isBest && (
                        <span className="ml-2 font-medium text-emerald-700 dark:text-emerald-300">
                          · Best option
                        </span>
                      )}
                      {confirmed && isAcceptable && !isBest && (
                        <span className="ml-2 font-medium text-amber-700 dark:text-amber-300">
                          · Acceptable
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {!confirmed ? (
            <Button className="mt-4" onClick={handleConfirm} disabled={selected === null}>
              Confirm decision
            </Button>
          ) : (
            <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {selected !== null && marksFor(decision, selected) === 1
                  ? 'Best choice — full marks'
                  : selected !== null && marksFor(decision, selected) === 0.5
                    ? 'Acceptable — half marks'
                    : 'Not the strongest choice — no marks'}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {decision.rationale}
              </p>
              {decisionIdx < total - 1 && (
                <Button className="mt-3" onClick={handleNext}>
                  Next decision
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              )}
            </div>
          )}
        </Card>
      )}

      {finished && finalScore !== null && (
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden />
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Case complete — you scored {finalScore}%
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {earned} of {total} marks across {total} decision{total === 1 ? '' : 's'}.
                Best option earns full marks, an acceptable option earns half.
              </p>
            </div>
          </div>
          <ProgressBar
            value={finalScore}
            className="mt-4"
            tone={finalScore >= 70 ? 'green' : finalScore >= 40 ? 'blue' : 'amber'}
          />
          <h4 className="mt-5 text-sm font-semibold text-slate-900 dark:text-white">
            Debrief
          </h4>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {businessCase.debrief}
          </p>
          <Button variant="secondary" className="mt-4" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4" aria-hidden />
            Replay this case
          </Button>
        </Card>
      )}
    </div>
  );
}

export default function CasesPage() {
  const { state } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (BUSINESS_CASES.length === 0) {
    return (
      <div>
        <PageHeader
          title="Case Simulator"
          subtitle="Real-world business cases. Make the decisions an analyst would make — then see how your reasoning holds up."
        />
        <EmptyState
          icon={<Briefcase className="h-6 w-6" aria-hidden />}
          title="No business cases yet"
          detail="Business cases are still being written. Check back once the simulator is stocked."
        />
      </div>
    );
  }

  const selected = BUSINESS_CASES.find((c) => c.id === selectedId) ?? BUSINESS_CASES[0];
  const attemptedCount = BUSINESS_CASES.filter((c) => state.caseAttempts[c.id]).length;
  const bestScore = BUSINESS_CASES.reduce(
    (max, c) => Math.max(max, state.caseAttempts[c.id]?.score ?? 0),
    0,
  );

  return (
    <div>
      <PageHeader
        title="Case Simulator"
        subtitle="Real-world business cases. Make the decisions an analyst would make — then see how your reasoning holds up."
      />

      <Card className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden />
          {attemptedCount} of {BUSINESS_CASES.length} cases attempted
        </p>
        {attemptedCount > 0 && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Best score so far: {bestScore}%
          </p>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <nav aria-label="Business cases" className="space-y-2">
          {BUSINESS_CASES.map((c) => {
            const attempt = state.caseAttempts[c.id];
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
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-label={`Attempted, scored ${attempt.score} percent`}
                  />
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
                    {c.company} · {c.decisions.length} decision
                    {c.decisions.length === 1 ? '' : 's'}
                    {attempt ? ` · scored ${attempt.score}%` : ''}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <CaseRunner key={selected.id} businessCase={selected} />
      </div>
    </div>
  );
}
