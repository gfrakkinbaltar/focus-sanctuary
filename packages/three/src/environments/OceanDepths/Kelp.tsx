import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface KelpProps {
  position: [number, number, number]
  height: number
}

export const Kelp = ({ position, height }: KelpProps) => {
  const groupRef = useRef<THREE.Group>(null!)
  const segments = 8

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    
    const children = groupRef.current.children
    children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const wave = Math.sin(clock.elapsedTime * 2 + i * 0.3) * 0.1
        child.rotation.z = wave * (i / segments)
      }
    })
  })

  const segmentHeight = height / segments

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: segments }, (_, i) => (
        <mesh 
          key={i} 
          position={[0, segmentHeight * i + segmentHeight / 2, 0]}
          castShadow
        >
          <cylinderGeometry 
            args={[
              0.08 - (i / segments) * 0.04,
              0.08 - ((i + 1) / segments) * 0.04,
              segmentHeight,
              8
            ]} 
          />
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(0.35, 0.6, 0.3 + (i / segments) * 0.2)}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Kelp leaves */}
      {Array.from({ length: Math.floor(segments / 2) }, (_, i) => {
        const leafHeight = (i * 2 + 1) * segmentHeight
        return (
          <group key={`leaf-${i}`} position={[0, leafHeight, 0]}>
            <mesh rotation={[0, 0, Math.PI / 6]} castShadow>
              <planeGeometry args={[0.3, 0.6]} />
              <meshStandardMaterial 
                color="#2d5016"
                side={THREE.DoubleSide}
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 6]} castShadow>
              <planeGeometry args={[0.3, 0.6]} />
              <meshStandardMaterial 
                color="#2d5016"
                side={THREE.DoubleSide}
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
