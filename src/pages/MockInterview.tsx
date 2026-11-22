import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mic,
  Timer,
} from 'lucide-react';
import { Badge, Button, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui';
import { INTERVIEW_QUESTIONS } from '../content';
import { useStore } from '../store/store';
import { evaluateAnswer, type RubricResult } from '../lib/rubric';
import { formatDateTime } from '../lib/utils';
import type { InterviewCategory, InterviewQuestion, MockSession } from '../types';

type Phase = 'setup' | 'running' | 'done';
type Duration = 15 | 30 | 60;

const DURATION_OPTIONS: { minutes: Duration; questions: number; label: string }[] = [
  { minutes: 15, questions: 5, label: 'Quick round' },
  { minutes: 30, questions: 10, label: 'Standard round' },
  { minutes: 60, questions: 15, label: 'Full interview' },
];

/** Category → report dimension mapping. */
const DIMENSION_MAP: Record<InterviewCategory, string> = {
  'ML Fundamentals': 'ML Fundamentals',
  Statistics: 'ML Fundamentals',
  Regression: 'ML Fundamentals',
  Classification: 'ML Fundamentals',
  'Unsupervised Learning': 'ML Fundamentals',
  'Model Evaluation': 'ML Fundamentals',
  'Model Selection': 'ML Fundamentals',
  'Python & Pandas': 'Technical',
  'SQL + ML': 'Technical',
  Preprocessing: 'Technical',
  'Feature Engineering': 'Technical',
  Scenario: 'Scenario & Business',
  'Business + ML': 'Scenario & Business',
  Project: 'Project Explanation',
};

const DIMENSION_ORDER = [
  'ML Fundamentals',
  'Technical',
  'Scenario & Business',
  'Project Explanation',
  'Communication',
];

/** Length-adequacy score (0–10) for the Communication dimension. */
function lengthScore(answer: string | undefined): number {
  if (!answer || !answer.trim()) return 0;
  const words = answer.trim().split(/\s+/).length;
  if (words < 15) return 2;
  if (words < 40) return 5;
  if (words <= 200) return 10;
  if (words <= 250) return 8;
  return 6;
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatSeconds(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function MockInterviewPage() {
  const { state, saveMockSession, recordInterviewAnswer } = useStore();

  const [phase, setPhase] = useState<Phase>('setup');
  const [duration, setDuration] = useState<Duration>(30);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, RubricResult>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [report, setReport] = useState<MockSession | null>(null);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const startedAtRef = useRef('');
  const finishedRef = useRef(false);

  const current = questions[index];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(scores).length;

  const finish = (
    finalScores: Record<string, number>,
    finalAnswers: Record<string, string>,
    finalResults: Record<string, RubricResult>,
  ) => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    // Unanswered questions score 0.
    const allScores: Record<string, number> = {};
    for (const q of questions) allScores[q.id] = finalScores[q.id] ?? 0;

    // Dimension scores (mean of question scores in each dimension).
    const byDimension = new Map<string, number[]>();
    for (const q of questions) {
      const dim = DIMENSION_MAP[q.category];
      const list = byDimension.get(dim) ?? [];
      list.push(allScores[q.id]);
      byDimension.set(dim, list);
    }
    const dimensionScores: Record<string, number> = {};
    for (const [dim, list] of byDimension) {
      dimensionScores[dim] = Math.round((list.reduce((a, b) => a + b, 0) / list.length) * 10) / 10;
    }
    // Communication: derived from answer-length adequacy across all questions.
    const comm =
      questions.reduce((sum, q) => sum + lengthScore(finalAnswers[q.id]), 0) /
      Math.max(1, questions.length);
    dimensionScores['Communication'] = Math.round(comm * 10) / 10;

    // Weak areas: categories averaging below 6.
    const byCategory = new Map<string, number[]>();
    for (const q of questions) {
      const list = byCategory.get(q.category) ?? [];
      list.push(allScores[q.id]);
      byCategory.set(q.category, list);
    }
    const weakAreas: string[] = [];
    for (const [cat, list] of byCategory) {
      const avg = list.reduce((a, b) => a + b, 0) / list.length;
      if (avg < 6) weakAreas.push(cat);
    }

    const session: MockSession = {
      id: uid(),
      durationMinutes: duration,
      questionIds: questions.map((q) => q.id),
      scores: allScores,
      dimensionScores,
      weakAreas,
      startedAt: startedAtRef.current,
      completedAt: new Date().toISOString(),
    };
    saveMockSession(session);
    setReport(session);

    // Also record each answered question in the interview log so the trainer
    // treats it as answered and the hub stats stay consistent.
    for (const q of questions) {
      const res = finalResults[q.id];
      const text = finalAnswers[q.id];
      if (res && text) {
        recordInterviewAnswer({
          questionId: q.id,
          category: q.category,
          answer: text,
          score: res.score,
          coverage: res.coverage,
          missingPoints: res.missingPoints,
        });
      }
    }

    setPhase('done');
  };

  // Countdown — hitting zero auto-finishes with unanswered questions at 0.
  useEffect(() => {
    if (phase !== 'running') return undefined;
    if (secondsLeft <= 0) {
      finish(scores, answers, results);
      return undefined;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
    // finish is stable per render; the effect re-runs every second so the
    // closure always sees fresh scores/answers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft]);

  const start = () => {
    const option = DURATION_OPTIONS.find((o) => o.minutes === duration) ?? DURATION_OPTIONS[1];
    const picked = shuffle(INTERVIEW_QUESTIONS).slice(0, Math.min(option.questions, INTERVIEW_QUESTIONS.length));
    finishedRef.current = false;
    startedAtRef.current = new Date().toISOString();
    setQuestions(picked);
    setIndex(0);
    setAnswer('');
    setScores({});
    setAnswers({});
    setResults({});
    setSecondsLeft(duration * 60);
    setReport(null);
    setConfirmEnd(false);
    setPhase('running');
  };

  const submitAnswer = () => {
    if (!current) return;
    const evaluation = evaluateAnswer(current, answer);
    const nextScores = { ...scores, [current.id]: evaluation.score };
    const nextAnswers = { ...answers, [current.id]: answer };
    const nextResults = { ...results, [current.id]: evaluation };
    setScores(nextScores);
    setAnswers(nextAnswers);
    setResults(nextResults);
    if (index + 1 >= totalQuestions) {
      finish(nextScores, nextAnswers, nextResults);
    } else {
      setIndex((i) => i + 1);
      setAnswer('');
    }
  };

  const overallAvg = useMemo(() => {
    if (!report) return null;
    const vals = Object.values(report.scores);
    if (vals.length === 0) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [report]);

  const lowTime = secondsLeft <= 60 && phase === 'running';

  if (INTERVIEW_QUESTIONS.length === 0 && phase === 'setup') {
    return (
      <div>
        <PageHeader title="Mock Interview" />
        <EmptyState
          icon={<Mic className="h-6 w-6" />}
          title="No interview questions yet"
          detail="Interview questions are being authored — mock interviews need a question bank to draw from."
          action={
            <Link to="/interview">
              <Button variant="secondary">Back to interview hub</Button>
            </Link>
          }
        />
      </div>
    );
  }

  /* ─── Report ─── */
  if (phase === 'done' && report) {
    return (
      <div>
        <PageHeader
          title="Mock Interview Report"
          subtitle={`${report.durationMinutes}-minute session · ${report.questionIds.length} questions · ${formatDateTime(report.startedAt)}`}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Overall score</p>
            <p className="mt-1 text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
              {overallAvg === null ? '—' : overallAvg.toFixed(1)}
              <span className="text-lg text-slate-400"> / 10</span>
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Unanswered questions scored 0
            </p>
          </Card>
          <Card className="p-5 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Questions answered</p>
            <p className="mt-1 text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
              {answeredCount}
              <span className="text-lg text-slate-400"> / {report.questionIds.length}</span>
            </p>
          </Card>
          <Card className="p-5 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">Weak areas</p>
            <p className="mt-1 text-4xl font-bold tabular-nums text-slate-900 dark:text-white">
              {report.weakAreas.length}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">categories below 6 / 10</p>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Dimension scores</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Rubric-based evaluation, not AI — scores come from each question&apos;s published rubric.
              Communication reflects answer-length adequacy.
            </p>
            <div className="mt-4 space-y-4">
              {DIMENSION_ORDER.filter((d) => report.dimensionScores[d] !== undefined).map((dim) => {
                const v = report.dimensionScores[dim];
                return (
                  <div key={dim}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{dim}</span>
                      <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                        {v.toFixed(1)} / 10
                      </span>
                    </div>
                    <ProgressBar
                      value={v * 10}
                      className="mt-1.5"
                      tone={v >= 7 ? 'green' : v >= 5 ? 'blue' : 'amber'}
                    />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Recommended revision
            </h2>
            {report.weakAreas.length === 0 ? (
              <p className="mt-2 flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                No weak areas — every category scored 6 or above. Keep the streak going with a
                longer session.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {report.weakAreas.map((cat) => (
                  <li key={cat} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                      <AlertTriangle className="h-4 w-4 text-amber-500" /> {cat}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Scored below 6 in this session. Revisit the lessons, then drill the category
                      in the trainer.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link to={`/interview/trainer?category=${encodeURIComponent(cat)}`}>
                        <Button size="sm" variant="secondary">Practise {cat}</Button>
                      </Link>
                      <Link to="/modules">
                        <Button size="sm" variant="ghost">
                          <BookOpen className="h-4 w-4" /> Revise modules
                        </Button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <h2 className="mt-6 mb-3 text-base font-semibold text-slate-900 dark:text-white">
          Question-by-question breakdown
        </h2>
        <ul className="space-y-3">
          {questions.map((q, i) => {
            const score = report.scores[q.id] ?? 0;
            const wasAnswered = answers[q.id] !== undefined;
            return (
              <li key={q.id}>
                <Card className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Q{i + 1} · <Badge>{q.category}</Badge>
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{q.question}</p>
                      {wasAnswered ? (
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                          {answers[q.id]}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-red-600 italic dark:text-red-400">
                          Not answered — scored 0
                        </p>
                      )}
                    </div>
                    <span
                      className={`shrink-0 text-xl font-bold tabular-nums ${
                        score >= 7
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : score >= 5
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {score}
                      <span className="text-sm text-slate-400"> / 10</span>
                    </span>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => setPhase('setup')}>
            <Mic className="h-4 w-4" /> Run another mock
          </Button>
          <Link to="/interview">
            <Button variant="outline">Back to interview hub</Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Running ─── */
  if (phase === 'running' && current) {
    const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
    return (
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Mock interview · Question {index + 1} of {totalQuestions}
            </p>
            <ProgressBar value={((index + 1) / totalQuestions) * 100} className="mt-2 w-48 sm:w-64" />
          </div>
          <div
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-lg font-bold tabular-nums ${
              lowTime
                ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300'
                : 'border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white'
            }`}
            role="timer"
            aria-label={`${Math.floor(secondsLeft / 60)} minutes ${secondsLeft % 60} seconds remaining`}
          >
            <Timer className="h-5 w-5" />
            {formatSeconds(secondsLeft)}
          </div>
        </div>

        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="blue">{current.category}</Badge>
            <Badge>{current.difficulty}</Badge>
          </div>
          <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-900 dark:text-white">
            {current.question}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            No going back, no peeking at the next question — just like a real interview. When the
            timer hits zero the session ends and unanswered questions score 0.
          </p>

          <label htmlFor="mock-answer" className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Your answer
          </label>
          <textarea
            id="mock-answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={7}
            autoFocus
            placeholder="Answer as you would out loud. Aim for 60–120 words."
            className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/40"
          />
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {wordCount} word{wordCount === 1 ? '' : 's'}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button onClick={submitAnswer} disabled={!answer.trim()}>
              {index + 1 >= totalQuestions ? 'Submit & finish' : 'Submit & next question'}
              <ChevronRight className="h-4 w-4" />
            </Button>
            {confirmEnd ? (
              <>
                <Button
                  variant="danger"
                  onClick={() => finish(scores, answers, results)}
                >
                  Confirm — end interview now
                </Button>
                <Button variant="ghost" onClick={() => setConfirmEnd(false)}>
                  Keep going
                </Button>
              </>
            ) : (
              <Button variant="ghost" onClick={() => setConfirmEnd(true)}>
                End interview early
              </Button>
            )}
          </div>
          {confirmEnd && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
              Ending now scores all remaining questions 0.
            </p>
          )}
        </Card>
      </div>
    );
  }

  /* ─── Setup ─── */
  return (
    <div>
      <Link
        to="/interview"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Interview hub
      </Link>
      <PageHeader
        title="Mock Interview"
        subtitle="A timed, sequential interview: one question at a time, no going back, scored against the published rubric when you submit each answer."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {DURATION_OPTIONS.map((opt) => (
          <button
            key={opt.minutes}
            type="button"
            onClick={() => setDuration(opt.minutes)}
            aria-pressed={duration === opt.minutes}
            className={`rounded-xl border p-5 text-left transition-colors ${
              duration === opt.minutes
                ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
            }`}
          >
            <Clock className={`h-5 w-5 ${duration === opt.minutes ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
            <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              {opt.minutes} minutes
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {opt.questions} questions · {opt.label}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              ~{Math.round(opt.minutes / opt.questions)} min per question
            </p>
          </button>
        ))}
      </div>

      <Card className="mt-5 p-5">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">How it works</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-slate-600 dark:text-slate-400">
          <li>Questions are drawn at random across all categories — you see one at a time.</li>
          <li>Submitting an answer scores it immediately against the question&apos;s rubric and moves on. There is no going back.</li>
          <li>If the timer hits zero, the session ends automatically and unanswered questions score 0.</li>
          <li>
            Your report breaks down five dimensions — ML Fundamentals, Technical, Scenario &amp;
            Business, Project Explanation, and Communication (from answer-length adequacy) — and
            flags weak areas with revision links.
          </li>
          <li>Scoring is rubric-based, not AI: deterministic checks against published keywords and key points.</li>
        </ul>
        <Button size="lg" className="mt-5" onClick={start}>
          <Mic className="h-5 w-5" /> Start {duration}-minute interview
        </Button>
      </Card>

      {state.mockSessions.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
            Previous sessions
          </h2>
          <ul className="space-y-2">
            {[...state.mockSessions]
              .reverse()
              .slice(0, 5)
              .map((s) => {
                const vals = Object.values(s.scores);
                const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
                return (
                  <li key={s.id}>
                    <Card className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                      <div className="text-sm">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {s.durationMinutes}-minute session
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {' · '}
                          {s.questionIds.length} questions · {formatDateTime(s.startedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        {s.weakAreas.length > 0 && (
                          <span className="text-xs text-amber-600 dark:text-amber-400">
                            Weak: {s.weakAreas.join(', ')}
                          </span>
                        )}
                        <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                          {avg.toFixed(1)} / 10
                        </span>
                      </div>
                    </Card>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}
