"""
ml-path local-dev reference backend (FastAPI + sqlite3).

IMPORTANT — READ BEFORE USING:
    The deployed frontend (Vercel) does NOT call this backend. The live app
    persists all learner state in the browser (versioned localStorage store,
    see src/store/store.tsx). This backend exists only as a local-dev
    reference: it mirrors the same data model (attempts, mastery, mistakes,
    notes, bookmarks, projects) so the API shape can be exercised, demoed,
    or used as the starting point for a real hosted backend later.

    Do not point the production frontend at this server, and do not treat
    the local SQLite file as a source of truth — it is throwaway dev data.

Run locally:
    pip install -r requirements.txt
    uvicorn main:app --reload          # http://127.0.0.1:8000

Config:
    DATABASE_URL  SQLAlchemy-style URL; only sqlite:// URLs are supported.
                  Default: sqlite:///./mlpath.db (created next to main.py).
                  The .db file is git-ignored (see .gitignore: backend/*.db).

Endpoints:
    GET  /api/health      liveness check
    GET  /api/attempts    list question attempts (optional ?moduleId= filter)
    POST /api/attempts    record a question attempt
    GET  /api/mastery     mastery per topic, computed from attempts
    GET  /api/mistakes    list mistakes (optional ?status= filter)
    POST /api/mistakes    record a mistake
    GET  /api/notes       list notes (optional ?lessonId= filter)
    POST /api/notes       create a note
    GET  /api/bookmarks   list bookmarks
    POST /api/bookmarks   create a bookmark
    GET  /api/projects    list project checklist progress
    POST /api/projects    upsert project checklist progress
"""

import json
import os
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ─── Database setup ─────────────────────────────────────────────────────────

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./mlpath.db")


def _sqlite_path(database_url: str) -> Path:
    """Accept sqlite:///relative.db and sqlite:////absolute.db URLs."""
    if not database_url.startswith("sqlite:///"):
        raise ValueError(
            f"Only sqlite:// DATABASE_URL values are supported, got: {database_url!r}"
        )
    raw = database_url[len("sqlite:///"):]
    path = Path(raw)
    return path if path.is_absolute() else Path(__file__).resolve().parent / path


DB_PATH = _sqlite_path(DATABASE_URL)

SCHEMA = """
CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL,
    topic TEXT NOT NULL,
    module_id TEXT NOT NULL,
    correct INTEGER NOT NULL,
    learner_answer TEXT NOT NULL DEFAULT '',
    correct_answer TEXT NOT NULL DEFAULT '',
    difficulty TEXT NOT NULL,
    mistake_type TEXT NOT NULL DEFAULT '',
    hints_used INTEGER NOT NULL DEFAULT 0,
    attempted_at TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'quiz'
);
CREATE TABLE IF NOT EXISTS mistakes (
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    question_id TEXT NOT NULL,
    question TEXT NOT NULL DEFAULT '',
    learner_answer TEXT NOT NULL DEFAULT '',
    correct_answer TEXT NOT NULL DEFAULT '',
    mistake_type TEXT NOT NULL DEFAULT '',
    difficulty TEXT NOT NULL,
    first_seen_at TEXT NOT NULL,
    last_seen_at TEXT NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 1,
    revision_status TEXT NOT NULL DEFAULT 'Needs revision'
);
CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    lesson_id TEXT NOT NULL,
    kind TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bookmarks (
    id TEXT PRIMARY KEY,
    lesson_id TEXT NOT NULL,
    tag TEXT NOT NULL,
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS projects (
    project_id TEXT PRIMARY KEY,
    checklist_json TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL
);
"""


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    return conn


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _new_id() -> str:
    return str(uuid.uuid4())


# ─── Pydantic models (mirror src/types.ts) ──────────────────────────────────

Difficulty = Literal["Easy", "Medium", "Hard", "Interview", "Real-world"]
AttemptSource = Literal["quiz", "revision", "diagnostic", "lesson"]
RevisionStatus = Literal["Needs revision", "Revising", "Resolved"]
NoteKind = Literal[
    "My Notes",
    "Key Summary",
    "Important Formula",
    "Interview Point",
    "Common Mistake",
    "Example",
    "Questions I Got Wrong",
]
BookmarkTag = Literal["Important", "Revise", "Confusing", "Interview", "Project Idea"]


