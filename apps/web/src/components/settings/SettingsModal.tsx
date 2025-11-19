import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useTimerStore, useEnvironmentStore } from '@core'
import { Settings, X, Clock, Volume2, Sparkles } from 'lucide-react'

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings: timerSettings, updateSettings: updateTimer } = useTimerStore()
  const { settings: envSettings, updateSettings: updateEnv } = useEnvironmentStore()
  
  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-20 z-10 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings className="w-6 h-6" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
            >
              <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 border border-white/10 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="w-6 h-6 text-blue-400" />
                    Settings
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-400" />
                      Timer Settings
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-2">
                          Focus Duration (minutes)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={timerSettings.focusDuration}
                          onChange={(e) => updateTimer({ focusDuration: parseInt(e.target.value) })}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-white/60 mb-2">
                          Short Break (minutes)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={timerSettings.shortBreakDuration}
                          onChange={(e) => updateTimer({ shortBreakDuration: parseInt(e.target.value) })}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-white/60 mb-2">
                          Long Break (minutes)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="60"
                          value={timerSettings.longBreakDuration}
                          onChange={(e) => updateTimer({ longBreakDuration: parseInt(e.target.value) })}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                        <span className="text-sm">Auto-start Breaks</span>
                        <button
                          onClick={() => updateTimer({ autoStartBreaks: !timerSettings.autoStartBreaks })}
                          className={`
                            w-12 h-6 rounded-full transition-colors relative
                            ${timerSettings.autoStartBreaks ? 'bg-emerald-500' : 'bg-white/20'}
                          `}
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                            animate={{ left: timerSettings.autoStartBreaks ? 28 : 4 }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-purple-400" />
                      Audio Settings
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-2">
                          Volume
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={timerSettings.volume * 100}
                          onChange={(e) => updateTimer({ volume: parseInt(e.target.value) / 100 })}
                          className="w-full accent-purple-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                        <span className="text-sm">Sound Effects</span>
                        <button
                          onClick={() => updateTimer({ soundEnabled: !timerSettings.soundEnabled })}
                          className={`
                            w-12 h-6 rounded-full transition-colors relative
                            ${timerSettings.soundEnabled ? 'bg-purple-500' : 'bg-white/20'}
                          `}
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                            animate={{ left: timerSettings.soundEnabled ? 28 : 4 }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      Environment Settings
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-2">
                          Ambient Intensity
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={envSettings.ambientIntensity * 100}
                          onChange={(e) => updateEnv({ ambientIntensity: parseInt(e.target.value) / 100 })}
                          className="w-full accent-yellow-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-white/60 mb-2">
                          Particle Density
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={envSettings.particleDensity * 100}
                          onChange={(e) => updateEnv({ particleDensity: parseInt(e.target.value) / 100 })}
                          className="w-full accent-yellow-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-white/60 mb-2">
                          Animation Speed
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={envSettings.animationSpeed * 100}
                          onChange={(e) => updateEnv({ animationSpeed: parseInt(e.target.value) / 100 })}
                          className="w-full accent-yellow-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
