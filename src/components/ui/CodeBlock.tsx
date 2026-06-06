'use client';
import { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeBlock({ code, language = 'sql', title }: CodeBlockProps) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const highlight = async () => {
      const hljs = (await import('highlight.js/lib/core')).default;
      const sql = (await import('highlight.js/lib/languages/sql')).default;
      const python = (await import('highlight.js/lib/languages/python')).default;
      if (!hljs.getLanguage('sql')) hljs.registerLanguage('sql', sql);
      if (!hljs.getLanguage('python')) hljs.registerLanguage('python', python);
      if (ref.current) {
        ref.current.removeAttribute('data-highlighted');
        hljs.highlightElement(ref.current);
      }
    };
    highlight();
  }, [code, language]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4" style={{ border: '1px solid var(--teal)', borderLeft: '3px solid var(--teal)' }}>
      {title && (
        <div
          className="flex items-center justify-between px-4 py-2 border-b"
          style={{ background: 'var(--bg-raised)', borderColor: 'var(--line-md)' }}
        >
          <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--teal)' }}>
            {language} {title && `· ${title}`}
          </span>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 font-mono text-xs transition-colors px-2 py-1"
            style={{ color: copied ? 'var(--teal)' : 'var(--ink-4)' }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      {!title && (
        <button
          onClick={copy}
          className="absolute right-3 top-3 font-mono text-xs transition-colors px-2 py-1 border z-10"
          style={{ color: 'var(--ink-4)', borderColor: 'var(--line)' }}
        />
      )}
      <div className="relative" style={{ background: '#06080f' }}>
        {!title && (
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={copy}
              className="flex items-center gap-1 font-mono text-xs px-2 py-1 border transition-colors"
              style={{ color: copied ? 'var(--teal)' : 'var(--ink-4)', borderColor: 'var(--line)' }}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
        <pre className="overflow-x-auto p-4 text-sm leading-6">
          <code ref={ref} className={`language-${language}`} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
