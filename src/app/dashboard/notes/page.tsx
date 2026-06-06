'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { NoteItem } from '@/types';
import TagBadge from '@/components/ui/TagBadge';
import Toast from '@/components/ui/Toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { Plus, Pin, Trash2, Eye, Edit3 } from 'lucide-react';

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [active, setActive] = useState<NoteItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [search, setSearch] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [renderedContent, setRenderedContent] = useState('');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/notes');
    const data = await res.json();
    const ns: NoteItem[] = Array.isArray(data) ? data : [];
    setNotes(ns);
    if (!active && ns.length > 0) setActive(ns[0]);
    setLoading(false);
  }, [active]);

  useEffect(() => { load(); }, []); // eslint-disable-line

  const save = useCallback(async (note: NoteItem) => {
    await fetch(`/api/notes/${note._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: note.title, content: note.content, tags: note.tags, pinned: note.pinned }),
    });
    setNotes(prev => prev.map(n => n._id === note._id ? note : n));
  }, []);

  const updateActive = (patch: Partial<NoteItem>) => {
    if (!active) return;
    const updated = { ...active, ...patch };
    setActive(updated);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(updated), 1000);
  };

  useEffect(() => {
    if (mode === 'preview' && active?.content) {
      import('marked').then(({ marked }) => {
        setRenderedContent(marked.parse(active.content) as string);
      });
    }
  }, [mode, active?.content]);

  const createNote = async () => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled Note', content: '', tags: [], pinned: false }),
    });
    const note = await res.json();
    setNotes(prev => [note, ...prev]);
    setActive(note);
  };

  const deleteNote = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    setNotes(prev => prev.filter(n => n._id !== id));
    if (active?._id === id) setActive(notes.find(n => n._id !== id) || null);
    setToast({ msg: 'Note deleted', type: 'success' });
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() && active) {
      updateActive({ tags: [...(active.tags || []), tagInput.trim()] });
      setTagInput('');
    }
  };

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = { color: 'var(--ink)', fontFamily: 'JetBrains Mono, monospace', background: 'transparent' };

  return (
    <div className="flex h-[calc(100vh-120px)] max-w-7xl gap-0" style={{ border: '1px solid var(--line)' }}>
      {/* Notes list */}
      <aside className="w-72 flex-shrink-0 flex flex-col border-r" style={{ borderColor: 'var(--line)', background: 'var(--bg-panel)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-center gap-2 mb-3">
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-b py-1 text-xs outline-none"
              style={{ borderColor: 'var(--line-md)', color: 'var(--ink)' }}
              placeholder="Search notes..." />
            <button onClick={createNote} className="p-1.5 border transition-colors" style={{ color: 'var(--gold)', borderColor: 'var(--gold-line)' }}><Plus size={14} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? Array(4).fill(0).map((_, i) => <div key={i} className="p-4 border-b" style={{ borderColor: 'var(--line)' }}><Skeleton height="40px" /></div>) :
            filtered.length === 0 ? <p className="p-4 font-mono text-xs" style={{ color: 'var(--ink-5)' }}>No notes found.</p> :
              filtered.map(n => (
                <button key={n._id} onClick={() => { setActive(n); setMode('edit'); }}
                  className="w-full text-left p-4 border-b transition-all"
                  style={{ borderColor: 'var(--line)', background: active?._id === n._id ? 'var(--gold-pale)' : 'transparent', borderLeft: active?._id === n._id ? '2px solid var(--gold)' : '2px solid transparent' }}>
                  <div className="flex items-start gap-2">
                    {n.pinned && <Pin size={10} style={{ color: 'var(--gold)', marginTop: 3, flexShrink: 0 }} />}
                    <div className="min-w-0">
                      <p className="font-mono text-xs truncate" style={{ color: active?._id === n._id ? 'var(--gold)' : 'var(--ink-2)' }}>{n.title}</p>
                      <p className="font-mono text-xs truncate mt-0.5" style={{ color: 'var(--ink-5)' }}>{n.content.slice(0, 50) || 'Empty note'}</p>
                      <p className="font-mono text-xs mt-1" style={{ color: 'var(--ink-5)', fontSize: '10px' }}>{new Date(n.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </button>
              ))
          }
        </div>
      </aside>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {!active ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="font-mono text-xs mb-3" style={{ color: 'var(--ink-5)' }}>Select or create a note</p>
              <button onClick={createNote} className="font-mono text-xs px-4 py-2 border" style={{ color: 'var(--gold)', borderColor: 'var(--gold-line)' }}>+ New Note</button>
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: 'var(--line)', background: 'var(--bg-panel)' }}>
              <div className="flex gap-2">
                <button onClick={() => setMode('edit')} className="font-mono text-xs px-3 py-1 border" style={{ color: mode === 'edit' ? 'var(--gold)' : 'var(--ink-4)', borderColor: mode === 'edit' ? 'var(--gold)' : 'var(--line)' }}>
                  <Edit3 size={12} className="inline mr-1" />Edit
                </button>
                <button onClick={() => setMode('preview')} className="font-mono text-xs px-3 py-1 border" style={{ color: mode === 'preview' ? 'var(--teal)' : 'var(--ink-4)', borderColor: mode === 'preview' ? 'var(--teal)' : 'var(--line)' }}>
                  <Eye size={12} className="inline mr-1" />Preview
                </button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateActive({ pinned: !active.pinned })} className="p-1.5" style={{ color: active.pinned ? 'var(--gold)' : 'var(--ink-4)' }}><Pin size={14} /></button>
                <button onClick={() => deleteNote(active._id)} className="p-1.5" style={{ color: 'var(--red)' }}><Trash2 size={14} /></button>
              </div>
            </div>

            {/* Title */}
            <input value={active.title} onChange={e => updateActive({ title: e.target.value })}
              className="px-6 py-4 font-display text-2xl font-semibold outline-none border-b"
              style={{ background: 'transparent', borderColor: 'var(--line)', color: 'var(--ink)' }}
              placeholder="Note title..." />

            {/* Tags */}
            <div className="flex items-center gap-2 px-6 py-2 border-b flex-wrap" style={{ borderColor: 'var(--line)' }}>
              {(active.tags || []).map(tag => (
                <TagBadge key={tag} label={tag} color="teal" onRemove={() => updateActive({ tags: active.tags.filter(t => t !== tag) })} />
              ))}
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                className="font-mono text-xs outline-none bg-transparent" style={{ color: 'var(--ink-3)', minWidth: '100px' }}
                placeholder="Add tag + Enter" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {mode === 'edit' ? (
                <textarea value={active.content} onChange={e => updateActive({ content: e.target.value })}
                  className="w-full h-full p-6 outline-none resize-none text-sm leading-relaxed"
                  style={{ ...inputStyle, fontFamily: 'DM Sans, sans-serif', lineHeight: '1.8', color: 'var(--ink-2)', background: 'transparent' }}
                  placeholder="Start writing in Markdown..." />
              ) : (
                <div className="p-6 prose-custom max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderedContent || '<p style="color:var(--ink-5);font-family:JetBrains Mono">Nothing to preview yet.</p>' }} />
              )}
            </div>

            {/* Auto-save indicator */}
            <div className="px-6 py-2 border-t" style={{ borderColor: 'var(--line)' }}>
              <span className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>Auto-saves after 1s of inactivity</span>
            </div>
          </>
        )}
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
