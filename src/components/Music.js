// ============================================================
// components/Music.js — локальный плеер + SoundCloud-плеер
// ============================================================
// File-объекты нельзя сохранить в localStorage — треки
// загружаются заново при каждой сессии, метаданные не хранятся.
// SoundCloud-эмбеды хранятся в state.scEmbeds (персистируются).
// ============================================================

import { state, saveState } from '../state.js';
import { update } from '../renderer.js';
import { t } from '../i18n/translations.js';

// ── Локальный плеер (сессионные данные) ──────────────────────

let localTracks  = [];  // [{ name, url }] blob URLs — живут до закрытия вкладки
let currentIdx   = -1;
let localPlaying = false;

const audio = new Audio();
audio.addEventListener('ended',           () => nextTrack());
audio.addEventListener('timeupdate',      () => updateProgressBar());
audio.addEventListener('loadedmetadata',  () => updateProgressBar());

function formatTime(sec) {
  if (!sec || !isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateProgressBar() {
  const bar     = document.getElementById('localProgress');
  const timeCur = document.getElementById('localTimeCur');
  const timeTot = document.getElementById('localTimeTot');
  const dur = audio.duration || 0;
  const cur = audio.currentTime || 0;
  if (bar)     bar.style.width     = dur ? `${(cur / dur) * 100}%` : '0%';
  if (timeCur) timeCur.textContent = formatTime(cur);
  if (timeTot) timeTot.textContent = formatTime(dur);
}

function playTrack(idx) {
  if (idx < 0 || idx >= localTracks.length) return;
  currentIdx = idx;
  audio.src  = localTracks[idx].url;
  audio.play().catch(() => {});
  localPlaying = true;
  refreshLocalUI();
}

function togglePlay() {
  if (localTracks.length === 0) return;
  if (currentIdx < 0) { playTrack(0); return; }
  if (audio.paused) { audio.play().catch(() => {}); localPlaying = true; }
  else              { audio.pause();                 localPlaying = false; }
  refreshLocalUI();
}

function prevTrack() {
  if (!localTracks.length) return;
  playTrack(currentIdx > 0 ? currentIdx - 1 : localTracks.length - 1);
}

function nextTrack() {
  if (!localTracks.length) return;
  playTrack(currentIdx < localTracks.length - 1 ? currentIdx + 1 : 0);
}

function refreshLocalUI() {
  const playBtn    = document.getElementById('localPlayBtn');
  const nowPlaying = document.getElementById('localNowPlaying');
  if (playBtn)    playBtn.textContent    = (!audio.paused) ? '⏸' : '▶';
  if (nowPlaying) nowPlaying.textContent = currentIdx >= 0
    ? localTracks[currentIdx].name
    : t('local_no_track');

  document.querySelectorAll('.local-track-item').forEach((el, i) => {
    el.style.background = i === currentIdx ? 'var(--bg3)' : 'transparent';
    el.style.color      = i === currentIdx ? 'var(--green)' : 'var(--text2)';
  });
}

// ── SoundCloud ────────────────────────────────────────────────

function parseSCUrl(raw) {
  try {
    const url = new URL(raw.trim());
    if (!url.hostname.includes('soundcloud.com')) return null;
    const parts = url.pathname.split('/').filter(Boolean);
    // parts: [artist] | [artist, track] | [artist, 'sets', playlist]
    if (parts.length < 2) return null;
    const isSet = parts[1] === 'sets';
    const title = isSet
      ? `${slugToTitle(parts[0])} — ${slugToTitle(parts[2] || 'playlist')}`
      : `${slugToTitle(parts[0])} — ${slugToTitle(parts[1])}`;
    return { url: url.href, title, isSet };
  } catch { return null; }
}

function slugToTitle(s = '') {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function scEmbedUrl(url) {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`
    + `&color=%2300e676&auto_play=false&hide_related=true`
    + `&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
}

// ── Рендер: Локальный плеер ───────────────────────────────────

export function renderLocalPlayer() {
  const hasTracks = localTracks.length > 0;
  const curName   = currentIdx >= 0 ? localTracks[currentIdx].name : t('local_no_track');
  const playing   = !audio.paused && localPlaying;

  return `
    <div class="card" style="display:flex;flex-direction:column;gap:10px;">
      <div class="card-title">🎵 ${t('local_player')}</div>

      <div style="display:flex;gap:6px;">
        <label style="flex:1;display:flex;align-items:center;justify-content:center;gap:5px;
          background:var(--bg4);border:1px dashed var(--border2);border-radius:6px;
          padding:8px 6px;cursor:pointer;font-size:11px;color:var(--green);font-family:var(--font-mono);text-align:center;">
          + ${t('load_files')}
          <input type="file" id="localFileInput" accept="audio/*" multiple style="display:none;">
        </label>
        <label style="flex:1;display:flex;align-items:center;justify-content:center;gap:5px;
          background:var(--bg4);border:1px dashed var(--border);border-radius:6px;
          padding:8px 6px;cursor:pointer;font-size:11px;color:var(--text2);font-family:var(--font-mono);text-align:center;">
          📁 ${t('load_folder')}
          <input type="file" id="localFolderInput" accept="audio/*" webkitdirectory style="display:none;">
        </label>
      </div>

      ${hasTracks ? `
        <div style="max-height:140px;overflow-y:auto;border-radius:6px;border:1px solid var(--border);">
          ${localTracks.map((tr, i) => `
            <div class="local-track-item" data-idx="${i}" style="
              display:flex;align-items:center;gap:8px;padding:5px 8px;cursor:pointer;
              border-bottom:1px solid var(--border);font-size:11px;
              background:${i === currentIdx ? 'var(--bg3)' : 'transparent'};
              color:${i === currentIdx ? 'var(--green)' : 'var(--text2)'};">
              <span style="font-size:10px;color:var(--text3);width:18px;flex-shrink:0;">${i + 1}</span>
              <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${tr.name}</span>
              ${i === currentIdx ? `<span style="font-size:10px;">${playing ? '▶' : '⏸'}</span>` : ''}
            </div>
          `).join('')}
        </div>

        <div style="display:flex;flex-direction:column;gap:6px;">
          <div id="localProgressWrap" style="position:relative;height:4px;background:var(--bg4);border-radius:4px;cursor:pointer;">
            <div id="localProgress" style="height:100%;width:0%;background:var(--green);border-radius:4px;transition:width .3s;"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text3);font-family:var(--font-mono);">
            <span id="localTimeCur">0:00</span>
            <span id="localTimeTot">0:00</span>
          </div>
          <div style="display:flex;gap:8px;align-items:center;justify-content:center;">
            <button id="localPrevBtn" style="background:var(--bg4);border:1px solid var(--border);border-radius:6px;color:var(--text2);padding:6px 14px;cursor:pointer;font-size:14px;">⏮</button>
            <button id="localPlayBtn" style="background:var(--green-dim);border:1px solid var(--border2);border-radius:6px;color:var(--green);padding:6px 20px;cursor:pointer;font-size:18px;font-weight:700;">${playing ? '⏸' : '▶'}</button>
            <button id="localNextBtn" style="background:var(--bg4);border:1px solid var(--border);border-radius:6px;color:var(--text2);padding:6px 14px;cursor:pointer;font-size:14px;">⏭</button>
          </div>
          <div id="localNowPlaying" style="text-align:center;font-size:11px;color:var(--text2);font-family:var(--font-mono);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${curName}</div>
        </div>
      ` : `
        <p class="empty-hint" style="text-align:center;padding:12px 0;">${t('local_empty')}</p>
      `}
    </div>
  `;
}

// ── Рендер: SoundCloud ────────────────────────────────────────

export function renderSoundCloudPlayer() {
  if (!Array.isArray(state.scEmbeds)) state.scEmbeds = [];
  const active = state.scEmbeds.find(e => e.id === state.scActive);

  return `
    <div class="card" style="display:flex;flex-direction:column;gap:10px;">
      <div class="card-title" style="display:flex;align-items:center;gap:6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff5500" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.05-.1-.1-.1zm1.67-.93c-.064 0-.117.055-.124.12l-.2 3.084.2 2.942c.007.067.06.12.124.12.063 0 .116-.053.124-.12l.228-2.942-.228-3.084c-.008-.068-.06-.12-.124-.12zm1.707-.528c-.077 0-.14.064-.148.14l-.18 3.612.18 2.88c.008.078.071.14.148.14.078 0 .14-.062.149-.14l.206-2.88-.206-3.612c-.009-.077-.07-.14-.149-.14zm1.73-.308c-.09 0-.163.074-.17.164l-.16 3.92.16 2.855c.007.09.08.164.17.164.092 0 .164-.073.172-.164l.183-2.855-.183-3.92c-.008-.09-.08-.164-.172-.164zm1.746-.12c-.104 0-.188.085-.195.188l-.142 4.04.142 2.83c.007.104.09.188.195.188.105 0 .188-.084.196-.188l.16-2.83-.16-4.04c-.008-.103-.09-.188-.196-.188zm1.76-.07c-.117 0-.21.094-.216.21l-.123 4.11.123 2.805c.006.117.1.21.217.21.117 0 .21-.093.218-.21l.14-2.805-.14-4.11c-.007-.116-.1-.21-.218-.21zm1.773-.02c-.13 0-.232.103-.238.232l-.104 4.13.104 2.78c.006.13.108.232.238.232.13 0 .232-.102.24-.232l.117-2.78-.118-4.13c-.007-.13-.11-.232-.24-.232zm1.788 0c-.143 0-.255.113-.26.255l-.086 4.13.086 2.755c.005.143.117.256.26.256.143 0 .255-.113.262-.256l.097-2.755-.097-4.13c-.006-.142-.119-.255-.262-.255zm4.244-2.05c-.252-.096-.525-.147-.812-.147-.513 0-.985.165-1.368.437-.15-1.83-1.693-3.254-3.572-3.254-.49 0-.96.102-1.382.286-.152.064-.193.13-.194.188v12.6c.001.065.05.12.117.127h6.99c.475 0 .86-.385.86-.86V11.7c0-1.14-.733-2.11-1.76-2.48"/>
        </svg>
        ${t('sc_player')}
      </div>

      <!-- Ввод ссылки -->
      <div style="display:flex;gap:6px;">
        <input id="scUrlInput" type="text"
          placeholder="${t('sc_placeholder')}"
          style="flex:1;background:var(--bg4);border:1px solid var(--border);border-radius:6px;
            padding:7px 10px;color:var(--text);font-size:12px;outline:none;
            transition:border-color .2s;"
          onfocus="this.style.borderColor='var(--border2)'"
          onblur="this.style.borderColor='var(--border)'" />
        <button id="scAddBtn" style="background:var(--green-dim);border:1px solid var(--border2);
          border-radius:6px;color:var(--green);font-size:12px;font-family:var(--font-mono);
          padding:7px 12px;cursor:pointer;white-space:nowrap;">
          + ${t('sc_add')}
        </button>
      </div>

      <!-- Активный плеер -->
      ${active ? `
        <div style="border-radius:10px;overflow:hidden;border:1px solid var(--border);">
          <iframe
            src="${scEmbedUrl(active.url)}"
            style="width:100%;height:${active.isSet ? '300' : '166'}px;border:none;display:block;"
            allow="autoplay" scrolling="no">
          </iframe>
        </div>
      ` : `
        <div style="height:120px;background:var(--bg4);border-radius:10px;border:1px solid var(--border);
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;">
          <div style="font-size:28px;opacity:.25;">🎧</div>
          <p class="empty-hint" style="margin:0;">${t('sc_placeholder')}</p>
        </div>
      `}

      <!-- Сохранённые ссылки -->
      ${state.scEmbeds.length > 0 ? `
        <div style="display:flex;flex-direction:column;gap:3px;max-height:120px;overflow-y:auto;">
          ${state.scEmbeds.map(em => {
            const isActive = em.id === state.scActive;
            return `
              <div class="sc-item" data-sc-id="${em.id}" style="
                display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;
                background:${isActive ? 'var(--bg3)' : 'transparent'};
                border:1px solid ${isActive ? 'var(--border2)' : 'transparent'};transition:.15s;">
                <span style="font-size:14px;flex-shrink:0;">${em.isSet ? '📋' : '🎵'}</span>
                <span style="flex:1;font-size:11px;color:${isActive ? 'var(--green)' : 'var(--text2)'};
                  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${em.title}</span>
                <button class="sc-del-btn btn-del" data-sc-id="${em.id}" style="flex-shrink:0;">✕</button>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

// ── Байндинг: Локальный ───────────────────────────────────────

export function bindLocalPlayer() {
  function loadFiles(files) {
    const audioFiles = [...files].filter(f =>
      f.type.startsWith('audio/') || /\.(mp3|wav|ogg|flac|aac|m4a)$/i.test(f.name)
    );
    if (!audioFiles.length) return;
    localTracks.forEach(t => URL.revokeObjectURL(t.url));
    localTracks  = audioFiles.map(f => ({ name: f.name.replace(/\.[^.]+$/, ''), url: URL.createObjectURL(f) }));
    currentIdx   = -1;
    localPlaying = false;
    audio.pause();
    update();
  }

  document.getElementById('localFileInput')?.addEventListener('change',   e => loadFiles(e.target.files));
  document.getElementById('localFolderInput')?.addEventListener('change', e => loadFiles(e.target.files));
  document.getElementById('localPlayBtn')?.addEventListener('click', togglePlay);
  document.getElementById('localPrevBtn')?.addEventListener('click', prevTrack);
  document.getElementById('localNextBtn')?.addEventListener('click', nextTrack);

  document.querySelectorAll('.local-track-item').forEach(el => {
    el.addEventListener('click', () => playTrack(+el.dataset.idx));
  });

  document.getElementById('localProgressWrap')?.addEventListener('click', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (audio.duration) audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  });
}

// ── Байндинг: SoundCloud ──────────────────────────────────────

export function bindSoundCloudPlayer() {
  if (!Array.isArray(state.scEmbeds)) state.scEmbeds = [];

  function doAdd() {
    const input = document.getElementById('scUrlInput');
    const raw   = input?.value.trim();
    if (!raw) return;

    const parsed = parseSCUrl(raw);
    if (!parsed) {
      if (input) { input.style.borderColor = 'var(--red)'; input.title = 'Неверная ссылка SoundCloud'; }
      return;
    }

    const id     = encodeURIComponent(parsed.url).slice(0, 40); // короткий стабильный id
    const exists = state.scEmbeds.find(e => e.url === parsed.url);
    if (!exists) state.scEmbeds.push({ id, url: parsed.url, title: parsed.title, isSet: parsed.isSet });
    state.scActive = exists ? exists.id : id;
    saveState();
    if (input) input.value = '';
    update();
  }

  document.getElementById('scAddBtn')?.addEventListener('click', doAdd);
  document.getElementById('scUrlInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') doAdd(); });

  document.querySelectorAll('.sc-item').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.classList.contains('sc-del-btn')) return;
      state.scActive = el.dataset.scId;
      saveState(); update();
    });
  });

  document.querySelectorAll('.sc-del-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.scId;
      state.scEmbeds = state.scEmbeds.filter(e => e.id !== id);
      if (state.scActive === id) state.scActive = state.scEmbeds[0]?.id || null;
      saveState(); update();
    });
  });
}
