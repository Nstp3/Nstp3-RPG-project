// ============================================================
// ui/progressBar.js — универсальный компонент прогресс-бара
// Возвращает HTML-строку. Используется во всех модулях.
// ============================================================

/**
 * @param {number} value   — текущее значение (0–max)
 * @param {number} max     — максимум (по умолчанию 100)
 * @param {string} variant — CSS-класс для цвета ('', 'hp', 'mood', 'focus', 'mot', 'green')
 */
export function ProgressBar(value, max = 100, variant = '') {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  return `
    <div class="progress">
      <div class="progress-bar progress-bar--${variant || 'green'}" style="width:${pct}%"></div>
    </div>
  `;
}
