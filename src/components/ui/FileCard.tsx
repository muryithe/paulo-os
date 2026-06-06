'use client';
import { FileText, FileCode, FileSpreadsheet, Image, File, Download, Trash2 } from 'lucide-react';
import { FileItem } from '@/types';

function FileIcon({ type }: { type: string }) {
  if (type.includes('pdf') || type.includes('word')) return <FileText size={24} style={{ color: 'var(--gold)' }} />;
  if (type.includes('sql') || type.includes('code')) return <FileCode size={24} style={{ color: 'var(--teal)' }} />;
  if (type.includes('csv') || type.includes('excel') || type.includes('spreadsheet')) return <FileSpreadsheet size={24} style={{ color: '#86efac' }} />;
  if (type.includes('image')) return <Image size={24} style={{ color: 'var(--amber)' }} />;
  return <File size={24} style={{ color: 'var(--ink-3)' }} />;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileCardProps {
  file: FileItem;
  onDelete: (id: string) => void;
  view?: 'grid' | 'list';
}

export default function FileCard({ file, onDelete, view = 'grid' }: FileCardProps) {
  if (view === 'list') {
    return (
      <div
        className="flex items-center gap-4 px-4 py-3 border-b transition-all"
        style={{ borderColor: 'var(--line)', background: 'var(--bg-panel)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-raised)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-panel)')}
      >
        <FileIcon type={file.type} />
        <span className="flex-1 font-mono text-sm" style={{ color: 'var(--ink-2)' }}>{file.name}</span>
        <span className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>{formatSize(file.size)}</span>
        <span className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>
          {new Date(file.uploadedAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <a href={file.blobUrl} download target="_blank" rel="noreferrer">
            <Download size={14} style={{ color: 'var(--teal)' }} />
          </a>
          <button onClick={() => onDelete(file._id)}>
            <Trash2 size={14} style={{ color: 'var(--red)' }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 flex flex-col gap-3 transition-all group"
      style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
    >
      <div className="flex items-start justify-between">
        <FileIcon type={file.type} />
        <span className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>
          {file.type.split('/').pop()?.toUpperCase() || 'FILE'}
        </span>
      </div>
      <div className="flex-1">
        <p className="font-mono text-sm truncate" style={{ color: 'var(--ink-2)' }}>{file.name}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>{formatSize(file.size)}</span>
        <div className="flex gap-2">
          <a href={file.blobUrl} download target="_blank" rel="noreferrer"
            className="p-1 transition-colors" style={{ color: 'var(--teal)' }}>
            <Download size={14} />
          </a>
          <button onClick={() => onDelete(file._id)} className="p-1 transition-colors" style={{ color: 'var(--red)' }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
