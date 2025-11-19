# Focus Sanctuary Architecture

## 🏗️ System Overview

Focus Sanctuary is built as a monorepo using Turbo, containing multiple packages that work together to create an immersive focus experience.

```
┌─────────────────────────────────────────────────┐
│              Focus Sanctuary PWA                 │
│                                                  │
│  ┌────────────┐  ┌────────────┐  ┌───────────┐ │
│  │   Timer    │  │    3D      │  │   Audio   │ │
│  │   Core     │  │  Renderer  │  │  Engine   │ │
│  └────────────┘  └────────────┘  └───────────┘ │
│         │              │              │         │
│         └──────────────┴──────────────┘         │
│                     │                            │
│              ┌──────┴──────┐                    │
│              │  UI Layer   │                    │
│              └─────────────┘                    │
└─────────────────────────────────────────────────┘
```

## 📦 Package Architecture

### 1. @focus-sanctuary/core
The brain of the application - manages all business logic and state.

**Responsibilities:**
- Timer state machine (Pomodoro technique)
- User statistics tracking
- Environment preferences
- Session history
- Settings management

**Key Technologies:**
- Zustand for state management
- Zustand persist middleware for localStorage
- TypeScript for type safety

**State Stores:**

```typescript
// Timer Store
interface TimerState {
  mode: 'focus' | 'break' | 'longBreak' | 'ambient'
  status: 'idle' | 'running' | 'paused' | 'completed'
  timeRemaining: number
  tick(): void
  start(): void
  pause(): void
  reset(): void
}

// Stats Store
interface StatsState {
  dailyStats: DailyStats[]
  currentStreak: number
  totalFocusTime: number
  recordSession(minutes: number, completed: boolean): void
}

// Environment Store
interface EnvironmentState {
  current: Environment
  settings: EnvironmentSettings
  setEnvironment(env: Environment): void
}
```

### 2. @focus-sanctuary/three
3D rendering engine using React Three Fiber.

**Responsibilities:**
- Render 3D environments
- Manage scene objects and animations
- Handle lighting and effects
- Optimize performance

**Key Technologies:**
- Three.js for WebGL rendering
- React Three Fiber for React integration
- @react-three/drei for helpers

**Environment Structure:**
```
each environment/
├── index.tsx          # Main scene composition
├── Component1.tsx     # Individual 3D objects
├── Component2.tsx
└── shaders/          # Custom GLSL shaders (if needed)
```

**Performance Optimizations:**
- Instanced meshes for repeated objects
- LOD (Level of Detail) system
- Frustum culling
- Texture atlasing
- Geometry merging where applicable

### 3. @focus-sanctuary/audio
Generative audio engine using Tone.js.

**Responsibilities:**
- Generate adaptive soundscapes
- Manage audio context
- Handle volume control
- Sync with timer events

**Key Technologies:**
- Tone.js for Web Audio API abstraction
- Procedural audio generation
- Real-time audio processing

**Soundscape Architecture:**
```typescript
interface Soundscape {
  start(): Promise<void>
  stop(): void
  setVolume(volume: number): void
  dispose(): void
}
```

Each soundscape creates:
- Ambient background (noise, pads)
- Periodic events (bird calls, waves)
- Environmental details (wind, rain drops)

### 4. @focus-sanctuary/database (Planned)
IndexedDB wrapper for offline data persistence.

**Future Responsibilities:**
- Store session history
- Cache environment assets
- Save user preferences
- Export/import data

### 5. @focus-sanctuary/ui (Planned)
Shared UI component library.

**Future Components:**
- Button variants
- Modal system
- Form controls
- Animation presets

## 🔄 Data Flow

### Timer Flow
```
User clicks Start
    ↓
TimerStore.start()
    ↓
Creates Session object
    ↓
Starts 1-second interval
    ↓
TimerStore.tick() every second
    ↓
Updates timeRemaining
    ↓
When timeRemaining = 0
    ↓
StatsStore.recordSession()
    ↓
Auto-advance to next mode
```

