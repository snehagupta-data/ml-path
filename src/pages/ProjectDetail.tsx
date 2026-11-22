import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Circle,
  Database,
  FolderKanban,
  ListChecks,
  MessageSquare,
  Target,
} from 'lucide-react';
import { DATASETS_BY_ID, PROJECTS_BY_ID } from '../content';
import { useStore } from '../store/store';
import { Badge, Card, EmptyState, PageHeader, ProgressBar } from '../components/ui';
import { cn } from '../lib/utils';
import { prerequisiteStatuses } from './Projects';
import type { Project } from '../types';

const LEVEL_GUIDANCE: Record<number, string> = {
  1: 'Level 1 is fully guided: follow the steps in order. Every step has guidance and a concrete deliverable, so you are never left guessing what to do next.',
  2: 'Level 2 is semi-guided: the steps tell you what to do, but you decide how to do it. Expect to look things up and make your own modelling choices.',
  3: 'Level 3 is independent: you own the plan. The steps are milestones, not instructions — you choose the approach, the tools, and the trade-offs.',
  4: 'Level 4 is interview-grade: build it as if an interviewer will interrogate every decision. Document your reasoning and be ready to defend it.',
  5: 'Level 5 is portfolio-quality: the finished project should be good enough to show a hiring manager — clean code, honest evaluation, and a clear business story.',
};

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

type PitchTab = '30s' | '1min' | '3min';

const PITCH_TABS: { id: PitchTab; label: string }[] = [
  { id: '30s', label: '30 seconds' },
  { id: '1min', label: '1 minute' },
  { id: '3min', label: '3 minutes' },
];

