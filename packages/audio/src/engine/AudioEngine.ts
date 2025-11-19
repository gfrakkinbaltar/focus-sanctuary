import * as Tone from 'tone'
import type { SoundscapeType, AudioSettings, Soundscape } from '../types'
import { ForestSoundscape } from '../soundscapes/ForestSoundscape'
import { OceanSoundscape } from '../soundscapes/OceanSoundscape'
import { RainSoundscape } from '../soundscapes/RainSoundscape'
import { SpaceSoundscape } from '../soundscapes/SpaceSoundscape'
import { DesertSoundscape } from '../soundscapes/DesertSoundscape'
import { ZenSoundscape } from '../soundscapes/ZenSoundscape'

export class AudioEngine {
  private static instance: AudioEngine | null = null
  private currentSoundscape: Soundscape | null = null
  private settings: AudioSettings
  private initialized = false

  private constructor() {
    this.settings = {
      masterVolume: 0.7,
      soundscapeVolume: 0.8,
      ambienceVolume: 0.6,
      enabled: true,
      soundscape: 'forest'
    }
  }

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine()
    }
    return AudioEngine.instance
  }

  async init(): Promise<void> {
    if (this.initialized) return

    try {
      await Tone.start()
      console.log('Audio engine initialized')
      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize audio:', error)
    }
  }

  async setSoundscape(type: SoundscapeType): Promise<void> {
    if (!this.initialized) {
      await this.init()
    }

    // Stop current soundscape
    if (this.currentSoundscape) {
      this.currentSoundscape.stop()
      this.currentSoundscape.dispose()
    }

    // Create new soundscape
    switch (type) {
      case 'forest':
        this.currentSoundscape = new ForestSoundscape()
        break
      case 'ocean':
        this.currentSoundscape = new OceanSoundscape()
        break
      case 'rain':
        this.currentSoundscape = new RainSoundscape()
        break
      case 'space':
        this.currentSoundscape = new SpaceSoundscape()
        break
      case 'desert':
        this.currentSoundscape = new DesertSoundscape()
        break
      case 'zen':
        this.currentSoundscape = new ZenSoundscape()
        break
      default:
        this.currentSoundscape = new ForestSoundscape()
    }

    this.settings.soundscape = type
    await this.currentSoundscape.start()
    this.updateVolumes()
  }

  setMasterVolume(volume: number): void {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume))
    this.updateVolumes()
  }

  setSoundscapeVolume(volume: number): void {
    this.settings.soundscapeVolume = Math.max(0, Math.min(1, volume))
    this.updateVolumes()
  }

  private updateVolumes(): void {
    if (this.currentSoundscape) {
      const effectiveVolume = this.settings.masterVolume * this.settings.soundscapeVolume
      this.currentSoundscape.setVolume(effectiveVolume)
    }
  }

  getSettings(): AudioSettings {
    return { ...this.settings }
  }

  stop(): void {
    if (this.currentSoundscape) {
      this.currentSoundscape.stop()
    }
  }

  dispose(): void {
    if (this.currentSoundscape) {
      this.currentSoundscape.dispose()
      this.currentSoundscape = null
    }
  }
}
