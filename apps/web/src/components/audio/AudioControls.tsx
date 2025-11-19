import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Music } from 'lucide-react'
import { useAudioEngine } from '@focus-sanctuary/audio'
import type { SoundscapeType } from '@focus-sanctuary/audio'

export const AudioControls = () => {
  const { setSoundscape, setMasterVolume, settings } = useAudioEngine()
  const [isOpen, setIsOpen] = useState(false)
  const [volume, setVolume] = useState(settings.masterVolume)
  const [currentSoundscape, setCurrentSoundscape] = useState<SoundscapeType>('forest')

  const soundscapes: { type: SoundscapeType; label: string; emoji: string }[] = [
    { type: 'forest', label: 'Forest', emoji: '🌲' },
    { type: 'ocean', label: 'Ocean', emoji: '🌊' },
    { type: 'rain', label: 'Rain', emoji: '🌧️' },
    { type: 'space', label: 'Space', emoji: '🌌' }
  ]

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setMasterVolume(newVolume)
  }

  const handleSoundscapeChange = async (type: SoundscapeType) => {
    setCurrentSoundscape(type)
    await setSoundscape(type)
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="
          p-4 rounded-full
          bg-white/10 backdrop-blur-md
          text-white shadow-xl
          hover:bg-white/20 transition-colors
        "
      >
        <Music size={24} />
      </motion.button>

      {/* Audio Controls Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="
              absolute top-16 right-0 w-80
              bg-black/60 backdrop-blur-xl
              rounded-2xl p-6 shadow-2xl
              border border-white/10
            "
          >
            {/* Volume Control */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/90 text-sm font-medium">
                  Volume
                </span>
                <div className="flex items-center gap-2">
                  {volume === 0 ? (
                    <VolumeX size={18} className="text-white/60" />
                  ) : (
                    <Volume2 size={18} className="text-white/60" />
                  )}
                  <span className="text-white/60 text-sm min-w-[3ch]">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="
                  w-full h-2 rounded-full
                  bg-white/20
                  appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-lg
                "
              />
            </div>

            {/* Soundscape Selector */}
            <div>
              <span className="text-white/90 text-sm font-medium block mb-3">
                Soundscape
              </span>
              <div className="grid grid-cols-2 gap-2">
                {soundscapes.map((soundscape) => (
                  <motion.button
                    key={soundscape.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSoundscapeChange(soundscape.type)}
                    className={`
                      px-4 py-3 rounded-xl
                      text-sm font-medium
                      transition-all duration-200
                      ${currentSoundscape === soundscape.type
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }
                    `}
                  >
                    <span className="mr-2">{soundscape.emoji}</span>
                    {soundscape.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
