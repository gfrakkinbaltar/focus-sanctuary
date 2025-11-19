import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ButterflyProps {
  position?: [number, number, number]
  color?: string
}

export const Butterfly = ({ position = [0, 2, 0], color = '#ff6b9d' }: ButterflyProps) => {
  const groupRef = useRef<THREE.Group>(null!)
  const leftWingRef = useRef<THREE.Mesh>(null!)
  const rightWingRef = useRef<THREE.Mesh>(null!)
  const time = useRef(0)
  const path = useRef({
    center: new THREE.Vector3(...position),
    radius: 3 + Math.random() * 2,
    speed: 0.3 + Math.random() * 0.2,
    phase: Math.random() * Math.PI * 2,
    heightVariation: 0.5 + Math.random() * 0.5
  })

  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    time.current += delta
    const { center, radius, speed, phase, heightVariation } = path.current

    // Figure-8 flight pattern
    const t = time.current * speed + phase
    const x = center.x + Math.sin(t) * radius
    const y = center.y + Math.sin(t * 2) * heightVariation
    const z = center.z + Math.cos(t) * radius
    
    groupRef.current.position.set(x, y, z)
    
    // Look direction of movement
    const nextT = t + 0.1
    const nextX = center.x + Math.sin(nextT) * radius
    const nextZ = center.z + Math.cos(nextT) * radius
    groupRef.current.lookAt(nextX, y, nextZ)

    // Wing flapping animation
    const flapSpeed = 8
    const flapAngle = Math.sin(time.current * flapSpeed) * 0.6
    if (leftWingRef.current) leftWingRef.current.rotation.y = flapAngle
    if (rightWingRef.current) rightWingRef.current.rotation.y = -flapAngle
  })

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.02, 0.1, 4, 8]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left Wing */}
      <mesh ref={leftWingRef} position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <planeGeometry args={[0.15, 0.2]} />
        <meshStandardMaterial 
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Right Wing */}
      <mesh ref={rightWingRef} position={[0.05, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <planeGeometry args={[0.15, 0.2]} />
        <meshStandardMaterial 
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Antennae */}
      <mesh position={[0, 0.06, 0.02]}>
        <cylinderGeometry args={[0.003, 0.003, 0.08]} />
        <meshStandardMaterial color="#2d2d2d" />
      </mesh>
    </group>
  )
}
