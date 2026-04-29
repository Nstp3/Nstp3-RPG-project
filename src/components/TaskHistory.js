import { state } from '../state.js';
import { update } from '../renderer.js';
import { t, tSkill } from '../i18n/translations.js';

const SKILL_KEYS = ['Тело','Разум','Продуктивность','Развлечения','Быт','Отдых'];
let historyFilter = 'all';

const catColors = {
  'Тело':'cat-physical','Разум':'cat-psyche','Продуктивность':'cat-intel',
  'Развлечения':'cat-shop','Быт':'cat-home','Отдых':'cat-other',
};

export function renderTaskHistory() {
  const history  = state.taskHistory || [];
  const filtered = historyFilter === 'all'
    ? history
    : history.filter(h => h.category === historyFilter);

  // Группировка по дате, свежие сверху
  const byDate = {};
  [...filtered].reverse().forEach(task => {
    const date = new Date(task.completedAt).toLocaleDateString(
      state.lang === 'en' ? 'en-US' : 'ru-RU',
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(task);
  });

  return `
    <div class="card">
      <div class="card-title">${t('history')}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
        <button class="hist-filter-btn" data-cat="all" style="
          background:${historyFilter === 'all' ? 'var(--green)' : 'var(--bg4)'};
          color:${historyFilter === 'all' ? '#000' : 'var(--text2)'};
          border:none;border-radius:6px;padding:4px 10px;font-size:11px;cursor:pointer;">
          ${t('filter_all')}
        </button>
        ${SKILL_KEYS.map(k => `
          <button class="hist-filter-btn" data-cat="${k}" style="
            background:${historyFilter === k ? 'var(--green)' : 'var(--bg4)'};
            color:${historyFilter === k ? '#000' : 'var(--text2)'};
            border:none;border-radius:6px;padding:4px 10px;font-size:11px;cursor:pointer;">
            ${tSkill(k)}
          </button>
        `).join('')}
      </div>
      ${Object.keys(byDate).length === 0
        ? `<p class="empty-hint">${t('history_empty')}</p>`
        : Object.entries(byDate).map(([date, tasks]) => `
            <div style="margin-bottom:14px;">
              <div style="font-size:11px;color:var(--text2);font-family:var(--font-mono);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px;">${date}</div>
              ${tasks.map(task => `
                <div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--bg3);">
                  <span style="color:var(--green);font-size:13px;">✓</span>
                  <span style="flex:1;font-size:13px;color:var(--text);">${task.text}</span>
                  <span class="task-cat ${catColors[task.category]||'cat-other'}" style="font-size:10px;">${tSkill(task.category)}</span>
                </div>
              `).join('')}
            </div>
          `).join('')
      }
    </div>
  `;
}

export function bindTaskHistory() {
  document.querySelectorAll('.hist-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      historyFilter = btn.dataset.cat;
      update();
    });
  });
}
