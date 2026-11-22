import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import type { BookmarkTag } from '../types';
import { ALL_LESSONS, LESSONS_BY_ID, QUESTIONS_BY_ID, moduleOfLesson, questionsForLesson } from '../content';
import { useStore } from '../store/store';
import { lessonScore } from '../lib/mastery';
import { Badge, Button, Card, EmptyState, ProgressBar } from '../components/ui';
import { cn } from '../lib/utils';
import NotesPanel from '../components/NotesPanel';
import QuizRunner from '../components/QuizRunner';
import VisualRenderer from '../components/visuals/VisualRenderer';

type ExplanationLevel = 'simple' | 'technical' | 'interview';

const BOOKMARK_TAGS: BookmarkTag[] = ['Important', 'Revise', 'Confusing', 'Interview', 'Project Idea'];

const LEVELS: { key: ExplanationLevel; label: string; hint: string }[] = [
  { key: 'simple', label: 'Simple', hint: 'Plain language, no jargon' },
  { key: 'technical', label: 'Technical', hint: 'Precise definitions and mechanics' },
  { key: 'interview', label: 'Interview', hint: 'How to say it in an interview' },
];

function Section({
  id,
  title,
  highlight,
  children,
}: {
  id: string;
  title: string;
  highlight: string | null;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={title}
      className={cn(
        'scroll-mt-24 rounded-xl transition-shadow duration-300',
        highlight === id && 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-950',
      )}
    >
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export default function LessonViewPage() {
  const { lessonId } = useParams();
  const { state, markLessonRead, completeLesson, toggleBookmark } = useStore();
  const [level, setLevel] = useState<ExplanationLevel>('simple');
  const [highlight, setHighlight] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const highlightTimer = useRef<number | null>(null);

  const lesson = LESSONS_BY_ID.get(lessonId ?? '');

  useEffect(() => {
    if (lesson) markLessonRead(lesson.id);
    // Reset per-lesson UI when navigating between lessons.
    setLevel('simple');
    setHighlight(null);
    setCopied(false);
  }, [lesson, markLessonRead]);

  useEffect(
    () => () => {
      if (highlightTimer.current !== null) window.clearTimeout(highlightTimer.current);
    },
    [],
  );

  if (!lesson) {
    return (
      <div>
        <EmptyState
          icon={<BookOpen className="h-6 w-6" aria-hidden />}
          title="Lesson not found"
          detail="The lesson you are looking for does not exist or has not been published yet."
          action={
            <Link
              to="/modules"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back to modules
            </Link>
          }
        />
      </div>
    );
  }

  const mod = moduleOfLesson(lesson.id);
  const index = ALL_LESSONS.findIndex((l) => l.id === lesson.id);
  const prev = index > 0 ? ALL_LESSONS[index - 1] : null;
  const next = index >= 0 && index < ALL_LESSONS.length - 1 ? ALL_LESSONS[index + 1] : null;
  const isComplete = Boolean(state.lessonsCompleted[lesson.id]);
  const score = lessonScore(state, lesson, QUESTIONS_BY_ID);
  const questions = questionsForLesson(lesson.id);
  const explanation = level === 'simple' ? lesson.simple : level === 'technical' ? lesson.technical : lesson.interview;

  function jumpTo(id: string, tab?: ExplanationLevel) {
    if (tab) setLevel(tab);
    if (highlightTimer.current !== null) window.clearTimeout(highlightTimer.current);
    setHighlight(id);
    // Scroll after any tab switch has rendered.
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 30);
    highlightTimer.current = window.setTimeout(() => setHighlight(null), 2500);
  }

  async function copyCode() {
    const code = lesson?.code?.code;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — nothing to do.
    }
  }

  const teachActions: { label: string; disabled?: boolean; run: () => void }[] = [
    { label: 'Explain simpler', run: () => jumpTo('explanation', 'simple') },
    { label: 'Give analogy', run: () => jumpTo('analogy') },
    { label: 'Show example', run: () => jumpTo('real-world') },
    { label: 'Show code', disabled: !lesson.code, run: () => jumpTo('code') },
    { label: 'Compare', disabled: !lesson.comparison?.length, run: () => jumpTo('comparison') },
    { label: 'Quiz me', disabled: questions.length === 0, run: () => jumpTo('quiz') },
    { label: 'Interview version', run: () => jumpTo('explanation', 'interview') },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <Link to="/modules" className="hover:underline">
          Modules
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        {mod && (
          <>
            <Link to={`/modules/${mod.id}`} className="hover:underline">
              {mod.title}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </>
        )}
        <span className="text-slate-900 dark:text-white" aria-current="page">
          {lesson.title}
        </span>
      </nav>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {lesson.title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">{lesson.subtitle}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone="neutral">
            <Clock className="h-3 w-3" aria-hidden /> {lesson.minutes} min
          </Badge>
          {lesson.skills.map((skill) => (
            <Badge key={skill} tone="blue">
              {skill}
            </Badge>
          ))}
          {score !== null && (
            <Badge tone={score >= 80 ? 'green' : score >= 60 ? 'blue' : score >= 40 ? 'amber' : 'red'}>
              {score}% mastery
            </Badge>
          )}
          {isComplete && (
            <Badge tone="green">
              <Check className="h-3 w-3" aria-hidden /> Completed
            </Badge>
          )}
        </div>
      </header>

      {/* Teach me differently */}
      <Card className="mb-8 px-5 py-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <Sparkles className="h-4 w-4 text-blue-600" aria-hidden /> Teach me differently
        </p>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Jump to a different angle on the same concept.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {teachActions.map((a) => (
            <Button key={a.label} variant="outline" size="sm" disabled={a.disabled} onClick={a.run}>
              {a.label}
            </Button>
          ))}
        </div>
      </Card>

      <div className="space-y-8">
        {/* Three-level explanation */}
        <Section id="explanation" title="Explanation" highlight={highlight}>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800" role="tablist" aria-label="Explanation level">
            {LEVELS.map((l) => (
              <button
                key={l.key}
                type="button"
                role="tab"
                aria-selected={level === l.key}
                onClick={() => setLevel(l.key)}
                title={l.hint}
                className={cn(
                  'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  level === l.key
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800 dark:text-slate-100">
            {explanation}
          </p>
        </Section>

        <Section id="analogy" title="Analogy" highlight={highlight}>
          <p className="flex gap-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden />
            <span className="whitespace-pre-wrap">{lesson.analogy}</span>
          </p>
        </Section>

        <Section id="real-world" title="Real-world example" highlight={highlight}>
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
            {lesson.realWorld}
          </p>
        </Section>

        {lesson.math && (
          <Section id="math" title="The math" highlight={highlight}>
            <p className="whitespace-pre-wrap rounded-lg bg-slate-50 px-4 py-3 font-mono text-sm leading-relaxed text-slate-800 dark:bg-slate-800 dark:text-slate-100">
              {lesson.math}
            </p>
          </Section>
        )}

        {lesson.code && (
          <Section id="code" title="Code" highlight={highlight}>
            <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-800">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Code2 className="h-3.5 w-3.5" aria-hidden /> Python
                </span>
                <Button variant="ghost" size="sm" onClick={copyCode}>
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden /> Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="code-block overflow-x-auto bg-white px-4 py-3 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
                {lesson.code.code}
              </pre>
            </div>
            {lesson.code.explanation && (
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
                {lesson.code.explanation}
              </p>
            )}
          </Section>
        )}

        {lesson.visual && (
          <Section id="visual" title="Interactive visualization" highlight={highlight}>
            <VisualRenderer visual={lesson.visual} />
          </Section>
        )}

        {lesson.mistakes.length > 0 && (
          <Section id="mistakes" title="Common mistakes" highlight={highlight}>
            <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
              {lesson.mistakes.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </Section>
        )}

        {(lesson.whenToUse?.length || lesson.whenNotToUse?.length) && (
          <Section id="when-to-use" title="When to use — and when not to" highlight={highlight}>
            <div className="grid gap-4 sm:grid-cols-2">
              {lesson.whenToUse && lesson.whenToUse.length > 0 && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/30">
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                    Use it when
                  </p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                    {lesson.whenToUse.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
              {lesson.whenNotToUse && lesson.whenNotToUse.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50/50 px-4 py-3 dark:border-red-900 dark:bg-red-950/30">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                    Avoid it when
                  </p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                    {lesson.whenNotToUse.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Section>
        )}

        {lesson.comparison && lesson.comparison.length > 0 && (
          <Section id="comparison" title="Comparison" highlight={highlight}>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-sm">
                <tbody>
                  {lesson.comparison.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <th
                        scope="row"
                        className="w-1/3 px-4 py-3 align-top font-medium text-slate-900 dark:text-white"
                      >
                        {row.label}
                      </th>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {lesson.keyPoints.length > 0 && (
          <Section id="key-points" title="Key points" highlight={highlight}>
            <ul className="space-y-2">
              {lesson.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {lesson.formulas && lesson.formulas.length > 0 && (
          <Section id="formulas" title="Formulas" highlight={highlight}>
            <dl className="space-y-2">
              {lesson.formulas.map((f, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg bg-slate-50 px-4 py-2.5 dark:bg-slate-800"
                >
                  <dt className="text-sm font-medium text-slate-900 dark:text-white">{f.name}</dt>
                  <dd className="font-mono text-sm text-slate-700 dark:text-slate-300">{f.formula}</dd>
                </div>
              ))}
            </dl>
          </Section>
        )}

        {/* Bookmarks + notes */}
        <Section id="notes" title="Bookmarks & notes" highlight={highlight}>
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Bookmark tags">
            {BOOKMARK_TAGS.map((tag) => {
              const active = state.bookmarks.some(
                (b) => b.lessonId === lesson.id && b.tag === tag,
              );
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleBookmark(lesson.id, tag)}
                  aria-pressed={active}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    active
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-300'
                      : 'border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300',
                  )}
                >
                  <Bookmark
                    className={cn('h-3.5 w-3.5', active && 'fill-blue-600 dark:fill-blue-400')}
                    aria-hidden
                  />
                  {tag}
                </button>
              );
            })}
          </div>
          <NotesPanel lessonId={lesson.id} />
        </Section>

        {/* Lesson quiz */}
        <Section id="quiz" title="Check your understanding" highlight={highlight}>
          {questions.length > 0 ? (
            <QuizRunner key={lesson.id} questions={questions} source="lesson" title={lesson.title} />
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No quiz questions for this lesson yet.
            </p>
          )}
        </Section>

        {/* Complete + navigation */}
        <Card className="px-5 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {isComplete ? 'Lesson completed' : 'Finished reading?'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isComplete
                  ? 'This lesson counts toward your overall progress.'
                  : 'Mark it complete to track your progress through the module.'}
              </p>
            </div>
            <Button onClick={() => completeLesson(lesson.id)} disabled={isComplete}>
              {isComplete ? (
                <>
                  <Check className="h-4 w-4" aria-hidden /> Completed
                </>
              ) : (
                'Mark lesson complete'
              )}
            </Button>
          </div>
          {score !== null && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Lesson mastery</span>
                <span>{score}%</span>
              </div>
              <div className="mt-1">
                <ProgressBar value={score} />
              </div>
            </div>
          )}
        </Card>

        <nav aria-label="Lesson navigation" className="flex items-center justify-between gap-3 pb-4">
          {prev ? (
            <Link
              to={`/lesson/${prev.id}`}
              className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`/lesson/${next.id}`}
              className="inline-flex min-w-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <span className="truncate">{next.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  );
}
