import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BambooPlantProps {
  position: [number, number, number]
}

export const BambooPlant = ({ position }: BambooPlantProps) => {
  const groupRef = useRef<THREE.Group>(null!)
  const time = useRef(0)

  // Gentle swaying in breeze
  useFrame((state, delta) => {
    time.current += delta
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(time.current * 0.8) * 0.03
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Multiple bamboo stalks */}
      {[0, 1, 2].map((i) => (
        <mesh 
          key={i} 
          position={[
            (i - 1) * 0.15,
            2,
            Math.sin(i) * 0.1
          ]}
          castShadow
        >
          <cylinderGeometry args={[0.08, 0.08, 4, 8]} />
          <meshStandardMaterial 
            color="#6b8e23"
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Leaves at top */}
      {[0, 1, 2, 3].map((i) => (
        <mesh 
          key={`leaf-${i}`}
          position={[
            Math.cos(i * Math.PI / 2) * 0.3,
            3.8,
            Math.sin(i * Math.PI / 2) * 0.3
          ]}
          rotation={[
            Math.PI / 6,
            i * Math.PI / 2,
            Math.PI / 4
          ]}
        >
          <planeGeometry args={[0.6, 0.15]} />
          <meshStandardMaterial 
            color="#7cb342"
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
