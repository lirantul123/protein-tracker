import { useState, useCallback } from 'react';
import type { AppState, FoodEntry, CustomFood, DayLog } from './types';
import { calcProtein, getTodayKey, nanoid } from './utils';

const STORAGE_KEY = 'protein-tracker-v1';

const defaultState: AppState = {
  dailyTarget: 120,
  logs: {},
  customFoods: [],
  recentFoodIds: [],
  streak: 0,
  lastLogDate: '',
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(loadState);

  const update = useCallback((updater: (s: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  const getTodayLog = (): DayLog => {
    const key = getTodayKey();
    return state.logs[key] ?? { date: key, entries: [] };
  };

  const getDayLog = (date: string): DayLog => {
    return state.logs[date] ?? { date, entries: [] };
  };

  const addEntry = (entry: Omit<FoodEntry, 'id' | 'proteinTotal' | 'timestamp'>) => {
    const key = getTodayKey();
    const full: FoodEntry = {
      ...entry,
      id: nanoid(),
      proteinTotal: calcProtein(entry.proteinPer100g, entry.amountG),
      timestamp: Date.now(),
    };
    update(s => {
      const day = s.logs[key] ?? { date: key, entries: [] };
      const newLogs = { ...s.logs, [key]: { ...day, entries: [...day.entries, full] } };
      let streak = s.streak;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = yesterday.toISOString().slice(0, 10);
      if (s.lastLogDate !== key) {
        streak = s.lastLogDate === yKey ? s.streak + 1 : 1;
      }
      return { ...s, logs: newLogs, lastLogDate: key, streak };
    });
  };

  const removeEntry = (entryId: string) => {
    const key = getTodayKey();
    update(s => {
      const day = s.logs[key];
      if (!day) return s;
      return { ...s, logs: { ...s.logs, [key]: { ...day, entries: day.entries.filter(e => e.id !== entryId) } } };
    });
  };

  const setDailyTarget = (target: number) => {
    update(s => ({ ...s, dailyTarget: target }));
  };

  const addCustomFood = (food: Omit<CustomFood, 'id'>) => {
    update(s => ({ ...s, customFoods: [...s.customFoods, { ...food, id: nanoid() }] }));
  };

  const removeCustomFood = (id: string) => {
    update(s => ({ ...s, customFoods: s.customFoods.filter(f => f.id !== id) }));
  };

  const toggleFavorite = (id: string) => {
    update(s => ({
      ...s,
      customFoods: s.customFoods.map(f => f.id === id ? { ...f, isFavorite: !f.isFavorite } : f),
    }));
  };

  const copyYesterdayMeals = () => {
    const key = getTodayKey();
    const yDate = new Date();
    yDate.setDate(yDate.getDate() - 1);
    const yKey = yDate.toISOString().slice(0, 10);
    update(s => {
      const yDay = s.logs[yKey];
      if (!yDay || yDay.entries.length === 0) return s;
      const today = s.logs[key] ?? { date: key, entries: [] };
      const copied = yDay.entries.map(e => ({ ...e, id: nanoid(), timestamp: Date.now() }));
      return { ...s, logs: { ...s.logs, [key]: { ...today, entries: [...today.entries, ...copied] } } };
    });
  };

  return {
    state,
    getTodayLog,
    getDayLog,
    addEntry,
    removeEntry,
    setDailyTarget,
    addCustomFood,
    removeCustomFood,
    toggleFavorite,
    copyYesterdayMeals,
  };
}
