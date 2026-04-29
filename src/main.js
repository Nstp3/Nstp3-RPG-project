import { t } from './i18n/translations.js';
import { state, saveState, exportJSON, importJSON } from './state.js';
import { render } from './renderer.js';
import { setI18nState } from './i18n/translations.js';
import { THEMES } from './themes.js';

setI18nState(state);
applyTheme(state.theme || 'dark');
render();

// ── Экспорт / Импорт ─────────────────────────────────────────
document.getElementById('btnExport')?.addEventListener('click', () => {
  const blob = new Blob([exportJSON()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'life-rpg-backup.json';
  a.click();
});

document.getElementById('btnImport')?.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        importJSON(ev.target.result);
        applyTheme(state.theme || 'dark');
        render();
      } catch { alert(t('import_error')); }
    };
    reader.readAsText(file);
  };
  input.click();
});

// ── Язык ─────────────────────────────────────────────────────
document.getElementById('btnLang')?.addEventListener('click', () => {
  state.lang = state.lang === 'ru' ? 'en' : 'ru';
  saveState(); render();
});

// ── Тема — переключение по кругу через THEMES[current].next ──
export function applyTheme(themeName) {
  const def = THEMES[themeName] || THEMES.dark;
  document.body.dataset.theme = def.bodyClass || '';
  state.theme = themeName;
  saveState();
}

// Вызывается из onclick на кнопке (чтобы избежать накопления listener-ов)
window.__themeToggle = function () {
  const current = state.theme || 'dark';
  const next = THEMES[current]?.next || 'dark';
  applyTheme(next);
  render();
};
