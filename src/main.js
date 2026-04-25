// ============================================================
// main.js — точка входа
// Инициализация, глобальные обработчики
// ============================================================

import { state, exportJSON, importJSON } from './state.js';
import { render } from './renderer.js';

// ── Запуск ──────────────────────────────────────────────────
render();

// ── Экспорт / Импорт ────────────────────────────────────────
document.getElementById('exportBtn')?.addEventListener('click', () => {
  const json = exportJSON();
  navigator.clipboard.writeText(json).then(() => {
    alert('Скопировано в буфер!');
  }).catch(() => {
    // Fallback для браузеров без clipboard API
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'life-rpg-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  });
});

document.getElementById('importBtn')?.addEventListener('click', () => {
  const json = prompt('Вставь JSON для импорта:');
  if (!json) return;
  try {
    importJSON(json);
    render();
    alert('Импорт успешен!');
  } catch {
    alert('Неверный JSON.');
  }
});
