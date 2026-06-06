'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3500 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      className="fixed bottom-6 right-6 z-[9998] flex items-center gap-3 px-5 py-3 transition-all duration-300"
      style={{
        background: 'rgba(13,21,37,0.95)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isSuccess ? 'var(--teal)' : 'var(--red)'}`,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        opacity: visible ? 1 : 0,
        minWidth: '280px',
      }}
    >
      {isSuccess
        ? <CheckCircle size={16} style={{ color: 'var(--teal)', flexShrink: 0 }} />
        : <XCircle size={16} style={{ color: 'var(--red)', flexShrink: 0 }} />
      }
      <span className="font-mono text-sm flex-1" style={{ color: 'var(--ink-2)' }}>{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} style={{ color: 'var(--ink-4)' }}>
        <X size={14} />
      </button>
    </div>
  );
}
