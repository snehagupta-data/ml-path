// ─── Core data model for the ML learning platform ──────────────────────────
// Content lives in src/content/*.ts as structured data. User state lives in
// the versioned localStorage store (src/store/store.tsx). Nothing here
// contains fake progress: all learner state starts empty.

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Interview' | 'Real-world';

export type MasteryStatus =
  | 'Locked'
  | 'Learning'
  | 'Practicing'
  | 'Weak'
  | 'Strong'
  | 'Mastered';

export type QuestionType =
  | 'mcq'
  | 'numerical'
  | 'short'
  | 'scenario'
  | 'model-selection';

export type SkillDimension =
  | 'Statistics'
  | 'Python'
  | 'Preprocessing'
  | 'Algorithms'
  | 'Evaluation'
  | 'Feature Engineering'
  | 'Model Selection'
  | 'Explainability'
  | 'Deployment'
  | 'Problem Solving'
  | 'Interview Readiness';

export const SKILL_DIMENSIONS: SkillDimension[] = [
  'Statistics',
  'Python',
  'Preprocessing',
  'Algorithms',
  'Evaluation',
  'Feature Engineering',
  'Model Selection',
  'Explainability',
  'Deployment',
  'Problem Solving',
  'Interview Readiness',
];

export type VisualId =
  | 'gradient-descent'
  | 'linear-regression'
  | 'bias-variance'
  | 'confusion-matrix'
  | 'roc'
  | 'kmeans'
  | 'decision-tree'
  | 'knn'
  | 'pca'
  | 'overfitting';

// ─── Curriculum ────────────────────────────────────────────────────────────

export interface CodeBlock {
  code: string;
  explanation?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  subtitle: string;
  minutes: number;
  /** Three-level explanation system */
  simple: string;
  technical: string;
  interview: string;
  analogy: string;
  realWorld: string;
  /** Optional math, written as plain text / simple notation (no LaTeX engine). */
  math?: string;
  code?: CodeBlock;
  mistakes: string[];
  whenToUse?: string[];
  whenNotToUse?: string[];
  comparison?: { label: string; text: string }[];
  keyPoints: string[];
  formulas?: { name: string; formula: string }[];
  visual?: VisualId;
  /** ids into the question bank */
  questionIds: string[];
  /** ids into the coding-challenge bank */
  challengeIds?: string[];
  /** skill dimensions this lesson builds */
  skills: SkillDimension[];
}

export interface Module {
  id: string; // 'm0' .. 'm14'
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  /** lucide icon name, resolved in components/ModuleIcon */
  icon: string;
  lessons: Lesson[];
  skills: SkillDimension[];
}

// ─── Questions ─────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  topic: string; // human-readable topic, e.g. "Precision vs Recall"
  lessonId?: string;
  moduleId: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  /** For mcq / model-selection / scenario with options */
  options?: string[];
  /** Index into options for choice questions */
  correctIndex?: number;
  /** For numerical questions: accepted value + tolerance */
  numericAnswer?: number;
  numericTolerance?: number;
  /** For short-answer questions: keywords that must appear (case-insensitive) */
  keywords?: string[];
  /** Full worked solution shown only after hints are exhausted / requested */
  solution: string;
  hints: [string, string, string];
  /** Which skill dimensions this question exercises */
  skills: SkillDimension[];
  /** Mistake classification used by the journal */
  mistakeType: string;
}

// ─── Coding challenges ─────────────────────────────────────────────────────

export interface TestCase {
  /** Python snippet run AFTER the learner's code; must print "PASS" or raise */
  testCode: string;
  description: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  topic: string;
  moduleId: string;
  lessonId?: string;
  difficulty: Difficulty;
  description: string;
  /** Starter code shown in the editor */
  starterCode: string;
  /** Reference solution (shown only on request) */
  solution: string;
  hints: [string, string, string];
  tests: TestCase[];
  /** 'numpy' | 'pandas' packages to preload, or [] for pure Python */
  needsPackages: ('numpy' | 'pandas')[];
  skills: SkillDimension[];
}

// ─── Interview ─────────────────────────────────────────────────────────────

export type InterviewCategory =
  | 'ML Fundamentals'
  | 'Statistics'
  | 'Python & Pandas'
  | 'Preprocessing'
  | 'Regression'
  | 'Classification'
  | 'Unsupervised Learning'
  | 'Model Evaluation'
  | 'Feature Engineering'
  | 'Model Selection'
  | 'SQL + ML'
  | 'Business + ML'
  | 'Scenario'
  | 'Project';

export interface InterviewQuestion {
  id: string;
  category: InterviewCategory;
  question: string;
  difficulty: Difficulty;
  /** Keywords the rubric looks for (transparent, deterministic evaluation) */
  rubricKeywords: string[];
  /** Points a strong answer must cover */
  keyPoints: string[];
  /** What a weak answer typically misses / gets wrong */
  commonGaps: string[];
  /** Model interview-ready answer */
  modelAnswer: string;
  /** Tougher follow-ups an interviewer might ask */
  followUps: string[];
}

// ─── Debugging lab ─────────────────────────────────────────────────────────

export interface DebuggingCase {
  id: string;
  title: string;
  bugType: string;
  difficulty: Difficulty;
  scenario: string;
  brokenCode: string;
  /** What the learner must identify */
  options: string[];
  correctIndex: number;
  explanation: string;
  fixedCode: string;
  skills: SkillDimension[];
}

// ─── Business cases ────────────────────────────────────────────────────────

