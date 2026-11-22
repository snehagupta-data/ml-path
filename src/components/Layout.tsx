import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  Brain,
  Bug,
  Code2,
  Database,
  FlaskConical,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Map,
  Menu,
  MessageSquare,
  Moon,
  NotebookPen,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Sun,
  Target,
  X,
} from 'lucide-react';
import { useStore } from '../store/store';
import { revisionDue } from '../lib/mastery';
import { cn } from '../lib/utils';

const NAV_SECTIONS: {
  label: string;
  items: { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }[];
}[] = [
  {
    label: 'Learn',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/roadmap', label: 'Roadmap', icon: Map },
      { to: '/modules', label: 'Modules & Lessons', icon: BookOpen },
      { to: '/diagnostic', label: 'Diagnostic', icon: Target },
      { to: '/visuals', label: 'Visualizations', icon: Sparkles },
    ],
  },
  {
    label: 'Practice',
    items: [
      { to: '/practice', label: 'Quiz Practice', icon: Brain },
      { to: '/coding', label: 'Coding Challenges', icon: Code2 },
      { to: '/revision', label: 'Revision', icon: RotateCcw },
      { to: '/mistakes', label: 'Mistake Journal', icon: NotebookPen },
    ],
  },
  {
    label: 'Apply',
    items: [
      { to: '/projects', label: 'Projects', icon: FolderKanban },
      { to: '/datasets', label: 'Dataset Lab', icon: Database },
      { to: '/debug-lab', label: 'Debugging Lab', icon: Bug },
      { to: '/cases', label: 'Case Simulator', icon: FlaskConical },
    ],
  },
  {
    label: 'Interview',
    items: [
      { to: '/interview', label: 'Interview Prep', icon: MessageSquare },
      { to: '/interview/trainer', label: 'Answer Trainer', icon: GraduationCap },
      { to: '/interview/mock', label: 'Mock Interview', icon: MessageSquare },
    ],
  },
  {
    label: 'Track',
    items: [
      { to: '/notes', label: 'Notes & Bookmarks', icon: NotebookPen },
      { to: '/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/settings', label: 'Settings & Data', icon: Settings },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { state } = useStore();
  const due = revisionDue(state);
  return (
    <div className="flex h-full flex-col">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-5 pb-5 pt-6"
        aria-label="ML Path home"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Brain className="h-5 w-5" aria-hidden />
        </span>
        <span>
          <span className="block text-base font-bold leading-tight text-slate-900 dark:text-white">
            ML Path
          </span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            Sneha&apos;s ML journey
          </span>
        </span>
      </Link>
      <nav className="thin-scroll flex-1 overflow-y-auto px-3 pb-4" aria-label="Main navigation">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="flex-1">{item.label}</span>
                    {item.to === '/revision' && due > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[11px] font-bold text-white">
                        {due}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {state.streak.count}-day streak
          </span>{' '}
          · {state.attempts.length} questions attempted
        </p>
      </div>
    </div>
  );
}

export default function Layout() {
  const { state, setTheme } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/modules?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <form onSubmit={submitSearch} className="hidden max-w-md flex-1 sm:block" role="search">
              <label className="relative block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search lessons, e.g. overfitting…"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  aria-label="Search lessons"
                />
              </label>
            </form>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-sm text-slate-500 dark:text-slate-400 md:block">
                Hi, {state.name}
              </span>
              <button
                type="button"
                onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label={state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {state.theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 px-6 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          ML Path — a personal learning platform for Sneha. Progress is stored locally in your
          browser. Interview evaluation is rubric-based, not AI.
        </footer>
      </div>
    </div>
  );
}
