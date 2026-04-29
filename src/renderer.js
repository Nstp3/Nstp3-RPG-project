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
import { renderLocalPlayer, bindLocalPlayer, renderSoundCloudPlayer, bindSoundCloudPlayer } from './components/Music.js';
import { renderTaskHistory, bindTaskHistory }   from './components/TaskHistory.js';
import { renderCalendar, bindCalendar }         from './components/Calendar.js';
import { t } from './i18n/translations.js';

let currentTab = 'home';
let tabsInitialized = false; // ← флаг: вешаем обработчики на вкладки только ОДИН РАЗ

window.__renderer__ = { update };

// Инициализация вкладок — вызывается единожды
function initTabs() {
  if (tabsInitialized) return;
  tabsInitialized = true;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTab = btn.dataset.tab;
      render();
    });
  });
}

// Обновление активного состояния вкладок — без добавления новых listener-ов
function updateTabState() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('tab-btn--active', btn.dataset.tab === currentTab);
  });
  // Обновляем i18n-тексты внутри кнопок
  document.querySelectorAll('.tab-btn [data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
}

export function render() {
  const app = document.getElementById('app');
  if (!app) return;

  // Topbar: язык и кнопки
  const btnLang   = document.getElementById('btnLang');
  const btnExport = document.getElementById('btnExport');
  const btnImport = document.getElementById('btnImport');
  if (btnLang)   btnLang.textContent   = t('lang');
  if (btnExport) btnExport.textContent = t('export');
  if (btnImport) btnImport.textContent = t('import');

  // Вкладки: один раз байндим, всегда обновляем стиль
  initTabs();
  updateTabState();

  // Контент по вкладке
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
        ${renderTaskHistory()}
      </div>
    `;
    bindTaskHistory(); bindCalendar();

  } else if (currentTab === 'relax') {
    app.innerHTML = `
      <div style="grid-column:1/-1;max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:12px;width:100%;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          ${renderLocalPlayer()}
          ${renderSoundCloudPlayer()}
        </div>
        ${renderMovies()}
      </div>
    `;
    bindLocalPlayer(); bindSoundCloudPlayer(); bindMovies();
  }
}

export function update() {
  render();
}
