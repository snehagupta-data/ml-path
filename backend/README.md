# ml-path backend — local-dev reference only

> **The deployed frontend (Vercel) does NOT call this backend.**
> The live app persists all learner state in the browser (versioned
> localStorage store, see `src/store/store.tsx`). This backend exists only
> as a local-dev reference: it mirrors the same data model (attempts,
> mastery, mistakes, notes, bookmarks, projects) so the API shape can be
> exercised, demoed, or used as the starting point for a real hosted
> backend later. Do not point production at it.

## Run

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements-local.txt
uvicorn main:app --reload       # http://127.0.0.1:8000
```

Interactive docs: http://127.0.0.1:8000/docs

## Config

| Variable | Default | Notes |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./mlpath.db` | Only `sqlite://` URLs are supported. The `.db` file is created next to `main.py` and is git-ignored (`backend/*.db`). Delete it to reset dev data. |

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Liveness check |
| GET / POST | `/api/attempts` | List / record question attempts (`?moduleId=` filter) |
| GET | `/api/mastery` | Mastery per topic, computed from attempts |
| GET / POST | `/api/mistakes` | List / record mistakes (`?status=` filter; repeat mistakes on the same question bump `attemptCount`) |
| GET / POST | `/api/notes` | List / create notes (`?lessonId=` filter) |
| GET / POST | `/api/bookmarks` | List / create bookmarks (409 on duplicate lesson+tag) |
| GET / POST | `/api/projects` | List / upsert project checklist progress |

Payloads use the same camelCase field names as the frontend types in
`src/types.ts`; input is validated with pydantic. CORS allows only
`http://localhost:5173` and `http://127.0.0.1:5173` (the Vite dev server).

## Quick smoke test

```bash
curl http://127.0.0.1:8000/api/health
curl -X POST http://127.0.0.1:8000/api/attempts \
  -H 'Content-Type: application/json' \
  -d '{"questionId":"q1","topic":"Precision vs Recall","moduleId":"m7","correct":true,"difficulty":"Easy"}'
curl http://127.0.0.1:8000/api/mastery
```
