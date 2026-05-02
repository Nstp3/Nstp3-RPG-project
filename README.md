# Nstp3-RPG — Ежедневник с элементами геймификации

![preview](preview.png)

> 🌐 **Живая версия:** [nstp3.github.io](https://nstp3.github.io/)


Личный дашборд продуктивности в стиле RPG. Превращает повседневные задачи, привычки и навыки в игровую прокачку персонажа. Работает прямо в браузере — без установки, без сервера, без регистрации.

---

## 🖥️ Возможности

- **Герой** — профиль с аватаром, уровнем и опытом (XP / Daily XP)
- **Статы** — Здоровье, Настроение, Выносливость, Мотивация с прогресс-барами
- **Задачи** — добавление по категориям, выполнение даёт XP
- **Навыки** — прокачка по 6 направлениям с визуализацией прогресса
- **Радар** — паутинка, отражающая текущий баланс навыков
- **Привычки** — трекер по дням месяца с drag-выделением диапазона
- **Помодоро** — таймер с настройкой рабочего / перерывного времени
- **Activity** — график активности по дням
- **3 темы** — Стандартная · Assassin's Creed · Solo Leveling
- **Экспорт / Импорт** — бэкап прогресса в JSON
- **Мультиязычность** — RU / EN

---

## 📱 Android APK

Доступна нативная Android-версия в виде WebView-обёртки.

### Скачать APK

[**⬇️ Скачать app-release.apk**](android_version/app-release.apk)

### Установка

1. Скачай файл `app-release.apk` по ссылке выше
2. Открой файл на телефоне
3. Если появится предупреждение → **Настройки → Безопасность → Разрешить установку из неизвестных источников**
4. Нажми **Установить**
5. Иконка **Nstp3 RPG** появится на рабочем столе

> ⚠️ APK собран вручную и не проходил проверку Google Play — это нормально для личного использования.

---

## 📱 Как открыть на телефоне (без APK)

Сайт уже в интернете — просто открой ссылку и добавь на рабочий стол.

### Android — Brave / Chrome

1. Открой [nstp3.github.io](https://nstp3.github.io/) в **Brave** или **Chrome**
2. Нажми **⋮** (три точки) в правом верхнем углу
3. Выбери **«Добавить на главный экран»** или **«Установить приложение»**
4. Подтверди — иконка появится на рабочем столе

### iPhone — Safari

1. Открой [nstp3.github.io](https://nstp3.github.io/) в **Safari**
2. Нажми кнопку **«Поделиться»** (квадрат со стрелкой вверх)
3. Выбери **«На экран "Домой"»**
4. Подтверди — иконка появится на рабочем столе

---

## 💾 Бэкап данных

Все данные хранятся в `localStorage` браузера на твоём устройстве.

- **Экспорт** — кнопка «Экспорт» в топ-баре → сохранит файл `life-rpg-backup.json`
- **Импорт** — кнопка «Импорт» → выбери сохранённый файл

> ⚠️ При очистке кэша браузера данные сотрутся. Делай экспорт регулярно.

Если пользуешься с нескольких устройств — экспортируй на одном, импортируй на другом.

---

## 🎨 Темы оформления

Переключение — кнопка с иконкой в правом верхнем углу топ-бара.

| | Тема | Стиль |
|---|------|-------|
| <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAE9ElEQVR42o2VX2xTVRzHf+fcv73tvbft+r/rOlq3dmO4wSDABk4I6DQyo9BJFAVCCILJeDDwaNmL0cRnSfybgH+SLYoGAyoPqGhA/giyUf4FWMe2brNbe9utXXtv7/FhG5k6HL+3c07O53zP95zzPQALFCEEAQBEIpHH2traxJlutNA8vMD4LIBZs3bdx9Xh2t0AAF1dXXihBeiFBCOEEEA5/eu5czlFyWQBANrb20szUDIjTn9ExVEMAOCtbtrmrl4dAhjIDwwMx+/FB5MAADZvoAoAiMdf3+DwhFfOx5oXHInEEACAILlzvGDf0djYyEwV1TJN1TAAgNW5ZHuo8YUIplknbzSNzO4OHrGQ0Wh0yB7/UgAwLG9a/3nw8RWtAADBZW19gYbnTs9zFg+KeghUAABE06IklZVvsNvsWLbIKzPjqVSgbs0rJUCtOWX0kFG0F40WR3AyPTIws3vyf1Zgm7fGa3VWNVTVr30aMG6w2mxvtG+NbPT4Kt4cHx0wFHIT51Ud6UajXRXNi18FAIhGow9THMUAPxP/ktb9mDaNm12LO8vMxfeuXb0ex5iE/JU+SyIx2v/nhXPf4uEbbxVwPmv1tO5nTPY9uezomVMnv7o3y5hPMSJA90xNjmlFInru9nNvG0TpWZc3UJccHeNu3B4oSTY3Hmc9bl5a+y5vCe/LjA0VaBr6pn3unM+KTh0ASH/Pd6fH7l++qBa0Mypl2FEk8haHu9zW1LxGAiyuQoj18ZL3iK3iibZ8ZnBw6OaJrRQqCVBby8z1mJ5zqoTnzX6rs8bKy67NFGT7CrwddCJWGzjThK/CVyS0UdOIqZlgU0jgLaXUcGxY4Eq3DLz5SYhdjM15NLOKpxeyeOo7JtNDKUK7tgBrOlhQ4jcp1oRolsMYYQEjnqUYy2rZGpZzkxmKZuXFwLHAmuRaT3hF2QwIzQEfmm4wpnWMyfX8pBLvUQlvy+dS+VIh+xcBlgBQRNeBo2gTSLK3WFQ1SKeHL9PYtj6fyy4iioIAgPmnx5EYAiAIU+goYcV3dG3CNaEkiq7ypQ1myU6V1MLUlIp0TQcN6aWsLPuplcsayKLyYCCv8jsnFeVK/Yolvp17O14DABKNRvE0uLtbB0A01kf6jIJ4leEcflH0lbJKRpNlN1NUia5kCcNhFgPwcsvqIK4NijCUGCuz2CtrRLNsLoHxF6LjJABALBZDFABBQA7Bxsu3m4slZjNFs1X5Kd3hDzYLstlPpcbvFURRYGzugHA9dr+0a9ceA41V6oNPj+lmZ5D2OkVFLYz4dU3tPPnNkc8BojgWe1/HkUg7BoQIpnm/y+17SZDsNZyBRr3nP/tNI3w6HF4l0JTIXvhjCABTpK7GT/340y3i8C2jBCp7pziVyEmyNQ36BGls3CDP3GWEu7u7SxCN4h++/uRoJp3+IpseKciSzcQJXEXv2cPHvU6v+vLmTWxisKC/uGkDmxzqjQ8PXsto2d4r16982ZPKJCvTikI4k3T80qVTmQc5/u+g8FSEmnRdoBErbWdY/imDEMzs2La7luVl8Do1OHhg7+8FjRoBmPDRHJs0isJH4/13zySTNxLw0LgjBAFCBADAagXJG9rWoYzd4Z22OmPHvgOvn/j+2Omurg8PLwrIBZqzV+bTZ7vicSU995Et8A9G/hOnocAzy+fc01lBqKWlhZ4vj/8G5d7nv0KqcSsAAAAASUVORK5CYII=" width="22"> | Стандартная | Тёмно-синяя, цвета `#2e4369` · `#455bb2` · `#cdd3fd` |
| <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFbElEQVR42sWVbUxTdxTGz//eUm7foW8gUKAoRixOCcIYwvCF4GREZrYSUbPJNGS4JUtYxGToroi6kWzJNhPmUJeoUTe6JS6aySZuSPGFoYiKQkGgQJGWttDalktfbv/7IF2QaOa3na/neX7nfDh5DsD/VRhjhDFGtbXVCV98QccDAMIYo//yEXMBNE0T8wUtLS0kQghnZa2ipfKoTwEANzQ0cObraJomnud/ZsO5YowxqqjYrho0PmSOHq23A4A41JtjQy8CoffKdnx98ODhDwAAGhsbydkeCQDw28XG74KsG589dxqXbtv654qcHEXIF9IeOHBoS2Xl7m9CTAIhBACA+/oNLY6p8d211Z+otVotpmmaSxAE+/mBvWnqhPj3J+22oEwW6U9SJ6xZuCBKhxAitFotAQBQVqZVsF5H5Yhp+EZoYc7TARghhM4rJGHF6sTEYwihfISQD2MMSYtUeyUSIXeGmfELeFxObFy032Kx5G3YsGGtTqe7rNPpoLxs82fd9zrHfrlw5UeapgmEUJADAIAQApqmiZqamqq3igua9uypPGw221sTExVmkZBX6HJ7gsqouDA24AelXAYCAY9lsb9oV/kurzxGut7Q3VXY1tZZPMt49io0Gg0qLS3FArGih8vlvoOxH0WIBTuFIj4lEIqJcYtlu9U+lUOFh7mVChnJsoE8t98ZO8N48wKYa1yzfj21f/9+rNVq0VwwLikpYR022ytdnV31en3rgFwecQQHfVtIDhV84vZtf7esfOIn3a9xq1blpickxI9KJBHLuJzwIwZDr+/qtes1DON5beXKlRydTsf+eyYbN24URUQQKadOnf8bACAtbXnVRx+WVYWRQZlnhtx7/IdT6PXcrGrLhL0eY9YcHxffwQ3nnOl+YMAdHbdo04jpBABAerpmYWSkkNvc3N5DPAU5mUVxstNnjh2qyMvLo4oK12lio2XSsTGLvqLi47NUOFUYZAPM4uSkAvuUc0dd3Vd6uUxRxeNxYxUK2SIA4J488WXR5uKCPywmswQAgMjMzBQ3NPRFjI2ZTXyKU5+eqtpxVX99sPPOPTRhc7UCgJUTRvxFIsx3Ohxqq8XelJaWmnnpUpOJQ3JGx8YtuGTTGzu5BL7AMB6eYXB8Kjs7W0SqVCpCxIMKZtov9PpmFqhiFFmDo5Zv7VOuZIripSQnJ2YEZryJ/iDqZVlo8jNuc2y0ojo+UZ3gcHkGFZHi9jW5GbXX2juCwyMWvZvx2hnG+4A0mUyBGJlkxO58kg0EaViYFLN6RWrKm5FS5fHLLTe7SJITjwCEw6YxrqFv4GGEVFzu9eM2ii/uS9UsuZufm17LBnxx3b3Gk3fv9w7wOdBkeGS0kjQNxDndlEulipONW6zSaGVsY5JalZa2LFmbmqIO+gPsfduk57Z2U5Fy7eqcjOYWfd26tasnV2gSM1IXx+2zWu2kw+mr+/3KVRMCZCW4Ar3Vag2GwoMEAI5cLpcC+Is0miWcsi3FGq93pkQi4isIRN0YnXAEvF6fQioRDfMoooBlfR6b3dHcftvQc/NG+51pr6tdIJC7TSaTEwBYFDq5pUuXRvLCyZ1skH11yjF5xe32u5ZpUiKTk5QpFF+kARSuYHGAhGBwgvG423r6h/qNxjGxQEDZopQyrdvD3HK5mO+HhoYsAIDIWTCWy+VKihc+6Zn2nRwYMLZmZKRJxs2PDQ97RyzmCbsrKlq2xOOZJnoNj/oGjY/vCwSiu0IhZUpJSW3u7e3/WSCgplnWC3a70/bcGJ3/ABAC0GqzeFtL395XWlJ8cVvJpuXE02zhzte+qNCsCM01hAI9PT2dn5+fL5kHI17gfel65qu8jOEfXyd7gqjdjTwAAAAASUVORK5CYII=" width="22"> | Assassin's Creed | Пергамент, тёплые коричневые тона |
| <img src="data:image/png;base64,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" width="22"> | Solo Leveling | Тёмно-фиолетовая, неоновые акценты |

---

## 🚀 Локальный запуск (для разработки)

### Требования
- [Node.js](https://nodejs.org/) версии 18+

### Команды

```bash
# Перейди в папку проекта
cd Nstp3-RPG-project

# Установи зависимости
npm install

# Запусти локально
npm run dev
```

Откроется по адресу `http://localhost:5173`

### Сборка и деплой на GitHub Pages

```bash
npm run build
# Готовые файлы появятся в папке dist/
```

### Тест локально с телефона (одна Wi-Fi сеть)

```bash
npm run dev -- --host
```

В терминале появится Network-адрес вида `http://192.168.1.XX:5173` — вбей его в браузер телефона.

---

## 📁 Структура проекта

```
Nstp3-RPG-project/
├── android_version/
│   └── app-release.apk     # Android APK
├── preview.png             # Превью для README
├── index.html              # Точка входа
├── package.json
├── vite.config.js
├── assets/                 # Фоновые изображения и иконки
└── src/
    ├── main.js             # Инициализация, темы, события
    ├── renderer.js         # Главный рендер
    ├── state.js            # Состояние (данные пользователя)
    ├── themes.js           # Конфигурация тем
    ├── icons.js            # Все иконки в base64
    ├── xp.js               # Логика опыта и уровней
    ├── components/         # Компоненты (Stats, Tasks, Habits…)
    ├── styles/             # CSS (base, components, layout)
    ├── ui/                 # UI-утилиты (toast, progressBar…)
    └── i18n/               # Переводы RU / EN
```

---

## 🛠️ Стек

| | |
|---|---|
| Сборщик | Vite 5 |
| Язык | Vanilla JS (ES Modules), без фреймворков |
| Стили | CSS Custom Properties, 3 темы |
| Данные | localStorage |
| Графики | Chart.js |
| Хостинг | GitHub Pages |
| Android | WebView APK (Android Studio / Kotlin) |

---

*Прокачивай себя как персонажа* ⚔️
