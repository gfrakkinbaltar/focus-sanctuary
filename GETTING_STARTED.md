# Getting Started with Focus Sanctuary

Welcome to Focus Sanctuary! This guide will help you set up and start developing this immersive focus timer application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher
- **pnpm** 8.0.0 or higher

### Installing pnpm

If you don't have pnpm installed:

```bash
npm install -g pnpm
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for the monorepo and all packages.

### 2. Start Development Server

```bash
pnpm dev
```

This starts the development server for all applications. The web app will be available at:
- **http://localhost:5173** (default Vite port)

### 3. Build for Production

```bash
pnpm build
```

This builds all packages and applications for production.

## 📁 Project Structure

```
focus-sanctuary/
├── apps/
│   └── web/              # Main React PWA application
│       ├── src/
│       │   ├── components/   # UI components
│       │   ├── App.tsx       # Main app component
│       │   └── main.tsx      # Entry point
│       └── public/           # Static assets
│
├── packages/
│   ├── core/             # Timer logic & state management
│   │   ├── timer/        # Pomodoro timer store
│   │   ├── environment/  # Environment settings
│   │   └── stats/        # Statistics tracking
│   │
│   ├── three/            # 3D environments
│   │   └── environments/ # All 6 environments
│   │       ├── ForestDawn/
│   │       ├── OceanDepths/
│   │       ├── SpaceObservatory/
│   │       ├── RainOnWindow/
│   │       ├── DesertNight/
│   │       └── ZenGarden/
│   │
│   ├── audio/            # Generative soundscapes
│   │   ├── engine/       # Audio engine
│   │   └── soundscapes/  # Sound implementations
│   │
│   ├── database/         # IndexedDB wrapper (future)
│   └── ui/               # Shared UI components (future)
```

## 🎮 Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages for production
- `pnpm test` - Run tests across all packages
- `pnpm lint` - Lint all code
- `pnpm clean` - Clean build artifacts and node_modules

## 🎨 Development Features

### Hot Module Replacement (HMR)
The development server includes HMR for instant feedback:
- React components reload automatically
- 3D scenes update without full refresh
- State is preserved during development

### TypeScript
Full TypeScript support across all packages:
- Type-safe props and state
- IntelliSense in your editor
- Compile-time error checking

### Monorepo Benefits
- Shared dependencies across packages
- Type-safe imports between packages
- Coordinated builds with Turbo

## 🌿 Working with Environments

### Adding a New 3D Scene Component

1. Create a new component in `packages/three/src/environments/YourEnvironment/`:

```typescript
// NewComponent.tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const NewComponent = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state, delta) => {
    // Animation logic
    if (meshRef.current) {
      meshRef.current.rotation.y += delta
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#10b981" />
    </mesh>
  )
}
```

2. Import and use in your environment's `index.tsx`

### Environment Guidelines

- Keep scenes under 100k polygons for 60fps
- Use instancing for many similar objects
- Optimize with LOD (Level of Detail) when needed
- Test on mobile devices

## 🎵 Working with Audio

### Creating a New Soundscape

1. Create a new file in `packages/audio/src/soundscapes/`:

```typescript
// YourSoundscape.ts
import * as Tone from 'tone'
import type { Soundscape } from '../types'

export class YourSoundscape implements Soundscape {
  private volume: Tone.Volume
  private synths: Tone.Synth[] = []
  private started = false

  constructor() {
    this.volume = new Tone.Volume(-10).toDestination()
    // Add your audio nodes
  }

  async start(): Promise<void> {
    if (this.started) return
    await Tone.start()
    // Start your sounds
    this.started = true
  }

  setVolume(volume: number): void {
    this.volume.volume.value = Tone.gainToDb(volume)
  }

  stop(): void {
    // Stop all sounds
    this.started = false
  }

  dispose(): void {
    // Clean up resources
  }
}
```

2. Register in `AudioEngine.ts`

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:

1. Clean and reinstall:
```bash
pnpm clean
pnpm install
```

2. Check Node version:
```bash
node --version  # Should be 18+
```

### Type Errors

If TypeScript shows errors:
```bash
# Rebuild type declarations
pnpm build --filter=@focus-sanctuary/core
pnpm build --filter=@focus-sanctuary/three
pnpm build --filter=@focus-sanctuary/audio
```

### Performance Issues

For 3D performance problems:
- Reduce particle count in environment settings
- Lower animation speed
- Check browser console for Three.js warnings
- Use Chrome DevTools Performance tab

## 📚 Next Steps

- Read the [Architecture Documentation](./ARCHITECTURE.md)
- Check out the [Contributing Guide](./CONTRIBUTING.md)
- Explore individual package READMEs
- Join our community discussions

## 🤝 Need Help?

- Check the [FAQ](./FAQ.md)
- Open an issue on GitHub
- Review existing issues and discussions

---

Happy coding! 🌿✨
