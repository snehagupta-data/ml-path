import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Target } from 'lucide-react';
import type { Question } from '../types';
import { DIAGNOSTIC_AREAS, MODULES_BY_ID, QUESTIONS } from '../content';
import { useStore } from '../store/store';
import { Badge, Button, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui';
import { gradeQuestion } from '../components/QuizRunner';
import { cn, formatDate } from '../lib/utils';

/** Weakest diagnostic area → the module to start with. */
const AREA_TO_MODULE: Record<string, string> = {
  Python: 'm3',
  Statistics: 'm2',
  Probability: 'm2',
  'Linear Algebra': 'm2',
  'Pandas & NumPy': 'm3',
  Preprocessing: 'm4',
  'ML Basics': 'm1',
  'Problem Solving': 'm1',
};

interface SavedAnswer {
  selectedIndex: number | null;
  text: string;
}

type Phase = 'intro' | 'taking' | 'report';

function isChoice(q: Question): boolean {
  return q.type === 'mcq' || q.type === 'scenario' || q.type === 'model-selection';
}

export default function DiagnosticPage() {
  const { state, completeDiagnostic } = useStore();
  const [phase, setPhase] = useState<Phase>(
    state.diagnostic.completedAt ? 'report' : 'intro',
  );
  const [areaIdx, setAreaIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, SavedAnswer>>({});

  // Group Module 0 questions by diagnostic area (topic === area), 4 per area.
  const questionsByArea = useMemo(() => {
    const map = new Map<string, Question[]>();
    for (const area of DIAGNOSTIC_AREAS) {
      map.set(
        area,
        QUESTIONS.filter((q) => q.moduleId === 'm0' && q.topic === area).slice(0, 4),
      );
    }
    return map;
  }, []);
  const activeAreas = DIAGNOSTIC_AREAS.filter(
    (a) => (questionsByArea.get(a) ?? []).length > 0,
  );
  const totalQuestions = activeAreas.reduce(
    (s, a) => s + (questionsByArea.get(a) ?? []).length,
    0,
  );

  const currentArea = activeAreas[areaIdx];
  const areaQuestions = currentArea ? (questionsByArea.get(currentArea) ?? []) : [];
  const q = areaQuestions[qIdx];
  const current = q ? (answers[q.id] ?? { selectedIndex: null, text: '' }) : null;
  const answeredCount = Object.values(answers).filter(
    (a) => a.selectedIndex !== null || a.text.trim() !== '',
  ).length;

  function setAnswer(questionId: string, patch: Partial<SavedAnswer>) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...(prev[questionId] ?? { selectedIndex: null, text: '' }), ...patch },
    }));
  }

  function goNext() {
    if (!q) return;
    if (qIdx + 1 < areaQuestions.length) {
      setQIdx(qIdx + 1);
    } else if (areaIdx + 1 < activeAreas.length) {
      setAreaIdx(areaIdx + 1);
      setQIdx(0);
    } else {
      submit();
    }
  }

  function goPrev() {
    if (qIdx > 0) {
      setQIdx(qIdx - 1);
    } else if (areaIdx > 0) {
      setAreaIdx(areaIdx - 1);
      setQIdx((questionsByArea.get(activeAreas[areaIdx - 1]) ?? []).length - 1);
    }
  }

  function submit() {
    const scores: Record<string, number> = {};
    const answerStrings: Record<string, string> = {};
    for (const area of activeAreas) {
      const qs = questionsByArea.get(area) ?? [];
      let correct = 0;
      for (const question of qs) {
        const a = answers[question.id] ?? { selectedIndex: null, text: '' };
        const graded = gradeQuestion(question, a.selectedIndex, a.text);
        if (graded.correct) correct += 1;
        answerStrings[question.id] = graded.learnerAnswer;
      }
      scores[area] = qs.length > 0 ? Math.round((correct / qs.length) * 100) : 0;
    }
    completeDiagnostic(scores, answerStrings);
    setPhase('report');
  }

  function retake() {
    setAnswers({});
    setAreaIdx(0);
    setQIdx(0);
    setPhase('intro');
  }

  // ── No diagnostic questions available yet ────────────────────────────────
  if (totalQuestions === 0) {
    return (
      <div>
        <PageHeader
          title="Diagnostic Assessment"
          subtitle="Measure your starting point across 8 areas before you begin the curriculum."
        />
        <EmptyState
          icon={<Target className="h-6 w-6" aria-hidden />}
          title="Diagnostic questions not available yet"
          detail="The Module 0 question bank is still being authored. Once it is published you can take the diagnostic here."
        />
      </div>
    );
  }

  // ── Report ───────────────────────────────────────────────────────────────
  if (phase === 'report') {
    const scores = state.diagnostic.scores;
    const entries = activeAreas
      .map((area) => ({ area, score: scores[area] ?? 0 }))
      .sort((a, b) => a.score - b.score);
    const overall =
      entries.length > 0
        ? Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length)
        : 0;
    const weakest = entries[0];
    const strongest = entries[entries.length - 1];
    const recommendedModuleId = weakest ? AREA_TO_MODULE[weakest.area] : undefined;
    const recommendedModule = recommendedModuleId
      ? MODULES_BY_ID.get(recommendedModuleId)
      : undefined;

    return (
      <div>
        <PageHeader
          title="Diagnostic Report"
          subtitle={
            state.diagnostic.completedAt
              ? `Completed ${formatDate(state.diagnostic.completedAt)} · ${totalQuestions} questions across ${activeAreas.length} areas.`
              : 'Your diagnostic results.'
          }
          actions={
            <Button variant="outline" onClick={retake}>
              <RotateCcw className="h-4 w-4" aria-hidden /> Retake diagnostic
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Overall score
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{overall}%</p>
          </Card>
          <Card className="px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Strongest area
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              {strongest ? `${strongest.area} — ${strongest.score}%` : '—'}
            </p>
          </Card>
          <Card className="px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Weakest area
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              {weakest ? `${weakest.area} — ${weakest.score}%` : '—'}
            </p>
          </Card>
        </div>

        <Card className="mt-6 px-5 py-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Per-area results</h2>
          <ul className="mt-4 space-y-4">
            {DIAGNOSTIC_AREAS.filter((a) => scores[a] !== undefined).map((area) => (
              <li key={area}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900 dark:text-white">{area}</span>
                  <span className="text-slate-600 dark:text-slate-400">{scores[area]}%</span>
                </div>
                <div className="mt-1.5">
                  <ProgressBar
                    value={scores[area]}
                    tone={scores[area] >= 70 ? 'green' : scores[area] >= 40 ? 'amber' : 'red'}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {weakest && recommendedModuleId && (
          <Card className="mt-6 border-blue-200 bg-blue-50/50 px-5 py-5 dark:border-blue-900 dark:bg-blue-950/30">
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
              <Target className="h-5 w-5 text-blue-600" aria-hidden />
              Personalized recommendation
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Your weakest area is <strong>{weakest.area}</strong> ({weakest.score}%). Start with{' '}
              <strong>
                {recommendedModule ? recommendedModule.title : `Module ${recommendedModuleId}`}
              </strong>{' '}
              to shore up that foundation before moving deeper into ML — weak foundations compound.
            </p>
            <Link
              to={`/modules/${recommendedModuleId}`}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Open recommended module
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Card>
        )}
      </div>
    );
  }

  // ── Intro ────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div>
        <PageHeader
          title="Diagnostic Assessment"
          subtitle="Measure your starting point before you begin the curriculum — so the path adapts to you instead of the other way around."
        />
        <Card className="px-5 py-6 sm:px-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            How it works
          </h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <li>
              {totalQuestions} questions across {activeAreas.length} areas — 4 questions per area.
            </li>
            <li>One area at a time. You can go back and change an answer before submitting.</li>
            <li>
              No hints, no solutions during the diagnostic — it measures what you know right now.
            </li>
            <li>
              At the end you get a per-area report and a recommended starting module based on
              your weakest area.
            </li>
            <li>
              Diagnostic answers are kept separate from practice mastery — they set your
              baseline, not your scores.
            </li>
          </ul>

          <h3 className="mt-6 text-sm font-semibold text-slate-900 dark:text-white">
            The 8 areas
          </h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {DIAGNOSTIC_AREAS.map((area) => {
              const count = questionsByArea.get(area)?.length ?? 0;
              return (
                <li
                  key={area}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-800"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-100">{area}</span>
                  <Badge tone={count > 0 ? 'blue' : 'neutral'}>
                    {count > 0 ? `${count} questions` : 'Not available yet'}
                  </Badge>
                </li>
              );
            })}
          </ul>

          <Button
            size="lg"
            className="mt-6"
            onClick={() => {
              setAnswers({});
              setAreaIdx(0);
              setQIdx(0);
              setPhase('taking');
            }}
          >
            Start diagnostic
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </Card>
      </div>
    );
  }

  // ── Taking the diagnostic ────────────────────────────────────────────────
  if (!q || !current) {
    return (
      <EmptyState
        icon={<Target className="h-6 w-6" aria-hidden />}
        title="Nothing to show"
        detail="This diagnostic section has no questions."
      />
    );
  }

  const isLast = areaIdx === activeAreas.length - 1 && qIdx === areaQuestions.length - 1;
  const canProceed = isChoice(q)
    ? current.selectedIndex !== null
    : current.text.trim().length > 0;

  return (
    <div>
      <PageHeader
        title="Diagnostic Assessment"
        subtitle={`${currentArea} — area ${areaIdx + 1} of ${activeAreas.length}`}
      />

      <Card className="px-5 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Question{' '}
            {activeAreas.slice(0, areaIdx).reduce((s, a) => s + (questionsByArea.get(a)?.length ?? 0), 0) +
              qIdx +
              1}{' '}
            of {totalQuestions} · {currentArea} ({qIdx + 1} of {areaQuestions.length})
          </p>
          <Badge tone="blue">{q.difficulty}</Badge>
        </div>
        <div className="mt-3">
          <ProgressBar value={(answeredCount / totalQuestions) * 100} />
        </div>

        <h2 className="mt-5 text-lg font-semibold leading-snug text-slate-900 dark:text-white">
          {q.question}
        </h2>

        <div className="mt-5">
          {isChoice(q) && q.options ? (
            <div role="radiogroup" aria-label="Answer options" className="space-y-2">
              {q.options.map((option, i) => (
                <label
                  key={i}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm transition-colors',
                    current.selectedIndex === i
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600',
                  )}
                >
                  <input
                    type="radio"
                    name={`diag-q-${q.id}`}
                    checked={current.selectedIndex === i}
                    onChange={() => setAnswer(q.id, { selectedIndex: i })}
                    className="mt-0.5 accent-blue-600"
                  />
                  <span className="flex-1 text-slate-800 dark:text-slate-100">{option}</span>
                </label>
              ))}
            </div>
          ) : q.type === 'numerical' ? (
            <div>
              <label
                htmlFor={`diag-num-${q.id}`}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Your answer
              </label>
              <input
                id={`diag-num-${q.id}`}
                type="number"
                inputMode="decimal"
                value={current.text}
                onChange={(e) => setAnswer(q.id, { text: e.target.value })}
                placeholder="Enter a number"
                className="mt-1 w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor={`diag-short-${q.id}`}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Your answer
              </label>
              <textarea
                id={`diag-short-${q.id}`}
                value={current.text}
                onChange={(e) => setAnswer(q.id, { text: e.target.value })}
                rows={4}
                placeholder="Write your answer in your own words…"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={areaIdx === 0 && qIdx === 0}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back
          </Button>
          <Button onClick={goNext} disabled={!canProceed}>
            {isLast ? (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden /> Submit diagnostic
              </>
            ) : (
              <>
                Next <ArrowRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </Button>
          {!canProceed && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Answer this question to continue.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
