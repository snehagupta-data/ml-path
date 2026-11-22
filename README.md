# ML Path — Sneha's Personal Machine Learning Platform

A personalized, interactive web-based Machine Learning learning platform that
takes a final-year B.Sc. Data Science student from ML foundations through
interview readiness — built around **learn → visualize → practice → code →
apply → test → review → retain → interview → build projects**.

Live site: *(deployment pending — see Deployment below)*

## What it is

ML Path replaces passive video learning with evidence-driven skill building:

- **15 modules, 48 lessons** (Diagnostic → Foundations → Math → Python →
  Preprocessing → Regression → Classification → Evaluation → Validation →
  Feature Engineering → Unsupervised → Explainability → Workflow →
  Deployment → Projects), each with a three-level explanation system
  (Simple / Technical / Interview), analogy, real-world business example,
  math, Python, common mistakes, and when-to-use / when-not-to-use guidance.
- **Diagnostic assessment** across 8 areas with a personalized starting path.
- **Quiz engine** (170+ questions: MCQ, numerical, short-answer, scenario,
  model-selection) with 3 progressive hints and worked solutions.
- **Mastery system** — per-topic scores from demonstrated ability (recency-
  weighted accuracy + coding), statuses Locked → Mastered. Deterministic
  rules, documented in `src/lib/mastery.ts`.
- **Mistake journal + spaced repetition** (1/3/7/14/30-day intervals) with a
  revision queue.
- **Real Python execution in the browser** via Pyodide (numpy/pandas on
  demand) — 20 coding challenges with real test-case checking. Nothing is
  faked; scikit-learn is not available in Pyodide, so challenges are
  numpy/pandas/pure-Python only.
- **10 interactive visualizations**: gradient descent, linear regression,
  bias–variance, confusion matrix, ROC/AUC, K-Means animation, decision
  trees, KNN, PCA, overfitting.
- **Interview prep**: 80-question bank across 14 categories, an answer
  trainer with **transparent rubric-based evaluation (not AI)**, and timed
  mock interviews (15/30/60 min) with per-dimension reports.
- **5 industry-standard projects** (churn, loan default, house prices,
  customer segmentation, sales forecasting) with readiness checklists and
  project interview prep (30s/1min/3min pitches, tough follow-ups).
- **Dataset lab**: 4 real synthetic datasets (deterministic generator in
  `scripts/generate-datasets.py`, labeled synthetic) with data dictionaries
  and staged tasks.
- **Debugging lab** (6 broken pipelines) and **business case simulator**
  (3 cases) with rubric scoring.
- **Dashboard** with today's mission, streak, weak areas, revision due,
  interview readiness, and an evidence-based "what to learn next"
  recommendation — weakest area first, never just the next chapter.
- **Skill radar** (11 dimensions), **progress analytics**, weekly review,
  and a 12-dimension **ML readiness score** based on performance, never on
  completion alone.
- Notes (7 kinds) and bookmarks (5 tags) per lesson; dark/light mode;
  responsive; keyboard accessible.

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 19 + TypeScript + Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | react-router-dom v7 (SPA, lazy-loaded pages) |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | Lucide |
| Python execution | Pyodide (CDN, WebAssembly) — real interpreter |
| Persistence | Versioned localStorage store with export/import JSON |
| Backend (local-dev only) | FastAPI + SQLite in `backend/` |
| Deployment | Vercel (static SPA) |

## Architecture decisions (deliberate)

- **Local-first persistence.** All progress lives in a versioned
  localStorage store (`src/store/store.tsx`) with JSON export/import. This
  is real persistence, not fake state — and it starts at zero; nothing is
  seeded. The FastAPI backend mirrors the data model for local development
  but the deployed app does not call it.
- **No live LLM.** There is no API key, so every "AI" feature is
  deterministic and honestly labeled: interview answers are scored by a
  published rubric (`src/lib/rubric.ts`), "Teach me differently" variants
  come from authored content, and the mock interviewer draws from a real
  question bank. Nothing claims to be an LLM.
- **Content as data.** All curriculum, questions, challenges, and interview
  content lives in structured TypeScript under `src/content/`, separate
  from UI code, so the platform can grow without rewriting components.

## Run locally

```bash
# Frontend
npm install
npm run dev        # http://localhost:5173

# Production build + smoke test
npm run build
npm run smoke      # builds, serves preview, checks every route + data files

# Typecheck / lint
npm run typecheck
npm run lint
```

Backend (optional, local-dev only — the frontend does not need it):

```bash
cd backend
pip install -r backend/requirements-local.txt
uvicorn main:app --reload   # http://localhost:8000, /api/health
```

## Project layout

```
src/
  content/     curriculum, questions, challenges, interview, projects,
               datasets, debugging cases, business cases (structured data)
  store/       versioned localStorage store (all learner state)
  lib/         mastery.ts (deterministic scoring), rubric.ts (interview
               evaluation), pyodide.ts (real Python execution), utils, csv
  components/  ui primitives, layout, quiz runner, visualizations, code runner
  pages/       24 lazy-loaded routes
scripts/       generate-datasets.py, smoke-test.mjs
backend/       FastAPI reference backend (local-dev only)
public/data/   generated synthetic datasets (CSV)
```

## Testing

- `npm run build` — full TypeScript check + production bundle.
- `npm run smoke` — builds, serves `vite preview`, and verifies all 24
  routes return 200, all 4 dataset CSVs are served, and the bundle contains
  no placeholder markers.
- Coding-challenge tests were verified against their reference solutions.
- Dataset facts in the lab were computed from the generator output.

## Known limitations (honest)

- **No cloud sync or accounts.** Progress lives in one browser's
  localStorage. Use Settings → Export to back up; import on another device.
- **No real LLM.** Interview evaluation is rubric/keyword-based: it can
  tell you which expected points you covered, but cannot judge nuanced
  reasoning the way a human interviewer would. It is labeled as such.
- **No scikit-learn in the browser.** Pyodide cannot load sklearn, so
  coding challenges implement algorithms from scratch with numpy/pandas.
  (The lessons still teach sklearn usage; running sklearn code is a
  local-Python exercise.)
- **Pyodide needs the network.** The runtime loads from the jsDelivr CDN on
  first use (~5–15s); offline, code execution is unavailable.
- **Backend is local-dev only.** The deployed Vercel app does not use it;
  wiring a hosted backend + auth is a future step.
- **Content is authored, not generated.** Question/challenge counts are
  fixed banks; there is no infinite question generator.

## Deployment

The frontend is a static SPA. `vercel.json` configures the Vite build and
SPA rewrites (`outputDirectory: dist`). Connect the GitHub repository to
Vercel; no environment variables are required for the frontend.

## License

Personal learning project. Content is authored for Sneha Gupta's ML study.
