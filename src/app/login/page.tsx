'use client';
import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) {
      router.push('/dashboard');
    } else {
      setError('Invalid credentials. Access denied.');
      formRef.current?.classList.add('shake');
      setTimeout(() => formRef.current?.classList.remove('shake'), 400);
    }
  };

  return (
    <div className="min-h-screen hex-bg flex items-center justify-center px-4">
      <div ref={formRef} className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 items-center justify-center border mb-4" style={{ borderColor: 'var(--gold-line)', background: 'var(--bg-panel)' }}>
            <span className="font-display text-3xl font-semibold" style={{ color: 'var(--gold)' }}>P</span>
          </div>
          <h1 className="font-display text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Paulo OS</h1>
          <p className="font-mono text-xs mt-1" style={{ color: 'var(--ink-4)' }}>// private_access_only</p>
        </div>

        {/* Form */}
        <div className="p-8 border" style={{ background: 'var(--bg-panel)', borderColor: 'var(--gold-line)' }}>
          <div className="mb-6">
            <label className="block font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--ink-4)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="gold-focus w-full bg-transparent px-0 py-2 border-b text-sm outline-none transition-all"
              style={{ borderColor: 'var(--line-md)', color: 'var(--ink)', fontFamily: 'JetBrains Mono, monospace' }}
              placeholder="you@domain.com"
            />
          </div>
          <div className="mb-8">
            <label className="block font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--ink-4)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="gold-focus w-full bg-transparent px-0 py-2 border-b text-sm outline-none transition-all"
              style={{ borderColor: 'var(--line-md)', color: 'var(--ink)', fontFamily: 'JetBrains Mono, monospace' }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="mb-4 px-3 py-2 font-mono text-xs" style={{ background: 'var(--red-pale)', color: 'var(--red)', border: '1px solid var(--red)' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 font-mono text-sm font-semibold tracking-widest transition-all disabled:opacity-50"
            style={{ background: loading ? 'var(--gold-line)' : 'var(--gold)', color: '#0a0f1e' }}
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER →'}
          </button>
        </div>

        <p className="text-center mt-6 font-mono text-xs" style={{ color: 'var(--ink-5)' }}>
          Single-user system. No registration available.
        </p>
      </div>
    </div>
  );
}
