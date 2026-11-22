import {
  BarChart3,
  BookOpen,
  Brain,
  Code2,
  Database,
  FlaskConical,
  GitBranch,
  GraduationCap,
  LineChart,
  Network,
  Rocket,
  SlidersHorizontal,
  Sparkles,
  Table2,
  Target,
  type LucideIcon,
} from 'lucide-react';

/** Resolves the `icon` string stored on each Module to a Lucide component. */
const ICONS: Record<string, LucideIcon> = {
  target: Target,
  brain: Brain,
  'bar-chart': BarChart3,
  'line-chart': LineChart,
  code: Code2,
  database: Database,
  'git-branch': GitBranch,
  sliders: SlidersHorizontal,
  sparkles: Sparkles,
  network: Network,
  rocket: Rocket,
  book: BookOpen,
  table: Table2,
  flask: FlaskConical,
  graduation: GraduationCap,
};

export function ModuleIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? BookOpen;
  return <Icon className={className} aria-hidden />;
}
