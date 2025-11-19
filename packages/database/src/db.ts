import Dexie, { Table } from 'dexie'

export interface Session {
  id?: number
  startTime: number
  endTime: number | null
  mode: 'focus' | 'break' | 'longBreak'
  targetDuration: number
  actualDuration: number | null
  completed: boolean
  interrupted: boolean
  environment: string
  date: string
}

export interface Settings {
  id?: number
  key: string
  value: any
  updatedAt: number
}

export interface Achievement {
  id?: number
  name: string
  description: string
  unlockedAt: number | null
  progress: number
  target: number
}

export class FocusDatabase extends Dexie {
  sessions!: Table<Session>
  settings!: Table<Settings>
  achievements!: Table<Achievement>

  constructor() {
    super('FocusSanctuary')
    
    this.version(1).stores({
      sessions: '++id, startTime, date, mode, completed',
      settings: '++id, key',
      achievements: '++id, name, unlockedAt'
    })
  }
}

export const db = new FocusDatabase()
