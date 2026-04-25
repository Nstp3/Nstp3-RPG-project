// ============================================================
// components/Directions.js — карточки направлений
// ============================================================

import { state, saveState } from '../state.js';
import { ProgressBar } from '../ui/progressBar.js';
import { update } from '../renderer.js';

export function renderDirections() {
  return `
    <div class="card">
      <div class="card-title">Directions</div>
      ${state.directions.map((d, i) => `
        <div class="dir-card">
          <div class="dir-header">
            <span class="dir-name">${d.name}</span>
            <span class="mono dir-pct dir-edit" data-idx="${i}">${d.progress}%</span>
          </div>
          ${ProgressBar(d.progress, 100, 'green')}
        </div>
      `).join('')}
    </div>
  `;
}

export function bindDirections() {
  document.querySelectorAll('.dir-edit').forEach(el => {
    el.addEventListener('click', () => {
      const idx = +el.dataset.idx;
      const dir = state.directions[idx];
      const val = prompt(`Прогресс для..."${dir.name}" (0–100):`, dir.progress);
      if (val === null) return;
      const n = Math.min(100, Math.max(0, +val));
      if (!isNaN(n)) {
        state.directions[idx].progress = n;
        saveState();
        update();
      }
    });
  });
}
