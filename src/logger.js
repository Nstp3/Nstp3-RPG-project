// ============================================================
// logger.js — лог активности по дням
// Используется для построения line-chart
// ============================================================

import { state, saveState } from './state.js';

// Найти или создать запись лога для сегодняшней даты
export function getTodayLog() {
  if (!Array.isArray(state.logs)) state.logs = [];
  const today = new Date().toDateString();
  let entry = state.logs.find(l => l.date === today);
  if (!entry) {
    entry = { date: today, value: 0 };
    state.logs.push(entry);
  }
  return entry;
}

// Инкрементировать/декрементировать счётчик задач в логе
export function incrementLog() {
  const entry = getTodayLog();
  entry.value++;
  saveState();
}

export function decrementLog() {
  const entry = getTodayLog();
  entry.value = Math.max(0, entry.value - 1);
  saveState();
}
