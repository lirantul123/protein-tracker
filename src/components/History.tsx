import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import type { AppState } from '../types';
import { getLastNDates, formatDate, getStatusColor } from '../utils';

interface Props {
  logs: AppState['logs'];
  target: number;
}

export function History({ logs, target }: Props) {
  const dates = getLastNDates(14);
  const data = dates.map(date => {
    const log = logs[date];
    const protein = log ? log.entries.reduce((s, e) => s + e.proteinTotal, 0) : 0;
    return { date, label: formatDate(date), protein };
  });

  const last7 = data.slice(-7);
  const avg = Math.round(last7.reduce((s, d) => s + d.protein, 0) / 7);
  const daysHit = last7.filter(d => d.protein >= target).length;
  const best = Math.max(0, ...last7.map(d => d.protein));

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    const val = payload[0].value;
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm shadow-xl">
        <div className="text-gray-400">{label}</div>
        <div className="text-brand-400 font-bold">{val}g חלבון</div>
        {val >= target && <div className="text-green-400 text-xs">✓ יעד הושג</div>}
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-3 gap-3">
        <MiniStat label="ממוצע שבועי" value={`${avg}g`} />
        <MiniStat label="ימים ביעד" value={`${daysHit}/7`} color={daysHit >= 5 ? '#22c55e' : '#f59e0b'} />
        <MiniStat label="שיא" value={`${best}g`} color="#818cf8" />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">14 ימים אחרונים</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 10 }} interval={1} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <ReferenceLine y={target} stroke="#22c55e" strokeDasharray="4 4" strokeWidth={1.5} />
            <Bar dataKey="protein" radius={[4, 4, 0, 0]}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={getStatusColor(target > 0 ? (entry.protein / target) * 100 : 0)} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <div className="w-8 border-t border-dashed border-brand-500" />
          <span>יעד: {target}g</span>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">7 ימים אחרונים</h3>
        <div className="space-y-2">
          {[...last7].reverse().map(d => {
            const pct = target > 0 ? (d.protein / target) * 100 : 0;
            const color = getStatusColor(pct);
            return (
              <div key={d.date} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-24">{d.label}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
                </div>
                <span className="text-xs font-medium w-12 text-right" style={{ color }}>
                  {d.protein > 0 ? `${d.protein}g` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color = '#e5e7eb' }: { label: string; value: string; color?: string }) {
  return (
    <div className="card p-3 text-center">
      <div className="text-lg font-bold" style={{ color }}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
