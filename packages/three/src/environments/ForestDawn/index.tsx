import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sky, Stars, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import { Tree } from './Tree'
import { Fireflies } from './Fireflies'
import { Butterfly } from './Butterfly'

export const ForestDawn = () => {
  const time = useRef(0)

  useFrame((state, delta) => {
    time.current += delta * 0.1
  })

  const trees = useMemo(() => {
    const positions: Array<[number, number, number]> = []
    const count = 40
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 15 + Math.random() * 12
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      
      positions.push([x, 0, z])
    }
    
    return positions
  }, [])

  const butterflies = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        2 + Math.random() * 3,
        (Math.random() - 0.5) * 20
      ] as [number, number, number],
      color: ['#ff6b9d', '#ffd93d', '#6bcf7f'][i % 3]
    }))
  }, [])

  const sunriseProgress = Math.min(time.current, 1)
  const skyColor = useMemo(() => {
    const darkBlue = new THREE.Color('#0a1628')
    const orange = new THREE.Color('#ff6b35')
    const lightBlue = new THREE.Color('#87CEEB')
    
    if (sunriseProgress < 0.5) {
      return darkBlue.lerp(orange, sunriseProgress * 2)
    } else {
      return orange.lerp(lightBlue, (sunriseProgress - 0.5) * 2)
    }
  }, [sunriseProgress])

  return (
    <>
      <Sky 
        distance={450000} 
        sunPosition={[
          Math.cos(sunriseProgress * Math.PI - Math.PI / 2) * 100,
          Math.sin(sunriseProgress * Math.PI - Math.PI / 2) * 100,
          0
        ]}
        inclination={0.6}
        azimuth={0.25}
      />
      
      <Stars 
        radius={100}
        depth={50}
        count={1500}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* God rays effect */}
      <pointLight
        position={[
          Math.cos(sunriseProgress * Math.PI - Math.PI / 2) * 15,
          Math.sin(sunriseProgress * Math.PI - Math.PI / 2) * 15 + 5,
          5
        ]}
        intensity={sunriseProgress * 0.8}
        color={skyColor}
        distance={40}
        decay={2}
      />

      <ambientLight intensity={0.3 + sunriseProgress * 0.4} />
      <directionalLight
        position={[
          Math.cos(sunriseProgress * Math.PI - Math.PI / 2) * 10,
          Math.sin(sunriseProgress * Math.PI - Math.PI / 2) * 10,
          5
        ]}
        intensity={0.6 + sunriseProgress * 0.6}
        color={skyColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Ground with texture variation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120, 32, 32]} />
        <meshStandardMaterial 
          color="#2d5016"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Subtle ground flowers/grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#3a6b1f"
          transparent
          opacity={0.3}
          roughness={1}
        />
      </mesh>

      {trees.map((pos, i) => (
        <Tree key={i} position={pos} scale={0.8 + (i % 3) * 0.2} />
      ))}

      {butterflies.map((b, i) => (
        <Butterfly key={i} position={b.position} color={b.color} />
      ))}

      {sunriseProgress < 0.7 && <Fireflies count={60} />}

      {/* Morning mist clouds */}
      {sunriseProgress < 0.6 && (
        <>
          <Cloud position={[-10, 1, -15]} speed={0.1} opacity={0.3} />
          <Cloud position={[15, 1.5, -20]} speed={0.15} opacity={0.25} />
          <Cloud position={[0, 0.8, -18]} speed={0.12} opacity={0.2} />
        </>
      )}

      <fog attach="fog" args={[skyColor, 25, 70]} />
    </>
  )
}
