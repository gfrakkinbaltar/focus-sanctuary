import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface KoiPondProps {
  position: [number, number, number]
}

interface Koi {
  angle: number
  radius: number
  speed: number
  phase: number
  color: string
}

export const KoiPond = ({ position }: KoiPondProps) => {
  const koiRef = useRef<THREE.Group>(null!)

  // Generate koi fish
  const koi = useMemo(() => {
    const fish: Koi[] = []
    const colors = ['#ff6b35', '#ffffff', '#ffd700', '#ff4500']
    
    for (let i = 0; i < 5; i++) {
      fish.push({
        angle: (i / 5) * Math.PI * 2,
        radius: 1 + Math.random() * 1.5,
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    
    return fish
  }, [])

  useFrame((state, delta) => {
    if (!koiRef.current) return

    koiRef.current.children.forEach((child, i) => {
      const fish = koi[i]
      fish.angle += fish.speed * delta
      
      const x = Math.cos(fish.angle) * fish.radius
      const z = Math.sin(fish.angle) * fish.radius
      
      child.position.set(x, 0.1, z)
      child.rotation.y = fish.angle + Math.PI / 2
    })
  })

  return (
    <group position={position}>
      {/* Pond water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial 
          color="#4a90a4"
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Koi fish */}
      <group ref={koiRef}>
        {koi.map((fish, i) => (
          <mesh key={i}>
            <coneGeometry args={[0.15, 0.5, 4]} />
            <meshStandardMaterial color={fish.color} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
