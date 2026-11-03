export interface CommonFood {
  name: string;
  nameHe: string;
  proteinPer100g: number;
  defaultAmountG: number;
  emoji: string;
}

export const COMMON_FOODS: CommonFood[] = [
  { name: 'Chicken Breast', nameHe: 'חזה עוף', proteinPer100g: 31, defaultAmountG: 150, emoji: '🍗' },
  { name: 'Eggs (1 egg = 50g)', nameHe: 'ביצה', proteinPer100g: 13, defaultAmountG: 100, emoji: '🥚' },
  { name: 'Canned Tuna', nameHe: 'טונה', proteinPer100g: 26, defaultAmountG: 160, emoji: '🐟' },
  { name: 'Whey Protein (1 scoop)', nameHe: 'אבקת חלבון', proteinPer100g: 80, defaultAmountG: 30, emoji: '🥛' },
  { name: 'Cottage Cheese', nameHe: "קוטג'", proteinPer100g: 12, defaultAmountG: 200, emoji: '🫙' },
  { name: 'Greek Yogurt', nameHe: 'יוגורט יווני', proteinPer100g: 10, defaultAmountG: 200, emoji: '🥣' },
  { name: 'Salmon', nameHe: 'סלמון', proteinPer100g: 25, defaultAmountG: 150, emoji: '🐠' },
  { name: 'Turkey Breast', nameHe: 'חזה הודו', proteinPer100g: 29, defaultAmountG: 100, emoji: '🦃' },
  { name: 'Beef (lean)', nameHe: 'בקר רזה', proteinPer100g: 26, defaultAmountG: 150, emoji: '🥩' },
  { name: 'Lentils (cooked)', nameHe: 'עדשים מבושלות', proteinPer100g: 9, defaultAmountG: 200, emoji: '🫘' },
  { name: 'Chickpeas (cooked)', nameHe: 'חומוס מבושל', proteinPer100g: 8.9, defaultAmountG: 150, emoji: '🟡' },
  { name: 'Tofu', nameHe: 'טופו', proteinPer100g: 8, defaultAmountG: 200, emoji: '⬜' },
  { name: 'Milk', nameHe: 'חלב', proteinPer100g: 3.4, defaultAmountG: 250, emoji: '🧴' },
  { name: 'Peanut Butter', nameHe: 'חמאת בוטנים', proteinPer100g: 25, defaultAmountG: 30, emoji: '🥜' },
  { name: 'Edamame', nameHe: 'אדמאמה', proteinPer100g: 11, defaultAmountG: 150, emoji: '🫛' },
];