### Environment Switching
```
User selects environment
    ↓
EnvironmentStore.setEnvironment()
    ↓
Triggers transition animation
    ↓
React suspends old environment
    ↓
Loads new environment
    ↓
AudioEngine switches soundscape
    ↓
Transition complete
```

### Audio Sync
```
Timer event fires
    ↓
AudioEngine notified
    ↓
Soundscape adjusts intensity
    ↓
Fade in/out effects
    ↓
New audio loop starts
```

## 🎨 UI Architecture

### Component Hierarchy
```
App
├── Canvas (Three.js)
│   ├── Camera
│   ├── Lights
│   └── CurrentEnvironment
│       ├── Ambient Objects
│       ├── Animated Elements
│       └── Particle Systems
│
├── TimerUI (Overlay)
│   ├── ModeIndicator
│   ├── TimeDisplay
│   └── Controls
│
├── EnvironmentSelector
├── AudioControls
├── StatsPanel
├── StatsModal
└── SettingsModal
```

### State Management Strategy

**Local State:** Component-specific UI state (modals open/closed)
**Zustand Stores:** Shared application state
**Props:** Parent-to-child communication
**Callbacks:** Child-to-parent communication

## 🔐 Data Persistence

### LocalStorage (via Zustand Persist)
```typescript
{
  'focus-sanctuary-timer': {
    settings: TimerSettings,
    completedSessions: number
  },
  'focus-sanctuary-environment': {
    settings: EnvironmentSettings
  },
  'focus-sanctuary-stats': {
    dailyStats: DailyStats[],
    currentStreak: number,
    ...
  }
}
```

### Future: IndexedDB
For larger datasets:
- Session history (full details)
- Environment asset cache
- Audio sample cache

## ⚡ Performance Considerations

### 3D Rendering
- Target: 60 FPS on modern devices
- Polygon budget: ~100k per scene
- Draw calls: < 50 per frame
- Texture memory: < 50MB

### Audio
- Max simultaneous voices: 20
- Reverb tail: 4-8 seconds
- Sample rate: 44.1kHz
- Bit depth: 16-bit

### Bundle Size
- Initial bundle: < 500KB (gzipped)
- Three.js: ~150KB
- Tone.js: ~100KB
- React + dependencies: ~150KB

## 🧪 Testing Strategy

### Unit Tests
- Core logic (timer calculations)
- State mutations
- Utility functions

### Integration Tests
- Timer flow
- Statistics recording
- Settings persistence

### E2E Tests
- Complete Pomodoro cycles
- Environment switching
- Audio playback

### Performance Tests
- FPS monitoring
- Memory profiling
- Bundle size checks

## 🚀 Build & Deploy

### Development
```bash
pnpm dev  # All packages in watch mode
```

### Production Build
```bash
pnpm build
# Output: apps/web/dist/
```

### PWA Deployment
- Service Worker for offline support
- Web App Manifest for installability
- Asset pre-caching
- Background sync (future)

## 🔮 Future Architecture Plans

### Mobile Apps (Capacitor)
```
focus-sanctuary/apps/
├── web/      # PWA
├── ios/      # Capacitor iOS
└── android/  # Capacitor Android
```

### Marketing Site
```
apps/marketing/
├── Landing page
├── Feature showcase
├── Blog
└── Documentation
```

### Backend (Optional)
```
apps/api/
├── User accounts
├── Cloud sync
├── Social features
└── Analytics
```

## 📝 Design Patterns

### State Management: Zustand + Middleware
- Single source of truth
- Immutable updates
- Automatic persistence
- DevTools integration

### Component Design: Container/Presentational
- Smart containers handle logic
- Dumb presenters handle display
- Props for data down
- Callbacks for events up

### 3D Scenes: Composition Pattern
- Small, reusable 3D components
- Compose into larger scenes
- Props for configuration
- React hooks for animation

### Audio: Strategy Pattern
- Soundscape interface
- Multiple implementations
- Runtime switching
- Clean disposal

---

*This architecture is designed to be scalable, maintainable, and performant. Each package has a clear responsibility and well-defined interfaces.*
