import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TimerMode = 'focus' | 'break' | 'longBreak' | 'ambient'
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

export interface TimerSettings {
  focusDuration: number // minutes
  shortBreakDuration: number
  longBreakDuration: number
  sessionsUntilLongBreak: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  notificationsEnabled: boolean
  soundEnabled: boolean
  volume: number // 0-1
}

export interface Session {
  id: string
  startTime: number
  endTime: number | null
  mode: TimerMode
  targetDuration: number
  completed: boolean
  interrupted: boolean
}

interface TimerState {
  mode: TimerMode
  status: TimerStatus
  timeRemaining: number // seconds
  targetDuration: number // seconds
  currentSession: Session | null
  completedSessions: number
  
  // Settings
  settings: TimerSettings
  
  // Actions
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  skip: () => void
  tick: () => void
  setMode: (mode: TimerMode) => void
  updateSettings: (settings: Partial<TimerSettings>) => void
}

const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  notificationsEnabled: true,
  soundEnabled: true,
  volume: 0.7
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      mode: 'focus',
      status: 'idle',
      timeRemaining: 25 * 60,
      targetDuration: 25 * 60,
      currentSession: null,
      completedSessions: 0,
      settings: DEFAULT_SETTINGS,

      start: () => {
        const state = get()
        const now = Date.now()
        
        set({
          status: 'running',
          currentSession: {
            id: `session-${now}`,
            startTime: now,
            endTime: null,
            mode: state.mode,
            targetDuration: state.targetDuration,
            completed: false,
            interrupted: false
          }
        })
      },

      pause: () => set({ status: 'paused' }),
      
      resume: () => set({ status: 'running' }),

      reset: () => {
        const state = get()
        const duration = state.settings.focusDuration * 60
        
        set({
          status: 'idle',
          timeRemaining: duration,
          targetDuration: duration,
          currentSession: null
        })
      },

      skip: () => {
        const state = get()
        const nextMode = state.mode === 'focus' 
          ? (state.completedSessions + 1) % state.settings.sessionsUntilLongBreak === 0
            ? 'longBreak'
            : 'break'
          : 'focus'
        
        get().setMode(nextMode)
        
        if (state.currentSession) {
          set({
            currentSession: {
              ...state.currentSession,
              endTime: Date.now(),
              interrupted: true
            }
          })
        }
      },

      tick: () => {
        const state = get()
        
        if (state.status !== 'running') return
        
        const newTimeRemaining = Math.max(0, state.timeRemaining - 1)
        
        set({ timeRemaining: newTimeRemaining })
        
        // Timer completed
        if (newTimeRemaining === 0) {
          set({ 
            status: 'completed',
            completedSessions: state.mode === 'focus' 
              ? state.completedSessions + 1 
              : state.completedSessions,
            currentSession: state.currentSession ? {
              ...state.currentSession,
              endTime: Date.now(),
              completed: true
            } : null
          })
        }
      },

      setMode: (mode: TimerMode) => {
        const state = get()
        const duration = mode === 'focus' 
          ? state.settings.focusDuration * 60
          : mode === 'break'
          ? state.settings.shortBreakDuration * 60
          : state.settings.longBreakDuration * 60
        
        set({
          mode,
          timeRemaining: duration,
          targetDuration: duration,
          status: 'idle'
        })
      },

      updateSettings: (newSettings: Partial<TimerSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }))
      }
    }),
    {
      name: 'focus-sanctuary-timer',
      partialize: (state) => ({
        settings: state.settings,
        completedSessions: state.completedSessions
      })
    }
  )
)

// Timer tick hook
let tickInterval: NodeJS.Timeout | null = null

export const startTimerTick = () => {
  if (tickInterval) return
  
  tickInterval = setInterval(() => {
    useTimerStore.getState().tick()
  }, 1000)
}

export const stopTimerTick = () => {
  if (tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  }
}
