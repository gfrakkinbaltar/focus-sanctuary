import { motion } from 'framer-motion'
import { useStatsStore } from '@core'
import { TrendingUp, Clock, Target, Flame } from 'lucide-react'

export function StatsPanel() {
  const { getTodayStats, currentStreak, longestStreak, totalFocusTime, totalSessions } = useStatsStore()
  const todayStats = getTodayStats()
  
  const stats = [
    {
      label: 'Today',
      value: `${todayStats.focusMinutes}m`,
      icon: Clock,
      color: '#10b981'
    },
    {
      label: 'Current Streak',
      value: `${currentStreak}d`,
      icon: Flame,
      color: '#f59e0b'
    },
    {
      label: 'Total Sessions',
      value: totalSessions,
      icon: Target,
      color: '#3b82f6'
    },
    {
      label: 'All Time',
      value: `${Math.floor(totalFocusTime / 60)}h`,
      icon: TrendingUp,
      color: '#8b5cf6'
    }
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10"
    >
      <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10">
        <div className="flex gap-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <motion.div
              key={label}
              className="text-center min-w-[80px]"
              whileHover={{ scale: 1.05 }}
            >
              <Icon 
                className="w-5 h-5 mx-auto mb-2" 
                style={{ color }}
              />
              <div className="text-2xl font-bold mb-1" style={{ color }}>
                {value}
              </div>
              <div className="text-xs text-white/60 uppercase tracking-wide">
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
