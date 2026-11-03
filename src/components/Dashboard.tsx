import { CircularProgress } from './CircularProgress';
import { getStatusColor, getStatusLabel } from '../utils';
import type { DayLog } from '../types';

interface Props {
  log: DayLog;
  target: number;
  streak: number;
  onAddFood: () => void;
  onCopyYesterday: () => void;
  onTargetEdit: (t: number) => void;
}

const MEAL_LABELS: Record<string, string> = {
  breakfast: '🌅 ארוחת בוקר',
  lunch: '☀️ ארוחת צהריים',
  dinner: '🌙 ארוחת ערב',
  snack: '🍎 חטיף',
};

export function Dashboard({ log, target, streak, onAddFood, onCopyYesterday, onTargetEdit }: Props) {
  const consumed = log.entries.reduce((s, e) => s + e.proteinTotal, 0);
  const remaining = Math.max(0, target - consumed);
  const pct = target > 0 ? Math.round((consumed / target) * 100) : 0;
  const color = getStatusColor(pct);

  const byMeal: Record<string, number> = {};
  log.entries.forEach(e => {
    byMeal[e.category] = (byMeal[e.category] ?? 0) + e.proteinTotal;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card p-4 flex items-center justify-between">
        <span className="text-lg font-semibold">{getStatusLabel(pct)}</span>
        {streak > 0 && (
          <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
            🔥 {streak} ימים רצופים
          </span>
        )}
      </div>

      <div className="card p-6 flex flex-col items-center gap-4">
        <CircularProgress pct={pct} consumed={consumed} target={target} color={color} />

        <div className="grid grid-cols-3 w-full gap-3 mt-2">
          <StatTile label="נאכל" value={`${consumed}g`} color={color} />
          <StatTile label="נותר" value={`${remaining}g`} color="#6b7280" />
          <StatTile
            label="יעד"
            value={`${target}g`}
            color="#6366f1"
            editable
            onEdit={() => {
              const v = prompt('יעד חלבון יומי (גרם):', String(target));
              const n = Number(v);
              if (v && n > 0) onTargetEdit(n);
            }}
          />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">פילוח ארוחות</h3>
        <div className="space-y-2">
          {Object.entries(MEAL_LABELS).map(([key, label]) => {
            const val = byMeal[key] ?? 0;
            const pctMeal = target > 0 ? (val / target) * 100 : 0;
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-sm w-36 text-gray-300">{label}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(pctMeal, 100)}%`, backgroundColor: color }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{val}g</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={onAddFood} className="btn-primary py-3 text-base">
          + הוסף אוכל
        </button>
        <button onClick={onCopyYesterday} className="btn-ghost py-3 text-base">
          📋 העתק אתמול
        </button>
      </div>
    </div>
  );
}

function StatTile({ label, value, color, editable, onEdit }: {
  label: string; value: string; color: string; editable?: boolean; onEdit?: () => void;
}) {
  return (
    <div
      className={`bg-gray-800 rounded-xl p-3 text-center ${editable ? 'cursor-pointer hover:bg-gray-700 transition-colors' : ''}`}
      onClick={editable ? onEdit : undefined}
    >
      <div className="text-xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}{editable && ' ✏️'}</div>
    </div>
  );
}
