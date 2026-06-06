'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const skills = ['SQL','Python','Tableau','IFRS 17','IAS 19','Loss Triangles','Chain-Ladder','Reserving','MongoDB','dbt','Pandas','NumPy','Matplotlib','Scikit-learn','R','Excel','Power BI'];

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const words = ['ACTUARY.', 'DATA_SCIENTIST.', 'BUILDER.'];
    let wi = 0, ci = 0, deleting = false;
    el.textContent = '';
    const tick = () => {
      const word = words[wi];
      if (!deleting) {
        el.textContent = word.slice(0, ci + 1);
        ci++;
        if (ci === word.length) { deleting = true; setTimeout(tick, 1800); return; }
      } else {
        el.textContent = word.slice(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      setTimeout(tick, deleting ? 60 : 110);
    };
    tick();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="min-h-screen hex-bg flex items-center pt-16 px-8 md:px-20 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(46,184,184,0.04) 0%, transparent 70%)' }} />
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px" style={{ background: 'var(--gold)' }} />
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--gold)' }}>System Online · v2024.1</span>
              </div>
              <h1 className="font-display font-semibold leading-none mb-2" style={{ fontSize: 'clamp(72px,12vw,160px)', color: 'var(--ink)', letterSpacing: '-0.03em' }}>
                PAULO
              </h1>
              <div className="font-mono text-lg mb-8" style={{ color: 'var(--teal)', minHeight: '2rem' }}>
                // <span ref={titleRef} />
                <span className="animate-pulse">_</span>
              </div>
              <div className="gold-rule-left mb-8">
                <p className="text-lg mb-2" style={{ color: 'var(--ink-2)' }}>
                  Fellow of the Society of Actuaries · Data Scientist
                </p>
                <p style={{ color: 'var(--ink-3)', lineHeight: '1.7', maxWidth: '520px' }}>
                  Bridging the gap between mathematical precision and computational scale. Building systems that turn uncertainty into navigable architecture.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/knowledge-base" className="font-mono text-sm px-6 py-3 transition-all" style={{ background: 'var(--gold)', color: '#0a0f1e', fontWeight: 600 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-lt)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold)')}>
                  View Knowledge Base →
                </Link>
                <a href="/cv.pdf" download className="font-mono text-sm px-6 py-3 border transition-all" style={{ color: 'var(--ink-2)', borderColor: 'var(--line-md)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line-md)')}>
                  Download CV
                </a>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-2 h-2 rounded-full status-pulse" style={{ background: 'var(--teal)' }} />
                <span className="font-mono text-xs" style={{ color: 'var(--teal)' }}>Open to opportunities</span>
              </div>
            </div>

            {/* Profile Card */}
            <div className="lg:col-span-5 fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="glass-panel p-8 teal-rule-left relative">
                <div className="absolute top-4 right-4 font-mono text-xs px-3 py-1 border" style={{ color: 'var(--ink-5)', borderColor: 'var(--line)' }}>FSA · CERA</div>
                <div className="w-24 h-24 rounded-full border-2 mb-6 overflow-hidden" style={{ borderColor: 'var(--gold-line)' }}>
                  <div className="w-full h-full flex items-center justify-center font-display text-4xl font-semibold" style={{ background: 'var(--bg-raised)', color: 'var(--gold)' }}>P</div>
                </div>
                <h2 className="font-display text-2xl font-semibold mb-1" style={{ color: 'var(--ink)' }}>Paulo Mutuku</h2>
                <p className="font-mono text-xs mb-6" style={{ color: 'var(--ink-4)' }}>ACTUARY · DATA SCIENTIST · NAIROBI, KE</p>
                <div className="grid grid-cols-3 gap-4 mb-6 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
                  {[['8+', 'Yrs Experience'], ['30', 'SQL Modules'], ['3', 'Certifications']].map(([v, l]) => (
                    <div key={l} className="text-center">
                      <div className="font-display text-2xl font-semibold" style={{ color: 'var(--gold)' }}>{v}</div>
                      <div className="font-mono text-xs mt-1" style={{ color: 'var(--ink-4)' }}>{l}</div>
                    </div>
                  ))}
                </div>
                <Link href="/login" className="block w-full text-center font-mono text-xs py-3 border transition-all" style={{ color: 'var(--teal)', borderColor: 'var(--teal)', opacity: 0.7 }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}>
                  PRIVATE OS →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Ticker */}
        <div className="overflow-hidden py-3 border-y" style={{ background: 'var(--bg-panel)', borderColor: 'var(--line)' }}>
          <div className="flex whitespace-nowrap">
            <div className="ticker-content flex gap-10 pr-10">
              {[...skills, ...skills].map((s, i) => (
                <span key={i} className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--ink-4)' }}>{s} <span style={{ color: 'var(--gold)', opacity: 0.4 }}>·</span></span>
              ))}
            </div>
          </div>
        </div>

        {/* KB Preview */}
        <section className="py-24 px-8 md:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-px" style={{ background: 'var(--gold)' }} />
              <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Knowledge Base</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'SQL Mastery', desc: '30 modules from SELECT fundamentals to advanced window functions, CTEs, and IFRS 17 data pipelines.', stat: '30 Modules · 25+ hrs', href: '/knowledge-base/sql', accent: 'var(--gold)', tag: 'ADVANCED' },
                { title: 'Python for Actuaries', desc: 'Pandas, NumPy, Matplotlib, and Scikit-learn applied to reserving, pricing, and experience studies.', stat: '24 Modules · 20 hrs', href: '/knowledge-base/python', accent: 'var(--teal)', tag: 'COMING SOON' },
                { title: 'Tableau Analytics', desc: 'Dashboard design, LOD expressions, and executive reporting for actuarial data visualisation.', stat: '18 Modules · 15 hrs', href: '/knowledge-base/tableau', accent: 'var(--amber)', tag: 'COMING SOON' },
              ].map(card => (
                <div key={card.title} className="p-8 border transition-all group" style={{ background: 'var(--bg-panel)', borderColor: 'var(--line)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = card.accent)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}>
                  <div className="font-mono text-xs mb-4 px-2 py-1 inline-block" style={{ color: card.accent, border: `1px solid ${card.accent}`, opacity: 0.8 }}>{card.tag}</div>
                  <h3 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--ink)' }}>{card.title}</h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--ink-3)', lineHeight: '1.7' }}>{card.desc}</p>
                  <div className="font-mono text-xs mb-6" style={{ color: 'var(--ink-4)' }}>{card.stat}</div>
                  <Link href={card.href} className="font-mono text-xs transition-colors" style={{ color: card.accent }}>Open Module →</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-24 px-8 md:px-20" style={{ background: 'var(--bg-panel)', borderTop: '1px solid var(--line)' }}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px" style={{ background: 'var(--gold)' }} />
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--gold)' }}>About</span>
              </div>
              <h2 className="font-display text-4xl font-semibold mb-6" style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}>Precision meets computation.</h2>
              <p className="mb-4" style={{ color: 'var(--ink-3)', lineHeight: '1.8' }}>
                I work at the intersection of actuarial science and data engineering — designing models that quantify risk with the rigour of regulation and the scalability of modern infrastructure.
              </p>
              <p style={{ color: 'var(--ink-3)', lineHeight: '1.8' }}>
                From IFRS 17 data marts to machine learning-assisted pricing, I build systems that give insurers and pension funds a clear view of their obligations.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px" style={{ background: 'var(--teal)' }} />
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--teal)' }}>Timeline</span>
              </div>
              <div className="flex flex-col gap-6">
                {[
                  { year: '2016', label: 'BSc Actuarial Science', sub: 'University of Nairobi' },
                  { year: '2018', label: 'Associate — Society of Actuaries', sub: 'ASA Designation' },
                  { year: '2020', label: 'Data Science Specialisation', sub: 'Coursera · Johns Hopkins' },
                  { year: '2022', label: 'Fellow — Society of Actuaries', sub: 'FSA · CERA Designation' },
                  { year: '2024', label: 'Building Paulo OS', sub: 'Personal knowledge system' },
                ].map(item => (
                  <div key={item.year} className="flex gap-6">
                    <div className="font-mono text-xs pt-1 w-12 flex-shrink-0" style={{ color: 'var(--gold)' }}>{item.year}</div>
                    <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: '1.5rem' }}>
                      <div className="font-mono text-sm" style={{ color: 'var(--ink-2)' }}>{item.label}</div>
                      <div className="font-mono text-xs mt-1" style={{ color: 'var(--ink-4)' }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-24 px-8 md:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-px" style={{ background: 'var(--gold)' }} />
              <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Contact</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Email', value: 'mutukupaul76@gmail.com', href: 'mailto:mutukupaul76@gmail.com', accent: 'var(--gold)' },
                { label: 'LinkedIn', value: '/in/paulo-mutuku', href: '#', accent: 'var(--teal)' },
                { label: 'GitHub', value: 'github.com/paulo', href: '#', accent: 'var(--amber)' },
              ].map(c => (
                <a key={c.label} href={c.href} className="p-6 border block transition-all" style={{ background: 'var(--bg-panel)', borderColor: 'var(--line)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = c.accent)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}>
                  <div className="font-mono text-xs mb-3" style={{ color: c.accent }}>{c.label}</div>
                  <div className="font-mono text-sm" style={{ color: 'var(--ink-2)' }}>{c.value}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
