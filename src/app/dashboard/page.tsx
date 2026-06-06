'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileItem, NoteItem, FamilyEventItem } from '@/types';
import ProgressRing from '@/components/ui/ProgressRing';
import { Skeleton } from '@/components/ui/Skeleton';
import { FileText, Database, StickyNote, Calendar, ArrowRight } from 'lucide-react';

function Widget({ title, children, accent = 'var(--gold)', className = '' }: { title: string; children: React.ReactNode; accent?: string; className?: string }) {
  return (
    <div className={`p-6 border ${className}`} style={{ background: 'var(--bg-panel)', borderColor: 'var(--line)', borderLeft: `2px solid ${accent}` }}>
      <h3 className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: accent }}>{title}</h3>
      {children}
    </div>
  );
}

export default function DashboardHome() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [events, setEvents] = useState<FamilyEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/files').then(r => r.json()).catch(() => []),
      fetch('/api/notes').then(r => r.json()).catch(() => []),
      fetch('/api/family/events').then(r => r.json()).catch(() => []),
    ]).then(([f, n, e]) => {
      setFiles(Array.isArray(f) ? f : []);
      setNotes(Array.isArray(n) ? n : []);
      setEvents(Array.isArray(e) ? e : []);
      setLoading(false);
    });
  }, []);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const totalStorage = files.reduce((s, f) => s + (f.size || 0), 0);
  const storageGB = totalStorage / (1024 * 1024 * 1024);
  const storagePct = Math.min(Math.round(storageGB / 5 * 100), 100);

  const upcomingEvents = events.filter(ev => {
    const d = new Date(ev.date);
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 90;
  }).slice(0, 3);

  const pinnedNote = notes.find(n => n.pinned);

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-xs mb-1" style={{ color: 'var(--ink-5)' }}>{now.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h1 className="font-display text-3xl font-semibold" style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}>{greeting}, Paulo.</h1>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Quick stats */}
        <div className="col-span-4">
          <Widget title="System Overview" accent="var(--gold)">
            {loading ? <Skeleton height="80px" /> : (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: FileText, label: 'Files', value: files.length, accent: 'var(--gold)', href: '/dashboard/files' },
                  { icon: Database, label: 'Datasets', value: 0, accent: 'var(--teal)', href: '/dashboard/database' },
                  { icon: StickyNote, label: 'Notes', value: notes.length, accent: 'var(--amber)', href: '/dashboard/notes' },
                ].map(s => (
                  <Link key={s.label} href={s.href} className="flex flex-col items-center p-3 border transition-all" style={{ borderColor: 'var(--line)', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = s.accent)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}>
                    <s.icon size={16} style={{ color: s.accent }} />
                    <span className="font-display text-2xl font-semibold mt-2" style={{ color: s.accent }}>{s.value}</span>
                    <span className="font-mono text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>{s.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </Widget>
        </div>

        {/* Storage */}
        <div className="col-span-4">
          <Widget title="Storage Usage" accent="var(--teal)">
            {loading ? <Skeleton height="80px" /> : (
              <div className="flex items-center gap-6">
                <ProgressRing value={storagePct} size={72} />
                <div>
                  <div className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>{storageGB.toFixed(2)} GB</div>
                  <div className="font-mono text-xs mt-1" style={{ color: 'var(--ink-4)' }}>of 5 GB used</div>
                  <div className="font-mono text-xs mt-1" style={{ color: 'var(--ink-5)' }}>{files.length} files</div>
                </div>
              </div>
            )}
          </Widget>
        </div>

        {/* Date + note */}
        <div className="col-span-4">
          <Widget title="Today" accent="var(--amber)">
            <div className="font-display text-3xl font-semibold mb-1" style={{ color: 'var(--ink)' }}>{now.getDate()}</div>
            <div className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>{now.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}</div>
            {pinnedNote && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
                <div className="font-mono text-xs mb-1" style={{ color: 'var(--amber)' }}>📌 PINNED</div>
                <div className="font-mono text-xs" style={{ color: 'var(--ink-3)' }}>{pinnedNote.title}</div>
              </div>
            )}
          </Widget>
        </div>

        {/* Recent files */}
        <div className="col-span-6">
          <Widget title="Recent Files" accent="var(--gold)">
            {loading ? <Skeleton height="160px" /> : files.length === 0 ? (
              <p className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>No files uploaded yet.</p>
            ) : (
              <div className="flex flex-col gap-1">
                {files.slice(0, 5).map(f => (
                  <div key={f._id} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: 'var(--line)' }}>
                    <FileText size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                    <span className="flex-1 font-mono text-xs truncate" style={{ color: 'var(--ink-2)' }}>{f.name}</span>
                    <span className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>{new Date(f.uploadedAt).toLocaleDateString()}</span>
                  </div>
                ))}
                <Link href="/dashboard/files" className="flex items-center gap-1 mt-2 font-mono text-xs" style={{ color: 'var(--gold)' }}>
                  View all <ArrowRight size={10} />
                </Link>
              </div>
            )}
          </Widget>
        </div>

        {/* Upcoming events */}
        <div className="col-span-6">
          <Widget title="Upcoming Events" accent="var(--amber)">
            {loading ? <Skeleton height="160px" /> : upcomingEvents.length === 0 ? (
              <p className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>No events in the next 90 days.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcomingEvents.map(ev => {
                  const d = new Date(ev.date);
                  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={ev._id} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: 'var(--line)' }}>
                      <Calendar size={14} style={{ color: 'var(--amber)', flexShrink: 0 }} />
                      <div className="flex-1">
                        <div className="font-mono text-xs" style={{ color: 'var(--ink-2)' }}>{ev.title}</div>
                        <div className="font-mono text-xs mt-0.5" style={{ color: 'var(--ink-5)' }}>{ev.person} · {ev.type}</div>
                      </div>
                      <span className="font-mono text-xs" style={{ color: diff <= 7 ? 'var(--red)' : 'var(--ink-4)' }}>
                        {diff === 0 ? 'Today!' : `${diff}d`}
                      </span>
                    </div>
                  );
                })}
                <Link href="/dashboard/family" className="flex items-center gap-1 mt-2 font-mono text-xs" style={{ color: 'var(--amber)' }}>
                  View family <ArrowRight size={10} />
                </Link>
              </div>
            )}
          </Widget>
        </div>

        {/* Pinned note */}
        {pinnedNote && (
          <div className="col-span-12">
            <Widget title="Pinned Note" accent="var(--teal)">
              <h4 className="font-display text-lg mb-2" style={{ color: 'var(--ink)' }}>{pinnedNote.title}</h4>
              <p className="font-mono text-xs leading-relaxed" style={{ color: 'var(--ink-3)', whiteSpace: 'pre-wrap' }}>
                {pinnedNote.content.slice(0, 400)}{pinnedNote.content.length > 400 ? '...' : ''}
              </p>
            </Widget>
          </div>
        )}
      </div>
    </div>
  );
}