class AttemptIn(BaseModel):
    question_id: str = Field(..., alias="questionId")
    topic: str
    module_id: str = Field(..., alias="moduleId")
    correct: bool
    learner_answer: str = Field("", alias="learnerAnswer")
    correct_answer: str = Field("", alias="correctAnswer")
    difficulty: Difficulty
    mistake_type: str = Field("", alias="mistakeType")
    hints_used: int = Field(0, alias="hintsUsed", ge=0)
    source: AttemptSource = "quiz"

    model_config = {"populate_by_name": True}


class AttemptOut(AttemptIn):
    id: str
    attempted_at: str = Field(..., alias="attemptedAt")

    model_config = {"populate_by_name": True}


class MistakeIn(BaseModel):
    topic: str
    question_id: str = Field(..., alias="questionId")
    question: str = ""
    learner_answer: str = Field("", alias="learnerAnswer")
    correct_answer: str = Field("", alias="correctAnswer")
    mistake_type: str = Field("", alias="mistakeType")
    difficulty: Difficulty
    revision_status: RevisionStatus = Field("Needs revision", alias="revisionStatus")

    model_config = {"populate_by_name": True}


class MistakeOut(MistakeIn):
    id: str
    first_seen_at: str = Field(..., alias="firstSeenAt")
    last_seen_at: str = Field(..., alias="lastSeenAt")
    attempt_count: int = Field(..., alias="attemptCount")

    model_config = {"populate_by_name": True}


class NoteIn(BaseModel):
    lesson_id: str = Field(..., alias="lessonId")
    kind: NoteKind
    text: str = Field(..., min_length=1)

    model_config = {"populate_by_name": True}


class NoteOut(NoteIn):
    id: str
    created_at: str = Field(..., alias="createdAt")
    updated_at: str = Field(..., alias="updatedAt")

    model_config = {"populate_by_name": True}


class BookmarkIn(BaseModel):
    lesson_id: str = Field(..., alias="lessonId")
    tag: BookmarkTag

    model_config = {"populate_by_name": True}


class BookmarkOut(BookmarkIn):
    id: str
    created_at: str = Field(..., alias="createdAt")

    model_config = {"populate_by_name": True}


class ProjectProgressIn(BaseModel):
    project_id: str = Field(..., alias="projectId")
    checklist: dict[str, bool] = Field(default_factory=dict)

    model_config = {"populate_by_name": True}


class ProjectProgressOut(BaseModel):
    project_id: str = Field(..., alias="projectId")
    checklist: dict[str, bool]
    updated_at: str = Field(..., alias="updatedAt")

    model_config = {"populate_by_name": True}


class TopicMastery(BaseModel):
    topic: str
    attempts: int
    correct: int
    accuracy: float  # 0–1
    status: Literal["Learning", "Practicing", "Weak", "Strong", "Mastered"]


class MasteryOut(BaseModel):
    topics: list[TopicMastery]
    total_attempts: int = Field(..., alias="totalAttempts")
    overall_accuracy: float = Field(..., alias="overallAccuracy")

    model_config = {"populate_by_name": True}


# ─── App ────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="ml-path local-dev backend",
    description=(
        "Local-dev reference backend for the ml-path learning platform. "
        "The deployed frontend uses the browser local store, NOT this API."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _init_db() -> None:
    get_db().close()


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "db": str(DB_PATH), "backend": "local-dev only"}


# ─── Attempts ───────────────────────────────────────────────────────────────


@app.get("/api/attempts", response_model=list[AttemptOut])
def list_attempts(moduleId: Optional[str] = None) -> list[dict]:
    with get_db() as conn:
        if moduleId:
            rows = conn.execute(
                "SELECT * FROM attempts WHERE module_id = ? ORDER BY attempted_at DESC",
                (moduleId,),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM attempts ORDER BY attempted_at DESC"
            ).fetchall()
        return [_row_to_attempt(r) for r in rows]


