import { useStatsStore } from '@core/stats/statsStore'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, Clock, Target, Flame, BarChart3 } from 'lucide-react'
import { useMemo, useState } from 'react'

export const StatsModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { dailyStats, currentStreak, longestStreak, totalFocusTime, totalSessions } = useStatsStore()

  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return dailyStats.find(d => d.date === today) || {
      date: today,
      focusMinutes: 0,
      breakMinutes: 0,
      sessionsCompleted: 0,
      sessionsInterrupted: 0,
      streakDays: 0
    }
  }, [dailyStats])

  const last7Days = useMemo(() => {
    const days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const stat = dailyStats.find(d => d.date === dateStr)
      
      days.push({
        date: dateStr,
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        minutes: stat?.focusMinutes || 0
      })
    }
    
    return days
  }, [dailyStats])

  const maxMinutes = Math.max(...last7Days.map(d => d.minutes), 1)

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-10 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <BarChart3 className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative"
        >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
            <X size={20} className="text-white" />
          </button>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-6">
            Your Progress
          </h2>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-4">
              <Flame className="text-orange-500 mb-2" size={24} />
              <div className="text-2xl font-bold text-white">{currentStreak}</div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <Clock className="text-blue-500 mb-2" size={24} />
              <div className="text-2xl font-bold text-white">{Math.floor(totalFocusTime / 60)}h</div>
              <div className="text-sm text-gray-400">Total Time</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <Target className="text-green-500 mb-2" size={24} />
              <div className="text-2xl font-bold text-white">{totalSessions}</div>
              <div className="text-sm text-gray-400">Sessions</div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <TrendingUp className="text-purple-500 mb-2" size={24} />
              <div className="text-2xl font-bold text-white">{longestStreak}</div>
              <div className="text-sm text-gray-400">Best Streak</div>
            </div>
          </div>

          {/* Today's stats */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Today</h3>
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">Focus Time</span>
                <span className="text-2xl font-bold text-white">{todayStats.focusMinutes} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Sessions Completed</span>
                <span className="text-2xl font-bold text-white">{todayStats.sessionsCompleted}</span>
              </div>
            </div>
          </div>

          {/* 7 Day Chart */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Last 7 Days</h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {last7Days.map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg transition-all"
                    style={{ height: `${(day.minutes / maxMinutes) * 100}%`, minHeight: day.minutes > 0 ? '10%' : '2%' }}
                  />
                  <span className="text-xs text-gray-400 mt-2">{day.day}</span>
                  <span className="text-xs text-gray-500">{day.minutes}m</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</>
  )
}
