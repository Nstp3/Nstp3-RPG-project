// ============================================================
// tasks.js — управление задачами
// ============================================================

import { state, saveState } from './state.js';
import { addXP, XP_PER_TASK } from './xp.js';
import { incrementLog, decrementLog } from './logger.js';
import { showToast } from './ui/toast.js';

export function addTask(text, category) {
  if (!text || !text.trim()) return false;
  state.tasks.push({
    id: Date.now(),
    text: text.trim(),
    done: false,
    category, // 'Morning' | 'Evening'
  });
  saveState();
  return true;
}

export function deleteTask(id) {
  const idx = state.tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  // Если задача была выполнена — снимаем XP и лог
  if (state.tasks[idx].done) {
    addXP(-XP_PER_TASK);
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
      incrementLog();
      showToast(`+${XP_PER_TASK} XP`, 'xp');
    }
  } else {
    addXP(-XP_PER_TASK);
    decrementLog();
  }

  saveState();
}
