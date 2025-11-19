import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import { Cactus } from './Cactus'
import { Dune } from './Dune'

export const DesertNight = () => {
  const moonRef = useRef<THREE.Mesh>(null!)
  const time = useRef(0)

  useFrame((state, delta) => {
    time.current += delta * 0.1
  })

  // Generate cacti
  const cacti = useMemo(() => {
    const positions: Array<[number, number, number]> = []
    const count = 15
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 8 + Math.random() * 12
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      
      positions.push([x, 0, z])
    }
    
    return positions
  }, [])

  // Generate sand dunes
  const dunes = useMemo(() => {
    const positions: Array<[number, number, number, number]> = []
    const count = 8
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 20 + Math.random() * 10
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const scale = 0.8 + Math.random() * 0.4
      
      positions.push([x, -1, z, scale])
    }
    
    return positions
  }, [])

  return (
    <>      {/* Night sky gradient */}
      <color attach="background" args={['#0a0e27']} />
      
      {/* Dense starfield */}
      <Stars 
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Large moon */}
      <mesh ref={moonRef} position={[15, 20, -30]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial 
          color="#e8dcc4"
          emissive="#ffebb3"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Moonlight */}
      <directionalLight
        position={[15, 20, -30]}
        intensity={0.8}
        color="#c5d9f0"
        castShadow
      />
      
      {/* Ambient night lighting */}
      <ambientLight intensity={0.15} color="#2d3561" />

      {/* Desert floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#d4a574"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Sand dunes */}
      {dunes.map(([x, y, z, scale], i) => (
        <Dune key={i} position={[x, y, z]} scale={scale} />
      ))}

      {/* Cacti */}
      {cacti.map((pos, i) => (
        <Cactus key={i} position={pos} scale={0.8 + (i % 3) * 0.2} />
      ))}

      {/* Desert fog */}
      <fog attach="fog" args={['#1a1d35', 30, 70]} />
    </>
  )
}
