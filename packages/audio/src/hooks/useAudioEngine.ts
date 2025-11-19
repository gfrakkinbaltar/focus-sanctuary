import { useEffect, useCallback } from 'react'
import { AudioEngine } from '../engine/AudioEngine'
import type { SoundscapeType } from '../types'

export const useAudioEngine = () => {
  const audioEngine = AudioEngine.getInstance()

  useEffect(() => {
    // Initialize on mount
    audioEngine.init()

    // Cleanup on unmount
    return () => {
      audioEngine.stop()
    }
  }, [])

  const setSoundscape = useCallback(async (type: SoundscapeType) => {
    await audioEngine.setSoundscape(type)
  }, [])

  const setMasterVolume = useCallback((volume: number) => {
    audioEngine.setMasterVolume(volume)
  }, [])

  const setSoundscapeVolume = useCallback((volume: number) => {
    audioEngine.setSoundscapeVolume(volume)
  }, [])

  const stop = useCallback(() => {
    audioEngine.stop()
  }, [])

  return {
    setSoundscape,
    setMasterVolume,
    setSoundscapeVolume,
    stop,
    settings: audioEngine.getSettings()
  }
}
