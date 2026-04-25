// ============================================================
// ui/toast.js — уведомления
// type: 'xp' | 'success' | 'warn' | 'info'
// ============================================================

let timer = null;

export function showToast(message, type = 'info') {
  const el = document.getElementById('toast');
  if (!el) return;

  el.textContent = message;
  el.className = `toast toast--${type}`;

  clearTimeout(timer);
  timer = setTimeout(() => {
    el.className = 'toast hidden';
  }, 1800);
}
