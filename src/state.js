// ============================================================
// state.js — единый источник правды
// ============================================================

const STORAGE_KEY = 'life_rpg_v2';

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
    'Тело': 50,
    'Разум': 40,
    'Продуктивность': 30,
    'Развлечения': 45,
    'Быт': 35,
    'Отдых': 55,
  },
  tasks: [],          // активные задачи
  taskHistory: [],    // выполненные: { id, text, category, completedAt }
  logs: [],           // [{ date, value }] для activity chart
  habits: [],
  movies: [],         // [{ id, title, poster, status }]
  dailyXP: 0,
  dailyXPLimit: 1000,
  lang: 'ru',
  lastDate: new Date().toDateString(),
};

function mergeState(saved) {
  if (!saved) return structuredClone(defaultState);
  return {
    ...defaultState,
    ...saved,
    profile:      { ...defaultState.profile,  ...saved.profile },
    stats:        { ...defaultState.stats,     ...saved.stats },
    skills:       { ...defaultState.skills },
    tasks:        Array.isArray(saved.tasks)        ? saved.tasks        : [],
    taskHistory:  Array.isArray(saved.taskHistory)  ? saved.taskHistory  : [],
    logs:         Array.isArray(saved.logs)         ? saved.logs         : [],
    habits:       Array.isArray(saved.habits)       ? saved.habits       : [],
    movies:       Array.isArray(saved.movies)       ? saved.movies       : [],
    lang:         saved.lang || 'ru',
  };
}

function loadFromStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
  catch { return null; }
}

export let state = mergeState(loadFromStorage());

// Сброс при новом дне
const today = new Date().toDateString();
if (state.lastDate !== today) {
  state.dailyXP  = 0;
  state.lastDate = today;
  state.stats = { Здоровье: 500, Настроение: 500, Выносливость: 500, Мотивация: 500 };

  // Повторяющаяся задача "Отдых 1 час" каждый день
  const hasRestTask = state.tasks.some(t => t.recurring && t.text === 'Отдых 1 час');
  if (!hasRestTask) {
    state.tasks.push({ id: Date.now(), text: 'Отдых 1 час', done: false, category: 'Отдых', recurring: true });
  }
}

export function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.warn('localStorage save failed:', e); }
}

export function exportJSON() { return JSON.stringify(state, null, 2); }

export function importJSON(json) {
  const parsed = JSON.parse(json);
  state = mergeState(parsed);
  saveState();
}
