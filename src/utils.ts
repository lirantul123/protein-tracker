export function calcProtein(per100g: number, amountG: number): number {
  return Math.round((per100g * amountG) / 100 * 10) / 10;
}

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function nanoid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function getLastNDates(n: number): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export function getStatusColor(pct: number): string {
  if (pct >= 100) return '#22c55e';
  if (pct >= 70) return '#f59e0b';
  if (pct >= 40) return '#f97316';
  return '#ef4444';
}

export function getStatusLabel(pct: number): string {
  if (pct >= 100) return '🎯 יעד הושג!';
  if (pct >= 70) return '💪 כמעט שם';
  if (pct >= 40) return '⚡ בדרך';
  return '🚀 בוא נתחיל';
}
