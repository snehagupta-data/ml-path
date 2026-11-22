import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './store/store';
import Layout from './components/Layout';

// Lazy-load pages for code splitting.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Modules = lazy(() => import('./pages/Modules'));
const ModuleDetail = lazy(() => import('./pages/ModuleDetail'));
const LessonView = lazy(() => import('./pages/LessonView'));
const Diagnostic = lazy(() => import('./pages/Diagnostic'));
const Practice = lazy(() => import('./pages/Practice'));
const Revision = lazy(() => import('./pages/Revision'));
const Mistakes = lazy(() => import('./pages/Mistakes'));
const Coding = lazy(() => import('./pages/Coding'));
const ChallengeRunner = lazy(() => import('./pages/ChallengeRunner'));
const Visuals = lazy(() => import('./pages/Visuals'));
const Interview = lazy(() => import('./pages/Interview'));
const InterviewTrainer = lazy(() => import('./pages/InterviewTrainer'));
const MockInterview = lazy(() => import('./pages/MockInterview'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Datasets = lazy(() => import('./pages/Datasets'));
const DatasetDetail = lazy(() => import('./pages/DatasetDetail'));
const DebugLab = lazy(() => import('./pages/DebugLab'));
const Cases = lazy(() => import('./pages/Cases'));
const Notes = lazy(() => import('./pages/Notes'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));

function Loading() {
  return (
    <div className="flex items-center justify-center py-24" role="status" aria-live="polite">
      <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:moduleId" element={<ModuleDetail />} />
              <Route path="/lesson/:lessonId" element={<LessonView />} />
              <Route path="/diagnostic" element={<Diagnostic />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/revision" element={<Revision />} />
              <Route path="/mistakes" element={<Mistakes />} />
              <Route path="/coding" element={<Coding />} />
              <Route path="/coding/:challengeId" element={<ChallengeRunner />} />
              <Route path="/visuals" element={<Visuals />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/interview/trainer" element={<InterviewTrainer />} />
              <Route path="/interview/mock" element={<MockInterview />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/datasets" element={<Datasets />} />
              <Route path="/datasets/:datasetId" element={<DatasetDetail />} />
              <Route path="/debug-lab" element={<DebugLab />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </StoreProvider>
  );
}
