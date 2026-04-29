import { t } from '../i18n/translations.js';
import { state } from '../state.js';

let lineChart = null;

export function renderActivityCard() {
  return `
    <div class="card" style="flex:1;min-width:0;display:flex;flex-direction:column;">
      <div class="card-title">${t('activity')}</div>
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
  const logs = state.logs.slice(-14);
  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: logs.map(l => l.date.slice(4, 10)),
      datasets: [{
        label: t('tasks_done_label'),
        data: logs.map(l => l.value),
        borderColor: '#00e676',
        backgroundColor: 'rgba(0,230,118,0.08)',
        fill: true, tension: 0.4,
        pointRadius: 2, pointBackgroundColor: '#00e676', borderWidth: 1.5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#484f58', font: { size: 9, family: 'Space Mono' } } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#484f58', font: { size: 9, family: 'Space Mono' }, stepSize: 1 }, beginAtZero: true }
      }
    }
  });
}
