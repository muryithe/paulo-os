'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Circle, CheckCircle } from 'lucide-react';
import { curriculum, Module, Part } from '@/lib/curriculum-data';

interface ModuleTreeProps {
  activeModuleId: string;
  onSelect: (moduleId: string) => void;
  completed: Set<string>;
}

export default function ModuleTree({ activeModuleId, onSelect, completed }: ModuleTreeProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggle = (partId: string) => {
    setCollapsed(prev => {
      const s = new Set(prev);
      s.has(partId) ? s.delete(partId) : s.add(partId);
      return s;
    });
  };

  const badgeColor: Record<string, string> = {
    Foundational: 'var(--gold)', Intermediate: 'var(--teal)',
    Advanced: '#f9a8d4', 'DB Objects': '#86efac',
    'AI-Assisted': 'var(--amber)', Capstone: '#a78bfa',
  };

  return (
    <nav className="flex flex-col h-full overflow-y-auto" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      <div className="flex gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--line)' }}>
        <button onClick={() => setCollapsed(new Set())} className="text-xs px-2 py-1 border" style={{ color: 'var(--ink-4)', borderColor: 'var(--line)' }}>Expand All</button>
        <button onClick={() => setCollapsed(new Set(curriculum.map(p => p.id)))} className="text-xs px-2 py-1 border" style={{ color: 'var(--ink-4)', borderColor: 'var(--line)' }}>Collapse All</button>
      </div>
      {curriculum.map((part: Part) => (
        <div key={part.id}>
          <button
            onClick={() => toggle(part.id)}
            className="w-full flex items-center gap-2 px-4 py-3 text-left transition-colors"
            style={{ background: 'var(--bg-raised)', borderBottom: '1px solid var(--line)' }}
          >
            {collapsed.has(part.id) ? <ChevronRight size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} /> : <ChevronDown size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />}
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Part {part.number}</span>
            <span className="text-xs truncate" style={{ color: 'var(--ink-3)' }}>{part.title}</span>
          </button>
          {!collapsed.has(part.id) && part.modules.map((mod: Module) => {
            const active = mod.id === activeModuleId;
            const done = completed.has(mod.id);
            return (
              <button
                key={mod.id}
                onClick={() => onSelect(mod.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all border-l-2"
                style={{
                  borderLeftColor: active ? 'var(--gold)' : 'transparent',
                  background: active ? 'var(--gold-pale)' : 'transparent',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                {done
                  ? <CheckCircle size={12} style={{ color: 'var(--teal)', flexShrink: 0 }} />
                  : <Circle size={12} style={{ color: 'var(--ink-5)', flexShrink: 0 }} />
                }
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--ink-5)' }}>{mod.number}</span>
                    <span className="text-xs truncate" style={{ color: active ? 'var(--gold)' : 'var(--ink-2)' }}>{mod.title}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px]" style={{ color: badgeColor[mod.badge] || 'var(--ink-4)' }}>{mod.badge}</span>
                    <span className="text-[10px]" style={{ color: 'var(--ink-5)' }}>· {mod.meta.duration}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
