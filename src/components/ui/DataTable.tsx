'use client';
import { useState } from 'react';

interface DataTableProps {
  columns: string[];
  rows: Record<string, unknown>[];
  pageSize?: number;
}

export default function DataTable({ columns, rows, pageSize = 10 }: DataTableProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(rows.length / pageSize);
  const visible = rows.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="overflow-x-auto" style={{ border: '1px solid var(--line-md)' }}>
      <table className="w-full text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--bg-raised)', borderBottom: '1px solid var(--gold-line)' }}>
            {columns.map(col => (
              <th
                key={col}
                className="px-4 py-2 text-left uppercase tracking-widest text-xs"
                style={{ color: 'var(--gold)', borderRight: '1px solid var(--line)' }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((row, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? 'var(--bg-base)' : 'var(--bg-panel)',
                borderBottom: '1px solid var(--line)',
              }}
              onMouseEnter={e => (e.currentTarget.style.outline = '1px solid var(--teal)')}
              onMouseLeave={e => (e.currentTarget.style.outline = 'none')}
            >
              {columns.map(col => (
                <td key={col} className="px-4 py-2 text-xs" style={{ color: 'var(--ink-2)', borderRight: '1px solid var(--line)' }}>
                  {String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2 border-t"
        style={{ background: 'var(--bg-raised)', borderColor: 'var(--line-md)' }}
      >
        <span className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>
          {rows.length} rows · Page {page + 1} / {Math.max(totalPages, 1)}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="font-mono text-xs px-3 py-1 border transition-colors disabled:opacity-30"
            style={{ color: 'var(--ink-3)', borderColor: 'var(--line)' }}
          >
            ← Prev
          </button>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="font-mono text-xs px-3 py-1 border transition-colors disabled:opacity-30"
            style={{ color: 'var(--ink-3)', borderColor: 'var(--line)' }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
