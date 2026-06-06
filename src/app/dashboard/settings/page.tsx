'use client';
import { useState } from 'react';
import Toast from '@/components/ui/Toast';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [name, setName] = useState('Paulo Mutuku');
  const [email, setEmail] = useState('mutukupaul76@gmail.com');

  const inputStyle = {
    borderColor: 'var(--line-md)',
    color: 'var(--ink)',
    fontFamily: 'JetBrains Mono, monospace',
    background: 'transparent',
  };
  const labelStyle = {
    color: 'var(--ink-4)',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    display: 'block',
    marginBottom: '6px',
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold mb-8" style={{ color: 'var(--ink)' }}>Settings</h1>

      {/* Profile */}
      <section className="p-6 border mb-4" style={{ background: 'var(--bg-panel)', borderColor: 'var(--line)', borderLeft: '2px solid var(--gold)' }}>
        <h2 className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'var(--gold)' }}>Profile</h2>
        <div className="flex flex-col gap-5">
          <div>
            <label style={labelStyle}>Display Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent border-b py-2 text-sm outline-none gold-focus" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-b py-2 text-sm outline-none gold-focus" style={inputStyle} />
          </div>
          <button onClick={() => setToast({ msg: 'Profile saved', type: 'success' })} className="flex items-center gap-2 px-4 py-2 w-fit font-mono text-sm" style={{ background: 'var(--gold)', color: '#0a0f1e' }}>
            <Save size={14} /> Save Profile
          </button>
        </div>
      </section>

      {/* System */}
      <section className="p-6 border mb-4" style={{ background: 'var(--bg-panel)', borderColor: 'var(--line)', borderLeft: '2px solid var(--teal)' }}>
        <h2 className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'var(--teal)' }}>System Info</h2>
        <div className="flex flex-col gap-3">
          {[
            ['Version', 'Paulo OS v2024.1'],
            ['Stack', 'Next.js 14 · MongoDB · Vercel Blob'],
            ['Auth', 'NextAuth.js · JWT Session'],
            ['Storage', 'Vercel Blob (5 GB limit)'],
            ['Database', 'MongoDB Atlas'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center gap-4">
              <span className="font-mono text-xs w-24 flex-shrink-0" style={{ color: 'var(--ink-4)' }}>{k}</span>
              <span className="font-mono text-xs" style={{ color: 'var(--ink-2)' }}>{v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="p-6 border" style={{ background: 'var(--bg-panel)', borderColor: 'var(--line)', borderLeft: '2px solid var(--red)' }}>
        <h2 className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: 'var(--red)' }}>Danger Zone</h2>
        <p className="font-mono text-xs mb-4" style={{ color: 'var(--ink-3)' }}>
          This is a single-user private system. There is no account deletion — this OS is yours.
        </p>
        <button
          onClick={() => setToast({ msg: 'Nothing was deleted. This is your OS.', type: 'error' })}
          className="font-mono text-xs px-4 py-2 border" style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>
          Reset All Data
        </button>
      </section>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
