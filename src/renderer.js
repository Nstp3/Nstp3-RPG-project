// ============================================================
// renderer.js — оркестратор рендеринга
//
// Паттерн: изменение данных → update() → render() + bind()
// Никаких прямых DOM-манипуляций в компонентах кроме bind().
// ============================================================

import { renderProfile, bindProfile }           from './components/Profile.js';
import { renderStats, bindStats }               from './components/Stats.js';
import { renderTasks, bindTasks }               from './components/Tasks.js';
import { renderSkillsList, renderRadarCard, bindSkills, renderRadarChart  } from './components/Skills.js';
import { renderActivityCard, renderLineChart }  from './components/ActivityChart.js';
import { renderDirections, bindDirections }     from './components/Directions.js';

export function render() {
  const app = document.getElementById('app');
  if (!app) return;

  // Трёхколоночный лейаут
  app.innerHTML = `
    <div class="col col--left">
      ${renderProfile()}
      ${renderStats()}
      ${renderDirections()}
    </div>

  <div class="col col--mid">
  ${renderTasks()}
  ${renderSkillsList()}
  <div style="display:flex; gap:10px; align-items:flex-start;">
    ${renderRadarCard()}
    ${renderActivityCard()}
  </div>
</div>
  `;

  // После вставки HTML — привязываем события
  bindProfile();
  bindStats();
  bindTasks();
  bindSkills();
  bindDirections();

  // Чарты инициализируются после рендера (нужен DOM-элемент canvas)
  renderRadarChart();
  renderLineChart();
}

// update = сохранить + перерендерить
// Вызывается из любого модуля после мутации state
export function update() {
  render();
}
