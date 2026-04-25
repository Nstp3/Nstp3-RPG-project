// ============================================================
// components/Skills.js — навыки + radar chart
// ============================================================

import { state, saveState } from '../state.js';
import { ProgressBar } from '../ui/progressBar.js';
import { update } from '../renderer.js';

let radarChart = null;

export function renderSkills() {
  const maxVal = Math.max(...Object.values(state.skills), 1);

  return `
    <div class="card">
      <div class="card-title">Skills</div>
      <div class="skill-list">
        ${Object.entries(state.skills).map(([key, val]) => `
          <div class="skill-row skill-edit" data-key="${key}">
            <span class="skill-name">${key}</span>
            <div class="skill-bar-wrap">
              ${ProgressBar(val, maxVal, 'green')}
            </div>
            <span class="mono skill-val">${val}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-title">Radar</div>
      <canvas id="radarChart"></canvas>
    </div>
  `;
}

export function bindSkills() {
  document.querySelectorAll('.skill-edit').forEach(el => {
    el.addEventListener('click', () => {
      const key = el.dataset.key;
      const val = prompt(`Edit ${key}:`, state.skills[key]);
      if (val === null) return;
      const n = Math.max(0, +val);
      if (!isNaN(n)) {
        state.skills[key] = n;
        saveState();
        update();
      }
    });
  });
}

export function renderRadarChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx || typeof Chart === 'undefined') return;

  if (radarChart) radarChart.destroy();

  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: Object.keys(state.skills),
      datasets: [{
        label: 'Skills',
        data: Object.values(state.skills),
        borderColor: '#00e676',
        backgroundColor: 'rgba(0,230,118,0.1)',
        pointBackgroundColor: '#00e676',
        pointRadius: 3,
        borderWidth: 1.5,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          grid: { color: 'rgba(255,255,255,0.06)' },
          angleLines: { color: 'rgba(255,255,255,0.08)' },
          pointLabels: { color: '#7d8590', font: { size: 10, family: 'Space Mono' } },
          ticks: { display: false },
        }
      }
    }
  });
}
