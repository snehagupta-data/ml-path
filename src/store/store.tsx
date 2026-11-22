import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type {
  AppState,
  Bookmark,
  BookmarkTag,
  ChallengeAttempt,
  InterviewAnswerRecord,
  Mistake,
  MockSession,
  Note,
  NoteKind,
  QuestionAttempt,
} from '../types';

const STORAGE_KEY = 'ml-path-state-v1';
export const REVISION_INTERVALS = [1, 3, 7, 14, 30];

export function emptyState(): AppState {
  return {
    version: 1,
    name: 'Sneha',
    theme: 'light',
    diagnostic: { completedAt: null, scores: {}, answers: {} },
    lessonsCompleted: {},
    lessonsRead: {},
    attempts: [],
    challengeAttempts: [],
    mistakes: [],
    revision: [],
    notes: [],
    bookmarks: [],
    interviewAnswers: [],
    mockSessions: [],
    debugAttempts: {},
    caseAttempts: {},
    projectChecklist: {},
    datasetTaskDone: {},
    activity: [],
    streak: { lastActiveDate: null, count: 0 },
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (parsed.version !== 1) return emptyState();
    return { ...emptyState(), ...parsed };
  } catch {
    return emptyState();
  }
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

function addDays(dateIso: string, days: number): string {
  const d = new Date(dateIso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Record activity + streak on any learning action. */
function touchActivity(state: AppState, kind: 'questions' | 'lessons' | 'challenges' | 'interviews'): AppState {
  const today = todayStr();
  const activity = [...state.activity];
  const idx = activity.findIndex((a) => a.date === today);
  if (idx >= 0) {
    activity[idx] = { ...activity[idx], [kind]: activity[idx][kind] + 1 };
  } else {
    activity.push({ date: today, questions: 0, lessons: 0, challenges: 0, interviews: 0, [kind]: 1 });
  }
  // Streak: consecutive days with any activity.
  let { count, lastActiveDate } = state.streak;
  if (lastActiveDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(
      yesterday.getDate(),
    ).padStart(2, '0')}`;
    count = lastActiveDate === yStr ? count + 1 : 1;
    lastActiveDate = today;
  }
  return { ...state, activity, streak: { count, lastActiveDate } };
}

type Action =
  | { type: 'SET_THEME'; theme: 'light' | 'dark' }
  | { type: 'COMPLETE_DIAGNOSTIC'; scores: Record<string, number>; answers: Record<string, string> }
  | { type: 'MARK_LESSON_READ'; lessonId: string }
  | { type: 'COMPLETE_LESSON'; lessonId: string }
  | { type: 'RECORD_ATTEMPT'; attempt: Omit<QuestionAttempt, 'id' | 'attemptedAt'> }
  | { type: 'RECORD_CHALLENGE'; attempt: Omit<ChallengeAttempt, 'id' | 'attemptedAt'> }
  | { type: 'RESOLVE_MISTAKE'; mistakeId: string }
  | { type: 'COMPLETE_REVISION'; revisionId: string; correct: boolean }
  | { type: 'ADD_NOTE'; lessonId: string; kind: NoteKind; text: string }
  | { type: 'UPDATE_NOTE'; noteId: string; text: string }
  | { type: 'DELETE_NOTE'; noteId: string }
  | { type: 'TOGGLE_BOOKMARK'; lessonId: string; tag: BookmarkTag }
  | { type: 'RECORD_INTERVIEW_ANSWER'; record: Omit<InterviewAnswerRecord, 'id' | 'answeredAt'> }
  | { type: 'SAVE_MOCK_SESSION'; session: MockSession }
  | { type: 'RECORD_DEBUG'; caseId: string; correct: boolean }
  | { type: 'RECORD_CASE'; caseId: string; score: number }
  | { type: 'TOGGLE_PROJECT_STEP'; projectId: string; stepIndex: number }
  | { type: 'TOGGLE_DATASET_TASK'; key: string }
  | { type: 'IMPORT_STATE'; state: AppState }
  | { type: 'RESET_ALL' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.theme };

    case 'COMPLETE_DIAGNOSTIC':
      return {
        ...state,
        diagnostic: {
          completedAt: new Date().toISOString(),
          scores: action.scores,
          answers: action.answers,
        },
      };

    case 'MARK_LESSON_READ': {
      if (state.lessonsRead[action.lessonId]) return state;
      return {
        ...state,
        lessonsRead: { ...state.lessonsRead, [action.lessonId]: new Date().toISOString() },
      };
    }

    case 'COMPLETE_LESSON': {
      if (state.lessonsCompleted[action.lessonId]) return state;
      const next = touchActivity(state, 'lessons');
      return {
        ...next,
        lessonsCompleted: {
          ...next.lessonsCompleted,
          [action.lessonId]: new Date().toISOString(),
        },
      };
    }

    case 'RECORD_ATTEMPT': {
      const now = new Date().toISOString();
      const attempt: QuestionAttempt = { ...action.attempt, id: uid(), attemptedAt: now };
      let next = touchActivity(state, 'questions');
      next = { ...next, attempts: [...next.attempts, attempt] };

      if (!attempt.correct) {
        // Upsert mistake
        const existingIdx = next.mistakes.findIndex((m) => m.questionId === attempt.questionId);
        const mistakes = [...next.mistakes];
        if (existingIdx >= 0) {
          const m = mistakes[existingIdx];
          mistakes[existingIdx] = {
            ...m,
            lastSeenAt: now,
            attemptCount: m.attemptCount + 1,
            learnerAnswer: attempt.learnerAnswer,
            revisionStatus: 'Needs revision',
          };
        } else {
          const mistake: Mistake = {
            id: uid(),
            topic: attempt.topic,
            questionId: attempt.questionId,
            question: attempt.questionId, // resolved to text at render time
            learnerAnswer: attempt.learnerAnswer,
            correctAnswer: attempt.correctAnswer,
            mistakeType: attempt.mistakeType,
            difficulty: attempt.difficulty,
            firstSeenAt: now,
            lastSeenAt: now,
            attemptCount: 1,
            revisionStatus: 'Needs revision',
          };
          mistakes.push(mistake);
        }
        // Schedule revision: first failure -> 1 day out; repeated failure resets to 1 day
        const revision = next.revision.filter((r) => r.questionId !== attempt.questionId);
        revision.push({
          id: uid(),
          questionId: attempt.questionId,
          topic: attempt.topic,
          dueDate: addDays(now, 1),
          intervalDays: 1,
          mistakes: (existingIdx >= 0 ? mistakes[existingIdx].attemptCount : 1),
          completed: false,
        });
        return { ...next, mistakes, revision };
      }
      return next;
    }

    case 'RECORD_CHALLENGE': {
      const attempt: ChallengeAttempt = {
        ...action.attempt,
        id: uid(),
        attemptedAt: new Date().toISOString(),
      };
      const next = touchActivity(state, 'challenges');
      return { ...next, challengeAttempts: [...next.challengeAttempts, attempt] };
    }

    case 'RESOLVE_MISTAKE':
      return {
        ...state,
        mistakes: state.mistakes.map((m) =>
          m.id === action.mistakeId ? { ...m, revisionStatus: 'Resolved' as const } : m,
        ),
      };

    case 'COMPLETE_REVISION': {
      const now = new Date().toISOString();
      const revision = state.revision.map((r) => {
        if (r.id !== action.revisionId) return r;
        if (action.correct) {
          // Advance the interval ladder; at 30 days the item is done.
          const idx = REVISION_INTERVALS.indexOf(r.intervalDays);
          if (idx >= REVISION_INTERVALS.length - 1) {
            return { ...r, completed: true };
          }
          const nextInterval = REVISION_INTERVALS[idx + 1];
          return { ...r, intervalDays: nextInterval, dueDate: addDays(now, nextInterval) };
        }
        // Wrong again: back to 1 day.
        return { ...r, intervalDays: 1, dueDate: addDays(now, 1), mistakes: r.mistakes + 1 };
      });
      return { ...state, revision };
    }

    case 'ADD_NOTE': {
      const now = new Date().toISOString();
      const note: Note = {
        id: uid(),
        lessonId: action.lessonId,
        kind: action.kind,
        text: action.text,
        createdAt: now,
        updatedAt: now,
      };
      return { ...state, notes: [...state.notes, note] };
    }

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.noteId ? { ...n, text: action.text, updatedAt: new Date().toISOString() } : n,
        ),
      };

    case 'DELETE_NOTE':
      return { ...state, notes: state.notes.filter((n) => n.id !== action.noteId) };

    case 'TOGGLE_BOOKMARK': {
      const existing = state.bookmarks.find(
        (b) => b.lessonId === action.lessonId && b.tag === action.tag,
      );
      if (existing) {
        return { ...state, bookmarks: state.bookmarks.filter((b) => b.id !== existing.id) };
      }
      const bookmark: Bookmark = {
        id: uid(),
        lessonId: action.lessonId,
        tag: action.tag,
        createdAt: new Date().toISOString(),
      };
      return { ...state, bookmarks: [...state.bookmarks, bookmark] };
    }

    case 'RECORD_INTERVIEW_ANSWER': {
      const record: InterviewAnswerRecord = {
        ...action.record,
        id: uid(),
        answeredAt: new Date().toISOString(),
      };
      const next = touchActivity(state, 'interviews');
      return { ...next, interviewAnswers: [...next.interviewAnswers, record] };
    }

    case 'SAVE_MOCK_SESSION':
      return { ...state, mockSessions: [...state.mockSessions, action.session] };

    case 'RECORD_DEBUG':
      return {
        ...state,
        debugAttempts: {
          ...state.debugAttempts,
          [action.caseId]: { correct: action.correct, attemptedAt: new Date().toISOString() },
        },
      };

    case 'RECORD_CASE':
      return {
        ...state,
        caseAttempts: {
          ...state.caseAttempts,
          [action.caseId]: { score: action.score, attemptedAt: new Date().toISOString() },
        },
      };

    case 'TOGGLE_PROJECT_STEP': {
      const project = state.projectChecklist[action.projectId] ?? {};
      return {
        ...state,
        projectChecklist: {
          ...state.projectChecklist,
          [action.projectId]: {
            ...project,
            [action.stepIndex]: !project[action.stepIndex],
          },
        },
      };
    }

    case 'TOGGLE_DATASET_TASK':
      return {
        ...state,
        datasetTaskDone: {
          ...state.datasetTaskDone,
          [action.key]: !state.datasetTaskDone[action.key],
        },
      };

    case 'IMPORT_STATE':
      return { ...emptyState(), ...action.state, version: 1 };

    case 'RESET_ALL':
      return emptyState();

    default:
      return state;
  }
}

interface StoreContextValue {
  state: AppState;
  setTheme: (theme: 'light' | 'dark') => void;
  completeDiagnostic: (scores: Record<string, number>, answers: Record<string, string>) => void;
  markLessonRead: (lessonId: string) => void;
  completeLesson: (lessonId: string) => void;
  recordAttempt: (attempt: Omit<QuestionAttempt, 'id' | 'attemptedAt'>) => void;
  recordChallenge: (attempt: Omit<ChallengeAttempt, 'id' | 'attemptedAt'>) => void;
  resolveMistake: (mistakeId: string) => void;
  completeRevision: (revisionId: string, correct: boolean) => void;
  addNote: (lessonId: string, kind: NoteKind, text: string) => void;
  updateNote: (noteId: string, text: string) => void;
  deleteNote: (noteId: string) => void;
  toggleBookmark: (lessonId: string, tag: BookmarkTag) => void;
  recordInterviewAnswer: (record: Omit<InterviewAnswerRecord, 'id' | 'answeredAt'>) => void;
  saveMockSession: (session: MockSession) => void;
  recordDebug: (caseId: string, correct: boolean) => void;
  recordCase: (caseId: string, score: number) => void;
  toggleProjectStep: (projectId: string, stepIndex: number) => void;
  toggleDatasetTask: (key: string) => void;
  importState: (state: AppState) => void;
  resetAll: () => void;
  exportJson: () => string;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable — the app still works in-memory.
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const value = useMemo<StoreContextValue>(
    () => ({
      state,
      setTheme: (theme) => dispatch({ type: 'SET_THEME', theme }),
      completeDiagnostic: (scores, answers) =>
        dispatch({ type: 'COMPLETE_DIAGNOSTIC', scores, answers }),
      markLessonRead: (lessonId) => dispatch({ type: 'MARK_LESSON_READ', lessonId }),
      completeLesson: (lessonId) => dispatch({ type: 'COMPLETE_LESSON', lessonId }),
      recordAttempt: (attempt) => dispatch({ type: 'RECORD_ATTEMPT', attempt }),
      recordChallenge: (attempt) => dispatch({ type: 'RECORD_CHALLENGE', attempt }),
      resolveMistake: (mistakeId) => dispatch({ type: 'RESOLVE_MISTAKE', mistakeId }),
      completeRevision: (revisionId, correct) =>
        dispatch({ type: 'COMPLETE_REVISION', revisionId, correct }),
      addNote: (lessonId, kind, text) => dispatch({ type: 'ADD_NOTE', lessonId, kind, text }),
      updateNote: (noteId, text) => dispatch({ type: 'UPDATE_NOTE', noteId, text }),
      deleteNote: (noteId) => dispatch({ type: 'DELETE_NOTE', noteId }),
      toggleBookmark: (lessonId, tag) => dispatch({ type: 'TOGGLE_BOOKMARK', lessonId, tag }),
      recordInterviewAnswer: (record) =>
        dispatch({ type: 'RECORD_INTERVIEW_ANSWER', record }),
      saveMockSession: (session) => dispatch({ type: 'SAVE_MOCK_SESSION', session }),
      recordDebug: (caseId, correct) => dispatch({ type: 'RECORD_DEBUG', caseId, correct }),
      recordCase: (caseId, score) => dispatch({ type: 'RECORD_CASE', caseId, score }),
      toggleProjectStep: (projectId, stepIndex) =>
        dispatch({ type: 'TOGGLE_PROJECT_STEP', projectId, stepIndex }),
      toggleDatasetTask: (key) => dispatch({ type: 'TOGGLE_DATASET_TASK', key }),
      importState: (imported) => dispatch({ type: 'IMPORT_STATE', state: imported }),
      resetAll: () => dispatch({ type: 'RESET_ALL' }),
      exportJson: () => JSON.stringify(state, null, 2),
    }),
    [state],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
