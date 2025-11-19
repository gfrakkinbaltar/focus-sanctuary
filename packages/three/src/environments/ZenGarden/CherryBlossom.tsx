import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CherryBlossomProps {
  position: [number, number, number]
}

export const CherryBlossom = ({ position }: CherryBlossomProps) => {
  const petalsRef = useRef<THREE.Points>(null!)
  const time = useRef(0)

  // Falling petals
  const { positions, velocities } = useMemo(() => {
    const count = 30
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4
      positions[i * 3 + 1] = Math.random() * 6 + 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
      velocities[i] = Math.random() * 0.5 + 0.3
    }
    
    return { positions, velocities }
  }, [])

  useFrame((state, delta) => {
    time.current += delta

    if (!petalsRef.current) return
    
    const pos = petalsRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < 30; i++) {
      pos[i * 3 + 1] -= velocities[i] * delta
      pos[i * 3] += Math.sin(time.current + i) * 0.01
      
      // Reset fallen petals
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 8
      }
    }
    
    petalsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <group position={position}>
      {/* Tree trunk */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 6, 8]} />
        <meshStandardMaterial color="#5d4e37" roughness={0.9} />
      </mesh>

      {/* Canopy */}
      <mesh position={[0, 6, 0]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial 
          color="#ffb7c5"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Falling petals */}
      <points ref={petalsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={30}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          color="#ffb7c5"
          transparent
          opacity={0.8}
        />
      </points>
    </group>
  )
}
