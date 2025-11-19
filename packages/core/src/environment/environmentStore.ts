import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Environment = 
  | 'forestDawn'
  | 'oceanDepths'
  | 'spaceObservatory'
  | 'rainOnWindow'
  | 'desertNight'
  | 'zenGarden'

export interface EnvironmentSettings {
  current: Environment
  transitionDuration: number
  ambientIntensity: number
  particleDensity: number
  animationSpeed: number
}

interface EnvironmentState {
  settings: EnvironmentSettings
  isTransitioning: boolean
  setEnvironment: (env: Environment) => void
  updateSettings: (settings: Partial<EnvironmentSettings>) => void
  setTransitioning: (transitioning: boolean) => void
}

const DEFAULT_SETTINGS: EnvironmentSettings = {
  current: 'forestDawn',
  transitionDuration: 2,
  ambientIntensity: 0.8,
  particleDensity: 0.7,
  animationSpeed: 0.5
}

export const useEnvironmentStore = create<EnvironmentState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      isTransitioning: false,
      
      setEnvironment: (env: Environment) => {
        set(state => ({
          settings: { ...state.settings, current: env },
          isTransitioning: true
        }))
        setTimeout(() => {
          set({ isTransitioning: false })
        }, DEFAULT_SETTINGS.transitionDuration * 1000)
      },
      
      updateSettings: (newSettings: Partial<EnvironmentSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }))
      },
      
      setTransitioning: (transitioning: boolean) => {
        set({ isTransitioning: transitioning })
      }
    }),
    {
      name: 'focus-sanctuary-environment'
    }
  )
)
