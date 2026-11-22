// ─── Deterministic learning analytics ──────────────────────────────────────
// Every score here is computed from recorded evidence (attempts, challenges,
// interview answers, lesson completion). Nothing is seeded or faked.
// Rules are deliberately simple and auditable:
//
// Topic mastery (0–100):
//   - Base = accuracy on that topic's questions (0–100), weighted by recency
//     (most recent 50% of attempts count double).
//   - +10 bonus if a related coding challenge passed (capped at 100).
//   - Requires ≥3 attempts before a topic can score above 60 ("Practicing"
//     needs evidence, not one lucky answer).
//   - 0 attempts → score is null (no evidence), status Locked/Learning.
//
// Status thresholds (with attempts):
//   score < 40 → Weak · 40–59 → Practicing · 60–79 → Strong · ≥80 → Mastered
//   A lesson read but never quizzed → Learning. Never touched → Locked.

import type {
  AppState,
  Lesson,
  MasteryStatus,
  Question,
  SkillDimension,
} from '../types';
import { SKILL_DIMENSIONS } from '../types';

export interface TopicMastery {
  topic: string;
  score: number | null;
  attempts: number;
  correct: number;
  status: MasteryStatus;
  lastAttemptedAt: string | null;
}

export function statusFor(score: number | null, attempts: number, read: boolean): MasteryStatus {
  if (attempts === 0) return read ? 'Learning' : 'Locked';
  if (score === null) return 'Learning';
  if (score < 40) return 'Weak';
  if (score < 60) return 'Practicing';
  if (score < 80) return 'Strong';
  return 'Mastered';
}

/** Recency-weighted accuracy for one topic, 0–100 or null if no attempts. */
export function topicScore(
  state: AppState,
  topic: string,
  challengePassed: boolean,
): number | null {
  const attempts = state.attempts.filter((a) => a.topic === topic);
  if (attempts.length === 0) return null;
  const sorted = [...attempts].sort((a, b) => a.attemptedAt.localeCompare(b.attemptedAt));
  const half = Math.ceil(sorted.length / 2);
  let weightedCorrect = 0;
  let weightedTotal = 0;
  sorted.forEach((a, i) => {
    const w = i >= sorted.length - half ? 2 : 1;
    weightedTotal += w;
    if (a.correct) weightedCorrect += w;
  });
  let score = (weightedCorrect / weightedTotal) * 100;
  if (challengePassed) score = Math.min(100, score + 10);
  // Small-sample cap: fewer than 3 attempts cannot exceed 60.
  if (attempts.length < 3) score = Math.min(score, 60);
  return Math.round(score);
}

export function topicMastery(
  state: AppState,
  topic: string,
  read: boolean,
  challengePassed: boolean,
): TopicMastery {
  const attempts = state.attempts.filter((a) => a.topic === topic);
  const correct = attempts.filter((a) => a.correct).length;
  const score = topicScore(state, topic, challengePassed);
  return {
    topic,
    score,
    attempts: attempts.length,
    correct,
    status: statusFor(score, attempts.length, read),
    lastAttemptedAt:
      attempts.length > 0
        ? attempts[attempts.length - 1].attemptedAt
        : null,
  };
}

/** Lesson mastery: average of its questions' topic scores, or null. */
export function lessonScore(
  state: AppState,
  lesson: Lesson,
  questionsById: Map<string, Question>,
): number | null {
  const topics = new Set<string>();
  lesson.questionIds.forEach((qid) => {
    const q = questionsById.get(qid);
    if (q) topics.add(q.topic);
  });
  if (topics.size === 0) return null;
  const scores: number[] = [];
  topics.forEach((t) => {
    const s = topicScore(state, t, false);
    if (s !== null) scores.push(s);
  });
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/** Skill radar: per-dimension score from all attempts on questions/challenges
 *  tagged with that skill, plus interview answers for Interview Readiness. */
export function skillScores(
  state: AppState,
  questionsById: Map<string, Question>,
): Record<SkillDimension, number | null> {
  const out = {} as Record<SkillDimension, number | null>;
  for (const dim of SKILL_DIMENSIONS) {
    if (dim === 'Interview Readiness') {
      const answers = state.interviewAnswers;
      if (answers.length === 0) {
        out[dim] = null;
      } else {
        const avg = answers.reduce((s, a) => s + a.score, 0) / answers.length;
        out[dim] = Math.round(avg * 10);
      }
      continue;
    }
    const relevant = state.attempts.filter((a) => {
      const q = questionsById.get(a.questionId);
      return q?.skills.includes(dim);
    });
    if (relevant.length === 0) {
      out[dim] = null;
    } else {
      const correct = relevant.filter((a) => a.correct).length;
      out[dim] = Math.round((correct / relevant.length) * 100);
    }
  }
  return out;
}

/** Overall progress: lessons completed / total lessons. */
export function overallProgress(state: AppState, totalLessons: number): number {
  if (totalLessons === 0) return 0;
  return Math.round((Object.keys(state.lessonsCompleted).length / totalLessons) * 100);
}

/** Interview readiness: 0–100 from interview answers + mock sessions. */
export function interviewReadiness(state: AppState): number | null {
  const answers = state.interviewAnswers;
  const sessions = state.mockSessions.filter((s) => s.completedAt);
  if (answers.length === 0 && sessions.length === 0) return null;
  const answerAvg =
    answers.length > 0
      ? answers.reduce((s, a) => s + a.score, 0) / answers.length / 10
      : null;
  const sessionAvg =
    sessions.length > 0
      ? sessions.reduce((s, sess) => {
          const dims = Object.values(sess.dimensionScores);
          return s + (dims.length ? dims.reduce((a, b) => a + b, 0) / dims.length : 0);
        }, 0) / sessions.length / 10
      : null;
  const parts = [answerAvg, sessionAvg].filter((v): v is number => v !== null);
  return Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100);
}

