import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const ShootingStar = () => {
  const ref = useRef<THREE.Group>(null!)
  const active = useRef(false)
  const progress = useRef(0)
  const startPos = useMemo(() => new THREE.Vector3(), [])
  const endPos = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    if (!active.current && Math.random() < 0.01) {
      // Trigger new shooting star
      active.current = true
      progress.current = 0
      
      // Random start position on sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      startPos.setFromSphericalCoords(80, phi, theta)
      
      // End position across the sky
      endPos.setFromSphericalCoords(
        80,
        phi + (Math.random() - 0.5) * 0.5,
        theta + (Math.random() - 0.5) * 1.5
      )
    }

    if (active.current) {
      progress.current += delta * 2
      
      if (progress.current >= 1) {
        active.current = false
        ref.current.visible = false
      } else {
        ref.current.visible = true
        ref.current.position.lerpVectors(startPos, endPos, progress.current)
        ref.current.lookAt(endPos)
      }
    }
  })

  return (
    <group ref={ref} visible={false}>
      <mesh>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Trail */}
      <mesh position={[0, 0, -2]}>
        <coneGeometry args={[0.05, 2, 4]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}
