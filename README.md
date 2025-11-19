# 🌿 Focus Sanctuary

> An immersive focus timer with breathtaking 3D environments and generative soundscapes

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://focus-sanctuary-hyr9laq9a-rahbii-2903s-projects.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r168-black)](https://threejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

- **6+ Stunning 3D Environments**: Forest Dawn, Ocean Depths, Space Observatory, Rain on Window, Desert Night, Zen Garden
- **Pomodoro Timer**: Customizable focus/break durations with automatic cycling
- **Generative Soundscapes**: Adaptive audio that responds to your environment
- **GPU-Accelerated Graphics**: Smooth 60fps with low-poly aesthetics
- **Progressive Web App**: Install on any device, works offline
- **Privacy-First**: All data stored locally, no tracking
- **Customizable**: Adjust durations, sounds, visuals to your preference

## 🚀 Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Three.js** + **React Three Fiber** for 3D rendering
- **Framer Motion** for smooth UI animations
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Tone.js** + **Howler.js** for audio
- **TurboRepo** for monorepo management

## 📦 Project Structure

```
focus-sanctuary/
├── apps/
│   ├── web/           # Main PWA application
│   ├── mobile/        # Capacitor mobile app (coming soon)
│   └── marketing/     # Marketing website (coming soon)
└── packages/
    ├── core/          # Timer logic & state management
    ├── three/         # 3D environments & components
    ├── audio/         # Generative soundscapes (coming soon)
    ├── database/      # IndexedDB wrapper (coming soon)
    └── ui/            # Shared UI components (coming soon)
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Available Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps for production
- `pnpm test` - Run tests across all packages
- `pnpm lint` - Lint all packages
- `pnpm clean` - Clean all build artifacts

## 🎨 Environments

### ✅ Forest Dawn (Implemented)
- Swaying trees with wind physics
- GPU-accelerated fireflies with custom shaders
- Dynamic sunrise animation
- Atmospheric fog

### 🚧 Coming Soon
- 🌊 Ocean Depths
- 🌌 Space Observatory  
- 🌧️ Rain on Window
- 🏜️ Desert Night
- 🌸 Zen Garden

## 🎯 Roadmap

### Phase 1: MVP (Current)
- [x] Core timer functionality
- [x] Forest Dawn environment
- [x] Basic UI with Framer Motion animations
- [ ] PWA configuration
- [ ] Mobile responsive design

### Phase 2: Enhancement
- [ ] Generative soundscapes with Tone.js
- [ ] Additional environments
- [ ] Statistics & insights
- [ ] Custom themes

### Phase 3: Polish
- [ ] Mobile app (iOS/Android via Capacitor)
- [ ] Social features (optional)
- [ ] Marketing website
- [ ] App store deployment

## 🤝 Contributing

This is currently a personal project, but contributions are welcome! Please open an issue first to discuss any changes.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Inspired by the Pomodoro Technique
- Built with love for focused work
- Designed for digital wellbeing

---

**Focus better. Live better. 🌿✨**
