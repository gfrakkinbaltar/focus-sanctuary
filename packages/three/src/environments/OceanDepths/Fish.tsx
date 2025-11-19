import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FishProps {
  schoolCenter: [number, number, number]
  offset: [number, number, number]
  speed: number
  color: string
}

export const Fish = ({ schoolCenter, offset, speed, color }: FishProps) => {
  const groupRef = useRef<THREE.Group>(null!)
  const tailRef = useRef<THREE.Mesh>(null!)
  const time = useRef(Math.random() * 100)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    
    time.current += delta * speed
    
    const [cx, cy, cz] = schoolCenter
    const [ox, oy, oz] = offset
    
    const radius = 5
    const t = time.current
    
    const x = cx + Math.sin(t + ox) * radius
    const y = cy + Math.sin(t * 0.5 + oy) * 2
    const z = cz + Math.cos(t + oz) * radius
    
    groupRef.current.position.set(x, y, z)
    
    const nextT = t + 0.1
    const nextX = cx + Math.sin(nextT + ox) * radius
    const nextZ = cz + Math.cos(nextT + oz) * radius
    groupRef.current.lookAt(nextX, y, nextZ)
    
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(time.current * 8) * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.15, 0.15]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Head */}
      <mesh position={[0.25, 0, 0]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Tail */}
      <mesh ref={tailRef} position={[-0.25, 0, 0]} castShadow rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.12, 0.2, 8]} />
        <meshStandardMaterial 
          color={color}
          transparent
          opacity={0.8}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>

      {/* Dorsal fin */}
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.28, 0.05, 0.05]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#000000" emissive="#333333" />
      </mesh>
      <mesh position={[0.28, 0.05, -0.05]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#000000" emissive="#333333" />
      </mesh>
    </group>
  )
}
