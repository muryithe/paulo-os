'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,15,30,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--gold-line)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold" style={{ color: 'var(--gold)' }}>
          P.OS
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/knowledge-base"
            className="font-mono text-xs uppercase tracking-widest transition-colors hover:opacity-80"
            style={{ color: 'var(--ink-3)', letterSpacing: '0.1em' }}
          >
            Knowledge Base
          </Link>
          <Link
            href="/login"
            className="font-mono text-xs uppercase tracking-widest px-4 py-2 border transition-all hover:opacity-80"
            style={{
              color: 'var(--gold)',
              borderColor: 'var(--gold-line)',
            }}
          >
            Private OS →
          </Link>
        </div>
      </div>
    </nav>
  );
}