/** Revision items due today or earlier and not completed. */
export function revisionDue(state: AppState, now = new Date()): number {
  return state.revision.filter((r) => !r.completed && new Date(r.dueDate) <= now).length;
}

/** Weak topics: topics with ≥2 attempts and score < 40, worst first. */
export function weakTopics(state: AppState): TopicMastery[] {
  const topics = new Set(state.attempts.map((a) => a.topic));
  const out: TopicMastery[] = [];
  topics.forEach((t) => {
    const m = topicMastery(state, t, false, false);
    if (m.attempts >= 2 && m.score !== null && m.score < 40) out.push(m);
  });
  return out.sort((a, b) => (a.score ?? 0) - (b.score ?? 0));
}

export interface NextAction {
  kind: 'revision' | 'remediation' | 'diagnostic' | 'continue' | 'interview' | 'project';
  title: string;
  detail: string;
  link: string;
  linkLabel: string;
}

/**
 * Evidence-based "what should I learn next" — weakest area first, never
 * just the next chapter.
 */
export function nextAction(
  state: AppState,
  lessons: Lesson[],
): NextAction {
  if (!state.diagnostic.completedAt) {
    return {
      kind: 'diagnostic',
      title: 'Take the diagnostic assessment',
      detail:
        'Before starting the curriculum, measure where you actually stand across Python, statistics, and ML basics — then your path is personalized.',
      link: '/diagnostic',
      linkLabel: 'Start diagnostic',
    };
  }
  const due = revisionDue(state);
  if (due > 0) {
    return {
      kind: 'revision',
      title: `Revise ${due} due item${due === 1 ? '' : 's'}`,
      detail:
        'Spaced repetition is due. Clearing these first protects what you already learned before adding new material.',
      link: '/revision',
      linkLabel: 'Start revision',
    };
  }
  const weak = weakTopics(state);
  if (weak.length > 0) {
    const w = weak[0];
    return {
      kind: 'remediation',
      title: `Remediate: ${w.topic}`,
      detail: `You scored ${w.score ?? 0}% on ${w.topic} across ${w.attempts} attempts. A short targeted review beats moving on — weak foundations compound.`,
      link: '/mistakes',
      linkLabel: 'Review mistakes',
    };
  }
  // Continue: first incomplete lesson in curriculum order.
  const next = lessons.find((l) => !state.lessonsCompleted[l.id]);
  if (next) {
    return {
      kind: 'continue',
      title: `Continue: ${next.title}`,
      detail: 'No weak areas and nothing due for revision. Time for the next concept.',
      link: `/lesson/${next.id}`,
      linkLabel: 'Open lesson',
    };
  }
  const readiness = interviewReadiness(state);
  if (readiness === null || readiness < 70) {
    return {
      kind: 'interview',
      title: 'Sharpen interview readiness',
      detail:
        'You have covered the curriculum. Interview performance is now the highest-leverage work.',
      link: '/interview',
      linkLabel: 'Interview prep',
    };
  }
  return {
    kind: 'project',
    title: 'Build a portfolio project',
    detail: 'Curriculum and interview prep are in good shape. Demonstrate competence with a full project.',
    link: '/projects',
    linkLabel: 'View projects',
  };
}

/** 12-dimension ML readiness score (performance-based). */
export function readinessScores(
  state: AppState,
  questionsById: Map<string, Question>,
): { dimension: string; score: number | null }[] {
  const skills = skillScores(state, questionsById);
  const interview = interviewReadiness(state);
  const projectDone = Object.values(state.projectChecklist).reduce(
    (sum, steps) => sum + Object.values(steps).filter(Boolean).length,
    0,
  );
  const projectTotal = 5 * 18; // 5 projects × ~18 steps (approximate; computed properly by UI)
  const projectScore =
    projectDone === 0 ? null : Math.min(100, Math.round((projectDone / projectTotal) * 100));
  return [
    { dimension: 'ML Fundamentals', score: skills['Algorithms'] },
    { dimension: 'Statistics', score: skills['Statistics'] },
    { dimension: 'Python', score: skills['Python'] },
    { dimension: 'Data Preprocessing', score: skills['Preprocessing'] },
    { dimension: 'Algorithms', score: skills['Algorithms'] },
    { dimension: 'Evaluation', score: skills['Evaluation'] },
    { dimension: 'Feature Engineering', score: skills['Feature Engineering'] },
    { dimension: 'Model Selection', score: skills['Model Selection'] },
    { dimension: 'Explainability', score: skills['Explainability'] },
    { dimension: 'Deployment', score: skills['Deployment'] },
    { dimension: 'Projects', score: projectScore },
    { dimension: 'Interview Readiness', score: interview },
  ];
}
