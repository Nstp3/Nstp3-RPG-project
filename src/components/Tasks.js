// ============================================================
// components/Tasks.js — список задач
// ============================================================

import { state } from '../state.js';
import { addTask, deleteTask, toggleTask } from '../tasks.js';
import { update } from '../renderer.js';

export function renderTasks() {
  const tasks = state.tasks;

  return `
    <div class="card">
      <div class="card-title">Tasks</div>

      <div class="task-input-row">
        <input id="taskInput" placeholder="Новая задача..." class="task-input" />
        <select id="taskCat" class="task-select">
          <option value="Morning">Утро</option>
          <option value="Evening">Вечер</option>
        </select>
        <button class="btn-add" id="taskAddBtn">+</button>
      </div>

      <div id="taskList">
        ${tasks.length === 0
          ? '<p class="empty-hint">No tasks yet. Add your first one!</p>'
          : tasks.map(t => renderTask(t)).join('')
        }
      </div>
    </div>
  `;
}

function renderTask(task) {
  const catClass = task.category === 'Morning' ? 'cat-morning' : 'cat-evening';
  return `
    <div class="task-item" data-id="${task.id}">
      <input type="checkbox" class="task-check" ${task.done ? 'checked' : ''} data-id="${task.id}" />
      <span class="task-text ${task.done ? 'task-text--done' : ''}">${task.text}</span>
      <span class="task-cat ${catClass}">${task.category === 'Morning' ? 'Утро' : 'Вечер'}</span>
      <button class="btn-del" data-id="${task.id}" title="Delete">✕</button>
    </div>
  `;
}

export function bindTasks() {
  // Добавление задачи
  const addBtn = document.getElementById('taskAddBtn');
  const input  = document.getElementById('taskInput');

  function handleAdd() {
    const text = input?.value;
    const cat  = document.getElementById('taskCat')?.value || 'Morning';
    if (addTask(text, cat)) {
      input.value = '';
      update();
    }
  }

  addBtn?.addEventListener('click', handleAdd);
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleAdd();
  });

  // Чекбоксы и удаление — делегирование на #taskList
  document.getElementById('taskList')?.addEventListener('click', e => {
    const id = +(e.target.dataset.id);
    if (!id) return;

    if (e.target.classList.contains('task-check') || e.target.classList.contains('task-text')) {
      toggleTask(id);
      update();
    }

    if (e.target.classList.contains('btn-del')) {
      deleteTask(id);
      update();
    }
  });

  // Также вешаем на чекбоксы через change для надёжности
  document.getElementById('taskList')?.addEventListener('change', e => {
    if (e.target.classList.contains('task-check')) {
      const id = +(e.target.dataset.id);
      if (id) {
        toggleTask(id);
        update();
      }
    }
  });
}
