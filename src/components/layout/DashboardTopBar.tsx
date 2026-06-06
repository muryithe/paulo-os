'use client';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard / Home',
  '/dashboard/files': 'Dashboard / Files',
  '/dashboard/database': 'Dashboard / Database',
  '/dashboard/family': 'Dashboard / Family',
  '/dashboard/notes': 'Dashboard / Notes',
  '/dashboard/settings': 'Dashboard / Settings',
};

export default function DashboardTopBar() {
  const pathname = usePathname();
  const breadcrumb = breadcrumbMap[pathname] || 'Dashboard';

  return (
    <header
      className="h-14 flex items-center justify-between px-6 border-b fixed top-0 right-0 z-30 transition-all"
      style={{
        left: '72px',
        background: 'rgba(13,21,37,0.95)',
        backdropFilter: 'blur(12px)',
        borderColor: 'var(--gold-line)',
      }}
    >
      <span className="font-mono text-xs" style={{ color: 'var(--ink-4)', letterSpacing: '0.08em' }}>
        {breadcrumb.split('/').map((part, i, arr) => (
          <span key={i}>
            <span style={{ color: i === arr.length - 1 ? 'var(--gold)' : 'var(--ink-4)' }}>
              {part.trim()}
            </span>
            {i < arr.length - 1 && <span style={{ color: 'var(--ink-5)' }}> / </span>}
          </span>
        ))}
      </span>
      <div className="flex items-center gap-4">
        <button
          className="relative p-2 transition-colors rounded-sm"
          style={{ color: 'var(--ink-3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}
        >
          <Bell size={16} />
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-display font-semibold text-sm"
          style={{ background: 'var(--gold-pale)', color: 'var(--gold)', border: '1px solid var(--gold-line)' }}
        >
          P
        </div>
      </div>
    </header>
  );
}
