import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  MessageSquare,
  RefreshCw,
  Scale,
  XCircle,
} from 'lucide-react';
import { Badge, Button, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui';
import { INTERVIEW_QUESTIONS } from '../content';
import { useStore } from '../store/store';
import { evaluateAnswer, type RubricResult } from '../lib/rubric';
import type { InterviewCategory, InterviewQuestion } from '../types';

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

type CategoryFilter = 'All' | InterviewCategory;

function pickQuestion(
  pool: InterviewQuestion[],
  answeredIds: Set<string>,
  excludeId: string | null,
): InterviewQuestion | null {
  if (pool.length === 0) return null;
  const unanswered = pool.filter((q) => !answeredIds.has(q.id) && q.id !== excludeId);
  const candidates = unanswered.length > 0 ? unanswered : pool.filter((q) => q.id !== excludeId);
  const list = candidates.length > 0 ? candidates : pool;
  return list[Math.floor(Math.random() * list.length)];
}

export default function InterviewTrainerPage() {
  const { state, recordInterviewAnswer } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const paramCategory = searchParams.get('category');
  const initialCategory: CategoryFilter =
    paramCategory && (CATEGORIES as string[]).includes(paramCategory)
      ? (paramCategory as InterviewCategory)
      : 'All';

  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<RubricResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const answeredIds = useMemo(
    () => new Set(state.interviewAnswers.map((a) => a.questionId)),
    [state.interviewAnswers],
  );

  const pool = useMemo(
    () =>
      category === 'All'
        ? INTERVIEW_QUESTIONS
        : INTERVIEW_QUESTIONS.filter((q) => q.category === category),
    [category],
  );

  const [question, setQuestion] = useState<InterviewQuestion | null>(() =>
    pickQuestion(
      initialCategory === 'All'
        ? INTERVIEW_QUESTIONS
        : INTERVIEW_QUESTIONS.filter((q) => q.category === initialCategory),
      new Set(state.interviewAnswers.map((a) => a.questionId)),
      null,
    ),
  );

  const unansweredInPool = pool.filter((q) => !answeredIds.has(q.id)).length;

  const chooseCategory = (c: CategoryFilter) => {
    setCategory(c);
    if (c === 'All') setSearchParams({});
    else setSearchParams({ category: c });
    const nextPool =
      c === 'All' ? INTERVIEW_QUESTIONS : INTERVIEW_QUESTIONS.filter((q) => q.category === c);
    setQuestion(pickQuestion(nextPool, answeredIds, null));
    setAnswer('');
    setResult(null);
    setSubmitted(false);
  };

  const nextQuestion = () => {
    setQuestion((current) => pickQuestion(pool, answeredIds, current?.id ?? null));
    setAnswer('');
    setResult(null);
    setSubmitted(false);
  };

  const submit = () => {
    if (!question || !answer.trim()) return;
    const evaluation = evaluateAnswer(question, answer);
    setResult(evaluation);
    setSubmitted(true);
    recordInterviewAnswer({
      questionId: question.id,
      category: question.category,
      answer,
      score: evaluation.score,
      coverage: evaluation.coverage,
      missingPoints: evaluation.missingPoints,
    });
  };

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  if (INTERVIEW_QUESTIONS.length === 0) {
    return (
      <div>
        <PageHeader title="Answer Trainer" />
        <EmptyState
          icon={<MessageSquare className="h-6 w-6" />}
          title="No interview questions yet"
          detail="Interview questions are being authored and will appear here as soon as they are published."
          action={
            <Link to="/interview">
              <Button variant="secondary">Back to interview hub</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (!question) {
    return (
      <div>
        <PageHeader title="Answer Trainer" />
        <EmptyState
          icon={<MessageSquare className="h-6 w-6" />}
          title="No questions in this category yet"
          detail="Pick another category — questions are added over time."
          action={
            <Button variant="secondary" onClick={() => chooseCategory('All')}>
              Show all categories
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/interview"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Interview hub
      </Link>
      <PageHeader
        title="Answer Trainer"
        subtitle="Explain the concept in your own words, as you would to an interviewer. Then see exactly which rubric points you covered and which you missed."
      />

      {/* Honest evaluation label */}
      <Card className="mb-5 border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/40">
        <p className="flex items-start gap-2 text-sm text-blue-900 dark:text-blue-100">
          <Scale className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">Rubric-based evaluation, not AI</span> — your answer is
            checked against the question&apos;s published rubric: keyword coverage and key-point
            coverage, scored deterministically. It cannot judge nuance the way a human interviewer
            would.
          </span>
        </p>
      </Card>

      {/* Category picker */}
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {(['All', ...CATEGORIES] as CategoryFilter[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => chooseCategory(c)}
            aria-pressed={category === c}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              category === c
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Question + answer */}
        <div>
          <Card className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="blue">{question.category}</Badge>
              <Badge>{question.difficulty}</Badge>
              {answeredIds.has(question.id) && <Badge tone="green">Answered before</Badge>}
              <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
                {unansweredInPool} unanswered in this {category === 'All' ? 'bank' : 'category'}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-900 dark:text-white">
              {question.question}
            </h2>

            <label htmlFor="interview-answer" className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Your answer — explain in your own words
            </label>
            <textarea
              id="interview-answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={submitted}
              rows={7}
              placeholder="Define the concept, explain why it matters, and give an example. Aim for 60–120 words."
              className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/40 dark:disabled:bg-slate-900"
            />
            <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>
                {wordCount} word{wordCount === 1 ? '' : 's'}
                {wordCount > 0 && wordCount < 15 && ' — too short for an interview answer'}
                {wordCount >= 40 && wordCount <= 200 && ' — good interview length'}
                {wordCount > 250 && ' — longer than most interview answers need to be'}
              </span>
              <span>Aim: 60–120 words</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {!submitted ? (
                <>
                  <Button onClick={submit} disabled={!answer.trim()}>
                    Submit for rubric score
                  </Button>
                  <Button variant="outline" onClick={nextQuestion}>
                    Next question <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button onClick={nextQuestion}>
                  <RefreshCw className="h-4 w-4" /> Try another question
                </Button>
              )}
            </div>
          </Card>

          {/* Model answer + follow-ups (after submit) */}
          {submitted && result && (
            <Card className="mt-4 p-5 sm:p-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <Lightbulb className="h-4 w-4 text-amber-500" /> Model interview-ready answer
              </h3>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                {question.modelAnswer}
              </p>
              {question.followUps.length > 0 && (
                <>
                  <h4 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Tougher follow-ups an interviewer might ask
                  </h4>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
                    {question.followUps.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </>
              )}
            </Card>
          )}
        </div>

        {/* Rubric result */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          {!submitted || !result ? (
            <Card className="border-dashed p-5 text-center">
              <Scale className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
              <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                Your rubric score will appear here
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Submit an answer to see your score out of 10, which key terms you covered, and
                what a strong answer still needs.
              </p>
              <div className="mt-4 text-left">
                <h4 className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                  How scoring works
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-500 dark:text-slate-400">
                  <li>60% keyword coverage, 40% key-point coverage, scaled to /10.</li>
                  <li>Answers under 15 words score at most 4 — interviews need depth.</li>
                  <li>Every point is explainable: the rubric is the question&apos;s own checklist.</li>
                </ul>
              </div>
            </Card>
          ) : (
            <Card className="p-5">
              <div className="flex items-end justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Rubric score</h3>
                <p className="text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                  {result.score}
                  <span className="text-base text-slate-400"> / 10</span>
                </p>
              </div>
              <ProgressBar
                value={result.score * 10}
                className="mt-2"
                tone={result.score >= 7 ? 'green' : result.score >= 5 ? 'blue' : 'amber'}
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Keyword coverage: {Math.round(result.coverage * 100)}% ({result.foundKeywords.length} of{' '}
                {question.rubricKeywords.length} terms) · Key points: {result.coveredPoints.length} of{' '}
                {question.keyPoints.length}
              </p>

              {result.lengthNote && (
                <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/60 dark:text-amber-200">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {result.lengthNote}
                </p>
              )}

              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <h4 className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> What was good
                  </h4>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-400">
                    {result.good.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
                {result.missing.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4" /> What was missing
                    </h4>
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-400">
                      {result.missing.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.incorrect.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-1.5 font-semibold text-red-700 dark:text-red-400">
                      <XCircle className="h-4 w-4" /> Possible misconceptions
                    </h4>
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-400">
                      {result.incorrect.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.missingPoints.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Key points to add next time</h4>
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-400">
                      {result.missingPoints.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
