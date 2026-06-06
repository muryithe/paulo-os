interface ProgressRingProps {
  value: number; // 0–100
  size?: number;
  label?: string;
}

export default function ProgressRing({ value, size = 80, label }: ProgressRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="4"
        />
        {/* Active ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--teal)" strokeWidth="4"
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: 'drop-shadow(0 0 4px var(--teal))' }}
        />
        <text
          x={size / 2} y={size / 2 + 5}
          textAnchor="middle"
          fill="var(--ink)"
          fontSize="14"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="500"
        >
          {value}%
        </text>
      </svg>
      {label && <span className="font-mono text-xs" style={{ color: 'var(--ink-4)' }}>{label}</span>}
    </div>
  );
}