@app.post("/api/attempts", response_model=AttemptOut, status_code=201)
def create_attempt(payload: AttemptIn) -> dict:
    attempt_id = _new_id()
    attempted_at = _now()
    with get_db() as conn:
        conn.execute(
            """INSERT INTO attempts
               (id, question_id, topic, module_id, correct, learner_answer,
                correct_answer, difficulty, mistake_type, hints_used,
                attempted_at, source)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                attempt_id,
                payload.question_id,
                payload.topic,
                payload.module_id,
                int(payload.correct),
                payload.learner_answer,
                payload.correct_answer,
                payload.difficulty,
                payload.mistake_type,
                payload.hints_used,
                attempted_at,
                payload.source,
            ),
        )
        conn.commit()
    return {
        "id": attempt_id,
        "questionId": payload.question_id,
        "topic": payload.topic,
        "moduleId": payload.module_id,
        "correct": payload.correct,
        "learnerAnswer": payload.learner_answer,
        "correctAnswer": payload.correct_answer,
        "difficulty": payload.difficulty,
        "mistakeType": payload.mistake_type,
        "hintsUsed": payload.hints_used,
        "attemptedAt": attempted_at,
        "source": payload.source,
    }


def _row_to_attempt(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "questionId": row["question_id"],
        "topic": row["topic"],
        "moduleId": row["module_id"],
        "correct": bool(row["correct"]),
        "learnerAnswer": row["learner_answer"],
        "correctAnswer": row["correct_answer"],
        "difficulty": row["difficulty"],
        "mistakeType": row["mistake_type"],
        "hintsUsed": row["hints_used"],
        "attemptedAt": row["attempted_at"],
        "source": row["source"],
    }


# ─── Mastery (computed from attempts) ───────────────────────────────────────


def _mastery_status(attempts: int, accuracy: float) -> str:
    """Same thresholds as the frontend's mastery ladder (minus Locked)."""
    if attempts < 3:
        return "Learning"
    if accuracy >= 0.9 and attempts >= 10:
        return "Mastered"
    if accuracy >= 0.8:
        return "Strong"
    if accuracy >= 0.6:
        return "Practicing"
    return "Weak"


@app.get("/api/mastery", response_model=MasteryOut)
def get_mastery() -> dict:
    with get_db() as conn:
        rows = conn.execute(
            """SELECT topic, COUNT(*) AS n, SUM(correct) AS c
               FROM attempts GROUP BY topic ORDER BY topic"""
        ).fetchall()
    topics: list[dict] = []
    total = 0
    total_correct = 0
    for r in rows:
        n, c = r["n"], r["c"]
        accuracy = c / n if n else 0.0
        topics.append(
            {
                "topic": r["topic"],
                "attempts": n,
                "correct": c,
                "accuracy": round(accuracy, 4),
                "status": _mastery_status(n, accuracy),
            }
        )
        total += n
        total_correct += c
    return {
        "topics": topics,
        "totalAttempts": total,
        "overallAccuracy": round(total_correct / total, 4) if total else 0.0,
    }


# ─── Mistakes ───────────────────────────────────────────────────────────────


@app.get("/api/mistakes", response_model=list[MistakeOut])
def list_mistakes(status: Optional[RevisionStatus] = None) -> list[dict]:
    with get_db() as conn:
        if status:
            rows = conn.execute(
                "SELECT * FROM mistakes WHERE revision_status = ? "
                "ORDER BY last_seen_at DESC",
                (status,),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM mistakes ORDER BY last_seen_at DESC"
            ).fetchall()
        return [_row_to_mistake(r) for r in rows]


@app.post("/api/mistakes", response_model=MistakeOut, status_code=201)
def create_mistake(payload: MistakeIn) -> dict:
    """Repeat mistakes on the same question bump attempt_count instead of
    creating a duplicate row (mirrors the frontend journal)."""
    now = _now()
    with get_db() as conn:
        existing = conn.execute(
            "SELECT * FROM mistakes WHERE question_id = ?", (payload.question_id,)
        ).fetchone()
        if existing:
            conn.execute(
                """UPDATE mistakes SET last_seen_at = ?, attempt_count = attempt_count + 1,
                       revision_status = ? WHERE id = ?""",
                (now, payload.revision_status, existing["id"]),
            )
            conn.commit()
            row = conn.execute(
                "SELECT * FROM mistakes WHERE id = ?", (existing["id"],)
            ).fetchone()
            return _row_to_mistake(row)
        mistake_id = _new_id()
        conn.execute(
            """INSERT INTO mistakes
               (id, topic, question_id, question, learner_answer, correct_answer,
                mistake_type, difficulty, first_seen_at, last_seen_at,
                attempt_count, revision_status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)""",
            (
                mistake_id,
                payload.topic,
                payload.question_id,
                payload.question,
                payload.learner_answer,
                payload.correct_answer,
                payload.mistake_type,
                payload.difficulty,
                now,
                now,
                payload.revision_status,
            ),
        )
        conn.commit()
    return {
        "id": mistake_id,
        "topic": payload.topic,
        "questionId": payload.question_id,
        "question": payload.question,
        "learnerAnswer": payload.learner_answer,
        "correctAnswer": payload.correct_answer,
        "mistakeType": payload.mistake_type,
        "difficulty": payload.difficulty,
        "firstSeenAt": now,
        "lastSeenAt": now,
        "attemptCount": 1,
        "revisionStatus": payload.revision_status,
    }


def _row_to_mistake(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "topic": row["topic"],
        "questionId": row["question_id"],
        "question": row["question"],
        "learnerAnswer": row["learner_answer"],
        "correctAnswer": row["correct_answer"],
        "mistakeType": row["mistake_type"],
        "difficulty": row["difficulty"],
        "firstSeenAt": row["first_seen_at"],
        "lastSeenAt": row["last_seen_at"],
        "attemptCount": row["attempt_count"],
        "revisionStatus": row["revision_status"],
    }


# ─── Notes ──────────────────────────────────────────────────────────────────


@app.get("/api/notes", response_model=list[NoteOut])
def list_notes(lessonId: Optional[str] = None) -> list[dict]:
    with get_db() as conn:
        if lessonId:
            rows = conn.execute(
                "SELECT * FROM notes WHERE lesson_id = ? ORDER BY updated_at DESC",
                (lessonId,),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM notes ORDER BY updated_at DESC"
            ).fetchall()
        return [_row_to_note(r) for r in rows]


@app.post("/api/notes", response_model=NoteOut, status_code=201)
def create_note(payload: NoteIn) -> dict:
    note_id = _new_id()
    now = _now()
    with get_db() as conn:
        conn.execute(
            "INSERT INTO notes (id, lesson_id, kind, text, created_at, updated_at)"
            " VALUES (?, ?, ?, ?, ?, ?)",
            (note_id, payload.lesson_id, payload.kind, payload.text, now, now),
        )
        conn.commit()
    return {
        "id": note_id,
        "lessonId": payload.lesson_id,
        "kind": payload.kind,
        "text": payload.text,
        "createdAt": now,
        "updatedAt": now,
    }


def _row_to_note(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "lessonId": row["lesson_id"],
        "kind": row["kind"],
        "text": row["text"],
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }


# ─── Bookmarks ──────────────────────────────────────────────────────────────


@app.get("/api/bookmarks", response_model=list[BookmarkOut])
def list_bookmarks() -> list[dict]:
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM bookmarks ORDER BY created_at DESC"
        ).fetchall()
        return [_row_to_bookmark(r) for r in rows]


