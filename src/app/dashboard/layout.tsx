'use client';
import { SessionProvider } from 'next-auth/react';
import DashboardNav from '@/components/layout/DashboardNav';
import DashboardTopBar from '@/components/layout/DashboardTopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen" style={{ background: 'var(--bg-base)' }}>
        <DashboardNav />
        <div className="flex-1 flex flex-col" style={{ marginLeft: '72px' }}>
          <DashboardTopBar />
          <main className="flex-1 mt-14 overflow-auto p-8">
            {/* Mobile guard */}
            <div className="lg:hidden flex items-center justify-center h-64">
              <div className="text-center">
                <p className="font-mono text-sm mb-2" style={{ color: 'var(--gold)' }}>Desktop Required</p>
                <p className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>Paulo OS dashboard requires a screen width of 1024px or more.</p>
              </div>
            </div>
            <div className="hidden lg:block">{children}</div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
