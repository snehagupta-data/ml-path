import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Brain, Play } from 'lucide-react';
import type { Difficulty, Question, QuestionType } from '../types';
import { CHALLENGES, QUESTIONS, allTopics } from '../content';
import { useStore } from '../store/store';
import { topicMastery } from '../lib/mastery';
import MasteryBadge from '../components/MasteryBadge';
import QuizRunner from '../components/QuizRunner';
import { Button, Card, EmptyState, PageHeader } from '../components/ui';

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Interview', 'Real-world'];

const TYPES: { value: QuestionType; label: string }[] = [
  { value: 'mcq', label: 'Multiple choice' },
  { value: 'numerical', label: 'Numerical' },
  { value: 'short', label: 'Short answer' },
  { value: 'scenario', label: 'Scenario' },
  { value: 'model-selection', label: 'Model selection' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SESSION_CAP = 20;

export default function PracticePage() {
  const { state } = useStore();
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get('topic');

  const [topic, setTopic] = useState(topicParam ?? 'All');
  const [difficulty, setDifficulty] = useState<'All' | Difficulty>('All');
  const [type, setType] = useState<'All' | QuestionType>('All');
  const [session, setSession] = useState<{ questions: Question[]; key: number } | null>(null);

  // Deep-link support: /practice?topic=... (used by the Mistake Journal).
  useEffect(() => {
    if (topicParam) setTopic(topicParam);
  }, [topicParam]);

  const topics = useMemo(() => allTopics(), []);

  const passedChallengeIds = useMemo(
    () => new Set(state.challengeAttempts.filter((a) => a.passed).map((a) => a.challengeId)),
    [state.challengeAttempts],
  );
  const passedTopics = useMemo(
    () => new Set(CHALLENGES.filter((c) => passedChallengeIds.has(c.id)).map((c) => c.topic)),
    [passedChallengeIds],
  );

  const filtered = useMemo(
    () =>
      QUESTIONS.filter((q) => {
        if (topic !== 'All' && q.topic !== topic) return false;
        if (difficulty !== 'All' && q.difficulty !== difficulty) return false;
        if (type !== 'All' && q.type !== type) return false;
        return true;
      }),
    [topic, difficulty, type],
  );

  const masteries = useMemo(() => {
    const list = topics.map((t) => topicMastery(state, t, false, passedTopics.has(t)));
    // Attempted topics first, weakest first; then untouched topics alphabetically.
    return list.sort((a, b) => {
      if (a.attempts === 0 && b.attempts === 0) return a.topic.localeCompare(b.topic);
      if (a.attempts === 0) return 1;
      if (b.attempts === 0) return -1;
      return (a.score ?? 0) - (b.score ?? 0);
    });
  }, [topics, state, passedTopics]);

  function startPractice() {
    setSession({ questions: shuffle(filtered).slice(0, SESSION_CAP), key: Date.now() });
  }

  const selectClass =
    'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white';

  return (
    <div>
      <PageHeader
        title="Quiz Practice"
        subtitle="Practise by topic, difficulty, and question type. Every answer is recorded — wrong ones go to your Mistake Journal and Revision queue."
      />

      {session ? (
        <div>
          <Button variant="ghost" className="mb-4 -ml-2" onClick={() => setSession(null)}>
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to filters
          </Button>
          <QuizRunner
            key={session.key}
            questions={session.questions}
            source="quiz"
            title="Practice session"
          />
        </div>
      ) : (
        <>
          <Card className="px-5 py-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="practice-topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Topic
                </label>
                <select
                  id="practice-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className={`${selectClass} mt-1 w-full`}
                >
                  <option value="All">All topics</option>
                  {topics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="practice-difficulty" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Difficulty
                </label>
                <select
                  id="practice-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'All' | Difficulty)}
                  className={`${selectClass} mt-1 w-full`}
                >
                  <option value="All">All difficulties</option>
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="practice-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Question type
                </label>
                <select
                  id="practice-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as 'All' | QuestionType)}
                  className={`${selectClass} mt-1 w-full`}
                >
                  <option value="All">All types</option>
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button onClick={startPractice} disabled={filtered.length === 0}>
                <Play className="h-4 w-4" aria-hidden />
                Start practice ({Math.min(SESSION_CAP, filtered.length)} questions)
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filtered.length === 0
                  ? 'No questions match these filters.'
                  : `${filtered.length} question${filtered.length === 1 ? '' : 's'} match — sessions are capped at ${SESSION_CAP}, shuffled.`}
              </p>
            </div>
          </Card>

          <h2 className="mb-3 mt-8 text-base font-semibold text-slate-900 dark:text-white">
            Mastery by topic
          </h2>
          {masteries.length === 0 ? (
            <EmptyState
              icon={<Brain className="h-6 w-6" aria-hidden />}
              title="No questions yet"
              detail="The question bank is still being authored. Once questions are published, your per-topic mastery will appear here."
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                        Topic
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                        Attempts
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                        Correct
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                        Score
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {masteries.map((m) => (
                      <tr key={m.topic} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                          {m.topic}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{m.attempts}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{m.correct}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {m.score === null ? '—' : `${m.score}%`}
                        </td>
                        <td className="px-4 py-3">
                          <MasteryBadge status={m.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
