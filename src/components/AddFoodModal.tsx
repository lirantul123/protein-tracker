import { useState } from 'react';
import type { MealCategory } from '../types';
import { COMMON_FOODS } from '../data/commonFoods';
import { calcProtein } from '../utils';

interface Props {
  onAdd: (entry: { name: string; proteinPer100g: number; amountG: number; category: MealCategory }) => void;
  onClose: () => void;
}

const MEALS: { value: MealCategory; label: string }[] = [
  { value: 'breakfast', label: '🌅 בוקר' },
  { value: 'lunch', label: '☀️ צהריים' },
  { value: 'dinner', label: '🌙 ערב' },
  { value: 'snack', label: '🍎 חטיף' },
];

export function AddFoodModal({ onAdd, onClose }: Props) {
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [per100, setPer100] = useState('');
  const [amount, setAmount] = useState('100');
  const [category, setCategory] = useState<MealCategory>('snack');
  const [mode, setMode] = useState<'search' | 'custom'>('search');

  const preview = per100 && amount ? calcProtein(Number(per100), Number(amount)) : null;

  const filtered = COMMON_FOODS.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.nameHe.includes(search)
  );

  const handleSelectCommon = (f: typeof COMMON_FOODS[0]) => {
    setName(f.nameHe);
    setPer100(String(f.proteinPer100g));
    setAmount(String(f.defaultAmountG));
    setMode('custom');
  };

  const handleSubmit = () => {
    const n = name.trim();
    const p = Number(per100);
    const a = Number(amount);
    if (!n || !p || !a) return;
    onAdd({ name: n, proteinPer100g: p, amountG: a, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-gray-900 border border-gray-700 rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">הוסף אוכל</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-2xl leading-none">×</button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('search')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'search' ? 'bg-brand-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            🔍 חיפוש
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'custom' ? 'bg-brand-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            ✏️ הזנה ידנית
          </button>
        </div>

        {mode === 'search' ? (
          <>
            <input
              className="input w-full mb-3"
              placeholder="חפש אוכל... (עברית או אנגלית)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filtered.map(f => (
                <button
                  key={f.name}
                  onClick={() => handleSelectCommon(f)}
                  className="w-full text-right bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-3 flex items-center gap-3 transition-colors"
                >
                  <span className="text-2xl">{f.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-200">{f.nameHe}</div>
                    <div className="text-xs text-gray-500">{f.proteinPer100g}g חלבון/100g • ברירת מחדל: {f.defaultAmountG}g</div>
                  </div>
                  <span className="text-brand-400 font-bold text-sm">
                    {calcProtein(f.proteinPer100g, f.defaultAmountG)}g
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-400 block mb-1">שם האוכל</label>
              <input className="input w-full" placeholder="למשל: חזה עוף" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-400 block mb-1">חלבון ל-100g</label>
                <input className="input w-full" type="number" placeholder="g" value={per100} onChange={e => setPer100(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">כמות (גרם)</label>
                <input className="input w-full" type="number" placeholder="g" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
            </div>
            {preview !== null && (
              <div className="bg-brand-500/10 border border-brand-500/30 rounded-xl px-4 py-3 text-center">
                <span className="text-brand-400 font-bold text-xl">{preview}g</span>
                <span className="text-gray-400 text-sm ml-2">חלבון</span>
              </div>
            )}
            <div>
              <label className="text-sm text-gray-400 block mb-2">ארוחה</label>
              <div className="grid grid-cols-2 gap-2">
                {MEALS.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setCategory(m.value)}
                    className={`py-2 rounded-xl text-sm font-medium transition-colors ${category === m.value ? 'bg-brand-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full py-3 text-base mt-2">
              הוסף לרשומה
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
