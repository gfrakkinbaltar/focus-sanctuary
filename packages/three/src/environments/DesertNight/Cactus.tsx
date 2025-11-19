import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CactusProps {
  position: [number, number, number]
  scale?: number
}

export const Cactus = ({ position, scale = 1 }: CactusProps) => {
  const groupRef = useRef<THREE.Group>(null!)
  const time = useRef(0)

  // Very subtle sway in desert wind
  useFrame((state, delta) => {
    time.current += delta
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(time.current * 0.2) * 0.01
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Main trunk */}
      <mesh position={[0, 2 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.3 * scale, 0.35 * scale, 4 * scale, 8]} />
        <meshStandardMaterial 
          color="#3d5a3d"
          roughness={0.9}
        />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.7 * scale, 2.5 * scale, 0]} rotation={[0, 0, Math.PI / 3]} castShadow>
        <cylinderGeometry args={[0.2 * scale, 0.25 * scale, 2 * scale, 8]} />
        <meshStandardMaterial 
          color="#3d5a3d"
          roughness={0.9}
        />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.6 * scale, 3 * scale, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.18 * scale, 0.22 * scale, 1.8 * scale, 8]} />
        <meshStandardMaterial 
          color="#3d5a3d"
          roughness={0.9}
        />
      </mesh>
    </group>
  )
}
