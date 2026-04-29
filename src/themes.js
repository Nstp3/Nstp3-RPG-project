// ============================================================
// themes.js — реестр тем. Добавь новую тему сюда.
// ============================================================
import { ICONS } from './icons.js';

export const THEMES = {

  // ── Тёмная (по умолчанию) ────────────────────────────────
  dark: {
    label:  '⚜️',       // иконка кнопки переключения
    next:   'ac',       // следующая тема при клике
    bodyClass: '',      // data-theme на body

    // Иконки логотипа и радара
    logo:  ICONS['ic-dark-logo'],
    radar: ICONS['ic-dark-radar'],

    // Иконки статов
    stats: {
      'Здоровье':     ICONS['ic-dark-stat-hp'],
      'Настроение':   ICONS['ic-dark-stat-mood'],
      'Выносливость': ICONS['ic-dark-stat-end'],
      'Мотивация':    ICONS['ic-dark-stat-mot'],
    },

    // Иконки навыков
    skills: {
      'Тело':           ICONS['ic-dark-skill-body'],
      'Разум':          ICONS['ic-dark-skill-mind'],
      'Продуктивность': ICONS['ic-dark-skill-prod'],
      'Развлечения':    ICONS['ic-dark-skill-fun'],
      'Быт':            ICONS['ic-dark-skill-home'],
      'Отдых':          ICONS['ic-dark-skill-rest'],
    },

    // Цвета прогресс-баров навыков и радара
    skillColors: {
      'Тело':           '#ef5350',
      'Разум':          '#ab47bc',
      'Продуктивность': '#42a5f5',
      'Развлечения':    '#66bb6a',
      'Быт':            '#ffa726',
      'Отдых':          '#78909c',
    },
    radarBorder: 'rgba(0,230,118,0.6)',
    radarFill:   'rgba(0,230,118,0.07)',
    radarGrid:   'rgba(255,255,255,0.06)',
    radarLabels: '#7d8590',
    radarFont:   'Space Mono',
  },

  // ── Assassin's Creed (пергамент) ─────────────────────────
  ac: {
    label:  '🌑',
    next:   'dark',    // только 2 темы сейчас; добавь 'mythic' когда будет готова
    bodyClass: 'ac',

    logo:  ICONS['ic-ac-logo'],
    radar: ICONS['ic-new-radar'],

    stats: {
      'Здоровье':     ICONS['ic-new-stat-hp'],
      'Настроение':   ICONS['ic-new-stat-mood'],
      'Выносливость': ICONS['ic-ac-stat-end'],
      'Мотивация':    ICONS['ic-new-shield-1'],
    },

    skills: {
      'Тело':           ICONS['ic-new-stat-hp'],
      'Разум':          ICONS['ic-new-shield-2'],
      'Продуктивность': ICONS['ic-new-shield-3'],
      'Развлечения':    ICONS['ic-new-stat-mood'],
      'Быт':            ICONS['ic-new-shield-5'],
      'Отдых':          ICONS['ic-new-shield-7'],
    },

    skillColors: {
      'Тело':           '#8b1a1a',
      'Разум':          '#6b4c7a',
      'Продуктивность': '#5a7a8c',
      'Развлечения':    '#4a8b4a',
      'Быт':            '#8b5a2b',
      'Отдых':          '#6b6b6b',
    },
    radarBorder: 'rgba(139,26,26,0.6)',
    radarFill:   'rgba(139,26,26,0.08)',
    radarGrid:   'rgba(101,67,33,0.15)',
    radarLabels: '#8b6f47',
    radarFont:   'Cinzel',
  },

  // ── Шаблон для новой темы (раскомментируй и заполни) ─────
  // mythic: {
  //   label: '🔮', next: 'dark', bodyClass: 'mythic',
  //   logo: ICONS['ic-mythic-logo'], radar: ICONS['ic-mythic-radar'],
  //   stats: { 'Здоровье': ICONS['ic-mythic-stat-hp'], ... },
  //   skills: { 'Тело': ICONS['ic-mythic-skill-body'], ... },
  //   skillColors: { 'Тело': '#...' },
  //   radarBorder: '...', radarFill: '...', radarGrid: '...',
  //   radarLabels: '#...', radarFont: '...',
  // },
};

export function getTheme() {
  const name = document.body.dataset.theme || 'dark';
  return THEMES[name] || THEMES.dark;
}
