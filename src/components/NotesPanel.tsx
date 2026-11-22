import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { NoteKind } from '../types';
import { useStore } from '../store/store';
import { Badge, Button } from './ui';
import { cn, formatDateTime } from '../lib/utils';

export const NOTE_KINDS: NoteKind[] = [
  'My Notes',
  'Key Summary',
  'Important Formula',
  'Interview Point',
  'Common Mistake',
  'Example',
  'Questions I Got Wrong',
];

const KIND_TONES: Record<NoteKind, 'neutral' | 'blue' | 'green' | 'amber' | 'red' | 'purple'> = {
  'My Notes': 'neutral',
  'Key Summary': 'blue',
  'Important Formula': 'purple',
  'Interview Point': 'green',
  'Common Mistake': 'red',
  Example: 'amber',
  'Questions I Got Wrong': 'red',
};

/** Per-lesson notes: pick a kind, write, save; list with edit/delete. */
export default function NotesPanel({ lessonId }: { lessonId: string }) {
  const { state, addNote, updateNote, deleteNote } = useStore();
  const [kind, setKind] = useState<NoteKind>('My Notes');
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const notes = state.notes
    .filter((n) => n.lessonId === lessonId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  function handleSave() {
    const trimmed = text.trim();
    if (!trimmed) return;
    addNote(lessonId, kind, trimmed);
    setText('');
  }

  function handleUpdate(noteId: string) {
    const trimmed = editText.trim();
    if (!trimmed) return;
    updateNote(noteId, trimmed);
    setEditingId(null);
    setEditText('');
  }

  return (
    <div>
      {/* New note composer */}
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="Note kind"
      >
        {NOTE_KINDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            aria-pressed={kind === k}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              kind === k
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
            )}
          >
            {k}
          </button>
        ))}
      </div>
      <label htmlFor={`note-text-${lessonId}`} className="sr-only">
        Write a {kind} note
      </label>
      <textarea
        id={`note-text-${lessonId}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder={`Write your ${kind.toLowerCase()}…`}
        className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
      <Button size="sm" className="mt-2" onClick={handleSave} disabled={text.trim().length === 0}>
        <Plus className="h-4 w-4" aria-hidden /> Save note
      </Button>

      {/* Existing notes */}
      {notes.length === 0 ? (
        <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
          No notes for this lesson yet. Notes you save here also appear on the Notes page.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge tone={KIND_TONES[note.kind]}>{note.kind}</Badge>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {formatDateTime(note.updatedAt)}
                </span>
              </div>
              {editingId === note.id ? (
                <div className="mt-2">
                  <label htmlFor={`edit-note-${note.id}`} className="sr-only">
                    Edit note
                  </label>
                  <textarea
                    id={`edit-note-${note.id}`}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={() => handleUpdate(note.id)} disabled={editText.trim().length === 0}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(null);
                        setEditText('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-100">
                    {note.text}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingId(note.id);
                        setEditText(note.text);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Delete this note?')) deleteNote(note.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
