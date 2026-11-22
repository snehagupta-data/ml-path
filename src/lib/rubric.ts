// ─── Transparent rubric-based interview answer evaluation ─────────────────
// This is NOT an LLM. It is a deterministic rubric: the learner's answer is
// checked against the question's authored rubric keywords and key points.
// Every score is explainable — the UI shows exactly which points were
// covered and which were missing. Labeled honestly in the UI as
// "rubric-based evaluation, not AI".

import type { InterviewQuestion } from '../types';

export interface RubricResult {
  /** 0–10 */
  score: number;
  /** Fraction of rubric keywords found, 0–1 */
  coverage: number;
  foundKeywords: string[];
  missingKeywords: string[];
  coveredPoints: string[];
  missingPoints: string[];
  good: string[];
  missing: string[];
  incorrect: string[];
  lengthNote: string | null;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

function containsPhrase(normalized: string, phrase: string): boolean {
  const p = normalize(phrase).trim();
  if (!p) return false;
  // Single words: word-boundary match. Phrases: substring match.
  if (!p.includes(' ')) {
    return normalized.split(/\s+/).includes(p);
  }
  return normalized.includes(p);
}

/** Short answers (< 15 words) cannot score above 4 — interviews need depth. */
export function evaluateAnswer(question: InterviewQuestion, answer: string): RubricResult {
  const normalized = normalize(answer);
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = answer.trim() ? words.length : 0;

  const foundKeywords: string[] = [];
  const missingKeywords: string[] = [];
  for (const kw of question.rubricKeywords) {
    if (containsPhrase(normalized, kw)) foundKeywords.push(kw);
    else missingKeywords.push(kw);
  }

  const coveredPoints: string[] = [];
  const missingPoints: string[] = [];
  for (const point of question.keyPoints) {
    // A key point counts as covered if at least half of its significant
    // words appear in the answer.
    const significant = normalize(point)
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['with', 'that', 'this', 'from', 'into', 'when', 'than', 'more', 'over', 'under'].includes(w));
    const hits = significant.filter((w) => normalized.split(/\s+/).includes(w)).length;
    if (significant.length > 0 && hits / significant.length >= 0.5) coveredPoints.push(point);
    else missingPoints.push(point);
  }

  const coverage =
    question.rubricKeywords.length > 0 ? foundKeywords.length / question.rubricKeywords.length : 0;
  const pointCoverage =
    question.keyPoints.length > 0 ? coveredPoints.length / question.keyPoints.length : 0;

  // Score: 60% keyword coverage, 40% key-point coverage, scaled to /10.
  let score = Math.round((coverage * 0.6 + pointCoverage * 0.4) * 10);
  let lengthNote: string | null = null;
  if (wordCount < 15) {
    score = Math.min(score, 4);
    lengthNote = `Your answer is ${wordCount} word${wordCount === 1 ? '' : 's'} — too short for an interview. Aim for 60–120 words: define the concept, explain why it matters, and give an example.`;
  } else if (wordCount > 250) {
    lengthNote = 'Your answer is long — interviewers value conciseness. Try to land the key points in under ~150 words.';
  }

  const good: string[] = [];
  if (foundKeywords.length > 0) {
    good.push(`Covered key terms: ${foundKeywords.slice(0, 6).join(', ')}${foundKeywords.length > 6 ? ` (+${foundKeywords.length - 6} more)` : ''}.`);
  }
  if (coveredPoints.length > 0) {
    good.push(`Addressed ${coveredPoints.length} of ${question.keyPoints.length} core points.`);
  }
  if (wordCount >= 40 && wordCount <= 200) {
    good.push('Good length for an interview answer — neither one-liner nor ramble.');
  }
  if (good.length === 0) {
    good.push('You attempted the answer — that is the first step. See below for what to add.');
  }

  const missing: string[] = [];
  if (missingPoints.length > 0) {
    missing.push(`Missing core points: ${missingPoints.slice(0, 3).join(' | ')}`);
  }
  if (missingKeywords.length > 0 && coverage < 1) {
    missing.push(`Terms an interviewer would expect: ${missingKeywords.slice(0, 5).join(', ')}.`);
  }

  // "Incorrect" can only be flagged by the rubric's common-gap patterns:
  // if the answer contains a known misconception phrase, flag it. Otherwise
  // the rubric cannot judge correctness — it says so.
  const incorrect: string[] = [];
  for (const gap of question.commonGaps) {
    if (gap.startsWith('!')) {
      const phrase = gap.slice(1);
      if (containsPhrase(normalized, phrase)) {
        incorrect.push(`Possible misconception: "${phrase}" — check the model answer.`);
      }
    }
  }

  return {
    score,
    coverage,
    foundKeywords,
    missingKeywords,
    coveredPoints,
    missingPoints,
    good,
    missing,
    incorrect,
    lengthNote,
  };
}