@app.post("/api/bookmarks", response_model=BookmarkOut, status_code=201)
def create_bookmark(payload: BookmarkIn) -> dict:
    with get_db() as conn:
        existing = conn.execute(
            "SELECT * FROM bookmarks WHERE lesson_id = ? AND tag = ?",
            (payload.lesson_id, payload.tag),
        ).fetchone()
        if existing:
            raise HTTPException(
                status_code=409, detail="Bookmark already exists for this lesson and tag"
            )
        bookmark_id = _new_id()
        now = _now()
        conn.execute(
            "INSERT INTO bookmarks (id, lesson_id, tag, created_at) VALUES (?, ?, ?, ?)",
            (bookmark_id, payload.lesson_id, payload.tag, now),
        )
        conn.commit()
    return {
        "id": bookmark_id,
        "lessonId": payload.lesson_id,
        "tag": payload.tag,
        "createdAt": now,
    }


def _row_to_bookmark(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "lessonId": row["lesson_id"],
        "tag": row["tag"],
        "createdAt": row["created_at"],
    }


# ─── Projects (checklist progress) ──────────────────────────────────────────

@app.get("/api/projects", response_model=list[ProjectProgressOut])
def list_projects() -> list[dict]:
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM projects ORDER BY updated_at DESC"
        ).fetchall()
        return [
            {
                "projectId": r["project_id"],
                "checklist": json.loads(r["checklist_json"]),
                "updatedAt": r["updated_at"],
            }
            for r in rows
        ]


@app.post("/api/projects", response_model=ProjectProgressOut, status_code=201)
def upsert_project(payload: ProjectProgressIn) -> dict:
    """Upsert: one row per project, checklist replaced wholesale (the
    frontend sends the full step map each time)."""
    now = _now()
    with get_db() as conn:
        conn.execute(
            """INSERT INTO projects (project_id, checklist_json, updated_at)
               VALUES (?, ?, ?)
               ON CONFLICT(project_id) DO UPDATE SET
                   checklist_json = excluded.checklist_json,
                   updated_at = excluded.updated_at""",
            (payload.project_id, json.dumps(payload.checklist), now),
        )
        conn.commit()
    return {
        "projectId": payload.project_id,
        "checklist": payload.checklist,
        "updatedAt": now,
    }
