// ============================================================
// components/Movies.js — блок с фильмами
// ============================================================

import { state, saveState } from '../state.js';
import { update } from '../renderer.js';
import { t } from '../i18n/translations.js';

let currentFilter = 'all'; // all | planned | unwatched | favorite

export function renderMovies() {
  if (!Array.isArray(state.movies)) state.movies = [];

  const filters = [
    { key: 'all',       label: t('filter_all') },
    { key: 'planned',   label: t('filter_planned') },
    { key: 'unwatched', label: t('filter_unwatched') },
    { key: 'favorite',  label: t('filter_favorite') },
  ];

  const filtered = currentFilter === 'all'
    ? state.movies
    : state.movies.filter(m => m.status === currentFilter);

  return `
    <div class="card" id="moviesCard">
      <div class="card-title" style="display:flex;justify-content:space-between;align-items:center;">
        <span>${t('movies')}</span>
      </div>

      <!-- Форма добавления -->
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
        <div style="display:flex;gap:8px;">
          <input
            id="movieTitleInput"
            type="text"
            placeholder="${t('movie_title_placeholder')}"
            style="flex:1;background:var(--bg4);border:1px solid var(--border);border-radius:6px;padding:7px 10px;color:var(--text);font-size:13px;outline:none;"
          >
          <label id="moviePosterLabel" style="cursor:pointer;display:flex;align-items:center;justify-content:center;background:var(--bg4);border:1px solid var(--border);border-radius:6px;padding:7px 10px;color:var(--text2);font-size:13px;white-space:nowrap;" title="Загрузить постер">
            + 🖼
            <input type="file" id="moviePosterFile" accept="image/*" style="display:none;">
          </label>
        </div>
        <div style="display:flex;gap:8px;">
          <input
            id="moviePosterInput"
            type="text"
            placeholder="${t('movie_poster_placeholder')}"
            style="flex:1;background:var(--bg4);border:1px solid var(--border);border-radius:6px;padding:7px 10px;color:var(--text);font-size:13px;outline:none;"
          >
          <button id="addMovieBtn" style="background:var(--green);color:#000;border:none;border-radius:6px;padding:7px 14px;font-size:13px;font-weight:600;cursor:pointer;">${t('movie_add')}</button>
        </div>
      </div>

      <!-- Фильтры -->
      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;">
        ${filters.map(f => `
          <button class="movie-filter-btn" data-filter="${f.key}" style="
            background:${currentFilter === f.key ? 'var(--green)' : 'var(--bg4)'};
            color:${currentFilter === f.key ? '#000' : 'var(--text2)'};
            border:none;border-radius:6px;padding:4px 12px;font-size:12px;cursor:pointer;
          ">${f.label}</button>
        `).join('')}
      </div>

      <!-- Список фильмов -->
      ${filtered.length === 0
        ? `<p class="empty-hint">${t('movies_empty')}</p>`
        : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;">
            ${filtered.map(m => `
              <div class="movie-card" data-id="${m.id}" style="background:var(--bg3);border-radius:8px;overflow:hidden;position:relative;">
                <div style="height:160px;background:var(--bg4);overflow:hidden;">
                  ${m.poster
                    ? `<img src="${m.poster}" alt="${m.title}" style="width:100%;height:100%;object-fit:cover;">`
                    : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:32px;">🎬</div>`
                  }
                </div>
                <div style="padding:6px;">
                  <div style="font-size:11px;font-weight:600;color:var(--text);margin-bottom:4px;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${m.title}</div>
                  <div style="display:flex;gap:4px;flex-wrap:wrap;">
                    ${m.status !== 'planned'   ? `<button class="movie-status-btn" data-id="${m.id}" data-status="planned"   style="font-size:9px;padding:2px 5px;border:none;border-radius:4px;cursor:pointer;background:var(--bg4);color:var(--text2);">📋</button>` : `<span style="font-size:9px;padding:2px 5px;border-radius:4px;background:var(--blue);color:#fff;">📋</span>`}
                    ${m.status !== 'unwatched' ? `<button class="movie-status-btn" data-id="${m.id}" data-status="unwatched" style="font-size:9px;padding:2px 5px;border:none;border-radius:4px;cursor:pointer;background:var(--bg4);color:var(--text2);">👁</button>` : `<span style="font-size:9px;padding:2px 5px;border-radius:4px;background:var(--amber);color:#000;">👁</span>`}
                    ${m.status !== 'favorite'  ? `<button class="movie-status-btn" data-id="${m.id}" data-status="favorite"  style="font-size:9px;padding:2px 5px;border:none;border-radius:4px;cursor:pointer;background:var(--bg4);color:var(--text2);">⭐</button>` : `<span style="font-size:9px;padding:2px 5px;border-radius:4px;background:var(--red);color:#fff;">⭐</span>`}
                    <button class="movie-del-btn" data-id="${m.id}" style="font-size:9px;padding:2px 5px;border:none;border-radius:4px;cursor:pointer;background:var(--bg4);color:var(--red);margin-left:auto;">✕</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>`
      }
    </div>
  `;
}

export function bindMovies() {
  // Фильтры
  document.querySelectorAll('.movie-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      update();
    });
  });

  // Загрузка постера файлом
  document.getElementById('moviePosterFile')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const input = document.getElementById('moviePosterInput');
      if (input) input.value = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Добавить фильм
  const addBtn = document.getElementById('addMovieBtn');
  const titleInput = document.getElementById('movieTitleInput');
  const posterInput = document.getElementById('moviePosterInput');

  const doAdd = () => {
    const title = titleInput?.value.trim();
    if (!title) return;
    state.movies.push({
      id: Date.now(),
      title,
      poster: posterInput?.value.trim() || '',
      status: 'planned',
    });
    saveState();
    if (titleInput) titleInput.value = '';
    if (posterInput) posterInput.value = '';
    update();
  };

  addBtn?.addEventListener('click', doAdd);
  titleInput?.addEventListener('keydown', e => { if (e.key === 'Enter') doAdd(); });

  // Смена статуса
  document.querySelectorAll('.movie-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = +btn.dataset.id;
      const movie = state.movies.find(m => m.id === id);
      if (movie) { movie.status = btn.dataset.status; saveState(); update(); }
    });
  });

  // Удалить фильм
  document.querySelectorAll('.movie-del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = +btn.dataset.id;
      state.movies = state.movies.filter(m => m.id !== id);
      saveState();
      update();
    });
  });
}
