// ============================================================
// components/Habits.js — трекер привычек (тепловая карта)
// Drag-выделение диапазона, +10 XP за каждую отметку
// ============================================================

import { state, saveState } from '../state.js';
import { addXP, XP_PER_HABIT } from '../xp.js';
import { showToast } from '../ui/toast.js';
import { update } from '../renderer.js';

// Инициализация массива привычек в state если нет
function ensureHabits() {
  if (!Array.isArray(state.habits)) state.habits = [];
}

// Получить текущий день месяца (1–31)
function todayDay() {
  return new Date().getDate();
}

// Получить количество дней в текущем месяце
function daysInMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export function renderHabits() {
  ensureHabits();
  const days  = daysInMonth();
  const today = todayDay();

  return `
    <div class="card" id="habitsCard">
      <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">
        <span>Привычки</span>
        <button class="btn-add" id="addHabitBtn">+</button>
      </div>

      ${state.habits.length === 0
        ? `<p class="empty-hint">Нет привычек. Добавь первую!</p>`
        : state.habits.map((h, hi) => `
            <div class="habit-row" style="margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <span style="font-size:12px;color:var(--text);">${h.name}</span>
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="font-size:10px;color:var(--text2);font-family:var(--font-mono);">
                    ${(h.done||[]).filter(d => d <= today).length}/${today}
                  </span>
                  <button class="btn-del" data-hi="${hi}" title="Удалить привычку">✕</button>
                </div>
              </div>
              <div class="habit-grid" data-hi="${hi}" style="display:grid;grid-template-columns:repeat(${days},1fr);gap:3px;">
                ${Array.from({length: days}, (_,i) => {
                  const day  = i + 1;
                  const done = (h.done||[]).includes(day);
                  const future = day > today;
                  const isToday = day === today;
                  return `<div
                    class="habit-sq"
                    data-hi="${hi}"
                    data-day="${day}"
                    style="
                      height:14px;
                      border-radius:2px;
                      cursor:${future ? 'default' : 'pointer'};
                      background:${done ? '#1D9E75' : 'var(--bg4)'};
                      ${isToday ? 'outline:1.5px solid #378ADD;outline-offset:1px;' : ''}
                      ${future ? 'opacity:0.3;' : ''}
                    "
                    title="День ${day}"
                  ></div>`;
                }).join('')}
              </div>
            </div>
          `).join('')
      }
    </div>
  `;
}

export function bindHabits() {
  ensureHabits();

  document.getElementById('addHabitBtn')?.addEventListener('click', () => {
    const name = prompt('Название привычки:');
    if (!name?.trim()) return;
    state.habits.push({ name: name.trim(), done: [] });
    saveState();
    update();
  });

  document.querySelectorAll('.btn-del[data-hi]').forEach(btn => {
    btn.addEventListener('click', () => {
      const hi = +btn.dataset.hi;
      if (confirm(`Удалить привычку "${state.habits[hi].name}"?`)) {
        // XP НЕ отнимаем при удалении
        state.habits.splice(hi, 1);
        saveState();
        update();
      }
    });
  });

  let dragState = null; // { hi, startDay, endDay, mode }

  const getSquares = (hi) =>
    [...document.querySelectorAll(`.habit-sq[data-hi="${hi}"]`)];

  // Обновляет визуал во время drag без изменения state
  function previewDrag(hi, startDay, endDay) {
    const min = Math.min(startDay, endDay);
    const max = Math.max(startDay, endDay);
    const habit = state.habits[hi];

    getSquares(hi).forEach(sq => {
      const day  = +sq.dataset.day;
      const done = (habit.done || []).includes(day);
      const inRange = day >= min && day <= max;

      if (inRange) {
        // режим определяется по startDay: если он был done — снимаем, нет — ставим
        sq.style.background = dragState.mode === 'remove' ? 'var(--bg4)' : '#1D9E75';
        sq.style.opacity = '1';
      } else {
        sq.style.background = done ? '#1D9E75' : 'var(--bg4)';
        sq.style.opacity = day > todayDay() ? '0.3' : '1';
      }
    });
  }

  // Применяет drag к state
  function commitDrag() {
    if (!dragState) return;
    const { hi, startDay, endDay, mode } = dragState;
    const min   = Math.min(startDay, endDay);
    const max   = Math.max(startDay, endDay);
    const habit = state.habits[hi];
    const today = todayDay();

    for (let day = min; day <= max; day++) {
      if (day > today) continue;
      const idx = (habit.done || []).indexOf(day);

      if (mode === 'add' && idx === -1) {
        habit.done.push(day);
        addXP(XP_PER_HABIT);
      } else if (mode === 'remove' && idx !== -1) {
        habit.done.splice(idx, 1);
        addXP(-XP_PER_HABIT);
      }
    }

    if (mode === 'add') showToast(`+XP · Привычки отмечены`, 'xp');

    saveState();
    dragState = null;
    update();
  }

  document.querySelectorAll('.habit-sq').forEach(sq => {
    const day   = +sq.dataset.day;
    const hi    = +sq.dataset.hi;
    const today = todayDay();

    if (day > today) return;

    sq.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const done = (state.habits[hi].done || []).includes(day);
      // Режим drag определяется по состоянию стартовой ячейки
      dragState = {
        hi,
        startDay: day,
        endDay:   day,
        mode:     done ? 'remove' : 'add',
      };
      previewDrag(hi, day, day);
    });

    sq.addEventListener('mouseenter', () => {
      if (!dragState || dragState.hi !== hi) return;
      dragState.endDay = day;
      previewDrag(hi, dragState.startDay, day);
    });
  });

  // mouseup на document — ловим даже если мышь вышла за пределы
  document.addEventListener('mouseup', () => {
    if (!dragState) return;
    commitDrag();
  });
}

function toggleDay(hi, day) {
  // toggleDay больше не используется — логика внутри commitDrag
}