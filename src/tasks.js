// ============================================================
// tasks.js — управление задачами
// ============================================================

import { state, saveState } from './state.js';
import { addXP, XP_PER_TASK } from './xp.js';
import { incrementLog, decrementLog } from './logger.js';
import { showToast } from './ui/toast.js';

// Таблица влияния скилла на stats
const SKILL_EFFECTS = {
  'Физические':    { Здоровье: +10, Настроение: +5,  Мотивация: +10, Выносливость: -5  },
  'Психика':       { Здоровье: +10, Настроение: +10, Мотивация: +5,  Выносливость: +5  },
  'Интеллект':     { Здоровье: +5,  Мотивация: +5,                   Выносливость: -5  },
  'Домашние дела': { Настроение: +5, Мотивация: +5,                  Выносливость: -10 },
  'Покупки':       { Настроение: +10,                                 Выносливость: -5  },
  'Другие дела':   { Здоровье: +5,  Настроение: +5,                  Выносливость: -5  },
};

function applyStatEffects(category, reverse = false) {
  const effects = SKILL_EFFECTS[category];
  if (!effects) return;

  Object.entries(effects).forEach(([stat, value]) => {
    if (!(stat in state.stats)) return;
    const delta = reverse ? -value : value;
    state.stats[stat] = Math.min(1000, Math.max(0, state.stats[stat] + delta));
  });
}

function applySkillBonus(category, reverse = false) {
  if (!(category in state.skills)) return;
  state.skills[category] += reverse ? -5 : 5;
  if (state.skills[category] < 0) state.skills[category] = 0;
}

export function addTask(text, category) {
  if (!text || !text.trim()) return false;
  state.tasks.push({
    id: Date.now(),
    text: text.trim(),
    done: false,
    category,
  });
  saveState();
  return true;
}

export function deleteTask(id) {
  const idx = state.tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  if (state.tasks[idx].done) {
    const cat = state.tasks[idx].category;
    addXP(-XP_PER_TASK);
    applyStatEffects(cat, true);
    applySkillBonus(cat, true);
    decrementLog();
  }
  state.tasks.splice(idx, 1);
  saveState();
}

export function toggleTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  task.done = !task.done;

  if (task.done) {
    const { added } = addXP(XP_PER_TASK);
    if (added) {
      applyStatEffects(task.category);
      applySkillBonus(task.category);
      incrementLog();
      showToast(`+${XP_PER_TASK} XP · ${task.category} +5`, 'xp');
    }
  } else {
    addXP(-XP_PER_TASK);
    applyStatEffects(task.category, true);
    applySkillBonus(task.category, true);
    decrementLog();
  }

  saveState();
}