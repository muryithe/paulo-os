'use client';

interface SkeletonProps {
  height?: string;
  width?: string;
  className?: string;
}

export function Skeleton({ height = '1rem', width = '100%', className = '' }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ height, width, background: 'var(--bg-raised)' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(46,184,184,0.06) 50%, transparent 100%)',
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-6" style={{ border: '1px solid var(--line)', background: 'var(--bg-panel)' }}>
      <Skeleton height="1rem" width="40%" className="mb-4" />
      <Skeleton height="0.75rem" width="80%" className="mb-2" />
      <Skeleton height="0.75rem" width="60%" />
    </div>
  );
}
