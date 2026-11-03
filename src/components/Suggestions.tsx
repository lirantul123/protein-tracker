import type { MealCategory } from '../types';
import { calcProtein } from '../utils';
import { COMMON_FOODS } from '../data/commonFoods';

interface Props {
  remaining: number;
  onAdd: (entry: { name: string; proteinPer100g: number; amountG: number; category: MealCategory }) => void;
}

export function Suggestions({ remaining, onAdd }: Props) {
  if (remaining <= 0) {
    return (
      <div className="card p-6 text-center animate-fade-in">
        <div className="text-5xl mb-3">🎯</div>
        <h3 className="text-xl font-bold text-brand-400">יעד הושג!</h3>
        <p className="text-gray-400 mt-1">השגת את יעד החלבון היומי שלך</p>
      </div>
    );
  }

  const scored = COMMON_FOODS.map(f => {
    const protein = calcProtein(f.proteinPer100g, f.defaultAmountG);
    const score = protein <= remaining ? protein / remaining : remaining / protein;
    return { ...f, protein, score };
  }).sort((a, b) => b.score - a.score).slice(0, 5);

  const afterAdding = (protein: number) => Math.max(0, remaining - protein);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card p-4">
        <h2 className="text-lg font-bold mb-1">🤔 מה לאכול עכשיו?</h2>
        <p className="text-sm text-gray-500">נותרו <span className="text-brand-400 font-bold">{remaining}g</span> חלבון להיום</p>
      </div>

      <div className="space-y-3">
        {scored.map(f => {
          const after = afterAdding(f.protein);
          const isIdeal = f.protein <= remaining && f.protein >= remaining * 0.6;
          return (
            <div key={f.name} className={`card p-4 ${isIdeal ? 'border-brand-500/40' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{f.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-200">{f.nameHe}</div>
                  <div className="text-xs text-gray-500">{f.defaultAmountG}g • {f.protein}g חלבון</div>
                  <div className="text-xs mt-1">
                    {after === 0
                      ? <span className="text-brand-400">✓ יסגור את היעד!</span>
                      : <span className="text-gray-500">נותר: {after}g</span>
                    }
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-brand-400 font-bold text-lg">{f.protein}g</div>
                  {isIdeal && <div className="text-xs text-brand-500 font-medium">מומלץ ⭐</div>}
                  <button
                    onClick={() => onAdd({ name: f.nameHe, proteinPer100g: f.proteinPer100g, amountG: f.defaultAmountG, category: 'snack' })}
                    className="mt-2 text-xs bg-brand-600 hover:bg-brand-700 text-white px-3 py-1 rounded-lg transition-colors"
                  >
                    + הוסף
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div className="bg-gray-800 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-brand-500 transition-all duration-700"
                    style={{ width: `${Math.min((f.protein / (remaining + f.protein)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
