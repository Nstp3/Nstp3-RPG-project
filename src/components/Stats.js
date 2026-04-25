// ============================================================
// components/Stats.js — статы персонажа (HP, Mood, Focus, Motivation)
// ============================================================

import { state, saveState } from '../state.js';
import { ProgressBar } from '../ui/progressBar.js';
import { update } from '../renderer.js';

// Каждый стат имеет свой цветовой вариант
const STAT_VARIANTS = {
  HP:         'hp',
  Mood:       'mood',
  Focus:      'focus',
  Motivation: 'mot',
};

export function renderStats() {
  return `
    <div class="card">
      <div class="card-title">Stats</div>
      ${Object.entries(state.stats).map(([key, val]) => `
        <div class="stat-row stat-edit" data-stat="${key}">
          <div class="stat-label">
            <span class="stat-name">${key}</span>
            <span class="mono stat-val">${val}</span>
          </div>
          ${ProgressBar(val, 100, STAT_VARIANTS[key] || 'green')}
        </div>
      `).join('')}
    </div>
  `;
}

export function bindStats() {
  document.querySelectorAll('.stat-edit').forEach(el => {
    el.addEventListener('click', () => {
      const key = el.dataset.stat;
      const val = prompt(`Изменить ${key} (0–100):`, state.stats[key]);
      if (val === null) return;
      const n = Math.min(100, Math.max(0, +val));
      if (!isNaN(n)) {
        state.stats[key] = n;
        saveState();
        update();
      }
    });
  });
}
