'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="border-t py-12 px-8"
      style={{ borderColor: 'var(--gold-line)', background: 'var(--bg-panel)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg" style={{ color: 'var(--gold)' }}>Paulo OS</span>
          <span className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-8 font-mono text-xs uppercase tracking-widest">
          <Link href="#" className="transition-colors" style={{ color: 'var(--ink-3)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}>
            LinkedIn
          </Link>
          <Link href="#" className="transition-colors" style={{ color: 'var(--ink-3)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}>
            GitHub
          </Link>
          <Link href="mailto:mutukupaul76@gmail.com" className="transition-colors" style={{ color: 'var(--ink-3)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}>
            Email
          </Link>
        </div>
      </div>
    </footer>
  );
}