export interface CaseDecision {
  id: string;
  label: string;
  prompt: string;
  options: string[];
  /** index of the strongest option */
  bestIndex: number;
  /** index of an acceptable option, if any */
  acceptableIndex?: number;
  rationale: string;
}

export interface BusinessCase {
  id: string;
  title: string;
  company: string;
  scenario: string;
  context: string[];
  decisions: CaseDecision[];
  debrief: string;
  skills: SkillDimension[];
}

// ─── Projects ──────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  level: 1 | 2 | 3 | 4 | 5;
  levelLabel: string;
  problemType: 'Classification' | 'Regression' | 'Clustering' | 'Forecasting';
  businessProblem: string;
  businessObjective: string;
  targetDefinition: string;
  datasetId?: string;
  datasetDescription: string;
  /** Full industry-standard structure as guided steps */
  steps: { title: string; guidance: string; deliverable: string }[];
  modelsToTry: string[];
  metrics: string[];
  /** Mastery prerequisites, expressed as skill thresholds 0–100 */
  prerequisites: { skill: SkillDimension; threshold: number }[];
  pitch30s: string;
  pitch1min: string;
  pitch3min: string;
  deepDive: string[];
  toughFollowUps: { question: string; guidance: string }[];
}

// ─── Datasets ──────────────────────────────────────────────────────────────

export interface DatasetColumn {
  name: string;
  type: string;
  description: string;
}

export interface DatasetTask {
  id: string;
  stage: 'EDA' | 'Preprocessing' | 'Modeling' | 'Evaluation' | 'Business';
  title: string;
  task: string;
  hint: string;
}

export interface Dataset {
  id: string;
  name: string;
  rows: number;
  file: string; // path under /data/
  businessContext: string;
  columns: DatasetColumn[];
  target: string;
  tasks: DatasetTask[];
  /** Key facts about the data (verified from the generator) */
  facts: string[];
}

// ─── Learner state (persisted) ─────────────────────────────────────────────

export interface QuestionAttempt {
  id: string;
  questionId: string;
  topic: string;
  moduleId: string;
  correct: boolean;
  learnerAnswer: string;
  correctAnswer: string;
  difficulty: Difficulty;
  mistakeType: string;
  hintsUsed: number;
  attemptedAt: string; // ISO
  source: 'quiz' | 'revision' | 'diagnostic' | 'lesson';
}

export interface ChallengeAttempt {
  id: string;
  challengeId: string;
  passed: boolean;
  testsPassed: number;
  testsTotal: number;
  attemptedAt: string;
}

export interface Mistake {
  id: string;
  topic: string;
  questionId: string;
  question: string;
  learnerAnswer: string;
  correctAnswer: string;
  mistakeType: string;
  difficulty: Difficulty;
  firstSeenAt: string;
  lastSeenAt: string;
  attemptCount: number;
  revisionStatus: 'Needs revision' | 'Revising' | 'Resolved';
}

export interface RevisionItem {
  id: string;
  questionId: string;
  topic: string;
  dueDate: string; // ISO date
  intervalDays: number; // 1 | 3 | 7 | 14 | 30
  mistakes: number;
  completed: boolean;
}

export type NoteKind =
  | 'My Notes'
  | 'Key Summary'
  | 'Important Formula'
  | 'Interview Point'
  | 'Common Mistake'
  | 'Example'
  | 'Questions I Got Wrong';

export interface Note {
  id: string;
  lessonId: string;
  kind: NoteKind;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export type BookmarkTag =
  | 'Important'
  | 'Revise'
  | 'Confusing'
  | 'Interview'
  | 'Project Idea';

export interface Bookmark {
  id: string;
  lessonId: string;
  tag: BookmarkTag;
  createdAt: string;
}

export interface InterviewAnswerRecord {
  id: string;
  questionId: string;
  category: InterviewCategory;
  answer: string;
  score: number; // 0–10
  coverage: number; // 0–1 fraction of rubric keywords found
  missingPoints: string[];
  answeredAt: string;
}

export interface MockSession {
  id: string;
  durationMinutes: 15 | 30 | 60;
  questionIds: string[];
  scores: Record<string, number>; // questionId -> 0–10
  dimensionScores: Record<string, number>;
  weakAreas: string[];
  startedAt: string;
  completedAt: string | null;
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  questions: number;
  lessons: number;
  challenges: number;
  interviews: number;
}

export interface AppState {
  version: 1;
  name: string;
  theme: 'light' | 'dark';
  diagnostic: {
    completedAt: string | null;
    scores: Record<string, number>; // area -> 0–100
    answers: Record<string, string>;
  };
  lessonsCompleted: Record<string, string>; // lessonId -> ISO completedAt
  lessonsRead: Record<string, string>; // lessonId -> ISO last read
  attempts: QuestionAttempt[];
  challengeAttempts: ChallengeAttempt[];
  mistakes: Mistake[];
  revision: RevisionItem[];
  notes: Note[];
  bookmarks: Bookmark[];
  interviewAnswers: InterviewAnswerRecord[];
  mockSessions: MockSession[];
  debugAttempts: Record<string, { correct: boolean; attemptedAt: string }>;
  caseAttempts: Record<string, { score: number; attemptedAt: string }>;
  projectChecklist: Record<string, Record<string, boolean>>; // projectId -> stepIdx -> done
  datasetTaskDone: Record<string, boolean>; // `${datasetId}:${taskId}` -> done
  activity: DayActivity[];
  streak: { lastActiveDate: string | null; count: number };
}
