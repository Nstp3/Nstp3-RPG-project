// ============================================================
// renderer.js — оркестратор рендеринга (3 вкладки)
// ============================================================

import { state } from './state.js';
import { renderProfile, bindProfile }           from './components/Profile.js';
import { renderStats, bindStats }               from './components/Stats.js';
import { renderTasks, bindTasks }               from './components/Tasks.js';
import { renderSkillsList, renderRadarCard, bindSkills, renderRadarChart } from './components/Skills.js';
import { renderActivityCard, renderLineChart }  from './components/ActivityChart.js';
import { renderPomodoro, bindPomodoro }         from './components/Pomodoro.js';
import { renderHabits, bindHabits }             from './components/Habits.js';
import { renderMovies, bindMovies }             from './components/Movies.js';
import { renderTaskHistory, bindTaskHistory }   from './components/TaskHistory.js';
import { renderCalendar, bindCalendar }         from './components/Calendar.js';
import { t } from './i18n/translations.js';

let currentTab = 'home';

// Делаем update доступным глобально для компонентов
window.__renderer__ = { update };

export function render() {
  const app = document.getElementById('app');
  if (!app) return;

  // Обновляем кнопку языка в topbar
  const btnLang = document.getElementById('btnLang');
  if (btnLang) btnLang.textContent = t('lang');

  // Обновляем topbar кнопки
  const btnExport = document.getElementById('btnExport');
  const btnImport = document.getElementById('btnImport');
  if (btnExport) btnExport.textContent = t('export');
  if (btnImport) btnImport.textContent = t('import');

  // Обновляем вкладки
  document.querySelectorAll('.tab-btn [data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  if (currentTab === 'home') {
    app.innerHTML = `
      <div class="col col--left">
        ${renderProfile()}
        ${renderStats()}
        ${renderRadarCard()}
        ${renderPomodoro()}
      </div>
      <div class="col col--mid">
        ${renderTasks()}
        ${renderSkillsList()}
        ${renderHabits()}
        ${renderActivityCard()}
      </div>
    `;
    bindProfile(); bindStats(); bindTasks(); bindSkills(); bindPomodoro(); bindHabits();
    renderRadarChart(); renderLineChart();

  } else if (currentTab === 'tasks') {
    app.innerHTML = `
      <div class="col col--left">
        ${renderCalendar()}
      </div>
      <div class="col col--mid">
        ${renderTasks()}
        ${renderTaskHistory()}
      </div>
    `;
    bindTasks(); bindTaskHistory(); bindCalendar();

  } else if (currentTab === 'relax') {
    app.innerHTML = `
      <div class="col col--mid" style="grid-column:1/-1;max-width:900px;margin:0 auto;">
        ${renderMovies()}
      </div>
    `;
    bindMovies();
  }

  // Вкладки
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('tab-btn--active', btn.dataset.tab === currentTab);
    btn.addEventListener('click', () => {
      currentTab = btn.dataset.tab;
      render();
    });
  });
}

export function update() {
  render();
}
