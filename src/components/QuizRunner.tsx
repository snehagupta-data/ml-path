import { useState } from 'react';
import { Check, ChevronRight, Eye, Lightbulb, RotateCcw, X } from 'lucide-react';
import type { Question } from '../types';
import { useStore } from '../store/store';
import { Badge, Button, Card, EmptyState, ProgressBar } from './ui';
import { cn } from '../lib/utils';

export interface QuizResult {
  questionId: string;
  correct: boolean;
  hintsUsed: number;
}

export interface GradedAnswer {
  correct: boolean;
  learnerAnswer: string;
  correctAnswer: string;
}

/**
 * Deterministic grading shared by QuizRunner and the diagnostic.
 * Choice questions: selected index must equal correctIndex.
 * Numerical: within numericTolerance of numericAnswer.
 * Short answer: at least 50% of keywords present (case-insensitive).
 */
export function gradeQuestion(
  q: Question,
  selectedIndex: number | null,
  textAnswer: string,
): GradedAnswer {
  if (q.type === 'mcq' || q.type === 'scenario' || q.type === 'model-selection') {
    const correctAnswer = q.options?.[q.correctIndex ?? -1] ?? '';
    const learnerAnswer =
      selectedIndex !== null ? (q.options?.[selectedIndex] ?? 'No answer') : 'No answer';
    return {
      correct: selectedIndex !== null && selectedIndex === q.correctIndex,
      learnerAnswer,
      correctAnswer,
    };
  }
  if (q.type === 'numerical') {
    const value = parseFloat(textAnswer);
    const expected = q.numericAnswer ?? 0;
    const tolerance = q.numericTolerance ?? 0;
    const correct = !Number.isNaN(value) && Math.abs(value - expected) <= tolerance;
    return {
      correct,
      learnerAnswer: textAnswer.trim() || 'No answer',
      correctAnswer: String(expected),
    };
  }
  // short
  const keywords = q.keywords ?? [];
  const lower = textAnswer.toLowerCase();
  const found = keywords.filter((k) => lower.includes(k.toLowerCase())).length;
  const correct =
    keywords.length === 0 ? textAnswer.trim().length > 0 : found / keywords.length >= 0.5;
  return {
    correct,
    learnerAnswer: textAnswer.trim() || 'No answer',
    correctAnswer: keywords.length > 0 ? keywords.join(', ') : q.solution,
  };
}

function isChoice(q: Question): boolean {
  return q.type === 'mcq' || q.type === 'scenario' || q.type === 'model-selection';
}

const TYPE_LABEL: Record<Question['type'], string> = {
  mcq: 'Multiple choice',
  numerical: 'Numerical',
  short: 'Short answer',
  scenario: 'Scenario',
  'model-selection': 'Model selection',
};

function ReviewItem({ question, result }: { question: Question; result: QuizResult }) {
  const [showSolution, setShowSolution] = useState(false);
  return (
    <li className="rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="flex-1 text-sm font-medium text-slate-900 dark:text-white">
          {question.question}
        </p>
        <Badge tone={result.correct ? 'green' : 'red'}>
          {result.correct ? (
            <>
              <Check className="h-3 w-3" aria-hidden /> Correct
            </>
          ) : (
            <>
              <X className="h-3 w-3" aria-hidden /> Incorrect
            </>
          )}
        </Badge>
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {question.topic} · {result.hintsUsed} hint{result.hintsUsed === 1 ? '' : 's'} used
      </p>
      <Button variant="ghost" size="sm" className="mt-2 -ml-2" onClick={() => setShowSolution((s) => !s)}>
        <Eye className="h-3.5 w-3.5" aria-hidden />
        {showSolution ? 'Hide solution' : 'View solution'}
      </Button>
      {showSolution && (
        <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {question.solution}
        </p>
      )}
    </li>
  );
}

/**
 * Shared quiz engine used by Practice, LessonView, and Revision.
 * One question at a time; "Check answer" reveals correctness without the
 * solution; 3 progressive hints; every submit records an attempt in the
 * store (and completes the revision item when source is 'revision').
 *
 * The question list is snapshotted on mount — parents start a new session
 * by remounting with a fresh `key`.
 */
