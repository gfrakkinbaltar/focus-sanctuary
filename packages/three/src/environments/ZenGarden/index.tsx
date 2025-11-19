import { useMemo } from 'react'
import { RockFormation } from './RockFormation'
import { BambooPlant } from './BambooPlant'
import { KoiPond } from './KoiPond'
import { CherryBlossom } from './CherryBlossom'

export const ZenGarden = () => {
  // Rock garden positions
  const rocks = useMemo(() => {
    return [
      { pos: [-4, 0.3, -3] as [number, number, number], scale: 1.2 },
      { pos: [5, 0.2, -4] as [number, number, number], scale: 0.8 },
      { pos: [-6, 0.25, 2] as [number, number, number], scale: 1 },
      { pos: [3, 0.2, 4] as [number, number, number], scale: 0.9 },
      { pos: [0, 0.15, -6] as [number, number, number], scale: 0.7 }
    ]
  }, [])

  // Bamboo positions around perimeter
  const bamboo = useMemo(() => {
    const positions: Array<[number, number, number]> = []
    const count = 12
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 12
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      
      positions.push([x, 0, z])
    }
    
    return positions
  }, [])

  return (
    <>
      {/* Soft pastel sky */}
      <color attach="background" args={['#e8d5c4']} />

      {/* Soft natural lighting */}
      <ambientLight intensity={0.6} color="#fff5e6" />
      <directionalLight
        position={[10, 20, 5]}
        intensity={0.5}
        color="#ffeaa7"
        castShadow
      />

      {/* Raked sand ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial 
          color="#f4e4d7"
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>

      {/* Koi pond in center */}
      <KoiPond position={[0, 0.05, 0]} />

      {/* Rock formations */}
      {rocks.map((rock, i) => (
        <RockFormation key={i} position={rock.pos} scale={rock.scale} />
      ))}

      {/* Bamboo perimeter */}
      {bamboo.map((pos, i) => (
        <BambooPlant key={i} position={pos} />
      ))}

      {/* Cherry blossom tree */}
      <CherryBlossom position={[-8, 0, -8]} />

      {/* Gentle atmospheric fog */}
      <fog attach="fog" args={['#f5e6d3', 25, 50]} />
    </>
  )
}
