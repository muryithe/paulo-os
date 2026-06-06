'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import ModuleTree from '@/components/knowledge-base/ModuleTree';
import CodeBlock from '@/components/ui/CodeBlock';
import { getAllModules, getModuleById, curriculum } from '@/lib/curriculum-data';
import { ChevronDown, ChevronRight, BookOpen, HelpCircle, Wrench } from 'lucide-react';

const badgeColors: Record<string, string> = {
  Foundational: 'var(--gold)', Intermediate: 'var(--teal)',
  Advanced: '#f9a8d4', 'DB Objects': '#86efac',
  'AI-Assisted': 'var(--amber)', Capstone: '#a78bfa',
};

export default function SQLPage() {
  const allModules = getAllModules();
  const [activeId, setActiveId] = useState(allModules[0].id);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['lectures']));
  const [openLectures, setOpenLectures] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showSolution, setShowSolution] = useState(false);

  const mod = getModuleById(activeId)!;
  const part = curriculum.find(p => p.modules.some(m => m.id === activeId))!;

  const toggleSection = (s: string) => {
    setOpenSections(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });
  };
  const toggleLecture = (id: string) => {
    setOpenLectures(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const markDone = () => {
    setCompleted(prev => { const n = new Set(prev); n.has(activeId) ? n.delete(activeId) : n.add(activeId); return n; });
    const idx = allModules.findIndex(m => m.id === activeId);
    if (idx < allModules.length - 1) setActiveId(allModules[idx + 1].id);
  };

  // Build TOC from lectures
  const toc = mod.lectures.map(l => ({ id: l.id, label: l.title }));

  return (
    <>
      <Navbar />
      <div className="flex h-screen pt-16" style={{ background: 'var(--bg-base)' }}>
        {/* Left sidebar */}
        <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 border-r overflow-hidden" style={{ borderColor: 'var(--gold-line)', background: 'var(--bg-panel)' }}>
          <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--line)' }}>
            <Link href="/knowledge-base" className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>← Knowledge Base</Link>
            <h2 className="font-display text-lg font-semibold mt-2" style={{ color: 'var(--gold)' }}>SQL Mastery</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1" style={{ background: 'var(--bg-raised)' }}>
                <div className="h-full" style={{ background: 'var(--teal)', width: `${(completed.size / allModules.length) * 100}%`, transition: 'width 0.3s' }} />
              </div>
              <span className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>{completed.size}/{allModules.length}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ModuleTree activeModuleId={activeId} onSelect={id => { setActiveId(id); setOpenSections(new Set(['lectures'])); setOpenLectures(new Set()); setShowSolution(false); }} completed={completed} />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-8">
            {/* Module header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>Part {part.number} · Module {mod.number}</span>
                <span className="font-mono text-xs px-2 py-0.5 border" style={{ color: badgeColors[mod.badge], borderColor: badgeColors[mod.badge], opacity: 0.8 }}>{mod.badge}</span>
              </div>
              <h1 className="font-display text-3xl font-semibold mb-2" style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}>{mod.title}</h1>
              <div className="flex items-center gap-6 mb-4">
                <span className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>{mod.meta.lectureCount} lectures · {mod.meta.duration}</span>
              </div>
              <div className="h-px" style={{ background: 'var(--gold-line)' }} />
            </div>

            {/* Lectures */}
            <section className="mb-6">
              <button onClick={() => toggleSection('lectures')} className="w-full flex items-center justify-between py-4 border-b" style={{ borderColor: 'var(--line)' }}>
                <div className="flex items-center gap-3">
                  <BookOpen size={16} style={{ color: 'var(--gold)' }} />
                  <span className="font-mono text-sm font-semibold" style={{ color: 'var(--ink)' }}>Lectures</span>
                  <span className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>{mod.meta.lectureCount} lessons</span>
                </div>
                {openSections.has('lectures') ? <ChevronDown size={14} style={{ color: 'var(--ink-4)' }} /> : <ChevronRight size={14} style={{ color: 'var(--ink-4)' }} />}
              </button>

              {openSections.has('lectures') && (
                <div className="py-2">
                  {mod.lectures.map((lec, i) => (
                    <div key={lec.id}>
                      <button
                        onClick={() => toggleLecture(lec.id)}
                        className="w-full flex items-center gap-4 px-4 py-3 transition-colors text-left"
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-raised)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span className="font-mono text-xs w-6" style={{ color: 'var(--ink-5)' }}>{String(i + 1).padStart(2, '0')}</span>
                        <span className="flex-1 text-sm" style={{ color: 'var(--ink-2)' }}>{lec.title}</span>
                        <span className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>{lec.duration}</span>
                        {openLectures.has(lec.id) ? <ChevronDown size={12} style={{ color: 'var(--ink-4)' }} /> : <ChevronRight size={12} style={{ color: 'var(--ink-4)' }} />}
                      </button>
                      {openLectures.has(lec.id) && (
                        <div className="px-4 pb-4 ml-10">
                          <p className="text-sm mb-4" style={{ color: 'var(--ink-3)', lineHeight: '1.7' }}>{lec.description}</p>
                          {lec.codeExamples?.map(ex => (
                            <div key={ex.title}>
                              <p className="font-mono text-xs mb-2" style={{ color: 'var(--teal)' }}>{ex.title}</p>
                              <CodeBlock code={ex.code} language="sql" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Quiz */}
            <section className="mb-6">
              <button onClick={() => toggleSection('quiz')} className="w-full flex items-center justify-between py-4 border-b" style={{ borderColor: 'var(--line)' }}>
                <div className="flex items-center gap-3">
                  <HelpCircle size={16} style={{ color: 'var(--teal)' }} />
                  <span className="font-mono text-sm font-semibold" style={{ color: 'var(--ink)' }}>Quiz</span>
                  <span className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>{mod.quiz.length} questions</span>
                </div>
                {openSections.has('quiz') ? <ChevronDown size={14} style={{ color: 'var(--ink-4)' }} /> : <ChevronRight size={14} style={{ color: 'var(--ink-4)' }} />}
              </button>
              {openSections.has('quiz') && (
                <div className="py-4 flex flex-col gap-6">
                  {mod.quiz.map((q, qi) => {
                    const selected = quizAnswers[q.id];
                    const answered = selected !== undefined;
                    return (
                      <div key={q.id} className="p-4" style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)' }}>
                        <p className="font-mono text-sm mb-4" style={{ color: 'var(--ink-2)' }}>{qi + 1}. {q.question}</p>
                        <div className="flex flex-col gap-2">
                          {q.options.map((opt, oi) => {
                            const isCorrect = oi === q.answer;
                            const isSelected = selected === oi;
                            let bg = 'transparent', border = 'var(--line)', color = 'var(--ink-3)';
                            if (answered) {
                              if (isCorrect) { bg = 'var(--teal-pale)'; border = 'var(--teal)'; color = 'var(--teal)'; }
                              else if (isSelected) { bg = 'var(--red-pale)'; border = 'var(--red)'; color = 'var(--red)'; }
                            }
                            return (
                              <button key={oi} disabled={answered}
                                onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: oi }))}
                                className="text-left px-3 py-2 border font-mono text-xs transition-all disabled:cursor-default"
                                style={{ background: bg, borderColor: border, color }}>
                                {String.fromCharCode(65 + oi)}. {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Exercise */}
            <section className="mb-8">
              <button onClick={() => toggleSection('exercise')} className="w-full flex items-center justify-between py-4 border-b" style={{ borderColor: 'var(--line)' }}>
                <div className="flex items-center gap-3">
                  <Wrench size={16} style={{ color: 'var(--amber)' }} />
                  <span className="font-mono text-sm font-semibold" style={{ color: 'var(--ink)' }}>Exercise</span>
                </div>
                {openSections.has('exercise') ? <ChevronDown size={14} style={{ color: 'var(--ink-4)' }} /> : <ChevronRight size={14} style={{ color: 'var(--ink-4)' }} />}
              </button>
              {openSections.has('exercise') && (
                <div className="py-4">
                  <div className="p-4 mb-4" style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', borderLeft: '3px solid var(--amber)' }}>
                    <p className="font-mono text-xs mb-2" style={{ color: 'var(--amber)' }}>TASK</p>
                    <p className="text-sm" style={{ color: 'var(--ink-2)', lineHeight: '1.7' }}>{mod.exercise.task}</p>
                  </div>
                  <div className="p-4 mb-4" style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)' }}>
                    <p className="font-mono text-xs mb-2" style={{ color: 'var(--ink-4)' }}>DATASET</p>
                    <p className="font-mono text-xs" style={{ color: 'var(--ink-3)' }}>{mod.exercise.dataset}</p>
                  </div>
                  <p className="font-mono text-xs mb-2" style={{ color: 'var(--teal)' }}>STARTER CODE</p>
                  <CodeBlock code={mod.exercise.starterCode} language="sql" />
                  <button onClick={() => setShowSolution(!showSolution)} className="font-mono text-xs mt-4 px-4 py-2 border transition-colors" style={{ color: 'var(--gold)', borderColor: 'var(--gold-line)' }}>
                    {showSolution ? 'Hide' : 'Show'} Solution
                  </button>
                  {showSolution && (
                    <div className="mt-4">
                      <p className="font-mono text-xs mb-2" style={{ color: 'var(--gold)' }}>SOLUTION</p>
                      <CodeBlock code={mod.exercise.solutionCode} language="sql" />
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Mark complete */}
            <div className="flex items-center justify-between pt-6" style={{ borderTop: '1px solid var(--gold-line)' }}>
              <button onClick={markDone}
                className="font-mono text-sm px-6 py-3 transition-all"
                style={{ background: completed.has(activeId) ? 'var(--teal-pale)' : 'var(--gold)', color: completed.has(activeId) ? 'var(--teal)' : '#0a0f1e', border: completed.has(activeId) ? '1px solid var(--teal)' : 'none' }}>
                {completed.has(activeId) ? '✓ Completed' : 'Mark Complete & Next →'}
              </button>
            </div>
          </div>
        </main>

        {/* Right TOC */}
        <aside className="hidden xl:block w-56 flex-shrink-0 border-l overflow-y-auto py-6 px-4" style={{ borderColor: 'var(--line)', background: 'var(--bg-panel)' }}>
          <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--ink-5)' }}>In this module</p>
          <div className="flex flex-col gap-2">
            {toc.map(item => (
              <a key={item.id} href={`#${item.id}`} className="font-mono text-xs leading-relaxed transition-colors" style={{ color: 'var(--ink-4)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-4)')}>
                {item.label}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
