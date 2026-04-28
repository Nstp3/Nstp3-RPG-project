import { state } from '../state.js';
import { addTask, deleteTask, toggleTask } from '../tasks.js';
import { update } from '../renderer.js';
import { t } from '../i18n/translations.js';

const SKILL_KEYS = ['Тело','Разум','Продуктивность','Развлечения','Быт','Отдых'];

export function renderTasks() {
  const tasks = state.tasks;
  return `
    <div class="card">
      <div class="card-title">${t('tasks')}</div>
      <div class="task-input-row">
        <input id="taskInput" placeholder="${t('task_placeholder')}" class="task-input" />
        <select id="taskCat" class="task-select">
          ${SKILL_KEYS.map(k => `<option value="${k}">${k}</option>`).join('')}
        </select>
        <button class="btn-add" id="taskAddBtn">+</button>
      </div>
      <div id="taskList">
        ${tasks.length === 0
          ? `<p class="empty-hint">${t('tasks_empty')}</p>`
          : tasks.map(task => renderTask(task)).join('')
        }
      </div>
    </div>
  `;
}

function renderTask(task) {
  const catColors = {
    'Тело':'cat-physical','Разум':'cat-psyche','Продуктивность':'cat-intel',
    'Развлечения':'cat-shop','Быт':'cat-home','Отдых':'cat-other',
  };
  const catClass = catColors[task.category] || 'cat-other';
  const recurIcon = task.recurring ? ' 🔄' : '';
  return `
    <div class="task-item" data-id="${task.id}">
      <input type="checkbox" class="task-check" ${task.done ? 'checked' : ''} data-id="${task.id}" />
      <span class="task-text ${task.done ? 'task-text--done' : ''}">${task.text}${recurIcon}</span>
      <span class="task-cat ${catClass}">${task.category}</span>
      <button class="btn-del" data-id="${task.id}" title="Delete">✕</button>
    </div>
  `;
}

export function bindTasks() {
  const addBtn = document.getElementById('taskAddBtn');
  const input  = document.getElementById('taskInput');

  function handleAdd() {
    const text = input?.value;
    const cat  = document.getElementById('taskCat')?.value || 'Тело';
    if (addTask(text, cat)) { input.value = ''; update(); }
  }

  addBtn?.addEventListener('click', handleAdd);
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') handleAdd(); });

  document.getElementById('taskList')?.addEventListener('click', e => {
    const id = +(e.target.dataset.id);
    if (!id) return;
    if (e.target.classList.contains('task-check') || e.target.classList.contains('task-text')) {
      toggleTask(id); update();
    }
    if (e.target.classList.contains('btn-del')) { deleteTask(id); update(); }
  });

  document.getElementById('taskList')?.addEventListener('change', e => {
    if (e.target.classList.contains('task-check')) {
      const id = +(e.target.dataset.id);
      if (id) { toggleTask(id); update(); }
    }
  });
}
