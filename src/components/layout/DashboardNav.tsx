'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import {
  LayoutDashboard, FolderOpen, Database, BookOpen,
  Heart, FileText, Settings, LogOut, ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/dashboard/files', icon: FolderOpen, label: 'Files' },
  { href: '/dashboard/database', icon: Database, label: 'Database' },
  { href: '/knowledge-base', icon: BookOpen, label: 'Knowledge Base' },
  { href: '/dashboard/family', icon: Heart, label: 'Family' },
  { href: '/dashboard/notes', icon: FileText, label: 'Notes' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-all duration-300 border-r"
      style={{
        width: expanded ? '240px' : '72px',
        background: 'var(--bg-panel)',
        borderColor: 'var(--gold-line)',
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b" style={{ borderColor: 'var(--gold-line)' }}>
        <span className="font-display text-xl font-semibold" style={{ color: 'var(--gold)' }}>
          {expanded ? 'Paulo OS' : 'P'}
        </span>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center border transition-colors"
        style={{ background: 'var(--bg-panel)', borderColor: 'var(--gold-line)', color: 'var(--gold)' }}
      >
        <ChevronRight size={12} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Nav Items */}
      <nav className="flex-1 py-6 flex flex-col gap-1 overflow-hidden">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 mx-2 px-3 py-3 transition-all rounded-sm group"
              style={{
                color: active ? 'var(--gold)' : 'var(--ink-3)',
                background: active ? 'var(--gold-pale)' : 'transparent',
                borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--ink)';
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--ink-3)';
              }}
            >
              <Icon size={18} className="flex-shrink-0" />
              {expanded && (
                <span className="font-mono text-xs uppercase tracking-widest whitespace-nowrap">{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t pb-4 pt-4" style={{ borderColor: 'var(--gold-line)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 mx-2 px-3 py-3 w-[calc(100%-16px)] transition-colors rounded-sm"
          style={{ color: 'var(--ink-4)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-4)')}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {expanded && <span className="font-mono text-xs uppercase tracking-widest">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
