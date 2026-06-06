'use client';
import { useRef, useState, useCallback } from 'react';
import { Upload, File } from 'lucide-react';

interface UploadDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
}

export default function UploadDropzone({ onFiles, accept, multiple = true, label }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  }, [onFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFiles(files);
    e.target.value = '';
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center p-10 cursor-pointer transition-all"
      style={{
        border: `2px dashed ${dragging ? 'var(--teal)' : 'var(--line-md)'}`,
        background: dragging ? 'var(--teal-pale)' : 'transparent',
        minHeight: '140px',
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
      <Upload size={28} style={{ color: dragging ? 'var(--teal)' : 'var(--ink-4)' }} />
      <p className="mt-3 font-mono text-sm" style={{ color: 'var(--ink-3)' }}>
        {label || 'Drop files here or click to browse'}
      </p>
      <p className="mt-1 font-mono text-xs" style={{ color: 'var(--ink-5)' }}>
        {accept ? accept.replace(/,/g, ' · ') : 'Any file type'}
      </p>
    </div>
  );
}
