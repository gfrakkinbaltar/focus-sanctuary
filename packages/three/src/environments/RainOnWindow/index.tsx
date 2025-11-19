import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Rain } from './Rain'

export const RainOnWindow = () => {
  const lightningRef = useRef(0)
  const intensity = useRef(0)

  useFrame((state, delta) => {
    lightningRef.current -= delta
    
    // Random lightning strikes
    if (lightningRef.current <= 0 && Math.random() < 0.02) {
      lightningRef.current = 0.2 + Math.random() * 0.3
      intensity.current = 1
    }
    
    // Fade out lightning
    if (intensity.current > 0) {
      intensity.current = Math.max(0, intensity.current - delta * 3)
    }
  })

  return (
    <>
      {/* Stormy sky */}
      <color attach="background" args={['#1a1a2e']} />
      
      {/* Ambient storm lighting */}
      <ambientLight intensity={0.2 + intensity.current * 0.8} color="#b0c4de" />
      
      {/* Lightning flash */}
      <pointLight 
        position={[0, 10, -20]}
        intensity={intensity.current * 5}
        color="#ffffff"
        distance={50}
      />

      {/* Window pane */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[20, 15]} />
        <meshPhysicalMaterial 
          color="#0a0a0a"
          transparent
          opacity={0.1}
          roughness={0.1}
          metalness={0.9}
          transmission={0.95}
          thickness={0.5}
        />
      </mesh>

      {/* Rain particles */}
      <Rain count={200} />

      {/* Distant cityscape silhouette */}
      <mesh position={[0, -3, -10]}>
        <boxGeometry args={[30, 8, 1]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>

      {/* Rain fog */}
      <fog attach="fog" args={['#1a1a2e', 10, 40]} />
    </>
  )
}
