// Central content access: typed lookups + derived indexes over the
// structured content files. Content authors edit the files under
// src/content/; pages import from here.
import { MODULES } from './curriculum';
import { QUESTIONS } from './questions';
import { CHALLENGES } from './challenges';
import { INTERVIEW_QUESTIONS } from './interview';
import { DEBUGGING_CASES } from './debugging';
import { BUSINESS_CASES } from './cases';
import { PROJECTS } from './projects';
import { DATASETS } from './datasets';
import type { Lesson, Module, Question } from '../types';

export {
  MODULES,
  QUESTIONS,
  CHALLENGES,
  INTERVIEW_QUESTIONS,
  DEBUGGING_CASES,
  BUSINESS_CASES,
  PROJECTS,
  DATASETS,
};

export const ALL_LESSONS: Lesson[] = MODULES.flatMap((m) => m.lessons);

export const LESSONS_BY_ID = new Map<string, Lesson>(ALL_LESSONS.map((l) => [l.id, l]));

export const MODULES_BY_ID = new Map<string, Module>(MODULES.map((m) => [m.id, m]));

export const QUESTIONS_BY_ID = new Map<string, Question>(QUESTIONS.map((q) => [q.id, q]));

export const CHALLENGES_BY_ID = new Map(CHALLENGES.map((c) => [c.id, c]));

export const INTERVIEW_BY_ID = new Map(INTERVIEW_QUESTIONS.map((q) => [q.id, q]));

export const PROJECTS_BY_ID = new Map(PROJECTS.map((p) => [p.id, p]));

export const DATASETS_BY_ID = new Map(DATASETS.map((d) => [d.id, d]));

export function moduleOfLesson(lessonId: string): Module | undefined {
  return MODULES.find((m) => m.lessons.some((l) => l.id === lessonId));
}

export function questionsForLesson(lessonId: string): Question[] {
  const lesson = LESSONS_BY_ID.get(lessonId);
  if (!lesson) return [];
  return lesson.questionIds
    .map((id) => QUESTIONS_BY_ID.get(id))
    .filter((q): q is Question => Boolean(q));
}

export function questionsForTopic(topic: string): Question[] {
  return QUESTIONS.filter((q) => q.topic === topic);
}

export function allTopics(): string[] {
  return [...new Set(QUESTIONS.map((q) => q.topic))].sort();
}

/** Diagnostic areas and their question ids (Module 0). */
export const DIAGNOSTIC_AREAS = [
  'Python',
  'Statistics',
  'Probability',
  'Linear Algebra',
  'Pandas & NumPy',
  'Preprocessing',
  'ML Basics',
  'Problem Solving',
] as const;

export type DiagnosticArea = (typeof DIAGNOSTIC_AREAS)[number];
