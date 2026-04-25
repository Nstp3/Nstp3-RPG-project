// ============================================================
// components/Profile.js — левая колонка: аватар, уровень, XP
// ============================================================

import { state, saveState } from '../state.js';
import { ProgressBar } from '../ui/progressBar.js';
import { update } from '../renderer.js';

export function renderProfile() {
  const { name, avatar, level, xp, avatarUrl } = state.profile;
  const dailyPct = Math.min(100, Math.round((state.dailyXP / state.dailyXPLimit) * 100));

  const bgStyle = avatarUrl
    ? `background-image:url('${avatarUrl}'); background-size:cover; background-position:center;`
    : `background:var(--bg4);`;

  return `
    <div class="card card--profile" style="padding:0; overflow:hidden;">

      <label id="avatarLabel" style="display:block; position:relative; height:200px; cursor:pointer; ${bgStyle}">
        <input type="file" id="avatarInput" accept="image/*" style="display:none;">

        <div style="
          position:absolute; inset:0;
          background:linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 50%);
        "></div>

        <div style="position:absolute; top:10px; left:12px; right:12px; display:flex; justify-content:space-between; align-items:center;">
          <span id="editName" style="font-size:14px; font-weight:600; color:#fff; cursor:pointer; text-shadow:0 1px 4px rgba(0,0,0,0.8);">${name}</span>
          <span id="editLevel" style="font-family:var(--font-mono); font-size:11px; color:var(--green); background:rgba(0,0,0,0.5); border:1px solid var(--border2); border-radius:4px; padding:2px 8px; cursor:pointer;">LVL ${level}</span>
        </div>

        ${!avatarUrl ? `<div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:40px; opacity:0.3;">${avatar}</div>` : ''}

        <div style="position:absolute; bottom:8px; right:10px; font-size:10px; color:rgba(255,255,255,0.4); font-family:var(--font-mono);">+ фото</div>
      </label>

      <div style="padding:12px;">
        <div class="xp-section">
          <div class="xp-label">
            <span>XP</span>
            <span class="mono">${xp} / 100</span>
          </div>
          ${ProgressBar(xp, 100, 'green')}
        </div>

        <div class="xp-section" style="margin-top:10px">
          <div class="xp-label">
            <span class="label-muted">Daily XP</span>
            <span class="mono label-muted">${state.dailyXP} / ${state.dailyXPLimit}</span>
          </div>
          ${ProgressBar(state.dailyXP, state.dailyXPLimit, 'amber')}
        </div>
      </div>

    </div>
  `;
}

// Привязка событий после рендера
export function bindProfile() {
  document.getElementById('editLevel')?.addEventListener('click', () => {
    const val = prompt('Уровень:', state.profile.level);
    if (val !== null && !isNaN(+val)) {
      state.profile.level = Math.max(1, Math.floor(+val));
      saveState();
      update();
    }
  });

  document.getElementById('editName')?.addEventListener('click', () => {
    const val = prompt('Имя:', state.profile.name);
    if (val?.trim()) {
      state.profile.name = val.trim();
      saveState();
      update();
    }
  });

  document.getElementById('avatarInput')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    state.profile.avatarUrl = ev.target.result; // base64
    saveState();
    update();
  };
  reader.readAsDataURL(file);
});
}
