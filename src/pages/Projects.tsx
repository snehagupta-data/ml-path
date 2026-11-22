import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Circle, FolderKanban, Target } from 'lucide-react';
import { PROJECTS, QUESTIONS_BY_ID } from '../content';
import { useStore } from '../store/store';
import { skillScores } from '../lib/mastery';
import { Badge, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui';
import type { AppState, Project, SkillDimension } from '../types';

// ─── Shared readiness helper (also used by ProjectDetail) ─────────────────

export interface PrerequisiteStatus {
  skill: SkillDimension;
  threshold: number;
  /** Null when there is no recorded evidence for the skill yet. */
  score: number | null;
  met: boolean;
}

/** A prerequisite with no evidence counts as unmet. */
export function prerequisiteStatuses(state: AppState, project: Project): PrerequisiteStatus[] {
  const scores = skillScores(state, QUESTIONS_BY_ID);
  return project.prerequisites.map((p) => {
    const score = scores[p.skill];
    return {
      skill: p.skill,
      threshold: p.threshold,
      score,
      met: score !== null && score >= p.threshold,
    };
  });
}

function levelTone(level: number): 'green' | 'blue' | 'amber' | 'purple' | 'red' {
  switch (level) {
    case 1:
      return 'green';
    case 2:
      return 'blue';
    case 3:
      return 'amber';
    case 4:
      return 'purple';
    default:
      return 'red';
  }
}

function ProjectCard({ project }: { project: Project }) {
  const { state } = useStore();
  const checklist = state.projectChecklist[project.id] ?? {};
  const doneCount = project.steps.filter((_, i) => checklist[i]).length;
  const progress =
    project.steps.length > 0 ? Math.round((doneCount / project.steps.length) * 100) : 0;

  const prereqs = prerequisiteStatuses(state, project);
  const metCount = prereqs.filter((p) => p.met).length;
  const noEvidenceCount = prereqs.filter((p) => p.score === null).length;

  return (
    <Card className="flex flex-col p-5 transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={levelTone(project.level)}>
          Level {project.level} · {project.levelLabel}
        </Badge>
        <Badge tone="blue">{project.problemType}</Badge>
      </div>
      <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
        {project.title}
      </h2>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {project.businessProblem}
      </p>

      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Checklist progress
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {doneCount} of {project.steps.length} steps · {progress}%
            </span>
          </div>
          <ProgressBar value={progress} />
        </div>
        <p className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
          <span>
            Readiness: {metCount} of {prereqs.length} prerequisite
            {prereqs.length === 1 ? '' : 's'} met
            {noEvidenceCount > 0 && ` · ${noEvidenceCount} with no evidence yet`}
          </span>
        </p>
      </div>

      <Link
        to={`/projects/${project.id}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        aria-label={`Open project: ${project.title}`}
      >
        Open project
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </Card>
  );
}

export default function ProjectsPage() {
  const { state } = useStore();

  if (PROJECTS.length === 0) {
    return (
      <div>
        <PageHeader
          title="Projects"
          subtitle="End-to-end ML projects, structured the way industry work actually runs — from business problem to interview-ready story."
        />
        <EmptyState
          icon={<FolderKanban className="h-6 w-6" aria-hidden />}
          title="No projects yet"
          detail="Project content is still being written. Check back once the project library is published."
        />
      </div>
    );
  }

  const totalSteps = PROJECTS.reduce((sum, p) => sum + p.steps.length, 0);
  const totalDone = PROJECTS.reduce(
    (sum, p) => sum + p.steps.filter((_, i) => state.projectChecklist[p.id]?.[i]).length,
    0,
  );
  const allMet = PROJECTS.filter((p) =>
    prerequisiteStatuses(state, p).every((s) => s.met),
  ).length;

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="End-to-end ML projects, structured the way industry work actually runs — from business problem to interview-ready story."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-3 p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {totalDone} of {totalSteps} steps complete
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Across all {PROJECTS.length} projects
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <Circle className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {allMet} of {PROJECTS.length} projects fully ready
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All prerequisites met from your quiz and challenge evidence
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
