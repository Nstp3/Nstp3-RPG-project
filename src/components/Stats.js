import { state, saveState } from '../state.js';
import { ProgressBar } from '../ui/progressBar.js';
import { update } from '../renderer.js';
import { t } from '../i18n/translations.js';
import { getTheme } from '../themes.js';

const STAT_VARIANTS = {
  Здоровье: 'hp', Настроение: 'mood', Выносливость: 'focus', Мотивация: 'mot',
};
const STAT_I18N = {
  Здоровье: 'health', Настроение: 'mood', Выносливость: 'stamina', Мотивация: 'motivation',
};

// Если значение — data-uri или http(s) → рисуем <img>, иначе — эмодзи в <span>
function renderStatIcon(value) {
  if (!value) return '';
  if (value.startsWith('data:') || value.startsWith('http')) {
    return `<img src="${value}" class="stat-icon" alt="">`;
  }
  return `<span class="stat-emoji">${value}</span>`;
}

export function renderStats() {
  const theme = getTheme();
  return `
    <div class="card">
      <div class="card-title">${t('stats')}</div>
      ${Object.entries(state.stats).map(([key, val]) => {
        const icon = renderStatIcon(theme.stats[key]);
        return `
          <div class="stat-row stat-edit" data-stat="${key}">
            <div class="stat-label">
              <span style="display:flex;align-items:center;gap:7px;">
                ${icon}
                <span class="stat-name">${t(STAT_I18N[key]) || key}</span>
              </span>
              <span class="mono stat-val">${val}</span>
            </div>
            ${ProgressBar(val, 1000, STAT_VARIANTS[key] || 'green')}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export function bindStats() {
  document.querySelectorAll('.stat-edit').forEach(el => {
    el.addEventListener('click', () => {
      const key = el.dataset.stat;
      const label = t(STAT_I18N[key]) || key;
      const val = prompt(`${label} (0–1000):`, state.stats[key]);
      if (val === null) return;
      const n = Math.min(1000, Math.max(0, +val));
      if (!isNaN(n)) { state.stats[key] = n; saveState(); update(); }
    });
  });
}
