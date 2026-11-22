import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  MessageSquare,
  Mic,
  Target,
} from 'lucide-react';
import { Badge, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui';
import { INTERVIEW_BY_ID, INTERVIEW_QUESTIONS } from '../content';
import { useStore } from '../store/store';
import { formatDateTime } from '../lib/utils';
import type { InterviewCategory } from '../types';

const CATEGORIES: InterviewCategory[] = [
  'ML Fundamentals',
  'Statistics',
  'Python & Pandas',
  'Preprocessing',
  'Regression',
  'Classification',
  'Unsupervised Learning',
  'Model Evaluation',
  'Feature Engineering',
  'Model Selection',
  'SQL + ML',
  'Business + ML',
  'Scenario',
  'Project',
];

function readinessLabel(avg: number | null, answered: number): { text: string; tone: 'neutral' | 'amber' | 'blue' | 'green' } {
  if (avg === null || answered === 0) return { text: 'Not started — answer your first question', tone: 'neutral' };
  if (avg < 5) return { text: 'Building — keep practising the fundamentals', tone: 'amber' };
  if (avg < 7 || answered < 10) return { text: 'Developing — solid base, more reps needed', tone: 'blue' };
  return { text: 'Strong — keep sharp with mock interviews', tone: 'green' };
}

export default function InterviewPage() {
  const { state } = useStore();
  const answers = state.interviewAnswers;

  const stats = useMemo(() => {
    const answeredIds = new Set(answers.map((a) => a.questionId));
    const avg =
      answers.length > 0
        ? answers.reduce((s, a) => s + a.score, 0) / answers.length
        : null;
    const best = answers.length > 0 ? Math.max(...answers.map((a) => a.score)) : null;
    return { totalAnswers: answers.length, distinct: answeredIds.size, avg, best };
  }, [answers]);

  const categoryStats = useMemo(() => {
    return CATEGORIES.map((category) => {
      const questions = INTERVIEW_QUESTIONS.filter((q) => q.category === category);
      const catAnswers = answers.filter((a) => a.category === category);
      const distinct = new Set(catAnswers.map((a) => a.questionId)).size;
      const avg =
        catAnswers.length > 0
          ? catAnswers.reduce((s, a) => s + a.score, 0) / catAnswers.length
          : null;
      return { category, total: questions.length, answered: distinct, avg };
    });
  }, [answers]);

  const recent = useMemo(() => [...answers].reverse().slice(0, 8), [answers]);
  const readiness = readinessLabel(stats.avg, stats.totalAnswers);
  const lastMock = state.mockSessions[state.mockSessions.length - 1];

  return (
    <div>
      <PageHeader
        title="Interview Preparation"
        subtitle="Practise explaining ML out loud, in your own words. Answers are scored against each question's published rubric — deterministic and transparent, not AI."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/interview/trainer">
              <Badge tone="blue" className="cursor-pointer px-3 py-1.5 text-sm">
                <MessageSquare className="h-4 w-4" /> Answer trainer
              </Badge>
            </Link>
            <Link to="/interview/mock">
              <Badge tone="purple" className="cursor-pointer px-3 py-1.5 text-sm">
                <Mic className="h-4 w-4" /> Mock interview
              </Badge>
            </Link>
          </div>
        }
      />

      {INTERVIEW_QUESTIONS.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-6 w-6" />}
          title="No interview questions yet"
          detail="Interview questions are being authored and will appear here as soon as they are published."
        />
      ) : (
        <>
          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <MessageSquare className="h-4 w-4" /> Answers given
              </div>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                {stats.totalAnswers}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {stats.distinct} of {INTERVIEW_QUESTIONS.length} questions attempted
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <BarChart3 className="h-4 w-4" /> Average rubric score
              </div>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                {stats.avg === null ? '—' : `${stats.avg.toFixed(1)} / 10`}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {stats.best === null ? 'No answers yet' : `Best answer: ${stats.best} / 10`}
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Target className="h-4 w-4" /> Readiness
              </div>
              <p className="mt-1">
                <Badge tone={readiness.tone}>{readiness.text}</Badge>
              </p>
              {stats.avg !== null && (
                <ProgressBar
                  value={stats.avg * 10}
                  className="mt-3"
                  tone={stats.avg >= 7 ? 'green' : stats.avg >= 5 ? 'blue' : 'amber'}
                />
              )}
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Mic className="h-4 w-4" /> Mock interviews
              </div>
              <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                {state.mockSessions.length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lastMock
                  ? `Last: ${lastMock.durationMinutes} min on ${formatDateTime(lastMock.startedAt)}`
                  : 'No mock interview yet'}
              </p>
            </Card>
          </div>

          {/* Category grid */}
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
            Question bank by category
          </h2>
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryStats.map((c) => (
              <Link
                key={c.category}
                to={`/interview/trainer?category=${encodeURIComponent(c.category)}`}
                className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{c.category}</h3>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {c.total} question{c.total === 1 ? '' : 's'}
                  {c.answered > 0 && (
                    <>
                      {' · '}
                      {c.answered} answered
                    </>
                  )}
                </p>
                {c.total > 0 && (
                  <ProgressBar value={(c.answered / c.total) * 100} className="mt-2" tone="blue" />
                )}
                {c.avg !== null && (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    Avg score: <span className="font-semibold text-slate-900 tabular-nums dark:text-white">{c.avg.toFixed(1)} / 10</span>
                  </p>
                )}
                {c.answered === c.total && c.total > 0 && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> All questions attempted
                  </p>
                )}
              </Link>
            ))}
          </div>

          {/* Recent answers */}
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Recent answers</h2>
          {recent.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No answers yet. Head to the{' '}
                <Link to="/interview/trainer" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  answer trainer
                </Link>{' '}
                and try your first question.
              </p>
            </Card>
          ) : (
            <ul className="space-y-3">
              {recent.map((a) => {
                const q = INTERVIEW_BY_ID.get(a.questionId);
                return (
                  <li key={a.id}>
                    <Card className="p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {q?.question ?? a.questionId}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                            {a.answer}
                          </p>
                          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Badge>{a.category}</Badge>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {formatDateTime(a.answeredAt)}
                            </span>
                            <span>Rubric coverage: {Math.round(a.coverage * 100)}%</span>
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span
                            className={`text-xl font-bold tabular-nums ${
                              a.score >= 7
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : a.score >= 5
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {a.score}
                          </span>
                          <span className="text-sm text-slate-400"> / 10</span>
                        </div>
                      </div>
                    </Card>
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
