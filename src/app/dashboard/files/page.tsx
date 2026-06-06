'use client';
import { useEffect, useState, useCallback } from 'react';
import { FileItem, FolderName } from '@/types';
import FileCard from '@/components/ui/FileCard';
import UploadDropzone from '@/components/ui/UploadDropzone';
import Toast from '@/components/ui/Toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { LayoutGrid, List, Folder } from 'lucide-react';

const folders: { key: FolderName; label: string }[] = [
  { key: 'all', label: 'All Files' },
  { key: 'work', label: 'Work' },
  { key: 'knowledge-base', label: 'Knowledge Base' },
  { key: 'cv-docs', label: 'CV & Docs' },
  { key: 'datasets', label: 'Datasets' },
  { key: 'family', label: 'Family' },
  { key: 'archive', label: 'Archive' },
];

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folder, setFolder] = useState<FolderName>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');

  const loadFiles = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/files?folder=${folder}`);
    const data = await res.json();
    setFiles(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [folder]);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const handleUpload = async (fileList: File[]) => {
    setUploading(true);
    for (const file of fileList) {
      try {
        const form = new FormData();
        form.append('file', file);
        form.append('folder', folder === 'all' ? 'general' : folder);
        const res = await fetch('/api/upload', { method: 'POST', body: form });
        const blob = await res.json();
        await fetch('/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, blobUrl: blob.url, type: file.type, size: file.size, folder: folder === 'all' ? 'general' : folder }),
        });
        setToast({ msg: `${file.name} uploaded`, type: 'success' });
      } catch {
        setToast({ msg: `Failed to upload ${file.name}`, type: 'error' });
      }
    }
    setUploading(false);
    loadFiles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return;
    await fetch(`/api/files/${id}`, { method: 'DELETE' });
    setFiles(prev => prev.filter(f => f._id !== id));
    setToast({ msg: 'File deleted', type: 'success' });
  };

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex gap-6 max-w-7xl h-[calc(100vh-120px)]">
      {/* Folder sidebar */}
      <aside className="w-52 flex-shrink-0">
        <div className="flex flex-col gap-1">
          {folders.map(f => (
            <button key={f.key} onClick={() => setFolder(f.key)}
              className="flex items-center gap-2 px-3 py-2 text-left transition-all border-l-2 font-mono text-xs"
              style={{
                borderLeftColor: folder === f.key ? 'var(--gold)' : 'transparent',
                background: folder === f.key ? 'var(--gold-pale)' : 'transparent',
                color: folder === f.key ? 'var(--gold)' : 'var(--ink-3)',
              }}>
              <Folder size={13} />
              {f.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <UploadDropzone onFiles={handleUpload} />
        {uploading && <p className="font-mono text-xs" style={{ color: 'var(--teal)' }}>Uploading...</p>}

        {/* Controls */}
        <div className="flex items-center gap-4">
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-b px-0 py-1.5 font-mono text-sm outline-none"
            style={{ borderColor: 'var(--line-md)', color: 'var(--ink)' }}
            placeholder="Search files..." />
          <button onClick={() => setView('grid')} className="p-2" style={{ color: view === 'grid' ? 'var(--gold)' : 'var(--ink-4)' }}><LayoutGrid size={16} /></button>
          <button onClick={() => setView('list')} className="p-2" style={{ color: view === 'list' ? 'var(--gold)' : 'var(--ink-4)' }}><List size={16} /></button>
        </div>

        {/* Files */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="grid grid-cols-3 gap-3">{Array(6).fill(0).map((_, i) => <Skeleton key={i} height="140px" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>No files found. Upload your first file above.</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map(f => <FileCard key={f._id} file={f} onDelete={handleDelete} view="grid" />)}
            </div>
          ) : (
            <div className="border" style={{ borderColor: 'var(--line)' }}>
              {filtered.map(f => <FileCard key={f._id} file={f} onDelete={handleDelete} view="list" />)}
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
