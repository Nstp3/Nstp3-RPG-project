import { state, saveState, exportJSON, importJSON } from './state.js';
import { render } from './renderer.js';
import { setI18nState } from './i18n/translations.js';

setI18nState(state);
render();

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
      try { importJSON(ev.target.result); render(); }
      catch { alert('Ошибка импорта — невалидный JSON'); }
    };
    reader.readAsText(file);
  };
  input.click();
});

document.getElementById('btnLang')?.addEventListener('click', () => {
  state.lang = state.lang === 'ru' ? 'en' : 'ru';
  saveState(); render();
});
