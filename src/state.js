// ============================================================
// state.js — единый источник правды
// Все данные приложения живут здесь.
// Никакой другой модуль не хранит данные — только читает из state.
// ============================================================

const STORAGE_KEY = 'life_rpg_v1';

// Дефолтное состояние — используется при первом запуске
// или как fallback при частичных данных из localStorage
export const defaultState = {
  profile: {
    name: 'Hero',
    avatar: '⚔️',
    level: 1,
    xp: 0,
  },
  stats: {
    Здоровье: 500,
    Настроение: 500,
    Выносливость: 500,
    Мотивация: 500,
  },
  skills: {
    Физические: 50,
    Психика: 40,
    Интеллект: 30,
    Покупки: 45,
    'Домашние дела': 35,
    'Другие дела': 55,
  },
  tasks: [],
  logs: [],       // [{ date: 'Mon Apr 25 2026', value: 3 }, ...]
  habits: [],
  directions: [
    { name: 'Morning Routine', progress: 0 },
    { name: 'Evening Wind-down', progress: 0 },
  ],
  dailyXP: 0,
  dailyXPLimit: 1000,
  lastDate: new Date().toDateString(),
};

// Текущее состояние — мутируется напрямую, затем сохраняется
// Глубокий merge: сохранённые данные перекрывают дефолты,
// но недостающие ключи берутся из defaultState
function mergeState(saved) {
  if (!saved) return structuredClone(defaultState);
  return {
    ...defaultState,
    ...saved,
    profile:    { ...defaultState.profile,    ...saved.profile },
    stats:      { ...defaultState.stats,       ...saved.stats },
    skills:     { ...defaultState.skills,      ...saved.skills },
    tasks:      Array.isArray(saved.tasks)      ? saved.tasks      : [],
    logs:       Array.isArray(saved.logs)       ? saved.logs       : [],
    directions: Array.isArray(saved.directions) ? saved.directions : defaultState.directions,
    habits:     Array.isArray(saved.habits)     ? saved.habits     : [],
  };
}

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export let state = mergeState(loadFromStorage());

// Сброс дневного счётчика XP при наступлении нового дня
const today = new Date().toDateString();
if (state.lastDate !== today) {
  state.dailyXP = 0;
  state.lastDate = today;
  // Stats сбрасываются каждый день до базового значения
  state.stats = {
    Здоровье: 500,
    Настроение: 500,
    Выносливость: 500,
    Мотивация: 500,
  };
}

// ============================================================
// Сохранение
// ============================================================

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

// ============================================================
// Экспорт / Импорт JSON
// ============================================================

export function exportJSON() {
  return JSON.stringify(state, null, 2);
}

export function importJSON(json) {
  const parsed = JSON.parse(json); // выбросит SyntaxError если невалидный JSON
  state = mergeState(parsed);
  saveState();
}
