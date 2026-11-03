import { useState } from 'react';
import { calcProtein } from '../utils';
import type { MealCategory } from '../types';

interface Props {
  onAddToLog: (entry: { name: string; proteinPer100g: number; amountG: number; category: MealCategory }) => void;
}

export function NutritionCalculator({ onAddToLog }: Props) {
  const [per100, setPer100] = useState('');
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [added, setAdded] = useState(false);

  const result = per100 && amount ? calcProtein(Number(per100), Number(amount)) : null;
  const pct = result !== null && Number(per100) > 0 ? Math.round((result / 120) * 100) : null;

  const handleAdd = () => {
    if (result === null || !name.trim()) return;
    onAddToLog({ name: name.trim(), proteinPer100g: Number(per100), amountG: Number(amount), category: 'snack' });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card p-5">
        <h2 className="text-lg font-bold mb-1">🏷️ מחשבון תווית תזונה</h2>
        <p className="text-sm text-gray-500 mb-4">הזן נתונים מהאריזה וחשב כמה חלבון קיבלת</p>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-400 block mb-1">שם המוצר (אופציונלי)</label>
            <input className="input w-full" placeholder="למשל: יוגורט 0%" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-400 block mb-1">חלבון ל-100g (מהתווית)</label>
              <input
                className="input w-full" type="number" min="0" max="100" placeholder="גרם"
                value={per100} onChange={e => setPer100(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">כמות שאכלת</label>
              <input
                className="input w-full" type="number" min="0" placeholder="גרם"
                value={amount} onChange={e => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {result !== null && (
        <div className="card p-5 animate-slide-up">
          <div className="text-center mb-4">
            <div className="text-6xl font-bold text-brand-400">{result}g</div>
            <div className="text-gray-400 mt-1">חלבון</div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>0g</span>
              <span>120g יעד יומי</span>
            </div>
            <div className="bg-gray-800 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-brand-500 transition-all duration-700"
                style={{ width: `${Math.min((result / 120) * 100, 100)}%` }}
              />
            </div>
            {pct !== null && <div className="text-center text-sm text-gray-400 mt-1">{pct}% מהיעד היומי</div>}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm mb-4">
            <div className="bg-gray-800 rounded-xl p-2">
              <div className="text-gray-400">ל-100g</div>
              <div className="font-bold text-gray-200">{per100}g</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-2">
              <div className="text-gray-400">כמות</div>
              <div className="font-bold text-gray-200">{amount}g</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-2">
              <div className="text-gray-400">סה"כ</div>
              <div className="font-bold text-brand-400">{result}g</div>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${added ? 'bg-green-600 text-white' : name.trim() ? 'btn-primary' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
          >
            {added ? '✓ נוסף לרשומה' : '+ הוסף לרשומת היום'}
          </button>
          {!name.trim() && <p className="text-xs text-gray-600 text-center mt-1">הזן שם מוצר כדי להוסיף</p>}
        </div>
      )}

      <div className="card p-4 text-sm text-gray-500">
        <div className="font-medium text-gray-400 mb-2">📐 הנוסחה</div>
        <div className="font-mono bg-gray-800 rounded-lg p-3 text-gray-300 text-center">
          (חלבון ל-100g ÷ 100) × כמות = חלבון כולל
        </div>
        <p className="mt-2 text-xs">לדוגמה: מוצר עם 10g חלבון ל-100g, ואכלת 250g → 25g חלבון</p>
      </div>
    </div>
  );
}
