import { state, saveState } from '../state.js';
import { ProgressBar } from '../ui/progressBar.js';
import { update } from '../renderer.js';
import { t, tSkill } from '../i18n/translations.js';
import { getTheme } from '../themes.js';
import { ICONS } from '../icons.js';

let radarChart = null;

const SKILL_BAR_COLOR = {
  'Тело':           'skill-body',
  'Разум':          'skill-mind',
  'Продуктивность': 'skill-prod',
  'Развлечения':    'skill-fun',
  'Быт':            'skill-home',
  'Отдых':          'skill-rest',
};

const RADAR_SHORT = {
  'Продуктивность': 'Продукт.',
  'Развлечения':    'Развлеч.',
  'Productivity':   'Product.',
  'Entertainment':  'Entert.',
};

function radarLabel(key) {
  const full = tSkill(key);
  return RADAR_SHORT[full] || full;
}

export function renderRadarCard() {
  const theme = getTheme();
  return `
    <div class="card" style="height:245px;padding:8px;flex-shrink:0;display:flex;flex-direction:column;">
      <div class="card-title">${t('radar')}</div>
      <div style="flex:1;position:relative;min-height:0;">
        <canvas id="radarChart" style="position:absolute;inset:0;width:100%!important;height:100%!important;"></canvas>
      </div>
    </div>
  `;
}

export function renderSkillsList() {
  const theme  = getTheme();
  const maxVal = Math.max(...Object.values(state.skills), 1);
  return `
    <div class="card">
      <div class="card-title">${t('skills')}</div>
      <div class="skill-list">
        ${Object.entries(state.skills).map(([key, val]) => {
          const barVariant = SKILL_BAR_COLOR[key] || 'green';
          const color      = (theme.skillColors || {})[key] || 'var(--green)';
          const iconSrc    = (theme.skills || {})[key];
          const icon = iconSrc
            ? `<img src="${iconSrc}" class="skill-icon" alt="">`
            : '';
          return `
            <div class="skill-row skill-edit" data-key="${key}">
              <span style="display:flex;align-items:center;gap:6px;min-width:0;">
                ${icon}
                <span class="skill-name">${tSkill(key)}</span>
              </span>
              <div class="skill-bar-wrap">${ProgressBar(val, maxVal, barVariant)}</div>
              <span class="mono skill-val" style="color:${color};">${val}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function bindSkills() {
  document.querySelectorAll('.skill-edit').forEach(el => {
    el.addEventListener('click', () => {
      const key = el.dataset.key;
      const val = prompt(`${tSkill(key)}:`, state.skills[key]);
      if (val === null) return;
      const n = Math.max(0, +val);
      if (!isNaN(n)) { state.skills[key] = n; saveState(); update(); }
    });
  });
}

export function renderRadarChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx || typeof Chart === 'undefined') return;
  if (radarChart) radarChart.destroy();

  const theme = getTheme();
  const keys  = Object.keys(state.skills);
  const values = Object.values(state.skills);
  const pointColors = keys.map(k => (theme.skillColors || {})[k] || '#00e676');

  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: keys.map(k => radarLabel(k)),
      datasets: [{
        label: t('skills'),
        data: values,
        borderColor:          theme.radarBorder || 'rgba(0,230,118,0.6)',
        backgroundColor:      theme.radarFill   || 'rgba(0,230,118,0.07)',
        pointBackgroundColor: pointColors,
        pointBorderColor:     pointColors,
        pointRadius: 4,
        borderWidth: 1.5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          grid:        { color: theme.radarGrid   || 'rgba(255,255,255,0.06)' },
          angleLines:  { color: theme.radarGrid   || 'rgba(255,255,255,0.06)' },
          pointLabels: {
            color: theme.radarLabels || '#7d8590',
            font:  { size: 7, family: theme.radarFont || 'Space Mono' }
          },
          ticks: { display: false },
        }
      }
    }
  });
}
