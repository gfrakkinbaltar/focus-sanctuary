import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { ForestDawn } from '@three/environments/ForestDawn'
import { OceanDepths } from '@three/environments/OceanDepths'
import { SpaceObservatory } from '@three/environments/SpaceObservatory'
import { RainOnWindow } from '@three/environments/RainOnWindow'
import { DesertNight } from '@three/environments/DesertNight'
import { ZenGarden } from '@three/environments/ZenGarden'
import { TimerUI } from './components/timer/TimerUI'
import { AudioControls } from './components/audio/AudioControls'
import { EnvironmentSelector } from './components/environment/EnvironmentSelector'
import { StatsPanel } from './components/stats/StatsPanel'
import { StatsModal } from './components/stats/StatsModal'
import { SettingsModal } from './components/settings/SettingsModal'
import { useEnvironmentStore } from '@core'
import { motion } from 'framer-motion'

const environments = {
  forestDawn: ForestDawn,
  oceanDepths: OceanDepths,
  spaceObservatory: SpaceObservatory,
  rainOnWindow: RainOnWindow,
  desertNight: DesertNight,
  zenGarden: ZenGarden
}

function App() {
  const { settings } = useEnvironmentStore()
  const CurrentEnvironment = environments[settings.current]
  
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <Canvas shadows className="absolute inset-0">
        <PerspectiveCamera makeDefault position={[0, 3, 10]} fov={75} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
        
        <Suspense fallback={null}>
          <CurrentEnvironment />
        </Suspense>
      </Canvas>

      {/* Timer UI Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 pointer-events-none"
      >
        <TimerUI />
      </motion.div>

      {/* UI Components */}
      <EnvironmentSelector />
      <AudioControls />
      <StatsPanel />
      <StatsModal />
      <SettingsModal />
    </div>
  )
}

export default App
