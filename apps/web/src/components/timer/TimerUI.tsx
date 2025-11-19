import { useTimerStore } from '@core/timer/timerStore'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'

export const TimerUI = () => {
  const {
    timeRemaining,
    status,
    mode,
    start,
    pause,
    resume,
    reset,
    skip
  } = useTimerStore()

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  const handlePlayPause = () => {
    if (status === 'idle') {
      start()
    } else if (status === 'running') {
      pause()
    } else if (status === 'paused') {
      resume()
    }
  }

  const getModeColor = () => {
    switch (mode) {
      case 'focus': return 'from-emerald-500 to-teal-500'
      case 'break': return 'from-blue-500 to-cyan-500'
      case 'longBreak': return 'from-purple-500 to-pink-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full pointer-events-auto px-4">
      {/* Mode Badge */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8"
      >
        <span className={`
          inline-block px-6 py-2 rounded-full text-sm font-medium
          bg-gradient-to-r ${getModeColor()}
          text-white shadow-lg backdrop-blur-sm
        `}>
          {mode === 'focus' ? '🌿 Focus Time' : 
           mode === 'break' ? '☕ Short Break' : 
           mode === 'longBreak' ? '🌙 Long Break' : 
           '✨ Ambient Mode'}
        </span>
      </motion.div>

      {/* Timer Display */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="mb-12"
      >
        <div className={`
          text-9xl font-light tracking-tight
          bg-gradient-to-r ${getModeColor()}
          bg-clip-text text-transparent
          drop-shadow-2xl
        `}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </motion.div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayPause}
          className={`
            p-6 rounded-full
            bg-gradient-to-r ${getModeColor()}
            text-white shadow-2xl
            hover:shadow-3xl transition-shadow
          `}
        >
          {status === 'running' ? (
            <Pause size={32} />
          ) : (
            <Play size={32} />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          disabled={status === 'idle'}
          className="
            p-6 rounded-full
            bg-white/10 backdrop-blur-sm
            text-white shadow-xl
            hover:bg-white/20 transition-colors
            disabled:opacity-30 disabled:cursor-not-allowed
          "
        >
          <RotateCcw size={24} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={skip}
          disabled={status === 'idle'}
          className="
            p-6 rounded-full
            bg-white/10 backdrop-blur-sm
            text-white shadow-xl
            hover:bg-white/20 transition-colors
            disabled:opacity-30 disabled:cursor-not-allowed
          "
        >
          <SkipForward size={24} />
        </motion.button>
      </div>
    </div>
  )
}
