import { useState } from 'react';
import type { CustomFood, MealCategory } from '../types';
import { calcProtein } from '../utils';
import { COMMON_FOODS } from '../data/commonFoods';

interface Props {
  customFoods: CustomFood[];
  onAdd: (entry: { name: string; proteinPer100g: number; amountG: number; category: MealCategory }) => void;
  onAddCustom: (food: Omit<CustomFood, 'id'>) => void;
  onRemoveCustom: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function QuickAdd({ customFoods, onAdd, onAddCustom, onRemoveCustom, onToggleFavorite }: Props) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPer100, setNewPer100] = useState('');
  const [newDefault, setNewDefault] = useState('100');

  const favorites = customFoods.filter(f => f.isFavorite);
  const others = customFoods.filter(f => !f.isFavorite);

  const handleCreate = () => {
    if (!newName.trim() || !Number(newPer100)) return;
    onAddCustom({ name: newName.trim(), proteinPer100g: Number(newPer100), defaultAmountG: Number(newDefault) || 100, isFavorite: false });
    setNewName(''); setNewPer100(''); setNewDefault('100');
    setCreating(false);
  };

  const FoodRow = ({ food }: { food: CustomFood }) => (
    <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-3 py-2 group">
      <button onClick={() => onToggleFavorite(food.id)} className="text-lg">
        {food.isFavorite ? '⭐' : '☆'}
      </button>
      <div className="flex-1">
        <div className="font-medium text-gray-200 text-sm">{food.name}</div>
        <div className="text-xs text-gray-500">{food.proteinPer100g}g/100g</div>
      </div>
      <span className="text-brand-400 font-medium text-sm">
        {calcProtein(food.proteinPer100g, food.defaultAmountG)}g
      </span>
      <button
        onClick={() => onAdd({ name: food.name, proteinPer100g: food.proteinPer100g, amountG: food.defaultAmountG, category: 'snack' })}
        className="text-xs bg-brand-600 hover:bg-brand-700 text-white px-2 py-1 rounded-lg transition-colors"
      >+ הוסף</button>
      <button
        onClick={() => onRemoveCustom(food.id)}
        className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-lg leading-none"
      >×</button>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {favorites.length > 0 && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">⭐ מועדפים</h3>
          <div className="space-y-2">{favorites.map(f => <FoodRow key={f.id} food={f} />)}</div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">🥗 האוכל שלי</h3>
          <button onClick={() => setCreating(!creating)} className="text-xs btn-ghost px-3 py-1">
            {creating ? 'ביטול' : '+ צור חדש'}
          </button>
        </div>

        {creating && (
          <div className="bg-gray-800 rounded-xl p-4 mb-3 space-y-3">
            <input className="input w-full" placeholder="שם האוכל" value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
            <div className="grid grid-cols-2 gap-3">
              <input className="input w-full" type="number" placeholder="חלבון ל-100g" value={newPer100} onChange={e => setNewPer100(e.target.value)} />
              <input className="input w-full" type="number" placeholder="כמות ברירת מחדל" value={newDefault} onChange={e => setNewDefault(e.target.value)} />
            </div>
            <button onClick={handleCreate} className="btn-primary w-full py-2">שמור</button>
          </div>
        )}

        {others.length === 0 && !creating && (
          <p className="text-gray-500 text-sm text-center py-4">
            צור מאכלים מותאמים אישית לגישה מהירה
          </p>
        )}
        <div className="space-y-2">{others.map(f => <FoodRow key={f.id} food={f} />)}</div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">⚡ הוספה מהירה</h3>
        <div className="grid grid-cols-2 gap-2">
          {COMMON_FOODS.slice(0, 8).map(f => (
            <button
              key={f.name}
              onClick={() => onAdd({ name: f.nameHe, proteinPer100g: f.proteinPer100g, amountG: f.defaultAmountG, category: 'snack' })}
              className="bg-gray-800 hover:bg-gray-700 rounded-xl p-3 text-right transition-colors"
            >
              <div className="text-xl mb-1">{f.emoji}</div>
              <div className="text-sm font-medium text-gray-200 truncate">{f.nameHe}</div>
              <div className="text-xs text-brand-400 font-bold">{calcProtein(f.proteinPer100g, f.defaultAmountG)}g</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
