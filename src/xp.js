import { t } from './i18n/translations.js';
import { state, saveState } from './state.js';
import { showToast } from './ui/toast.js';

export const XP_PER_TASK  = 20;
export const XP_PER_HABIT = 10;
const MAX_LEVEL  = 999;
const BASE_XP    = 100;
const MULTIPLIER = 1.15;

export function xpForLevel(level) {
  return Math.round(BASE_XP * Math.pow(MULTIPLIER, level - 1));
}

export function addXP(amount) {
  const result = { added: false, levelUp: false };

  if (amount > 0 && state.dailyXP >= state.dailyXPLimit) {
    showToast(t('daily_limit'), 'warn');
    return result;
  }

  state.profile.xp += amount;

  // dailyXP меняется в обе стороны
  if (amount > 0) {
    state.dailyXP += amount;
  } else {
    // При отмене уменьшаем dailyXP, не уходим в минус
    state.dailyXP = Math.max(0, state.dailyXP + amount);
  }

  result.added = true;

  // Level UP
  while (state.profile.level < MAX_LEVEL) {
    const needed = xpForLevel(state.profile.level);
    if (state.profile.xp >= needed) {
      state.profile.xp -= needed;
      state.profile.level++;
      result.levelUp = true;
      showToast(`${t('level_up')} ${state.profile.level}! 🎉`, 'success');
    } else break;
  }

  // Level DOWN
  while (state.profile.level > 1 && state.profile.xp < 0) {
    state.profile.level--;
    state.profile.xp += xpForLevel(state.profile.level);
    showToast(`${t('level_down')} ${state.profile.level}`, 'warn');
  }

  if (state.profile.xp < 0) state.profile.xp = 0;

  saveState();
  return result;
}
