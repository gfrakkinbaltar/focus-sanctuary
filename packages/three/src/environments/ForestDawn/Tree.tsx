import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TreeProps {
  position: [number, number, number]
  scale?: number
}

export const Tree = ({ position, scale = 1 }: TreeProps) => {
  const meshRef = useRef<THREE.Group>(null!)
  const time = useRef(0)

  // Wind animation
  useFrame((state, delta) => {
    time.current += delta
    if (meshRef.current) {
      // Subtle swaying motion
      meshRef.current.rotation.z = Math.sin(time.current * 0.5) * 0.05
      meshRef.current.rotation.x = Math.cos(time.current * 0.3) * 0.02
    }
  })

  // Low-poly tree geometry
  const trunkGeometry = useMemo(() => 
    new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 3 * scale, 6),
    [scale]
  )

  const foliageGeometry = useMemo(() => 
    new THREE.ConeGeometry(1.5 * scale, 2 * scale, 6),
    [scale]
  )

  return (
    <group position={position} ref={meshRef}>
      {/* Trunk */}
      <mesh geometry={trunkGeometry} position={[0, 1.5 * scale, 0]}>
        <meshStandardMaterial 
          color="#4a3428" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Foliage - 3 layers */}
      <mesh geometry={foliageGeometry} position={[0, 4 * scale, 0]}>
        <meshStandardMaterial 
          color="#2d5016" 
          roughness={0.8}
        />
      </mesh>
      <mesh geometry={foliageGeometry} position={[0, 3.5 * scale, 0]} scale={1.2}>
        <meshStandardMaterial 
          color="#3a6b1f" 
          roughness={0.8}
        />
      </mesh>
      <mesh geometry={foliageGeometry} position={[0, 3 * scale, 0]} scale={1.4}>
        <meshStandardMaterial 
          color="#4d8028" 
          roughness={0.8}
        />
      </mesh>
    </group>
  )
}
