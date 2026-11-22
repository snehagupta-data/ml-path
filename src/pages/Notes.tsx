import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, NotebookPen, Pencil, Trash2 } from 'lucide-react';
import type { BookmarkTag, NoteKind } from '../types';
import { LESSONS_BY_ID, moduleOfLesson } from '../content';
import { useStore } from '../store/store';
import { NOTE_KINDS } from '../components/NotesPanel';
import { Badge, Button, Card, EmptyState, PageHeader } from '../components/ui';
import { formatDateTime } from '../lib/utils';

const BOOKMARK_TAGS: BookmarkTag[] = ['Important', 'Revise', 'Confusing', 'Interview', 'Project Idea'];

const KIND_TONES: Record<NoteKind, 'neutral' | 'blue' | 'green' | 'amber' | 'red' | 'purple'> = {
  'My Notes': 'neutral',
  'Key Summary': 'blue',
  'Important Formula': 'purple',
  'Interview Point': 'green',
  'Common Mistake': 'red',
  Example: 'amber',
  'Questions I Got Wrong': 'red',
};

export default function NotesPage() {
  const { state, updateNote, deleteNote } = useStore();
  const [kindFilter, setKindFilter] = useState<'All' | NoteKind>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const groupedNotes = useMemo(() => {
    const filtered = state.notes.filter((n) => kindFilter === 'All' || n.kind === kindFilter);
    const groups = new Map<string, typeof filtered>();
    for (const note of filtered) {
      const list = groups.get(note.lessonId) ?? [];
      list.push(note);
      groups.set(note.lessonId, list);
    }
    return [...groups.entries()]
      .map(([lessonId, notes]) => ({
        lessonId,
        lesson: LESSONS_BY_ID.get(lessonId),
        notes: notes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      }))
      .sort((a, b) =>
        (a.lesson?.title ?? 'Unknown lesson').localeCompare(b.lesson?.title ?? 'Unknown lesson'),
      );
  }, [state.notes, kindFilter]);

  const groupedBookmarks = useMemo(
    () =>
      BOOKMARK_TAGS.map((tag) => ({
        tag,
        bookmarks: state.bookmarks
          .filter((b) => b.tag === tag)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      })).filter((g) => g.bookmarks.length > 0),
    [state.bookmarks],
  );

  function handleUpdate(noteId: string) {
    const trimmed = editText.trim();
    if (!trimmed) return;
    updateNote(noteId, trimmed);
    setEditingId(null);
    setEditText('');
  }

  return (
    <div>
      <PageHeader
        title="Notes & Bookmarks"
        subtitle="Everything you saved while learning — notes by lesson, bookmarks by tag."
      />

      <section aria-label="Notes">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Notes</h2>
          <label htmlFor="notes-kind" className="sr-only">
            Filter notes by kind
          </label>
          <select
            id="notes-kind"
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value as 'All' | NoteKind)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="All">All kinds</option>
            {NOTE_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {state.notes.length} note{state.notes.length === 1 ? '' : 's'} total
          </p>
        </div>

        {state.notes.length === 0 ? (
          <EmptyState
            icon={<NotebookPen className="h-6 w-6" aria-hidden />}
            title="No notes yet"
            detail="Open any lesson and use the notes panel at the bottom to save your first note."
            action={
              <Link
                to="/modules"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Browse lessons
              </Link>
            }
          />
        ) : groupedNotes.length === 0 ? (
          <EmptyState
            icon={<NotebookPen className="h-6 w-6" aria-hidden />}
            title="No notes of this kind"
            detail="Try a different kind filter."
          />
        ) : (
          <div className="space-y-6">
            {groupedNotes.map(({ lessonId, lesson, notes }) => {
              const mod = moduleOfLesson(lessonId);
              return (
                <Card key={lessonId} className="px-5 py-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {lesson ? (
                      <Link to={`/lesson/${lessonId}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {lesson.title}
                      </Link>
                    ) : (
                      'Unknown lesson'
                    )}
                    {mod && (
                      <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                        · {mod.title}
                      </span>
                    )}
                  </h3>
                  <ul className="mt-3 space-y-3">
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
                              <Button
                                size="sm"
                                onClick={() => handleUpdate(note.id)}
                                disabled={editText.trim().length === 0}
                              >
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
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section aria-label="Bookmarks" className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
          <Bookmark className="h-4 w-4 text-slate-400" aria-hidden /> Bookmarks
        </h2>
        {groupedBookmarks.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="h-6 w-6" aria-hidden />}
            title="No bookmarks yet"
            detail="Bookmark lessons from the lesson page with tags like Important, Revise, or Interview."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupedBookmarks.map(({ tag, bookmarks }) => (
              <Card key={tag} className="px-5 py-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {tag}{' '}
                  <span className="font-normal text-slate-500 dark:text-slate-400">
                    ({bookmarks.length})
                  </span>
                </h3>
                <ul className="mt-3 space-y-2">
                  {bookmarks.map((b) => {
                    const lesson = LESSONS_BY_ID.get(b.lessonId);
                    return (
                      <li key={b.id}>
                        {lesson ? (
                          <Link
                            to={`/lesson/${b.lessonId}`}
                            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {lesson.title}
                          </Link>
                        ) : (
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            Unknown lesson
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
