import { state, saveState } from '../state.js';
import { ProgressBar } from '../ui/progressBar.js';
import { update } from '../renderer.js';
import { t, tSkill } from '../i18n/translations.js';

let radarChart = null;

// Цвет полосы прогресса (соответствует CSS progress-bar--<variant>)
const SKILL_BAR_COLOR = {
  'Тело':           'skill-body',
  'Разум':          'skill-mind',
  'Продуктивность': 'skill-prod',
  'Развлечения':    'skill-fun',
  'Быт':            'skill-home',
  'Отдых':          'skill-rest',
};

// Короткие подписи для радара — работают на обоих языках
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

// Цвет числового значения и точек радара
const SKILL_COLOR = {
  'Тело':           '#ef5350',
  'Разум':          '#ab47bc',
  'Продуктивность': '#42a5f5',
  'Развлечения':    '#66bb6a',
  'Быт':            '#ffa726',
  'Отдых':          '#78909c',
};

export function renderRadarCard() {
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
  const maxVal = Math.max(...Object.values(state.skills), 1);
  return `
    <div class="card">
      <div class="card-title">${t('skills')}</div>
      <div class="skill-list">
        ${Object.entries(state.skills).map(([key, val]) => {
          const barVariant = SKILL_BAR_COLOR[key] || 'green';
          const color      = SKILL_COLOR[key]     || 'var(--green)';
          return `
            <div class="skill-row skill-edit" data-key="${key}">
              <span class="skill-name">${tSkill(key)}</span>
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

  const keys         = Object.keys(state.skills);
  const values       = Object.values(state.skills);
  const pointColors  = keys.map(k => SKILL_COLOR[k] || '#00e676');

  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: keys.map(k => radarLabel(k)),
      datasets: [{
        label: t('skills'),
        data: values,
        borderColor: 'rgba(0,230,118,0.6)',
        backgroundColor: 'rgba(0,230,118,0.07)',
        pointBackgroundColor: pointColors,
        pointBorderColor: pointColors,
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
          grid:        { color: 'rgba(255,255,255,0.06)' },
          angleLines:  { color: 'rgba(255,255,255,0.08)' },
          pointLabels: { color: '#7d8590', font: { size: 7, family: 'Space Mono' } },
          ticks:       { display: false },
        }
      }
    }
  });
}
