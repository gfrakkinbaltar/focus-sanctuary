export type SoundscapeType = 'forest' | 'ocean' | 'rain' | 'space' | 'desert' | 'zen'

export interface AudioSettings {
  masterVolume: number // 0-1
  soundscapeVolume: number // 0-1
  ambienceVolume: number // 0-1
  enabled: boolean
  soundscape: SoundscapeType
}

export interface Soundscape {
  start(): Promise<void>
  stop(): void
  setVolume(volume: number): void
  dispose(): void
}
