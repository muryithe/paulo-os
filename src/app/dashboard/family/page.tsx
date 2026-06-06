'use client';
import { useEffect, useState, useCallback } from 'react';
import { FamilyPhotoItem, FamilyEventItem } from '@/types';
import Modal from '@/components/ui/Modal';
import UploadDropzone from '@/components/ui/UploadDropzone';
import Toast from '@/components/ui/Toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { Heart, Calendar, Plus, Camera } from 'lucide-react';

export default function FamilyPage() {
  const [photos, setPhotos] = useState<FamilyPhotoItem[]>([]);
  const [events, setEvents] = useState<FamilyEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addPhoto, setAddPhoto] = useState(false);
  const [addEvent, setAddEvent] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [caption, setCaption] = useState('');
  const [dateTaken, setDateTaken] = useState('');
  const [people, setPeople] = useState<string[]>([]);
  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evType, setEvType] = useState<'birthday' | 'anniversary' | 'milestone'>('birthday');
  const [evPerson, setEvPerson] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const [p, e] = await Promise.all([
      fetch('/api/family/photos').then(r => r.json()).catch(() => []),
      fetch('/api/family/events').then(r => r.json()).catch(() => []),
    ]);
    setPhotos(Array.isArray(p) ? p : []);
    setEvents(Array.isArray(e) ? e : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handlePhotoUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'family');
      const blobRes = await fetch('/api/upload', { method: 'POST', body: form });
      const blob = await blobRes.json();
      await fetch('/api/family/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blobUrl: blob.url, caption, dateTaken: dateTaken || new Date(), people }),
      });
      setToast({ msg: 'Photo added', type: 'success' });
      setAddPhoto(false); setCaption(''); setDateTaken(''); setPeople([]);
      load();
    } catch {
      setToast({ msg: 'Upload failed', type: 'error' });
    }
    setUploading(false);
  };

  const saveEvent = async () => {
    if (!evTitle || !evDate) return;
    await fetch('/api/family/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: evTitle, date: evDate, type: evType, person: evPerson, recurring: true }),
    });
    setToast({ msg: 'Event saved', type: 'success' });
    setAddEvent(false); setEvTitle(''); setEvDate(''); setEvPerson('');
    load();
  };

  const now = new Date();
  const upcoming = events.filter(ev => {
    const d = new Date(ev.date);
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 90;
  });

  const inputStyle = { borderColor: 'var(--line-md)', color: 'var(--ink)', fontFamily: 'JetBrains Mono, monospace', background: 'transparent' };
  const labelStyle = { color: 'var(--ink-4)', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.1em' };

  return (
    <div className="max-w-7xl" style={{ '--amber': '#d4845a' } as React.CSSProperties}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Family</h1>
          <p className="font-mono text-xs mt-1" style={{ color: 'var(--ink-4)' }}>Memories & milestones</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setAddEvent(true)} className="flex items-center gap-2 px-4 py-2 border font-mono text-xs" style={{ color: '#d4845a', borderColor: '#d4845a' }}>
            <Calendar size={14} /> Add Event
          </button>
          <button onClick={() => setAddPhoto(true)} className="flex items-center gap-2 px-4 py-2 font-mono text-xs" style={{ background: '#d4845a', color: '#fff' }}>
            <Camera size={14} /> Add Memory
          </button>
        </div>
      </div>

      {/* Profile cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[{ name: 'Spouse', role: 'Wife', icon: '💍', color: '#d4845a' }, { name: 'Son', role: 'Son', icon: '⭐', color: '#a78bfa' }].map(p => (
          <div key={p.name} className="p-6 border flex items-center gap-4" style={{ background: 'var(--bg-panel)', borderColor: 'var(--line)', borderLeft: `2px solid ${p.color}` }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--bg-raised)' }}>{p.icon}</div>
            <div>
              <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>{p.name}</h3>
              <p className="font-mono text-xs" style={{ color: p.color }}>{p.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <div className="mb-8 p-6 border" style={{ background: 'var(--bg-panel)', borderColor: '#d4845a', borderLeft: '2px solid #d4845a' }}>
          <h3 className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: '#d4845a' }}>Upcoming in 90 days</h3>
          <div className="flex flex-col gap-3">
            {upcoming.map(ev => {
              const diff = Math.ceil((new Date(ev.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={ev._id} className="flex items-center gap-4">
                  <Heart size={14} style={{ color: '#d4845a', flexShrink: 0 }} />
                  <span className="font-mono text-sm flex-1" style={{ color: 'var(--ink-2)' }}>{ev.title}</span>
                  <span className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>{ev.person} · {ev.type}</span>
                  <span className="font-mono text-xs" style={{ color: diff <= 7 ? 'var(--red)' : '#d4845a' }}>{diff === 0 ? 'Today!' : `in ${diff}d`}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Photo gallery */}
      <h3 className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: '#d4845a' }}>Photo Gallery</h3>
      {loading ? (
        <div className="grid grid-cols-3 gap-3">{Array(6).fill(0).map((_, i) => <Skeleton key={i} height="200px" />)}</div>
      ) : photos.length === 0 ? (
        <div className="flex items-center justify-center h-40 border" style={{ borderColor: 'var(--line)' }}>
          <p className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>No photos yet. Add a memory above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {photos.map(photo => (
            <div key={photo._id} className="relative overflow-hidden border group" style={{ borderColor: 'var(--line)', aspectRatio: '1' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.blobUrl} alt={photo.caption || 'Family photo'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                {photo.caption && <p className="font-mono text-xs" style={{ color: '#fff' }}>{photo.caption}</p>}
                {photo.dateTaken && <p className="font-mono text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{new Date(photo.dateTaken).toLocaleDateString()}</p>}
                <div className="flex gap-1 mt-1 flex-wrap">
                  {photo.people.map(p => <span key={p} className="font-mono text-xs px-1" style={{ background: '#d4845a', color: '#fff' }}>{p}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      <Modal open={addPhoto} onClose={() => setAddPhoto(false)} title="Add Memory">
        <div className="flex flex-col gap-4">
          <UploadDropzone onFiles={handlePhotoUpload} accept="image/*" multiple={false} label="Drop photo here" />
          <div>
            <label style={labelStyle} className="block mb-1">Caption</label>
            <input value={caption} onChange={e => setCaption(e.target.value)} className="w-full bg-transparent border-b py-1.5 text-sm outline-none gold-focus" style={inputStyle} placeholder="A wonderful moment..." />
          </div>
          <div>
            <label style={labelStyle} className="block mb-1">Date Taken</label>
            <input type="date" value={dateTaken} onChange={e => setDateTaken(e.target.value)} className="w-full bg-transparent border-b py-1.5 text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle} className="block mb-2">Who's in the photo?</label>
            <div className="flex gap-2 flex-wrap">
              {['paulo', 'wife', 'son', 'all'].map(p => (
                <button key={p} onClick={() => setPeople(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                  className="font-mono text-xs px-3 py-1 border" style={{ color: people.includes(p) ? '#d4845a' : 'var(--ink-4)', borderColor: people.includes(p) ? '#d4845a' : 'var(--line)' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          {uploading && <p className="font-mono text-xs" style={{ color: 'var(--teal)' }}>Uploading...</p>}
        </div>
      </Modal>

      {/* Add Event Modal */}
      <Modal open={addEvent} onClose={() => setAddEvent(false)} title="Add Event">
        <div className="flex flex-col gap-4">
          <div>
            <label style={labelStyle} className="block mb-1">Event Title</label>
            <input value={evTitle} onChange={e => setEvTitle(e.target.value)} className="w-full bg-transparent border-b py-1.5 text-sm outline-none gold-focus" style={inputStyle} placeholder="e.g. Sarah's Birthday" />
          </div>
          <div>
            <label style={labelStyle} className="block mb-1">Date</label>
            <input type="date" value={evDate} onChange={e => setEvDate(e.target.value)} className="w-full bg-transparent border-b py-1.5 text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle} className="block mb-1">Type</label>
            <select value={evType} onChange={e => setEvType(e.target.value as 'birthday' | 'anniversary' | 'milestone')} className="w-full bg-transparent border-b py-1.5 text-sm outline-none" style={inputStyle}>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="milestone">Milestone</option>
            </select>
          </div>
          <div>
            <label style={labelStyle} className="block mb-1">Person</label>
            <input value={evPerson} onChange={e => setEvPerson(e.target.value)} className="w-full bg-transparent border-b py-1.5 text-sm outline-none gold-focus" style={inputStyle} placeholder="Wife / Son / Family" />
          </div>
          <button onClick={saveEvent} className="w-full py-3 font-mono text-sm" style={{ background: '#d4845a', color: '#fff' }}>Save Event</button>
        </div>
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
