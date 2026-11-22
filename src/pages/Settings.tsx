import { useRef, useState } from 'react';
import { Download, Info, Moon, Sun, Trash2, Upload } from 'lucide-react';
import type { AppState } from '../types';
import { useStore } from '../store/store';
import { Button, Card, PageHeader } from '../components/ui';
import { cn } from '../lib/utils';

export default function SettingsPage() {
  const { state, setTheme, exportJson, importState, resetAll } = useStore();
  const [importMessage, setImportMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ml-path-data.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<AppState>;
        if (parsed.version !== 1) {
          setImportMessage({
            kind: 'error',
            text: "That file doesn't look like ML Path data",
          });
          return;
        }
        importState(parsed as AppState);
        setImportMessage({ kind: 'ok', text: 'Data imported successfully.' });
      } catch {
        setImportMessage({
          kind: 'error',
          text: "That file doesn't look like ML Path data",
        });
      }
    };
    reader.onerror = () => {
      setImportMessage({
        kind: 'error',
        text: "That file doesn't look like ML Path data",
      });
    };
    reader.readAsText(file);
  }

  function handleReset() {
    if (
      window.confirm(
        'Reset all progress? This erases every lesson, attempt, mistake, note, and bookmark stored in this browser. This cannot be undone — export your data first if you want a backup.',
      )
    ) {
      resetAll();
    }
  }

  const stats: { label: string; value: number }[] = [
    { label: 'Question attempts', value: state.attempts.length },
    { label: 'Mistakes recorded', value: state.mistakes.length },
    { label: 'Notes', value: state.notes.length },
    { label: 'Lessons completed', value: Object.keys(state.lessonsCompleted).length },
    { label: 'Revision items', value: state.revision.length },
    { label: 'Bookmarks', value: state.bookmarks.length },
    { label: 'Interview answers', value: state.interviewAnswers.length },
    { label: 'Coding attempts', value: state.challengeAttempts.length },
  ];

  return (
    <div>
      <PageHeader
        title="Settings & Data"
        subtitle="Appearance and your learning data. Everything is stored locally in this browser."
      />

      <div className="space-y-6">
        {/* Appearance */}
        <Card className="px-5 py-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Appearance</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Light or dark theme — applied across the whole app.
          </p>
          <div className="mt-4 flex gap-2" role="group" aria-label="Theme">
            <Button
              variant={state.theme === 'light' ? 'primary' : 'outline'}
              onClick={() => setTheme('light')}
              aria-pressed={state.theme === 'light'}
            >
              <Sun className="h-4 w-4" aria-hidden /> Light
            </Button>
            <Button
              variant={state.theme === 'dark' ? 'primary' : 'outline'}
              onClick={() => setTheme('dark')}
              aria-pressed={state.theme === 'dark'}
            >
              <Moon className="h-4 w-4" aria-hidden /> Dark
            </Button>
          </div>
        </Card>

        {/* Storage stats */}
        <Card className="px-5 py-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            What&apos;s stored
          </h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-800">
                <dt className="text-xs text-slate-500 dark:text-slate-400">{s.label}</dt>
                <dd className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 flex items-start gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Your data lives only in this browser&apos;s localStorage. It is not synced anywhere —
            clearing browser data or switching browsers will lose it unless you export a backup.
          </p>
        </Card>

        {/* Export / import */}
        <Card className="px-5 py-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Export &amp; import
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Export a JSON backup of all your progress, or restore one from a file. Importing
            replaces your current data.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={handleExport}>
              <Download className="h-4 w-4" aria-hidden /> Export data (JSON)
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" aria-hidden /> Import data
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              aria-label="Choose a JSON file to import"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImportFile(file);
                e.target.value = '';
              }}
            />
          </div>
          {importMessage && (
            <p
              className={cn(
                'mt-3 rounded-lg px-3 py-2 text-sm',
                importMessage.kind === 'ok'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                  : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200',
              )}
              role="status"
            >
              {importMessage.text}
            </p>
          )}
        </Card>

        {/* Danger zone */}
        <Card className="border-red-200 px-5 py-5 dark:border-red-900">
          <h2 className="text-base font-semibold text-red-700 dark:text-red-300">Danger zone</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Reset all progress to zero — lessons, attempts, mistakes, revision, notes, bookmarks,
            interview answers, and streak. This cannot be undone.
          </p>
          <Button variant="danger" className="mt-4" onClick={handleReset}>
            <Trash2 className="h-4 w-4" aria-hidden /> Reset all data
          </Button>
        </Card>
      </div>
    </div>
  );
}
