// ============================================================
// i18n/translations.js
// ============================================================

export const translations = {
  ru: {
    export: 'Экспорт', import: 'Импорт', lang: 'EN',
    tab_home: 'Главная', tab_tasks: 'Задачи', tab_relax: 'Досуг',
    photo: '+ фото',
    stats: 'Stats',
    health: 'Здоровье', mood: 'Настроение', stamina: 'Выносливость', motivation: 'Мотивация',
    skills: 'Skills', radar: 'Radar',
    tasks: 'Tasks', task_placeholder: 'Новая задача...', tasks_empty: 'Нет задач. Добавь первую!',
    history: 'История задач', history_empty: 'Нет выполненных задач', filter_all: 'Все',
    habits: 'Привычки', habit_placeholder: 'Новая привычка...', habits_empty: 'Нет привычек. Добавь первую!',
    pomodoro: 'Помодоро', work: 'РАБОТА', rest_label: 'ПЕРЕРЫВ',
    start: '▶ Старт', pause: '⏸ Пауза', reset: '↺ Сброс',
    work_min: 'Работа (мин)', break_min: 'Перерыв (мин)', apply: 'Применить',
    activity: 'Activity',
    movies: 'Фильмы', movie_title_placeholder: 'Название фильма...', movie_poster_placeholder: 'Ссылка на постер...',
    movie_add: 'Добавить', movies_empty: 'Нет фильмов. Добавь первый!',
    status_planned: 'Планирую', status_unwatched: 'Не смотрел', status_favorite: 'Любимые',
    filter_planned: 'Планирую', filter_unwatched: 'Не смотрел', filter_favorite: 'Любимые',
    daily_limit: 'Дневной лимит XP достигнут!',
  },
  en: {
    export: 'Export', import: 'Import', lang: 'RU',
    tab_home: 'Home', tab_tasks: 'Tasks', tab_relax: 'Leisure',
    photo: '+ photo',
    stats: 'Stats',
    health: 'Health', mood: 'Mood', stamina: 'Stamina', motivation: 'Motivation',
    skills: 'Skills', radar: 'Radar',
    tasks: 'Tasks', task_placeholder: 'New task...', tasks_empty: 'No tasks yet. Add your first one!',
    history: 'Task History', history_empty: 'No completed tasks', filter_all: 'All',
    habits: 'Habits', habit_placeholder: 'New habit...', habits_empty: 'No habits yet. Add your first one!',
    pomodoro: 'Pomodoro', work: 'WORK', rest_label: 'BREAK',
    start: '▶ Start', pause: '⏸ Pause', reset: '↺ Reset',
    work_min: 'Work (min)', break_min: 'Break (min)', apply: 'Apply',
    activity: 'Activity',
    movies: 'Movies', movie_title_placeholder: 'Movie title...', movie_poster_placeholder: 'Poster URL...',
    movie_add: 'Add', movies_empty: 'No movies. Add your first!',
    status_planned: 'Planning', status_unwatched: 'Unwatched', status_favorite: 'Favorites',
    filter_planned: 'Planning', filter_unwatched: 'Unwatched', filter_favorite: 'Favorites',
    daily_limit: 'Daily XP limit reached!',
  },
};

// Ленивый импорт state чтобы избежать circular dependency
let _state = null;
export function setI18nState(s) { _state = s; }

export function t(key) {
  const lang = _state?.lang || 'ru';
  return translations[lang]?.[key] ?? translations['ru']?.[key] ?? key;
}
