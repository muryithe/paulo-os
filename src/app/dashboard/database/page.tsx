'use client';
import { useEffect, useState, useCallback } from 'react';
import { DatasetItem } from '@/types';
import Modal from '@/components/ui/Modal';
import DataTable from '@/components/ui/DataTable';
import UploadDropzone from '@/components/ui/UploadDropzone';
import TagBadge from '@/components/ui/TagBadge';
import Toast from '@/components/ui/Toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { Database, Trash2, Download, Eye } from 'lucide-react';

export default function DatabasePage() {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<DatasetItem | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [tagFilter, setTagFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/datasets');
    const data = await res.json();
    setDatasets(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1, 51).map(line => {
      const vals = line.split(',');
      return Object.fromEntries(headers.map((h, i) => [h, vals[i]?.trim().replace(/"/g, '') ?? '']));
    });
    return { headers, rows, rowCount: lines.length - 1 };
  };

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    try {
      const text = await file.text();
      const { headers, rows, rowCount } = parseCSV(text);
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'datasets');
      const blobRes = await fetch('/api/upload', { method: 'POST', body: form });
      const blob = await blobRes.json();
      await fetch('/api/datasets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name.replace(/\.[^.]+$/, ''),
          blobUrl: blob.url,
          rowCount,
          colCount: headers.length,
          columns: headers.map(h => ({ name: h, type: 'string' })),
          preview: rows,
          tags: [],
        }),
      });
      setToast({ msg: `${file.name} uploaded (${rowCount} rows)`, type: 'success' });
      load();
    } catch {
      setToast({ msg: 'Upload failed', type: 'error' });
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this dataset?')) return;
    await fetch(`/api/datasets/${id}`, { method: 'DELETE' });
    setDatasets(prev => prev.filter(d => d._id !== id));
    setToast({ msg: 'Dataset deleted', type: 'success' });
  };

  const allTags = [...new Set(datasets.flatMap(d => d.tags))];
  const filtered = tagFilter ? datasets.filter(d => d.tags.includes(tagFilter)) : datasets;

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Dataset Library</h1>
        <div className="flex gap-2">
          {allTags.map(tag => (
            <button key={tag} onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}>
              <TagBadge label={tag} color={tagFilter === tag ? 'gold' : 'teal'} />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <UploadDropzone onFiles={handleUpload} accept=".csv,.xlsx" multiple={false} label="Drop CSV or XLSX dataset here" />
        {uploading && <p className="font-mono text-xs mt-2" style={{ color: 'var(--teal)' }}>Parsing and uploading...</p>}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <Skeleton key={i} height="180px" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center h-48 border" style={{ borderColor: 'var(--line)' }}>
          <p className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>No datasets yet. Upload a CSV to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(ds => (
            <div key={ds._id} className="p-6 border transition-all" style={{ background: 'var(--bg-panel)', borderColor: 'var(--line)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--teal)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}>
              <div className="flex items-start justify-between mb-3">
                <Database size={20} style={{ color: 'var(--teal)' }} />
                <div className="flex gap-2">
                  <button onClick={() => setPreview(ds)} style={{ color: 'var(--teal)' }}><Eye size={14} /></button>
                  <a href={ds.blobUrl} download target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}><Download size={14} /></a>
                  <button onClick={() => handleDelete(ds._id)} style={{ color: 'var(--red)' }}><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="font-display text-lg font-semibold mb-1" style={{ color: 'var(--ink)' }}>{ds.name}</h3>
              {ds.description && <p className="font-mono text-xs mb-3" style={{ color: 'var(--ink-3)' }}>{ds.description}</p>}
              <div className="flex gap-4 mb-3">
                <div><div className="font-display text-lg font-semibold" style={{ color: 'var(--teal)' }}>{ds.rowCount.toLocaleString()}</div><div className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>rows</div></div>
                <div><div className="font-display text-lg font-semibold" style={{ color: 'var(--gold)' }}>{ds.colCount}</div><div className="font-mono text-xs" style={{ color: 'var(--ink-5)' }}>columns</div></div>
              </div>
              <div className="flex flex-wrap gap-1">
                {ds.tags.map(t => <TagBadge key={t} label={t} color="teal" />)}
              </div>
              <p className="font-mono text-xs mt-3" style={{ color: 'var(--ink-5)' }}>{new Date(ds.uploadedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <Modal open={true} onClose={() => setPreview(null)} title={`Preview: ${preview.name}`} width="900px">
          <div className="mb-4">
            <p className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>
              {preview.rowCount} rows · {preview.colCount} columns — showing first 50 rows
            </p>
          </div>
          <DataTable
            columns={preview.columns.map(c => c.name)}
            rows={preview.preview || []}
          />
        </Modal>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
