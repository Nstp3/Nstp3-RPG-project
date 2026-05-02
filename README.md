# Nstp3-RPG — Gamified Productivity Dashboard

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="readme_assets/preview.png" width="100%" alt="Desktop"><br><sub>Desktop</sub></td>
      <td align="center" width="32%"><img src="readme_assets/preview-mobile.jpg" width="100%" alt="Mobile"><br><sub>Mobile</sub></td>
    </tr>
  </table>

  <strong>🇬🇧 English</strong> &nbsp;·&nbsp; <a href="README.ru.md">🇷🇺 Русский</a>

  <br>

  <a href="https://nstp3.github.io/">🌐 Live Demo</a> &nbsp;·&nbsp;
  <a href="android_version/app-release.apk">⬇️ Android APK</a>
</div>

<br>

A personal RPG-style productivity dashboard. Turn your daily tasks, habits and skills into character progression. Runs entirely in the browser — no install, no server, no account needed.

---

## ✨ Features

- **Hero profile** — avatar, level and XP / Daily XP tracking
- **Stats** — Health, Mood, Stamina, Motivation with progress bars
- **Tasks** — add by category, completing tasks earns XP
- **Skills** — level up 6 skill tracks with visual progress bars
- **Radar chart** — spider chart showing your current skill balance
- **Habits** — monthly day tracker with drag-to-select range and day labels
- **Pomodoro** — focus timer with configurable work / break duration
- **Activity** — daily activity line chart
- **3 themes** — Default · Assassin's Creed · Solo Leveling
- **Export / Import** — JSON backup of all your progress
- **Bilingual** — RU / EN

---

## 📱 Android APK

A native Android WebView wrapper is available. Works **offline** — all files are bundled inside the app.

### Download

[**⬇️ Download app-release.apk**](android_version/app-release.apk)

### Install

1. Download `app-release.apk`
2. Open the file on your phone
3. If prompted → **Settings → Security → Allow installs from unknown sources**
4. Tap **Install**
5. The **Nstp3 RPG** icon will appear on your home screen

> ⚠️ This APK is self-signed and not published on Google Play — that's fine for personal use.

---

## 📱 Add to Home Screen (without APK)

The site is already live — just open the link and add it to your home screen.

### Android — Brave / Chrome

1. Open [nstp3.github.io](https://nstp3.github.io/) in **Brave** or **Chrome**
2. Tap **⋮** (three dots) in the top-right corner
3. Select **"Add to Home Screen"** or **"Install app"**
4. Confirm — the icon will appear on your home screen

### iPhone — Safari

1. Open [nstp3.github.io](https://nstp3.github.io/) in **Safari**
2. Tap the **Share** button (box with arrow)
3. Select **"Add to Home Screen"**
4. Confirm — the icon will appear on your home screen

---

## 💾 Data Backup

All data is stored in **IndexedDB** in your browser (~500 MB limit).

- **Export** — click "Export" in the top bar → saves `life-rpg-backup.json`
- **Import** — click "Import" → pick your saved file

> ⚠️ Clearing browser data will erase your progress. Export regularly.

---

## 🎨 Themes

Switch themes via the icon button in the top-right corner (dropdown).

| | Theme | Style |
|---|------|-------|
| <img src="readme_assets/theme-dark.png" width="22" height="22"> | Default | Dark blue — `#2e4369` · `#455bb2` · `#cdd3fd` |
| <img src="readme_assets/theme-ac.png" width="22" height="22"> | Assassin's Creed | Parchment, warm brown tones |
| <img src="readme_assets/theme-mythic.png" width="22" height="22"> | Solo Leveling | Dark purple with neon accents |

---

## 🚀 Local Development

### Requirements
- [Node.js](https://nodejs.org/) 18+

```bash
cd nstp3-rpg
npm install
npm run dev
```

Opens at `http://localhost:5173`

### Build & Deploy to GitHub Pages

```bash
npm run build
# Output in dist/
```

### Test on mobile (same Wi-Fi)

```bash
npm run dev -- --host
```

Use the Network address shown in the terminal on your phone browser.

---

## 🤖 Rebuild Android APK

```bash
cd nstp3-rpg && \
BUILD_TARGET=android npm run build && \
rm -r ~/AndroidStudioProjects/Nstp3RPG/app/src/main/assets/* && \
cp -r dist-android/* ~/AndroidStudioProjects/Nstp3RPG/app/src/main/assets && \
echo "✓ Done — build APK in Android Studio"
```

Then in Android Studio: **Build → Generate Signed APK → release → Finish**

---

## 📁 Project Structure

```
nstp3-rpg/
├── android_version/
│   └── app-release.apk       # Android APK (offline)
├── readme_assets/            # Theme icons for README
├── index.html
├── package.json
├── vite.config.js
├── assets/                   # Background images & icons
└── src/
    ├── main.js               # Init, themes, events
    ├── renderer.js           # Render engine (desktop + mobile)
    ├── state.js              # App state
    ├── db.js                 # IndexedDB wrapper
    ├── themes.js             # Theme config
    ├── icons.js              # Icons as base64
    ├── xp.js                 # XP & level logic
    ├── components/           # UI components
    ├── styles/               # CSS (base, components, layout)
    ├── ui/                   # Utilities (toast, progressBar…)
    └── i18n/                 # RU / EN translations
```

---

## 🛠️ Stack

| | |
|---|---|
| Bundler | Vite 5 |
| Language | Vanilla JS (ES Modules), no frameworks |
| Styles | CSS Custom Properties, 3 themes |
| Storage | IndexedDB |
| Charts | Chart.js |
| Hosting | GitHub Pages |
| Android | WebView APK (Android Studio / Kotlin), offline |

---

*Level up your real life* ⚔️
