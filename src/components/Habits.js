import { state, saveState } from '../state.js';
import { addXP, XP_PER_HABIT } from '../xp.js';
import { showToast } from '../ui/toast.js';
import { update } from '../renderer.js';
import { t } from '../i18n/translations.js';

function ensureHabits() { if (!Array.isArray(state.habits)) state.habits = []; }
function todayDay() { return new Date().getDate(); }
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
        <span>${t('habits')}</span>
      </div>
      <div class="task-input-row" style="margin-bottom:12px;">
        <input id="habitInput" placeholder="${t('habit_placeholder')}" class="task-input" />
        <button class="btn-add" id="addHabitBtn">+</button>
      </div>
      ${state.habits.length === 0
        ? `<p class="empty-hint">${t('habits_empty')}</p>`
        : state.habits.map((h, hi) => `
            <div class="habit-row" style="margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <span style="font-size:12px;color:var(--text);">${h.name}</span>
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="font-size:10px;color:var(--text2);font-family:var(--font-mono);">
                    ${(h.done||[]).filter(d => d <= today).length}/${today}
                  </span>
                  <button class="btn-del" data-hi="${hi}" title="${t('habit_delete_confirm')}">✕</button>
                </div>
              </div>
              <div class="habit-grid" data-hi="${hi}" style="display:grid;grid-template-columns:repeat(${days},1fr);gap:3px;">
                ${Array.from({length: days}, (_,i) => {
                  const day = i + 1;
                  const done = (h.done||[]).includes(day);
                  const future = day > today;
                  const isToday = day === today;
                  return `<div class="habit-sq" data-hi="${hi}" data-day="${day}" style="height:14px;border-radius:2px;cursor:${future?'default':'pointer'};background:${done?'#1D9E75':'var(--bg4)'};${isToday?'outline:1.5px solid #378ADD;outline-offset:1px;':''}${future?'opacity:0.3;':''}" title="${t('habit_day_title')} ${day}"></div>`;
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
  const habitInput = document.getElementById('habitInput');
  function doAddHabit() {
    const name = habitInput?.value.trim(); if (!name) return;
    state.habits.push({ name, done: [] }); habitInput.value = '';
    saveState(); update();
  }
  document.getElementById('addHabitBtn')?.addEventListener('click', doAddHabit);
  habitInput?.addEventListener('keydown', e => { if (e.key === 'Enter') doAddHabit(); });

  document.querySelectorAll('.btn-del[data-hi]').forEach(btn => {
    btn.addEventListener('click', () => {
      const hi = +btn.dataset.hi;
      if (confirm(`${t('habit_delete_confirm')} "${state.habits[hi].name}"?`)) {
        state.habits.splice(hi, 1); saveState(); update();
      }
    });
  });

  let dragState = null;
  const getSquares = hi => [...document.querySelectorAll(`.habit-sq[data-hi="${hi}"]`)];

  function previewDrag(hi, startDay, endDay) {
    const min = Math.min(startDay, endDay), max = Math.max(startDay, endDay);
    const habit = state.habits[hi];
    getSquares(hi).forEach(sq => {
      const day = +sq.dataset.day, done = (habit.done||[]).includes(day), inRange = day >= min && day <= max;
      if (inRange) { sq.style.background = dragState.mode === 'remove' ? 'var(--bg4)' : '#1D9E75'; sq.style.opacity = '1'; }
      else { sq.style.background = done ? '#1D9E75' : 'var(--bg4)'; sq.style.opacity = day > todayDay() ? '0.3' : '1'; }
    });
  }

  function commitDrag() {
    if (!dragState) return;
    const { hi, startDay, endDay, mode } = dragState;
    const min = Math.min(startDay, endDay), max = Math.max(startDay, endDay);
    const habit = state.habits[hi]; const today = todayDay();
    for (let day = min; day <= max; day++) {
      if (day > today) continue;
      const idx = (habit.done||[]).indexOf(day);
      if (mode === 'add' && idx === -1) { habit.done.push(day); addXP(XP_PER_HABIT); }
      else if (mode === 'remove' && idx !== -1) { habit.done.splice(idx, 1); addXP(-XP_PER_HABIT); }
    }
    if (mode === 'add') showToast(`+XP · ${t('habits')}`, 'xp');
    saveState(); dragState = null; update();
  }

  document.querySelectorAll('.habit-sq').forEach(sq => {
    const day = +sq.dataset.day, hi = +sq.dataset.hi;
    if (day > todayDay()) return;
    sq.addEventListener('mousedown', e => {
      e.preventDefault();
      const done = (state.habits[hi].done||[]).includes(day);
      dragState = { hi, startDay: day, endDay: day, mode: done ? 'remove' : 'add' };
      previewDrag(hi, day, day);
    });
    sq.addEventListener('mouseenter', () => {
      if (!dragState || dragState.hi !== hi) return;
      dragState.endDay = day; previewDrag(hi, dragState.startDay, day);
    });
  });
  document.addEventListener('mouseup', () => { if (dragState) commitDrag(); });
}
