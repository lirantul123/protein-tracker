import type { FoodEntry, MealCategory } from '../types';

interface Props {
  entries: FoodEntry[];
  onRemove: (id: string) => void;
}

const MEAL_ORDER: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snack'];
const MEAL_LABELS: Record<MealCategory, string> = {
  breakfast: '🌅 ארוחת בוקר',
  lunch: '☀️ צהריים',
  dinner: '🌙 ערב',
  snack: '🍎 חטיף',
};

export function FoodLog({ entries, onRemove }: Props) {
  if (entries.length === 0) {
    return (
      <div className="card p-8 text-center text-gray-500 animate-fade-in">
        <div className="text-5xl mb-3">🍽️</div>
        <p className="text-lg">אין רשומות עדיין</p>
        <p className="text-sm mt-1">הוסף אוכל כדי להתחיל לעקוב</p>
      </div>
    );
  }

  const byMeal: Record<MealCategory, FoodEntry[]> = {
    breakfast: [], lunch: [], dinner: [], snack: [],
  };
  entries.forEach(e => byMeal[e.category].push(e));

  return (
    <div className="space-y-4 animate-fade-in">
      {MEAL_ORDER.map(meal => {
        const items = byMeal[meal];
        if (items.length === 0) return null;
        const total = items.reduce((s, e) => s + e.proteinTotal, 0);
        return (
          <div key={meal} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-200">{MEAL_LABELS[meal]}</h3>
              <span className="text-brand-400 font-bold text-sm">{total}g</span>
            </div>
            <div className="space-y-2">
              {items.map(entry => (
                <div key={entry.id} className="flex items-center gap-3 bg-gray-800 rounded-xl px-3 py-2 group">
                  <div className="flex-1">
                    <div className="font-medium text-gray-200 text-sm">{entry.name}</div>
                    <div className="text-xs text-gray-500">{entry.amountG}g • {entry.proteinPer100g}g/100g</div>
                  </div>
                  <div className="text-brand-400 font-bold">{entry.proteinTotal}g</div>
                  <button
                    onClick={() => onRemove(entry.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-lg leading-none"
                    title="הסר"
                  >×</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
