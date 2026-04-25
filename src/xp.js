// ============================================================
// xp.js — система XP и уровней
// ============================================================

import { state, saveState } from './state.js';
import { showToast } from './ui/toast.js';

const XP_PER_LEVEL = 100;
const XP_PER_TASK  = 10;

// Добавить XP. Возвращает { added, levelUp }
// Положительный XP блокируется при достижении дневного лимита.
// Отрицательный XP (снятие при uncheck) всегда проходит.
export function addXP(amount) {
  const result = { added: false, levelUp: false };

  if (amount > 0 && state.dailyXP >= state.dailyXPLimit) {
    showToast('Daily XP limit reached!', 'warn');
    return result;
  }

  state.profile.xp  += amount;
  state.dailyXP     += Math.max(0, amount);
  result.added = true;

  // Уровень вверх
  if (state.profile.xp >= XP_PER_LEVEL) {
    state.profile.level++;
    state.profile.xp -= XP_PER_LEVEL;
    result.levelUp = true;
    showToast(`Level Up! Now level ${state.profile.level} 🎉`, 'success');
  }

  // XP не может быть отрицательным
  if (state.profile.xp < 0) state.profile.xp = 0;

  saveState();
  return result;
}

export { XP_PER_TASK };
