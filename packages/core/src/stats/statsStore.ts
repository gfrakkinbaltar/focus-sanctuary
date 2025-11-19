import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DailyStats {
  date: string
  focusMinutes: number
  breakMinutes: number
  sessionsCompleted: number
  sessionsInterrupted: number
  streakDays: number
}

export interface WeeklyStats {
  week: string
  totalFocusMinutes: number
  totalBreakMinutes: number
  totalSessions: number
  averageFocusPerDay: number
  bestDay: string
}

interface StatsState {
  dailyStats: DailyStats[]
  currentStreak: number
  longestStreak: number
  totalFocusTime: number
  totalSessions: number
  
  recordSession: (minutes: number, completed: boolean) => void
  recordBreak: (minutes: number) => void
  getTodayStats: () => DailyStats
  getWeeklyStats: () => WeeklyStats[]
  reset: () => void
}

const getTodayDate = () => new Date().toISOString().split('T')[0]

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      dailyStats: [],
      currentStreak: 0,
      longestStreak: 0,
      totalFocusTime: 0,
      totalSessions: 0,
      
      recordSession: (minutes: number, completed: boolean) => {
        const today = getTodayDate()
        const state = get()
        
        const todayIndex = state.dailyStats.findIndex(d => d.date === today)
        let updatedStats = [...state.dailyStats]
        
        if (todayIndex >= 0) {
          updatedStats[todayIndex] = {
            ...updatedStats[todayIndex],
            focusMinutes: updatedStats[todayIndex].focusMinutes + minutes,
            sessionsCompleted: completed ? updatedStats[todayIndex].sessionsCompleted + 1 : updatedStats[todayIndex].sessionsCompleted,
            sessionsInterrupted: !completed ? updatedStats[todayIndex].sessionsInterrupted + 1 : updatedStats[todayIndex].sessionsInterrupted
          }
        } else {
          updatedStats.push({
            date: today,
            focusMinutes: minutes,
            breakMinutes: 0,
            sessionsCompleted: completed ? 1 : 0,
            sessionsInterrupted: !completed ? 1 : 0,
            streakDays: 0
          })
        }
        
        const newStreak = calculateStreak(updatedStats)
        
        set({
          dailyStats: updatedStats,
          totalFocusTime: state.totalFocusTime + minutes,
          totalSessions: completed ? state.totalSessions + 1 : state.totalSessions,
          currentStreak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak)
        })
      },
      
      recordBreak: (minutes: number) => {
        const today = getTodayDate()
        const state = get()
        
        const todayIndex = state.dailyStats.findIndex(d => d.date === today)
        let updatedStats = [...state.dailyStats]
        
        if (todayIndex >= 0) {
          updatedStats[todayIndex] = {
            ...updatedStats[todayIndex],
            breakMinutes: updatedStats[todayIndex].breakMinutes + minutes
          }
        }
        
        set({ dailyStats: updatedStats })
      },
      
      getTodayStats: () => {
        const today = getTodayDate()
        const state = get()
        const todayData = state.dailyStats.find(d => d.date === today)
        
        return todayData || {
          date: today,
          focusMinutes: 0,
          breakMinutes: 0,
          sessionsCompleted: 0,
          sessionsInterrupted: 0,
          streakDays: state.currentStreak
        }
      },
      
      getWeeklyStats: () => {
        const state = get()
        const weeks: Map<string, WeeklyStats> = new Map()
        
        state.dailyStats.forEach(day => {
          const weekKey = getWeekKey(day.date)
          const existing = weeks.get(weekKey)
          
          if (existing) {
            weeks.set(weekKey, {
              ...existing,
              totalFocusMinutes: existing.totalFocusMinutes + day.focusMinutes,
              totalBreakMinutes: existing.totalBreakMinutes + day.breakMinutes,
              totalSessions: existing.totalSessions + day.sessionsCompleted
            })
          } else {
            weeks.set(weekKey, {
              week: weekKey,
              totalFocusMinutes: day.focusMinutes,
              totalBreakMinutes: day.breakMinutes,
              totalSessions: day.sessionsCompleted,
              averageFocusPerDay: 0,
              bestDay: day.date
            })
          }
        })
        
        return Array.from(weeks.values()).map(week => ({
          ...week,
          averageFocusPerDay: week.totalFocusMinutes / 7
        }))
      },
      
      reset: () => {
        set({
          dailyStats: [],
          currentStreak: 0,
          longestStreak: 0,
          totalFocusTime: 0,
          totalSessions: 0
        })
      }
    }),
    {
      name: 'focus-sanctuary-stats'
    }
  )
)

function calculateStreak(stats: DailyStats[]): number {
  if (stats.length === 0) return 0
  
  const sorted = [...stats].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < sorted.length; i++) {
    const statDate = new Date(sorted[i].date)
    statDate.setHours(0, 0, 0, 0)
    
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    
    if (statDate.getTime() === expectedDate.getTime() && sorted[i].sessionsCompleted > 0) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

function getWeekKey(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const week = Math.ceil((date.getDate() + date.getDay()) / 7)
  return `${year}-W${week}`
}
