export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodEntry {
  id: string;
  name: string;
  proteinPer100g: number;
  amountG: number;
  proteinTotal: number;
  category: MealCategory;
  timestamp: number;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  entries: FoodEntry[];
}

export interface CustomFood {
  id: string;
  name: string;
  proteinPer100g: number;
  defaultAmountG: number;
  isFavorite: boolean;
}

export interface AppState {
  dailyTarget: number;
  logs: Record<string, DayLog>;
  customFoods: CustomFood[];
  recentFoodIds: string[];
  streak: number;
  lastLogDate: string;
}
