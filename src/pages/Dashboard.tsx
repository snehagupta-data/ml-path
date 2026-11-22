import { Link } from 'react-router-dom';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Code2,
  Flame,
  MessageSquare,
  RotateCcw,
  Target,
  TrendingUp,
} from 'lucide-react';
import {
  ALL_LESSONS,
  CHALLENGES,
  INTERVIEW_QUESTIONS,
  PROJECTS,
  QUESTIONS,
  QUESTIONS_BY_ID,
  allTopics,
  moduleOfLesson,
} from '../content';
import { useStore } from '../store/store';
import {
  interviewReadiness,
  nextAction,
  overallProgress,
  revisionDue,
  topicMastery,
} from '../lib/mastery';
import { Badge, Card, PageHeader, ProgressBar } from '../components/ui';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function last7Days(): { key: string; label: string }[] {
  const days: { key: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate(),
    ).padStart(2, '0')}`;
    days.push({ key, label: d.toLocaleDateString('en-IN', { weekday: 'short' }) });
  }
  return days;
}

interface MissionItem {
  icon: typeof BookOpen;
  title: string;
  detail: string;
  to: string;
  done: boolean;
}

function MissionRow({ item }: { item: MissionItem }) {
  return (
    <li>
      <Link
        to={item.to}
        className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
      >
        <span
          className={
            item.done
              ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
          }
        >
          {item.done ? (
            <CheckCircle2 className="h-5 w-5" aria-hidden />
          ) : (
            <item.icon className="h-5 w-5" aria-hidden />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">
            {item.title}
          </span>
          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
            {item.detail}
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
      </Link>
    </li>
  );
}

export default function DashboardPage() {
  const { state } = useStore();

  const progress = overallProgress(state, ALL_LESSONS.length);
  const completedLessons = Object.keys(state.lessonsCompleted).length;
  const nextLesson = ALL_LESSONS.find((l) => !state.lessonsCompleted[l.id]);
  const nextModule = nextLesson ? moduleOfLesson(nextLesson.id) : undefined;

  const attemptedIds = new Set(state.attempts.map((a) => a.questionId));
  const unattempted = QUESTIONS.filter((q) => !attemptedIds.has(q.id));

  const passedChallengeIds = new Set(
    state.challengeAttempts.filter((a) => a.passed).map((a) => a.challengeId),
  );
  const nextChallenge = CHALLENGES.find((c) => !passedChallengeIds.has(c.id));
  const passedTopics = new Set(
    CHALLENGES.filter((c) => passedChallengeIds.has(c.id)).map((c) => c.topic),
  );

  const dueCount = revisionDue(state);

  const answeredInterviewIds = new Set(state.interviewAnswers.map((a) => a.questionId));
  const unansweredInterview = INTERVIEW_QUESTIONS.filter((q) => !answeredInterviewIds.has(q.id));

  const readiness = interviewReadiness(state);

  const masteries = allTopics().map((t) => topicMastery(state, t, false, passedTopics.has(t)));
  const masteredCount = masteries.filter((m) => m.status === 'Mastered').length;
  const weakCount = masteries.filter((m) => m.status === 'Weak').length;

  const totalProjectSteps = PROJECTS.reduce((s, p) => s + p.steps.length, 0);
  const doneProjectSteps = PROJECTS.reduce(
    (s, p) => s + p.steps.filter((_, i) => state.projectChecklist[p.id]?.[i]).length,
    0,
  );
  const projectPct =
    totalProjectSteps > 0 ? Math.round((doneProjectSteps / totalProjectSteps) * 100) : 0;

  const recentMistakes = [...state.mistakes]
    .sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt))
    .slice(0, 5);

  const action = nextAction(state, ALL_LESSONS);

  const weekData = last7Days().map((d) => {
    const a = state.activity.find((x) => x.date === d.key);
    return {
      day: d.label,
      questions: a?.questions ?? 0,
      lessons: a?.lessons ?? 0,
      challenges: a?.challenges ?? 0,
      interviews: a?.interviews ?? 0,
    };
  });
  const weekTotal = weekData.reduce(
    (s, d) => s + d.questions + d.lessons + d.challenges + d.interviews,
    0,
  );

  const mission: MissionItem[] = [
    nextLesson
      ? {
          icon: BookOpen,
          title: `Continue: ${nextLesson.title}`,
          detail: `${nextModule?.title ?? 'Next lesson'} · ${nextLesson.minutes} min`,
          to: `/lesson/${nextLesson.id}`,
          done: false,
        }
      : {
          icon: BookOpen,
          title: 'All lessons complete',
          detail: 'Review the roadmap or take on a project',
          to: '/projects',
          done: true,
        },
    {
      icon: Brain,
      title:
        unattempted.length > 0
          ? `Practise ${Math.min(5, unattempted.length)} new question${Math.min(5, unattempted.length) === 1 ? '' : 's'}`
          : 'All questions attempted',
      detail:
        unattempted.length > 0
          ? `${unattempted.length} unattempted question${unattempted.length === 1 ? '' : 's'} remaining`
          : 'Revisit practice to sharpen weak topics',
      to: '/practice',
      done: unattempted.length === 0 && QUESTIONS.length > 0,
    },
    ...(nextChallenge
      ? [
          {
            icon: Code2,
            title: `Solve: ${nextChallenge.title}`,
            detail: `${nextChallenge.topic} · ${nextChallenge.difficulty}`,
            to: `/coding/${nextChallenge.id}`,
            done: false,
          } as MissionItem,
        ]
      : []),
    {
      icon: RotateCcw,
      title: dueCount > 0 ? `Revise ${dueCount} due item${dueCount === 1 ? '' : 's'}` : 'Nothing due for revision',
      detail:
        dueCount > 0
          ? 'Spaced repetition keeps past mistakes from returning'
          : 'Revision items appear here after a wrong answer',
      to: '/revision',
      done: dueCount === 0,
    },
    {
      icon: MessageSquare,
      title:
        unansweredInterview.length > 0
          ? 'Answer 1 interview question'
          : 'Interview bank complete',
      detail:
        unansweredInterview.length > 0
          ? `${unansweredInterview.length} unanswered interview question${unansweredInterview.length === 1 ? '' : 's'}`
          : INTERVIEW_QUESTIONS.length > 0
            ? 'All interview questions answered at least once'
            : 'No interview questions available yet',
      to: '/interview',
      done: unansweredInterview.length === 0 && INTERVIEW_QUESTIONS.length > 0,
    },
  ];

  return (
    <div>
      <PageHeader
        title={`${greeting()}, ${state.name}`}
        subtitle="Your learning command center — everything below is computed from your real activity."
      />

      {/* Recommended next action */}
      <Card className="border-blue-200 bg-blue-50/50 px-5 py-5 dark:border-blue-900 dark:bg-blue-950/30">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Target className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Recommended next action
              </p>
              <h2 className="mt-0.5 text-lg font-semibold text-slate-900 dark:text-white">
                {action.title}
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-600 dark:text-slate-400">
                {action.detail}
              </p>
            </div>
          </div>
          <Link
            to={action.link}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {action.linkLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </Card>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Overall progress
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{progress}%</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {completedLessons} of {ALL_LESSONS.length} lessons complete
          </p>
          <div className="mt-2">
            <ProgressBar value={progress} />
          </div>
        </Card>
        <Card className="px-4 py-4">
          <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Flame className="h-3.5 w-3.5" aria-hidden /> Streak
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {state.streak.count} day{state.streak.count === 1 ? '' : 's'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {state.attempts.length} questions attempted
          </p>
        </Card>
        <Card className="px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Topics mastered / weak
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {masteredCount} <span className="text-base font-medium text-slate-400">/ {weakCount}</span>
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden /> from quiz evidence only
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
            {readiness === null
              ? 'Answer interview questions to get a score'
              : `${state.interviewAnswers.length} answers recorded`}
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Today's mission */}
        <Card className="px-5 py-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Today&apos;s mission
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            A small, concrete set — generated from where you actually are.
          </p>
          <ul className="mt-4 space-y-2.5">
            {mission.map((item) => (
              <MissionRow key={item.title} item={item} />
            ))}
          </ul>
        </Card>

        {/* Weekly activity */}
        <Card className="px-5 py-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Activity this week
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {weekTotal === 0
              ? 'No activity recorded in the last 7 days yet.'
              : `${weekTotal} learning actions in the last 7 days.`}
          </p>
          <div className="mt-4 h-44 w-full" role="img" aria-label="Bar chart of activity over the last 7 days">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="questions" stackId="a" fill="#2563eb" name="Questions" />
                <Bar dataKey="lessons" stackId="a" fill="#60a5fa" name="Lessons" />
                <Bar dataKey="challenges" stackId="a" fill="#93c5fd" name="Challenges" />
                <Bar
                  dataKey="interviews"
                  stackId="a"
                  fill="#cbd5e1"
                  name="Interviews"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-blue-600" aria-hidden /> Questions
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-blue-400" aria-hidden /> Lessons
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-blue-300" aria-hidden /> Challenges
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" aria-hidden /> Interviews
            </span>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Revision + projects */}
        <Card className="px-5 py-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Revision &amp; projects</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-amber-500" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {dueCount} item{dueCount === 1 ? '' : 's'} due for revision
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {state.revision.filter((r) => !r.completed).length} total in the revision queue
                  </p>
                </div>
              </div>
              <Link to="/revision" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                Revise
              </Link>
            </div>
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-blue-600" aria-hidden />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Project progress: {totalProjectSteps > 0 ? `${projectPct}%` : 'no projects yet'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {doneProjectSteps} of {totalProjectSteps} checklist steps done
                    </p>
                  </div>
                </div>
                <Link to="/projects" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Projects
                </Link>
              </div>
              {totalProjectSteps > 0 && (
                <div className="mt-2">
                  <ProgressBar value={projectPct} />
                </div>
              )}
            </div>
            {state.diagnostic.completedAt === null && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950">
                <p className="flex items-center gap-2 text-sm font-medium text-amber-800 dark:text-amber-200">
                  <AlertTriangle className="h-4 w-4" aria-hidden />
                  Diagnostic not taken yet
                </p>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                  Measure your starting point across 8 areas so the roadmap can adapt to you.
                </p>
                <Link
                  to="/diagnostic"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-amber-800 underline dark:text-amber-200"
                >
                  Take the diagnostic <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Recent mistakes */}
        <Card className="px-5 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Recent mistakes
            </h2>
            <Link to="/mistakes" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              View all
            </Link>
          </div>
          {recentMistakes.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              No mistakes recorded yet. Wrong answers land here automatically so you can learn
              from them.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {recentMistakes.map((m) => (
                <li key={m.id} className="rounded-lg border border-slate-200 px-3 py-2.5 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="red">{m.topic}</Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      seen {m.attemptCount} time{m.attemptCount === 1 ? '' : 's'} · {m.revisionStatus}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-800 dark:text-slate-100">
                    {QUESTIONS_BY_ID.get(m.questionId)?.question ?? m.question}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
