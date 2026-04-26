// ============================================================
// renderer.js — оркестратор рендеринга
//
// Паттерн: изменение данных → update() → render() + bind()
// Никаких прямых DOM-манипуляций в компонентах кроме bind().
// ============================================================

import { renderProfile, bindProfile }           from './components/Profile.js';
import { renderStats, bindStats }               from './components/Stats.js';
import { renderTasks, bindTasks }               from './components/Tasks.js';
import { renderSkillsList, renderRadarCard, bindSkills, renderRadarChart } from './components/Skills.js';
import { renderActivityCard, renderLineChart }  from './components/ActivityChart.js';
import { renderPomodoro, bindPomodoro }         from './components/Pomodoro.js';
import { renderHabits, bindHabits }             from './components/Habits.js';

export function render() {
  const app = document.getElementById('app');
  if (!app) return;

  // четырёхколоночный лейаут
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

  bindProfile();
  bindStats();
  bindTasks();
  bindSkills();
  bindPomodoro();
  bindHabits();

  // Чарты инициализируются после рендера (нужен DOM-элемент canvas)
  renderRadarChart();
  renderLineChart();
}

// update = сохранить + перерендерить
// Вызывается из любого модуля после мутации state
export function update() {
  render();
}
