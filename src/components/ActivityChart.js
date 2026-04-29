import { t } from '../i18n/translations.js';
import { state } from '../state.js';
import { ICONS } from '../icons.js';
import { getTheme } from '../themes.js';

let lineChart = null;

export function renderActivityCard() {
  // Фон активити только для AC-темы (пергамент); в тёмной — без фона
  const isAC = document.body.dataset.theme === 'ac';
  const bgStyle = isAC && ICONS['bg-activity']
    ? `background-image:url('${ICONS['bg-activity']}');background-size:cover;background-position:center top;`
    : '';

  return `
    <div class="card" style="flex:1;min-width:0;display:flex;flex-direction:column;${bgStyle}">
      <div class="card-title" style="${isAC ? 'text-shadow:0 1px 3px rgba(255,252,240,0.8);' : ''}">${t('activity')}</div>
      <div style="flex:1;position:relative;min-height:160px;">
        <canvas id="lineChart" style="position:absolute;inset:0;width:100%!important;height:100%!important;"></canvas>
      </div>
    </div>
  `;
}

export function renderLineChart() {
  const ctx = document.getElementById('lineChart');
  if (!ctx || typeof Chart === 'undefined') return;
  if (lineChart) lineChart.destroy();

  const isAC      = document.body.dataset.theme === 'ac';
  const lineColor = isAC ? '#8b1a1a' : '#00e676';
  const fillColor = isAC ? 'rgba(139,26,26,0.12)' : 'rgba(0,230,118,0.08)';
  const gridColor = isAC ? 'rgba(101,67,33,0.12)' : 'rgba(255,255,255,0.04)';
  const tickColor = isAC ? '#8b6f47' : '#484f58';
  const tickFont  = isAC ? 'Cinzel' : 'Space Mono';

  const logs = state.logs.slice(-14);
  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: logs.map(l => l.date.slice(4, 10)),
      datasets: [{
        label: t('tasks_done_label'),
        data: logs.map(l => l.value),
        borderColor: lineColor,
        backgroundColor: fillColor,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: lineColor,
        borderWidth: 1.5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid:  { color: gridColor },
          ticks: { color: tickColor, font: { size: 9, family: tickFont } },
        },
        y: {
          grid:  { color: gridColor },
          ticks: { color: tickColor, font: { size: 9, family: tickFont }, stepSize: 1 },
          beginAtZero: true,
        }
      }
    }
  });
}
