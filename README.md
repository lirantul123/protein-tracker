# 💪 Protein Tracker

A polished, fully interactive personal protein intake tracker built for muscle building goals. Mobile-first, RTL (Hebrew) UI, zero backend — all data stored locally in your browser.

![License](https://img.shields.io/badge/license-MIT-green)
![Tech](https://img.shields.io/badge/stack-React%20%2B%20TypeScript%20%2B%20Tailwind-blue)

## Features

- **Daily Dashboard** — circular progress ring, meal breakdown, streak counter
- **Food Log** — add/remove entries by meal category (breakfast, lunch, dinner, snack)
- **Nutrition Label Calculator** — paste values from any food package → instant protein calc
- **Smart Suggestions** — "what should I eat now?" based on remaining daily target
- **Quick Add** — favorites list, custom foods, one-click common foods
- **History & Charts** — 14-day bar chart, weekly average, days-on-target
- **Copy Yesterday** — duplicate yesterday's meals with one tap
- **Editable Daily Target** — tap the target tile to change it anytime
- **Hebrew RTL** — fully right-to-left layout

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS 3 (dark theme) |
| Charts | Recharts |
| Storage | localStorage (no backend) |
| Fonts | Inter (Google Fonts) |

## Installation

```bash
git clone https://github.com/lirantul123/protein-tracker.git
cd protein-tracker
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for Production

```bash
npm run build
npm run preview   # serve the built dist locally
```

Output lands in `dist/`.

## Project Structure

```
src/
├── types.ts              # TypeScript interfaces (FoodEntry, DayLog, AppState…)
├── store.ts              # useAppStore hook — all state + localStorage persistence
├── utils.ts              # Pure calculation helpers (calcProtein, formatDate…)
├── data/
│   └── commonFoods.ts    # Built-in food database (15 common high-protein foods)
└── components/
    ├── CircularProgress.tsx   # Animated SVG ring
    ├── Dashboard.tsx          # Main home tab
    ├── FoodLog.tsx            # Today's entries grouped by meal
    ├── AddFoodModal.tsx       # Search + manual entry modal
    ├── NutritionCalculator.tsx # Label calculator
    ├── Suggestions.tsx        # Smart food recommendations
    ├── QuickAdd.tsx           # Favorites + custom foods
    └── History.tsx            # Weekly chart + 14-day log
```

## Configuration

No environment variables required. The daily protein target (default: 120g) is editable in the app.

To change the default target, edit `src/store.ts`:

```ts
const defaultState: AppState = {
  dailyTarget: 120,   // ← change this
  ...
}
```

## Running Tests

Calculation logic is exported from `src/utils.ts` for unit testing.

Core formula:
```ts
calcProtein(per100g, amountG) = round((per100g * amountG) / 100, 1)
// Example: calcProtein(10, 250) === 25
```

## Personal Profile (defaults)

| Setting | Value |
|---|---|
| Weight | 65 kg |
| Goal | Muscle hypertrophy |
| Daily target | 120g protein |
| Training | Gym + running |

## License

MIT
