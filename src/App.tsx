import { useState } from 'react';
import { useAppStore } from './store';
import { Dashboard } from './components/Dashboard';
import { FoodLog } from './components/FoodLog';
import { AddFoodModal } from './components/AddFoodModal';
import { NutritionCalculator } from './components/NutritionCalculator';
import { Suggestions } from './components/Suggestions';
import { History } from './components/History';
import { QuickAdd } from './components/QuickAdd';
import type { MealCategory } from './types';

type Tab = 'dashboard' | 'log' | 'suggest' | 'calc' | 'quick' | 'history';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'בית', icon: '🏠' },
  { id: 'log', label: 'יומן', icon: '📋' },
  { id: 'suggest', label: 'המלצות', icon: '💡' },
  { id: 'calc', label: 'חישוב', icon: '🏷️' },
  { id: 'quick', label: 'מהיר', icon: '⚡' },
  { id: 'history', label: 'היסטוריה', icon: '📊' },
];

export default function App() {
  const store = useAppStore();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showModal, setShowModal] = useState(false);

  const todayLog = store.getTodayLog();
  const consumed = todayLog.entries.reduce((s, e) => s + e.proteinTotal, 0);
  const remaining = Math.max(0, store.state.dailyTarget - consumed);

  const handleAdd = (entry: { name: string; proteinPer100g: number; amountG: number; category: MealCategory }) => {
    store.addEntry(entry);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-950" dir="rtl">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">מעקב חלבון 💪</h1>
          <p className="text-xs text-gray-500">
            {consumed}g / {store.state.dailyTarget}g היום
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
        >
          + הוסף
        </button>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-4 pb-24">
        {tab === 'dashboard' && (
          <Dashboard
            log={todayLog}
            target={store.state.dailyTarget}
            streak={store.state.streak}
            onAddFood={() => setShowModal(true)}
            onCopyYesterday={store.copyYesterdayMeals}
            onTargetEdit={store.setDailyTarget}
          />
        )}
        {tab === 'log' && (
          <FoodLog entries={todayLog.entries} onRemove={store.removeEntry} />
        )}
        {tab === 'suggest' && (
          <Suggestions remaining={remaining} onAdd={handleAdd} />
        )}
        {tab === 'calc' && (
          <NutritionCalculator onAddToLog={handleAdd} />
        )}
        {tab === 'quick' && (
          <QuickAdd
            customFoods={store.state.customFoods}
            onAdd={handleAdd}
            onAddCustom={store.addCustomFood}
            onRemoveCustom={store.removeCustomFood}
            onToggleFavorite={store.toggleFavorite}
          />
        )}
        {tab === 'history' && (
          <History logs={store.state.logs} target={store.state.dailyTarget} />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-30">
        <div className="max-w-lg mx-auto flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center py-2 pt-3 transition-colors ${
                tab === t.id ? 'text-brand-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              <span className="text-[10px] mt-1 font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Add Food Modal */}
      {showModal && <AddFoodModal onAdd={handleAdd} onClose={() => setShowModal(false)} />}
    </div>
  );
}
