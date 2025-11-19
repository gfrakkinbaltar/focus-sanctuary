import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

class Raindrop {
  x: number
  y: number
  speed: number
  size: number

  constructor(width: number, height: number) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.speed = 2 + Math.random() * 3
    this.size = 0.5 + Math.random() * 1.5
  }

  update(delta: number, height: number) {
    this.y -= this.speed * delta * 60
    
    if (this.y < 0) {
      this.y = height
      this.x = Math.random() * 20
    }
  }
}

export const Rain = ({ count = 200 }: { count?: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  
  const raindrops = useMemo(() => {
    return Array.from({ length: count }, () => new Raindrop(20, 15))
  }, [count])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const dummy = new THREE.Object3D()
    
    raindrops.forEach((drop, i) => {
      drop.update(delta, 15)
      
      dummy.position.set(drop.x - 10, drop.y - 5, 0.1)
      dummy.scale.set(drop.size * 0.05, drop.size * 0.3, 1)
      dummy.updateMatrix()
      
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.1, 4, 4]} />
      <meshBasicMaterial 
        color="#b0c4de"
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  )
}
