interface TagBadgeProps {
  label: string;
  color?: 'gold' | 'teal' | 'amber' | 'red';
  onRemove?: () => void;
}

export default function TagBadge({ label, color = 'teal', onRemove }: TagBadgeProps) {
  const colorMap = {
    gold: { bg: 'var(--gold-pale)', text: 'var(--gold)', border: 'var(--gold-line)' },
    teal: { bg: 'var(--teal-pale)', text: 'var(--teal)', border: 'rgba(46,184,184,0.3)' },
    amber: { bg: 'rgba(212,132,90,0.1)', text: 'var(--amber)', border: 'rgba(212,132,90,0.3)' },
    red: { bg: 'var(--red-pale)', text: 'var(--red)', border: 'rgba(224,82,82,0.3)' },
  };
  const c = colorMap[color];

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-xs"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {label}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 hover:opacity-70" style={{ color: c.text }}>×</button>
      )}
    </span>
  );
}
