# vidyo

<div align="center">

```
  █ █ ███ ██◥ █ █ ◢█◣
  █ █  █  █ █ ◥█◤ █ █
   █  ███ ██◢  █  ◥█◤
```

### **Stream to storage in seconds. Paste, pick, play.**

[![npm version](https://img.shields.io/npm/v/vidyo-cli.svg?color=brightgreen&style=flat-square)](https://www.npmjs.com/package/vidyo-cli)
[![npm downloads](https://img.shields.io/npm/dm/vidyo-cli.svg?color=blue&style=flat-square)](https://www.npmjs.com/package/vidyo-cli)
[![total downloads](https://img.shields.io/npm/dt/vidyo-cli.svg?color=orange&style=flat-square)](https://www.npmjs.com/package/vidyo-cli)
[![license](https://img.shields.io/github/license/HA2345567/vidyo.svg?style=flat-square)](LICENSE)
[![node version](https://img.shields.io/badge/node-%3E%3D18-blue.svg?style=flat-square)](https://nodejs.org)
[![bun](https://img.shields.io/badge/bun-%3E%3D1.0-black.svg?style=flat-square)](https://bun.sh)

A luxurious, blazing-fast **Terminal UI** for searching and downloading videos/audio from YouTube, Instagram, X (Twitter), TikTok, Threads, Reddit, and **1000+ sites** — all from your command line.

</div>

---

## 📸 Preview

<div align="center">
  <img src="public/vidyo_preview.gif" alt="VIDYO Terminal UI Preview" width="750" />
</div>

---

## ✨ Features

- 🔍 **Interactive YouTube Search** — Type any search term (e.g. `lofi study beats`) to browse and pick videos directly inside the terminal.
- 🎬 **1000+ Supported Sites** — YouTube, Instagram, X, TikTok, Threads, Reddit, Vimeo, SoundCloud, and more (powered by `yt-dlp`).
- 🎵 **Audio Extraction Presets** — High quality MP3 (320k), M4A (AAC), FLAC (Lossless), and WAV (Uncompressed).
- ⚡ **Instant Clipboard Auto-Paste** — Auto-detects video links in your clipboard before you type.
- 🎨 **15 Color Themes** — Instant theme switching with `Ctrl + T` (Red, Yellow, Sunset, Neon, Dracula, Nord, Catppuccin, Matrix, Cyberpunk, etc.).
- 📊 **Real-time Download Progress** — Live speed meter, ETA, and progress bar.
- 🖱️ **Full Mouse & Keyboard Support** — Interactive TUI click targets for menus, logo, and buttons.
- 🕒 **Download History** — Quickly recall past downloaded URLs with `↑` arrow key.
- 🎞️ **Bundled FFmpeg** — Automatic audio conversion and video stream merging with zero manual setup.
- 💾 **Automatic Storage** — Saves media directly to your local `~/Downloads` folder.

---

## 🚀 Quick Start

Run instantly without installing anything:

```bash
bunx vidyo-cli@latest
# or
npx vidyo-cli@latest
```

### Global Installation

```bash
bun install -g vidyo-cli
# or
npm install -g vidyo-cli
```

Once installed globally, simply run:
```bash
vidyo
```

---

## 🎮 How to Use

### 1. Download by URL
Paste any video link into the prompt and hit `Enter`:
```
https://www.youtube.com/watch?v=...
https://youtu.be/...
https://www.instagram.com/reel/...
```

### 2. Search Videos Directly
Type any search query into the prompt (e.g., `coding lofi beats` or `react 19 tutorial`). **vidyo** will fetch YouTube search results in an interactive list for you to choose from!

### 3. Choose Format & Quality
Select your desired video resolution (`1080p`, `720p`, `480p`, etc.) or audio extraction preset (`MP3`, `M4A`, `FLAC`, `WAV`).

---

## ⌨️ Shortcuts & Controls

| Key | Action |
| :--- | :--- |
| `↵ Enter` | Grab video / Confirm selection |
| `↑ / ↓` | Navigate menus & search results |
| `↑ (at input)` | Open download history |
| `Ctrl + T` | Cycle color theme (15 themes) |
| `Esc` | Back to input / Cancel download |
| `Ctrl + C` | Quit application |
| `Mouse Click` | Click any button, menu item, or logo |

---

## 🎨 Theme Gallery

Cycle through 15 themes seamlessly in real-time with `Ctrl + T`:

| Theme | Description |
| :--- | :--- |
| **`auto`** | Adaptive system terminal theme |
| **`light`** | Clean high-contrast light mode |
| **`dark`** | Deep dark obsidian palette |
| **`red`** | Crimson ruby accent |
| **`yellow`** | Amber gold theme |
| **`sunset`** | Warm sunset orange |
| **`neon`** | Electric teal & hot pink |
| **`dracula`** | Classic Dracula purple |
| **`nord`** | Arctic frost blue |
| **`catppuccin`** | Warm Mocha pastel |
| **`tokyo`** | Tokyo Night neon |
| **`gruvbox`** | Retro warm earthy tones |
| **`rosepine`** | Elegant rose & pine |
| **`matrix`** | Digital rain green |
| **`cyberpunk`** | High-voltage neon cyan |

---

## 🛠️ Development Setup

```bash
# 1. Clone repo
git clone https://github.com/HA2345567/vidyo.git
cd vidyo

# 2. Install dependencies
bun install

# 3. Run locally
bun start

# 4. Run tests
bun test

# 5. Typecheck & Lint
bun run typecheck
bun run lint
```

---

## 📁 Architecture & File Structure

```
vidyo/
├── src/
│   ├── App.tsx                  # Core TUI Application logic & state
│   ├── cli.tsx                  # CLI entry point & argument parser
│   ├── theme.tsx                # Theme provider & 15 color definitions
│   ├── components/
│   │   ├── logo.tsx             # Animated VIDYO ASCII Header Logo
│   │   ├── framed-input.tsx     # Custom TUI Framed Input component
│   │   ├── fullscreen.tsx       # Full terminal canvas wrapper
│   │   ├── pannel.tsx           # TUI Panel container
│   │   ├── progress-bar.tsx     # Smooth download progress bar
│   │   ├── shortcuts-bar.tsx    # Interactive shortcuts footer bar
│   │   └── text-input.tsx       # Styled text input control
│   └── lib/
│       ├── ytdlp.ts             # yt-dlp process wrapper & search engine
│       ├── clipboard.ts         # System clipboard detector
│       ├── history.ts           # JSON Download History storage
│       ├── format.ts            # Speed, ETA & byte formatting helpers
│       ├── format.test.ts       # Unit test suite
│       ├── platform.ts          # Supported site detector
│       ├── click-map.ts         # Mouse click target calculator
│       └── use-mouse-click.ts   # Ink TUI mouse click listener
├── public/
│   └── vidyo_terminal_pic.png   # README Preview Screenshot
├── package.json                 # Project manifest & CLI bin config
├── tsup.config.json             # tsup CLI bundler settings
└── README.md
```

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<div align="center">
  <sub>Built with ❤️ for developers who love the terminal.</sub>
</div>
