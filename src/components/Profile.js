// ============================================================
// components/Profile.js — левая колонка: аватар, уровень, XP
// ============================================================

import { state, saveState } from '../state.js';
import { ProgressBar } from '../ui/progressBar.js';
import { update } from '../renderer.js';

export function renderProfile() {
  const { name, avatar, level, xp } = state.profile;
  const dailyPct = Math.min(100, Math.round((state.dailyXP / state.dailyXPLimit) * 100));

  return `
    <div class="card card--profile">
      <label class="avatar" id="avatarLabel" title="Сменить аватар" style="cursor:pointer;overflow:hidden;">
  ${state.profile.avatarUrl
    ? `<img src="${state.profile.avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
    : avatar}
  <input type="file" id="avatarInput" accept="image/*" style="display:none;">
</label>

      <div class="level-badge" id="editLevel">LVL ${level}</div>
      <div class="profile-name" id="editName">${name}</div>

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
