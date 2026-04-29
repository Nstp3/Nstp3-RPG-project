// ============================================================
// tasks.js — управление задачами
// ============================================================

import { state, saveState } from './state.js';
import { tSkill } from './i18n/translations.js';
import { addXP, XP_PER_TASK } from './xp.js';
import { incrementLog, decrementLog } from './logger.js';
import { showToast } from './ui/toast.js';

const SKILL_EFFECTS = {
  'Тело':           { Здоровье: +15, Выносливость: +10, Настроение: +5 },
  'Разум':          { Мотивация: +10, Выносливость: +15, Настроение: -5 },
  'Продуктивность': { Мотивация: +15, Выносливость: +10, Настроение: -5 },
  'Развлечения':    { Настроение: +15, Выносливость: +5 },
  'Быт':            { Настроение: +5, Мотивация: +5, Выносливость: -10 },
  'Отдых':          { Выносливость: +20, Настроение: +10, Мотивация: -5 },
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
  state.tasks.push({ id: Date.now(), text: text.trim(), done: false, category });
  saveState();
  return true;
}

export function deleteTask(id) {
  const idx = state.tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  const task = state.tasks[idx];
  if (task.done) {
    addXP(-XP_PER_TASK);
    applyStatEffects(task.category, true);
    applySkillBonus(task.category, true);
    decrementLog();
    // Убрать из истории
    state.taskHistory = state.taskHistory.filter(h => h.id !== task.id);
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
      // Добавить в историю
      state.taskHistory.push({
        id: task.id,
        text: task.text,
        category: task.category,
        completedAt: new Date().toISOString(),
      });
      showToast(`+${XP_PER_TASK} XP · ${tSkill(task.category)} +5`, 'xp');
    }
  } else {
    addXP(-XP_PER_TASK);
    applyStatEffects(task.category, true);
    applySkillBonus(task.category, true);
    decrementLog();
    // Убрать из истории при отмене
    state.taskHistory = state.taskHistory.filter(h => h.id !== task.id);
  }

  saveState();
}