function InterviewPrep({ project }: { project: Project }) {
  const [pitchTab, setPitchTab] = useState<PitchTab>('30s');
  const [openFollowUp, setOpenFollowUp] = useState<number | null>(null);

  const pitch =
    pitchTab === '30s' ? project.pitch30s : pitchTab === '1min' ? project.pitch1min : project.pitch3min;

  return (
    <section aria-labelledby="interview-prep-heading">
      <h2
        id="interview-prep-heading"
        className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"
      >
        <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />
        Interview prep
      </h2>
      <div className="space-y-5">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            The pitch — practise it out loud
          </h3>
          <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Pitch length">
            {PITCH_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`pitch-tab-${tab.id}`}
                aria-selected={pitchTab === tab.id}
                aria-controls="pitch-panel"
                onClick={() => setPitchTab(tab.id)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                  pitchTab === tab.id
                    ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <p
            id="pitch-panel"
            role="tabpanel"
            aria-labelledby={`pitch-tab-${pitchTab}`}
            className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
          >
            {pitch}
          </p>
        </Card>

        {project.deepDive.length > 0 && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Deep-dive points
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Topics an interviewer is likely to push on. Make sure you can speak to each one.
            </p>
            <ul className="mt-3 space-y-2">
              {project.deepDive.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {project.toughFollowUps.length > 0 && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tough follow-ups
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Expand a question to see how to approach the answer.
            </p>
            <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
              {project.toughFollowUps.map((fu, i) => {
                const open = openFollowUp === i;
                return (
                  <div key={fu.question}>
                    <button
                      type="button"
                      onClick={() => setOpenFollowUp(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`followup-${i}`}
                      className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-medium text-slate-900 dark:text-white"
                    >
                      {fu.question}
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 shrink-0 text-slate-400 transition-transform',
                          open && 'rotate-180',
                        )}
                        aria-hidden
                      />
                    </button>
                    {open && (
                      <p
                        id={`followup-${i}`}
                        className="pb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                      >
                        {fu.guidance}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { state, toggleProjectStep } = useStore();
  const project = projectId ? PROJECTS_BY_ID.get(projectId) : undefined;

  if (!project) {
    return (
      <div>
        <Link
          to="/projects"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to projects
        </Link>
        <EmptyState
          icon={<FolderKanban className="h-6 w-6" aria-hidden />}
          title="Project not found"
          detail="This project does not exist, or its content has not been published yet."
        />
      </div>
    );
  }

  const dataset = project.datasetId ? DATASETS_BY_ID.get(project.datasetId) : undefined;
  const checklist = state.projectChecklist[project.id] ?? {};
  const doneCount = project.steps.filter((_, i) => checklist[i]).length;
  const progress =
    project.steps.length > 0 ? Math.round((doneCount / project.steps.length) * 100) : 0;
  const prereqs = prerequisiteStatuses(state, project);
  const metCount = prereqs.filter((p) => p.met).length;

  return (
    <div>
      <Link
        to="/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to projects
      </Link>

      <PageHeader
        title={project.title}
        subtitle={LEVEL_GUIDANCE[project.level]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Badge tone={levelTone(project.level)}>
              Level {project.level} · {project.levelLabel}
            </Badge>
            <Badge tone="blue">{project.problemType}</Badge>
          </div>
        }
      />

      <div className="space-y-8">
        {/* Business problem */}
        <section aria-labelledby="business-heading">
          <h2
            id="business-heading"
            className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"
          >
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />
            The business problem
          </h2>
          <Card className="space-y-4 p-5">
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {project.businessProblem}
            </p>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Business objective
                </dt>
                <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  {project.businessObjective}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Target definition
                </dt>
                <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  {project.targetDefinition}
                </dd>
              </div>
            </dl>
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Dataset
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                {project.datasetDescription}
              </p>
              {dataset && (
                <Link
                  to={`/datasets/${dataset.id}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Database className="h-4 w-4" aria-hidden />
                  Open {dataset.name} in the Dataset Lab
                </Link>
              )}
            </div>
          </Card>
        </section>

        {/* Models + metrics */}
        <section aria-labelledby="approach-heading">
          <h2
            id="approach-heading"
            className="mb-3 text-lg font-semibold text-slate-900 dark:text-white"
          >
            Approach
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Models to try
              </h3>
              <ul className="mt-3 space-y-2">
                {project.modelsToTry.map((m) => (
                  <li
                    key={m}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"
                      aria-hidden
                    />
                    {m}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Metrics that matter
              </h3>
              <ul className="mt-3 space-y-2">
                {project.metrics.map((m) => (
                  <li
                    key={m}
                    className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"
                      aria-hidden
                    />
                    {m}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        {/* Readiness */}
        <section aria-labelledby="readiness-heading">
          <h2
            id="readiness-heading"
            className="mb-3 text-lg font-semibold text-slate-900 dark:text-white"
          >
            Readiness checklist
          </h2>
          <Card className="p-5">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {metCount} of {prereqs.length} prerequisites met. Scores come from your quiz and
              challenge evidence — a skill with no evidence yet counts as unmet.
            </p>
            <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {prereqs.map((p) => (
                <li key={p.skill} className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.met ? (
                      <CheckCircle2
                        className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                        aria-hidden
                      />
                    ) : (
                      <Circle
                        className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600"
                        aria-hidden
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {p.skill}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Required: {p.threshold}%
                      </p>
                    </div>
                  </div>
                  {p.score === null ? (
                    <Badge tone="neutral">no evidence yet</Badge>
                  ) : (
                    <Badge tone={p.met ? 'green' : 'amber'}>
                      Your score: {p.score}%{p.met ? ' · met' : ' · not met'}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Steps checklist */}
        <section aria-labelledby="steps-heading">
          <h2
            id="steps-heading"
            className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white"
          >
            <ListChecks className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden />
            Project steps
          </h2>
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {doneCount} of {project.steps.length} steps done
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{progress}%</p>
            </div>
            <ProgressBar value={progress} className="mb-5" />
            <ol className="space-y-2">
              {project.steps.map((step, i) => {
                const done = Boolean(checklist[i]);
                return (
                  <li
                    key={`${step.title}-${i}`}
                    className={cn(
                      'rounded-lg border p-4',
                      done
                        ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/30'
                        : 'border-slate-200 dark:border-slate-800',
                    )}
                  >
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggleProjectStep(project.id, i)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                      />
                      <span className="min-w-0">
                        <span
                          className={cn(
                            'block text-sm font-medium',
                            done
                              ? 'text-slate-500 line-through dark:text-slate-400'
                              : 'text-slate-900 dark:text-white',
                          )}
                        >
                          Step {i + 1}: {step.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {step.guidance}
                        </span>
                        <span className="mt-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                          Deliverable: {step.deliverable}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ol>
          </Card>
        </section>

        <InterviewPrep project={project} />
      </div>
    </div>
  );
}
