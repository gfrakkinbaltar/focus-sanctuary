import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Fish } from './Fish'
import { Kelp } from './Kelp'

export const OceanDepths = () => {
  const time = useRef(0)

  useFrame((_, delta) => {
    time.current += delta * 0.3
  })

  const kelp = useMemo(() => {
    return Array.from({ length: 25 }, () => ({
      position: [
        (Math.random() - 0.5) * 40,
        0,
        (Math.random() - 0.5) * 40
      ] as [number, number, number],
      height: 4 + Math.random() * 6
    }))
  }, [])

  const fishSchools = useMemo(() => {
    return Array.from({ length: 3 }, (_, schoolIdx) => ({
      center: [
        (Math.random() - 0.5) * 30,
        3 + Math.random() * 5,
        (Math.random() - 0.5) * 30
      ] as [number, number, number],
      fish: Array.from({ length: 12 }, () => ({
        offset: [Math.random() * 2, Math.random() * 2, Math.random() * 2] as [number, number, number],
        speed: 0.5 + Math.random() * 0.5
      })),
      color: ['#ff6b9d', '#6bb6ff', '#ffd93d'][schoolIdx]
    }))
  }, [])

  return (
    <>
      {/* Underwater lighting */}
      <ambientLight intensity={0.4} color="#0066aa" />
      <directionalLight
        position={[10, 20, 5]}
        intensity={0.6}
        color="#66ccff"
        castShadow
      />
      <pointLight position={[0, 8, 0]} intensity={0.5} color="#00ffff" distance={30} />

      {/* Volumetric caustic light rays */}
      <spotLight
        position={[0, 15, 0]}
        angle={0.8}
        penumbra={0.5}
        intensity={0.8}
        color="#66ddff"
        distance={40}
      />

      {/* Ocean floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100, 64, 64]} />
        <meshStandardMaterial 
          color="#1a4d7a"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Sandy texture overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#d4a574"
          transparent
          opacity={0.4}
          roughness={1}
        />
      </mesh>

      {kelp.map((k, i) => (
        <Kelp key={i} position={k.position} height={k.height} />
      ))}

      {fishSchools.map((school, i) => (
        <group key={i}>
          {school.fish.map((fish, j) => (
            <Fish 
              key={j} 
              schoolCenter={school.center}
              offset={fish.offset}
              speed={fish.speed}
              color={school.color}
            />
          ))}
        </group>
      ))}

      {/* Underwater particles (plankton/bubbles) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={new Float32Array(Array.from({ length: 600 }, () => 
              (Math.random() - 0.5) * 60
            ))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.3} />
      </points>

      <fog attach="fog" args={['#0a3d62', 15, 50]} />
    </>
  )
}
