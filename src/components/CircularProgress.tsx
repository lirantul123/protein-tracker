interface Props {
  pct: number;
  consumed: number;
  target: number;
  color: string;
}

export function CircularProgress({ pct, consumed, target, color }: Props) {
  const radius = 80;
  const stroke = 10;
  const norm = radius - stroke / 2;
  const circ = 2 * Math.PI * norm;
  const offset = circ - Math.min(pct / 100, 1) * circ;
  const clampedPct = Math.min(pct, 100);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      <svg width={200} height={200} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={100} cy={100} r={norm}
          fill="none" stroke="#1f2937" strokeWidth={stroke}
        />
        <circle
          cx={100} cy={100} r={norm}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        {pct > 100 && (
          <circle
            cx={100} cy={100} r={norm}
            fill="none" stroke="#86efac" strokeWidth={stroke / 2}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - ((pct - 100) / 100) * circ}
            style={{ transition: 'stroke-dashoffset 1s ease-out', opacity: 0.5 }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold" style={{ color }}>{consumed}g</span>
        <span className="text-sm text-gray-400 mt-1">מתוך {target}g</span>
        <span className="text-lg font-semibold text-gray-300 mt-1">{clampedPct}%</span>
      </div>
    </div>
  );
}
