'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function KnowledgeBasePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24 px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px" style={{ background: 'var(--gold)' }} />
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Knowledge Base</span>
          </div>
          <h1 className="font-display text-5xl font-semibold mb-4" style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}>Actuarial Knowledge System</h1>
          <p className="mb-16 max-w-2xl" style={{ color: 'var(--ink-3)', lineHeight: '1.8' }}>
            A structured curriculum covering the technical toolkit of the modern actuary — from SQL data engineering to Python modelling and Tableau visualisation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                code: '01', title: 'SQL Mastery', status: 'LIVE', accent: 'var(--gold)',
                desc: '30 modules across 6 parts — from SELECT fundamentals to advanced window functions, CTEs, stored procedures, and IFRS 17 pipeline design.',
                stats: [['30', 'Modules'], ['25+', 'Hours'], ['6', 'Parts']],
                href: '/knowledge-base/sql',
              },
              {
                code: '02', title: 'Python for Actuaries', status: 'COMING SOON', accent: 'var(--teal)',
                desc: 'Pandas for data wrangling, NumPy for numerical methods, Scikit-learn for predictive modelling, and Matplotlib for actuarial visualisation.',
                stats: [['24', 'Modules'], ['20', 'Hours'], ['5', 'Parts']],
                href: '/knowledge-base/python',
              },
              {
                code: '03', title: 'Tableau Analytics', status: 'COMING SOON', accent: 'var(--amber)',
                desc: 'Dashboard design, Level of Detail expressions, executive reporting templates, and real-time actuarial monitoring dashboards.',
                stats: [['18', 'Modules'], ['15', 'Hours'], ['4', 'Parts']],
                href: '/knowledge-base/tableau',
              },
            ].map(card => (
              <div key={card.code} className="p-8 border flex flex-col" style={{ background: 'var(--bg-panel)', borderColor: 'var(--line)' }}>
                <div className="flex items-start justify-between mb-6">
                  <span className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>{card.code} /</span>
                  <span className="font-mono text-xs px-2 py-0.5 border" style={{ color: card.accent, borderColor: card.accent, opacity: 0.8 }}>{card.status}</span>
                </div>
                <h2 className="font-display text-2xl font-semibold mb-4" style={{ color: 'var(--ink)' }}>{card.title}</h2>
                <p className="text-sm mb-8 flex-1" style={{ color: 'var(--ink-3)', lineHeight: '1.7' }}>{card.desc}</p>
                <div className="grid grid-cols-3 gap-2 mb-6 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
                  {card.stats.map(([v, l]) => (
                    <div key={l}>
                      <div className="font-display text-xl font-semibold" style={{ color: card.accent }}>{v}</div>
                      <div className="font-mono text-xs mt-0.5" style={{ color: 'var(--ink-4)' }}>{l}</div>
                    </div>
                  ))}
                </div>
                <Link href={card.href} className="font-mono text-xs transition-colors" style={{ color: card.accent }}>
                  Open {card.status === 'LIVE' ? 'Module' : '(Preview)'} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
