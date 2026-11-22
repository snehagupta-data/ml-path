import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Info } from 'lucide-react';
import type { MasteryStatus } from '../types';
import { ALL_LESSONS, CHALLENGES, QUESTIONS_BY_ID, allTopics } from '../content';
import { useStore } from '../store/store';
import {
  interviewReadiness,
  nextAction,
  readinessScores,
  skillScores,
  topicMastery,
  weakTopics,
} from '../lib/mastery';
import MasteryBadge from '../components/MasteryBadge';
import SkillRadar from '../components/SkillRadar';
import { Badge, Card, PageHeader, ProgressBar } from '../components/ui';

const STATUS_ORDER: MasteryStatus[] = [
  'Mastered',
  'Strong',
  'Practicing',
  'Weak',
  'Learning',
  'Locked',
];

/** Start of the current calendar week (Monday, local time). */
function startOfWeek(): Date {
  const d = new Date();
  const day = d.getDay(); // 0 = Sunday
  const diff = (day + 6) % 7; // days since Monday
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function AnalyticsPage() {
  const { state } = useStore();

  const passedChallengeIds = useMemo(
    () => new Set(state.challengeAttempts.filter((a) => a.passed).map((a) => a.challengeId)),
    [state.challengeAttempts],
  );
  const passedTopics = useMemo(
    () => new Set(CHALLENGES.filter((c) => passedChallengeIds.has(c.id)).map((c) => c.topic)),
    [passedChallengeIds],
  );

  const attempts = state.attempts.length;
  const correctCount = state.attempts.filter((a) => a.correct).length;
  const accuracy = attempts > 0 ? Math.round((correctCount / attempts) * 100) : null;
  const challengesPassed = passedChallengeIds.size;
  const readiness = interviewReadiness(state);
  const lessonsDone = Object.keys(state.lessonsCompleted).length;
  const skills = useMemo(
    () => skillScores(state, QUESTIONS_BY_ID),
    [state],
  );
  const readinessList = useMemo(
    () => readinessScores(state, QUESTIONS_BY_ID),
    [state],
  );

  const masteries = useMemo(() => {
    const list = allTopics().map((t) => topicMastery(state, t, false, passedTopics.has(t)));
    return list.sort((a, b) => {
      if (a.attempts === 0 && b.attempts === 0) return a.topic.localeCompare(b.topic);
      if (a.attempts === 0) return 1;
      if (b.attempts === 0) return -1;
      return (a.score ?? 0) - (b.score ?? 0);
    });
  }, [state, passedTopics]);

  const distribution = useMemo(() => {
    const counts = new Map<MasteryStatus, number>();
    for (const m of masteries) counts.set(m.status, (counts.get(m.status) ?? 0) + 1);
    return STATUS_ORDER.map((status) => ({ status, count: counts.get(status) ?? 0 }));
  }, [masteries]);

  // Weekly review — current calendar week only.
  const week = useMemo(() => {
    const start = startOfWeek();
    const inWeek = (iso: string) => new Date(iso) >= start;
    const weekAttempts = state.attempts.filter((a) => inWeek(a.attemptedAt));
    const weekCorrect = weekAttempts.filter((a) => a.correct).length;
    const weekLessons = Object.values(state.lessonsCompleted).filter(inWeek).length;
    const weekMistakes = state.mistakes.filter((m) => inWeek(m.firstSeenAt));
    return {
      lessons: weekLessons,
      questions: weekAttempts.length,
      accuracy:
        weekAttempts.length > 0 ? Math.round((weekCorrect / weekAttempts.length) * 100) : null,
      mistakes: weekMistakes.length,
      weak: weakTopics(state),
      focus: nextAction(state, ALL_LESSONS),
    };
  }, [state]);

  return (
    <div>
      <PageHeader
        title="Progress Analytics"
        subtitle="Evidence, not hours studied. Every number below comes from recorded attempts, challenges, and interview answers."
      />

      {/* Overall stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card className="px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Questions attempted
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{attempts}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {accuracy === null ? 'No attempts yet' : `${accuracy}% accuracy overall`}
          </p>
        </Card>
        <Card className="px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Coding challenges passed
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {challengesPassed} / {CHALLENGES.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {state.challengeAttempts.length} challenge attempts
          </p>
        </Card>
        <Card className="px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Interview readiness
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {readiness === null ? '—' : `${readiness}%`}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {state.interviewAnswers.length} answers · {state.mockSessions.filter((s) => s.completedAt).length} mock sessions
          </p>
        </Card>
        <Card className="px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Lessons completed
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {lessonsDone} / {ALL_LESSONS.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {Object.keys(state.lessonsRead).length} lessons read
          </p>
        </Card>
        <Card className="px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Current streak
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {state.streak.count} day{state.streak.count === 1 ? '' : 's'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {state.mistakes.filter((m) => m.revisionStatus !== 'Resolved').length} unresolved mistakes
          </p>
        </Card>
        <Card className="px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Revision queue
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {state.revision.filter((r) => !r.completed).length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {state.revision.filter((r) => r.completed).length} items fully completed
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Skill radar */}
        <Card className="px-5 py-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Skill radar</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            11 dimensions, scored from your attempts. Dimensions with no attempts show as “No
            data yet”.
          </p>
          <div className="mt-4">
            <SkillRadar scores={skills} />
          </div>
        </Card>

        {/* ML readiness */}
        <Card className="px-5 py-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">ML readiness</h2>
          <p className="mt-0.5 flex items-start gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Performance-based, not completion-based: finishing lessons alone never means
            job-ready. Scores come from demonstrated accuracy, projects, and interview answers.
          </p>
          <ul className="mt-4 space-y-3">
            {readinessList.map((r) => (
              <li key={r.dimension}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900 dark:text-white">{r.dimension}</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {r.score === null ? 'No data yet' : `${r.score}%`}
                  </span>
                </div>
                <div className="mt-1">
                  <ProgressBar
                    value={r.score ?? 0}
                    tone={
                      r.score === null
                        ? 'blue'
                        : r.score >= 70
                          ? 'green'
                          : r.score >= 40
                            ? 'amber'
                            : 'red'
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Weekly review */}
      <Card className="mt-6 px-5 py-5">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
          <BarChart3 className="h-5 w-5 text-blue-600" aria-hidden /> This week&apos;s review
        </h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Current calendar week (Monday to today) — generated from your activity.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Lessons completed</p>
            <p className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">{week.lessons}</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Questions attempted</p>
            <p className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">{week.questions}</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Accuracy</p>
            <p className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">
              {week.accuracy === null ? '—' : `${week.accuracy}%`}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">New mistakes</p>
            <p className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">{week.mistakes}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-900 dark:text-white">Weak areas:</span>
          {week.weak.length === 0 ? (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              None identified — no topic with 2+ attempts is scoring below 40%.
            </span>
          ) : (
            week.weak.map((w) => (
              <Badge key={w.topic} tone="red">
                {w.topic} · {w.score}%
              </Badge>
            ))
          )}
        </div>
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50/50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/30">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            Recommended focus: {week.focus.title}
          </p>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{week.focus.detail}</p>
          <Link
            to={week.focus.link}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {week.focus.linkLabel} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Mastery distribution */}
        <Card className="px-5 py-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Mastery distribution
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {masteries.length} topic{masteries.length === 1 ? '' : 's'} across the question bank.
          </p>
          <ul className="mt-4 space-y-3">
            {distribution.map(({ status, count }) => (
              <li key={status}>
                <div className="flex items-center justify-between text-sm">
                  <MasteryBadge status={status} />
                  <span className="text-slate-600 dark:text-slate-400">
                    {count} topic{count === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="mt-1">
                  <ProgressBar
                    value={masteries.length > 0 ? (count / masteries.length) * 100 : 0}
                    tone={
                      status === 'Mastered' || status === 'Strong'
                        ? 'green'
                        : status === 'Weak'
                          ? 'red'
                          : status === 'Practicing'
                            ? 'amber'
                            : 'blue'
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Per-topic mastery table */}
        <Card className="overflow-hidden">
          <h2 className="px-5 pt-5 text-base font-semibold text-slate-900 dark:text-white">
            Per-topic mastery
          </h2>
          <p className="px-5 pt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Weakest attempted topics first.
          </p>
          {masteries.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-500 dark:text-slate-400">
              No topics yet — the question bank is still being authored.
            </p>
          ) : (
            <div className="mt-4 max-h-96 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-medium text-slate-600 dark:text-slate-300">
                      Topic
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-medium text-slate-600 dark:text-slate-300">
                      Score
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-medium text-slate-600 dark:text-slate-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {masteries.map((m) => (
                    <tr key={m.topic} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-white">
                        {m.topic}
                        <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">
                          {m.attempts} attempt{m.attempts === 1 ? '' : 's'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">
                        {m.score === null ? '—' : `${m.score}%`}
                      </td>
                      <td className="px-4 py-2.5">
                        <MasteryBadge status={m.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
