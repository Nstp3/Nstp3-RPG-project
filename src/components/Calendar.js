import { tSkill } from '../i18n/translations.js';
import { update } from '../renderer.js';
import { state, saveState } from '../state.js';
import { t } from '../i18n/translations.js';

let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();

export function renderCalendar() {
  const now     = new Date();
  const maxYear = now.getFullYear() + 1; // полный следующий год до декабря

  const firstDay  = new Date(calYear, calMonth, 1);
  const daysCount = new Date(calYear, calMonth + 1, 0).getDate();
  const startWeekday = (firstDay.getDay() + 6) % 7; // Пн=0

  const monthName = firstDay.toLocaleDateString(
    state.lang === 'en' ? 'en-US' : 'ru-RU',
    { month: 'long', year: 'numeric' }
  );

  const today = now.toDateString();

  const historyMap = {};
  (state.taskHistory || []).forEach(task => {
    const d = new Date(task.completedAt);
    if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
      const day = d.getDate();
      if (!historyMap[day]) historyMap[day] = [];
      historyMap[day].push(task);
    }
  });

  // Назад — до текущего месяца. Вперёд — до декабря следующего года включительно
  const canPrev = !(calYear === now.getFullYear() && calMonth === now.getMonth());
  const canNext = !(calYear === maxYear && calMonth === 11);

  const weekDays = state.lang === 'en'
    ? ['Mo','Tu','We','Th','Fr','Sa','Su']
    : ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push('<div></div>');
  for (let d = 1; d <= daysCount; d++) {
    const thisDate = new Date(calYear, calMonth, d);
    const isToday  = thisDate.toDateString() === today;
    const isPast   = thisDate < now && !isToday;
    const hasTasks = historyMap[d]?.length > 0;
    const count    = historyMap[d]?.length || 0;
    cells.push(`
      <div class="cal-day ${isToday ? 'cal-day--today' : ''}" data-day="${d}" style="
        position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;
        height:36px;border-radius:6px;cursor:pointer;
        background:${isToday ? 'var(--green)' : hasTasks ? 'var(--bg3)' : 'transparent'};
        color:${isToday ? '#000' : isPast && !hasTasks ? 'var(--text2)' : 'var(--text)'};
        font-size:12px;">
        ${d}
        ${hasTasks ? `<span style="position:absolute;bottom:3px;width:5px;height:5px;border-radius:50%;background:${isToday ? '#000' : 'var(--green)'};"></span>` : ''}
        ${count > 1 ? `<span style="position:absolute;top:2px;right:4px;font-size:8px;color:${isToday?'#000':'var(--green)'};">${count}</span>` : ''}
      </div>
    `);
  }

  return `
    <div class="card">
      <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">
        <button class="cal-nav" id="calPrev" style="background:none;border:none;color:var(--text2);cursor:pointer;font-size:18px;padding:0 4px;${!canPrev?'opacity:0.25;pointer-events:none;':''}">‹</button>
        <span style="font-size:13px;font-weight:600;text-transform:capitalize;">${monthName}</span>
        <button class="cal-nav" id="calNext" style="background:none;border:none;color:var(--text2);cursor:pointer;font-size:18px;padding:0 4px;${!canNext?'opacity:0.25;pointer-events:none;':''}">›</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:4px;">
        ${weekDays.map(d => `<div style="text-align:center;font-size:10px;color:var(--text2);padding:2px 0;">${d}</div>`).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;" id="calGrid">
        ${cells.join('')}
      </div>
      <div id="calDayDetail" style="margin-top:10px;min-height:20px;"></div>
    </div>
  `;
}

export function bindCalendar() {
  const now     = new Date();
  const maxYear = now.getFullYear() + 1;

  document.getElementById('calPrev')?.addEventListener('click', () => {
    if (calYear === now.getFullYear() && calMonth === now.getMonth()) return;
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    update();
  });

  document.getElementById('calNext')?.addEventListener('click', () => {
    if (calYear === maxYear && calMonth === 11) return;
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    update();
  });

  document.getElementById('calGrid')?.addEventListener('click', e => {
    const dayEl = e.target.closest('.cal-day'); if (!dayEl) return;
    const day = +dayEl.dataset.day;
    const tasks = (state.taskHistory || []).filter(task => {
      const d = new Date(task.completedAt);
      return d.getFullYear() === calYear && d.getMonth() === calMonth && d.getDate() === day;
    });
    const detail = document.getElementById('calDayDetail'); if (!detail) return;
    if (tasks.length === 0) {
      detail.innerHTML = `<p style="font-size:11px;color:var(--text2);">${t('cal_no_tasks')}</p>`;
    } else {
      const catColors = {
        'Тело':'cat-physical','Разум':'cat-psyche','Продуктивность':'cat-intel',
        'Развлечения':'cat-shop','Быт':'cat-home','Отдых':'cat-other'
      };
      detail.innerHTML = `
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px;">${day} — ${t('cal_done_prefix')} ${tasks.length}</div>
        ${tasks.map(task => `
          <div style="display:flex;align-items:center;gap:6px;padding:3px 0;border-bottom:1px solid var(--bg3);">
            <span style="color:var(--green);">✓</span>
            <span style="flex:1;font-size:12px;">${task.text}</span>
            <span class="task-cat ${catColors[task.category]||'cat-other'}" style="font-size:10px;">${tSkill(task.category)}</span>
          </div>
        `).join('')}
      `;
    }
  });
}