export default function QuizRunner({
  questions,
  source,
  onFinish,
  revisionIdMap,
  title,
}: {
  questions: Question[];
  source: 'quiz' | 'revision' | 'lesson';
  onFinish?: (results: QuizResult[]) => void;
  revisionIdMap?: Map<string, string>;
  title?: string;
}) {
  const { recordAttempt, completeRevision } = useStore();
  const [sessionQuestions] = useState(questions);
  const [index, setIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [checked, setChecked] = useState<GradedAnswer | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [finished, setFinished] = useState(false);

  if (sessionQuestions.length === 0) {
    return (
      <EmptyState
        icon={<Lightbulb className="h-6 w-6" aria-hidden />}
        title="No questions here"
        detail="There are no questions for this set yet. Try a different filter or come back once more content is available."
      />
    );
  }

  const q = sessionQuestions[index];
  const total = sessionQuestions.length;
  const choice = isChoice(q);
  const canCheck =
    !checked && (choice ? selectedIndex !== null : textAnswer.trim().length > 0);

  function handleCheck() {
    if (!canCheck) return;
    const graded = gradeQuestion(q, selectedIndex, textAnswer);
    recordAttempt({
      questionId: q.id,
      topic: q.topic,
      moduleId: q.moduleId,
      correct: graded.correct,
      learnerAnswer: graded.learnerAnswer,
      correctAnswer: graded.correctAnswer,
      difficulty: q.difficulty,
      mistakeType: q.mistakeType,
      hintsUsed: hintsRevealed,
      source,
    });
    if (source === 'revision' && revisionIdMap) {
      const revisionId = revisionIdMap.get(q.id);
      if (revisionId) completeRevision(revisionId, graded.correct);
    }
    setResults((prev) => [...prev, { questionId: q.id, correct: graded.correct, hintsUsed: hintsRevealed }]);
    setChecked(graded);
  }

  function handleNext() {
    if (index + 1 >= total) {
      setFinished(true);
      onFinish?.(results);
    } else {
      setIndex((i) => i + 1);
      setSelectedIndex(null);
      setTextAnswer('');
      setChecked(null);
      setHintsRevealed(0);
      setShowSolution(false);
    }
  }

  function handleRestart() {
    setIndex(0);
    setSelectedIndex(null);
    setTextAnswer('');
    setChecked(null);
    setHintsRevealed(0);
    setShowSolution(false);
    setResults([]);
    setFinished(false);
  }

  if (finished) {
    const correctCount = results.filter((r) => r.correct).length;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return (
      <Card className="px-5 py-6 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Session complete</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            {correctCount} / {total} correct
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {pct}% accuracy
            {results.reduce((s, r) => s + r.hintsUsed, 0) > 0 &&
              ` · ${results.reduce((s, r) => s + r.hintsUsed, 0)} hint${results.reduce((s, r) => s + r.hintsUsed, 0) === 1 ? '' : 's'} used`}
          </p>
          <div className="mx-auto mt-4 max-w-sm">
            <ProgressBar value={pct} tone={pct >= 70 ? 'green' : pct >= 40 ? 'amber' : 'red'} />
          </div>
          <Button variant="outline" className="mt-5" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Retake this set
          </Button>
        </div>
        <h3 className="mt-8 text-sm font-semibold text-slate-900 dark:text-white">Review</h3>
        <ul className="mt-3 space-y-3">
          {results.map((r) => {
            const question = sessionQuestions.find((sq) => sq.id === r.questionId);
            if (!question) return null;
            return <ReviewItem key={r.questionId} question={question} result={r} />;
          })}
        </ul>
      </Card>
    );
  }

  return (
    <Card className="px-5 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title ? `${title} · ` : ''}Question {index + 1} of {total}
        </p>
        <div className="flex items-center gap-2">
          <Badge tone="neutral">{TYPE_LABEL[q.type]}</Badge>
          <Badge
            tone={
              q.difficulty === 'Easy'
                ? 'green'
                : q.difficulty === 'Medium'
                  ? 'blue'
                  : q.difficulty === 'Hard'
                    ? 'amber'
                    : 'purple'
            }
          >
            {q.difficulty}
          </Badge>
        </div>
      </div>
      <div className="mt-3">
        <ProgressBar value={(index / total) * 100} />
      </div>

      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {q.topic}
      </p>
      <h2 className="mt-1 text-lg font-semibold leading-snug text-slate-900 dark:text-white">
        {q.question}
      </h2>

      {/* Answer input */}
      <div className="mt-5">
        {choice && q.options ? (
          <div role="radiogroup" aria-label="Answer options" className="space-y-2">
            {q.options.map((option, i) => {
              const isSelected = selectedIndex === i;
              const isCorrectOption = checked !== null && i === q.correctIndex;
              const isWrongSelection = checked !== null && isSelected && i !== q.correctIndex;
              return (
                <label
                  key={i}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm transition-colors',
                    isCorrectOption
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                      : isWrongSelection
                        ? 'border-red-500 bg-red-50 dark:bg-red-950'
                        : isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600',
                    checked !== null && 'cursor-default',
                  )}
                >
                  <input
                    type="radio"
                    name={`quiz-q-${q.id}`}
                    checked={isSelected}
                    disabled={checked !== null}
                    onChange={() => setSelectedIndex(i)}
                    className="mt-0.5 accent-blue-600"
                  />
                  <span className="flex-1 text-slate-800 dark:text-slate-100">{option}</span>
                  {isCorrectOption && (
                    <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                  )}
                  {isWrongSelection && <X className="h-4 w-4 shrink-0 text-red-600" aria-hidden />}
                </label>
              );
            })}
          </div>
        ) : q.type === 'numerical' ? (
          <div>
            <label
              htmlFor={`quiz-num-${q.id}`}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Your answer
            </label>
            <input
              id={`quiz-num-${q.id}`}
              type="number"
              inputMode="decimal"
              value={textAnswer}
              disabled={checked !== null}
              onChange={(e) => setTextAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && canCheck) handleCheck();
              }}
              placeholder="Enter a number"
              className="mt-1 w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800"
            />
          </div>
        ) : (
          <div>
            <label
              htmlFor={`quiz-short-${q.id}`}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Your answer
            </label>
            <textarea
              id={`quiz-short-${q.id}`}
              value={textAnswer}
              disabled={checked !== null}
              onChange={(e) => setTextAnswer(e.target.value)}
              rows={4}
              placeholder="Write your answer in your own words…"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Graded on keyword coverage — cover at least half of the key ideas.
            </p>
          </div>
        )}
      </div>

      {/* Hints */}
      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-2" aria-label="Hints">
          <Lightbulb className="h-4 w-4 text-slate-400" aria-hidden />
          {[0, 1, 2].map((i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              disabled={checked !== null || hintsRevealed <= i - 1 || hintsRevealed > i}
              onClick={() => setHintsRevealed(i + 1)}
            >
              Hint {i + 1}
            </Button>
          ))}
        </div>
        {hintsRevealed > 0 && (
          <ul className="mt-3 space-y-2">
            {q.hints.slice(0, hintsRevealed).map((hint, i) => (
              <li
                key={i}
                className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200"
              >
                <span className="font-medium">Hint {i + 1}: </span>
                {hint}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Feedback after checking */}
      {checked && (
        <div
          className={cn(
            'mt-5 rounded-lg border px-4 py-3',
            checked.correct
              ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950'
              : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950',
          )}
          role="status"
        >
          <p
            className={cn(
              'flex items-center gap-2 text-sm font-semibold',
              checked.correct
                ? 'text-emerald-800 dark:text-emerald-200'
                : 'text-red-800 dark:text-red-200',
            )}
          >
            {checked.correct ? (
              <>
                <Check className="h-4 w-4" aria-hidden /> Correct
              </>
            ) : (
              <>
                <X className="h-4 w-4" aria-hidden /> Not quite
              </>
            )}
          </p>
          {!checked.correct && q.type !== 'short' && (
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              The correct answer is: <span className="font-medium">{checked.correctAnswer}</span>
            </p>
          )}
          {!checked.correct && q.type === 'short' && (
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              Your answer covered fewer than half of the key ideas. Check the solution below.
            </p>
          )}
        </div>
      )}

      {/* Solution */}
      {checked && (
        <div className="mt-3">
          {!showSolution ? (
            <Button variant="ghost" size="sm" onClick={() => setShowSolution(true)}>
              <Eye className="h-4 w-4" aria-hidden /> Show solution
            </Button>
          ) : (
            <div className="rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Solution
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                {q.solution}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        {!checked ? (
          <Button onClick={handleCheck} disabled={!canCheck}>
            Check answer
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {index + 1 >= total ? 'Finish' : 'Next question'}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        )}
        <p className="self-center text-xs text-slate-500 dark:text-slate-400">
          {results.filter((r) => r.correct).length} correct so far
        </p>
      </div>
    </Card>
  );
}
