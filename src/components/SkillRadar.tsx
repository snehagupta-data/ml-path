import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import type { SkillDimension } from '../types';
import { SKILL_DIMENSIONS } from '../types';
import { Card } from './ui';

/**
 * Radar chart of the 11 skill dimensions. A null score means "no data yet"
 * for that dimension — it renders as 0 on the chart and is labelled
 * honestly in the list below.
 */
export default function SkillRadar({
  scores,
}: {
  scores: Record<SkillDimension, number | null>;
}) {
  const data = SKILL_DIMENSIONS.map((dimension) => ({
    dimension,
    score: scores[dimension] ?? 0,
    hasData: scores[dimension] !== null,
  }));
  const hasAny = data.some((d) => d.hasData);

  if (!hasAny) {
    return (
      <Card className="px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-900 dark:text-white">No skill data yet</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">
          Answer quiz questions, complete coding challenges, or practise interview answers and
          your skill radar will build itself from real evidence.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <div className="h-80 w-full" role="img" aria-label="Radar chart of skill scores">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="#cbd5e1" />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#64748b' }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              dataKey="score"
              stroke="#2563eb"
              fill="#2563eb"
              fillOpacity={0.25}
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#2563eb', strokeWidth: 0 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
        {data.map((d) => (
          <div key={d.dimension} className="flex items-baseline justify-between gap-2 text-sm">
            <dt className="truncate text-slate-600 dark:text-slate-400">{d.dimension}</dt>
            <dd className="shrink-0 font-semibold text-slate-900 dark:text-white">
              {d.hasData ? `${d.score}%` : <span className="font-normal text-slate-400">No data yet</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
