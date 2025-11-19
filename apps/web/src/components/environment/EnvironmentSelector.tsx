import { motion, AnimatePresence } from 'framer-motion'
import { useEnvironmentStore, Environment } from '@core'
import { Mountain, Waves, Rocket, CloudRain, Palmtree, Flower2 } from 'lucide-react'

const environments: { id: Environment; name: string; icon: any; color: string }[] = [
  { id: 'forestDawn', name: 'Forest Dawn', icon: Mountain, color: '#10b981' },
  { id: 'oceanDepths', name: 'Ocean Depths', icon: Waves, color: '#3b82f6' },
  { id: 'spaceObservatory', name: 'Space', icon: Rocket, color: '#8b5cf6' },
  { id: 'rainOnWindow', name: 'Rain', icon: CloudRain, color: '#6366f1' },
  { id: 'desertNight', name: 'Desert', icon: Palmtree, color: '#f59e0b' },
  { id: 'zenGarden', name: 'Zen Garden', icon: Flower2, color: '#ec4899' }
]

export function EnvironmentSelector() {
  const { settings, setEnvironment, isTransitioning } = useEnvironmentStore()
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-10"
    >
      <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 space-y-2 border border-white/10">
        {environments.map(({ id, name, icon: Icon, color }) => (
          <motion.button
            key={id}
            onClick={() => !isTransitioning && setEnvironment(id)}
            disabled={isTransitioning}
            className={`
              relative group w-14 h-14 rounded-xl transition-all duration-300
              ${settings.current === id 
                ? 'bg-white/20 scale-110' 
                : 'bg-white/5 hover:bg-white/10 hover:scale-105'
              }
              ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            whileHover={{ scale: settings.current === id ? 1.1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon 
              className="w-6 h-6 mx-auto" 
              style={{ color: settings.current === id ? color : '#fff' }}
            />
            
            <AnimatePresence>
              {settings.current === id && (
                <motion.div
                  layoutId="activeEnv"
                  className="absolute inset-0 rounded-xl"
                  style={{ 
                    border: `2px solid ${color}`,
                    boxShadow: `0 0 20px ${color}40`
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div 
                className="bg-black/80 backdrop-blur-md px-3 py-2 rounded-lg whitespace-nowrap text-sm"
                style={{ borderLeft: `2px solid ${color}` }}
              >
                {name}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
