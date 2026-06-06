import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function TableauPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="font-mono text-xs mb-4" style={{ color: 'var(--amber)' }}>TABLEAU · COMING SOON</div>
          <h1 className="font-display text-4xl font-semibold mb-4" style={{ color: 'var(--ink)' }}>Tableau Analytics</h1>
          <p className="mb-8" style={{ color: 'var(--ink-3)' }}>This module is under construction. Check back soon.</p>
          <Link href="/knowledge-base" className="font-mono text-xs" style={{ color: 'var(--gold)' }}>← Back to Knowledge Base</Link>
        </div>
      </div>
    </>
  );
}
