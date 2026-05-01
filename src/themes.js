// ============================================================
// themes.js — реестр тем. Добавь новую тему сюда.
// ============================================================
import { ICONS } from './icons.js';

export const THEMES = {

  // ── Тёмная (по умолчанию) ────────────────────────────────
  dark: {
    label:  '🌊',
    next:   'ac',
    bodyClass: '',

    logo:  ICONS['ic-dark-logo-new'],
    radar: ICONS['ic-dark-radar'],

    // Статы — эмодзи вместо иконок
    stats: {
      'Здоровье':     '❤️',
      'Настроение':   '😊',
      'Выносливость': '⚡',
      'Мотивация':    '🔥',
    },

    // Навыки — без иконок
    skills: {},

    skillColors: {
      'Тело':           '#6e8fd4',
      'Разум':          '#9b8fea',
      'Продуктивность': '#7eb8f5',
      'Развлечения':    '#72c9a0',
      'Быт':            '#f0a36b',
      'Отдых':          '#8fa8c8',
    },
    radarBorder: 'rgba(197, 213, 253, 0.65)',
    radarFill:   'rgba(69, 91, 178, 0.12)',
    radarGrid:   'rgba(205, 211, 253, 0.07)',
    radarLabels: '#8a9cc8',
    radarFont:   'Space Mono',
  },

  // ── Assassin's Creed (пергамент) ─────────────────────────
  ac: {
    label:  '🌑',
    next:   'mythic',
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

  // ── Mythic (тёмно-фиолетовая, Solo Leveling) ─────────────
  mythic: {
    label:  '⚜️',
    next:   'dark',
    bodyClass: 'mythic',

    logo:  ICONS['ic-m-logo'],
    radar: ICONS['ic-dark-radar'],   // переиспользуем — подходит по стилю

    stats: {
      'Здоровье':     ICONS['ic-m-stat-hp'],
      'Настроение':   ICONS['ic-m-stat-mood'],
      'Выносливость': ICONS['ic-m-stat-end'],
      'Мотивация':    ICONS['ic-m-stat-mot'],
    },

    skills: {},  // без иконок в блоке навыков

    skillColors: {
      'Тело':           '#7c3aed',
      'Разум':          '#6d28d9',
      'Продуктивность': '#8b5cf6',
      'Развлечения':    '#a78bfa',
      'Быт':            '#5b21b6',
      'Отдых':          '#4c1d95',
    },
    radarBorder: 'rgba(167,139,250,0.7)',
    radarFill:   'rgba(124,58,237,0.12)',
    radarGrid:   'rgba(167,139,250,0.08)',
    radarLabels: '#a78bfa',
    radarFont:   'Space Mono',
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
