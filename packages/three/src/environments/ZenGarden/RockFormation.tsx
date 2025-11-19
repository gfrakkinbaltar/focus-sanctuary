import * as THREE from 'three'

interface RockFormationProps {
  position: [number, number, number]
  scale?: number
}

export const RockFormation = ({ position, scale = 1 }: RockFormationProps) => {
  return (
    <group position={position}>
      {/* Main rock */}
      <mesh castShadow receiveShadow>
        <dodecahedronGeometry args={[0.8 * scale, 0]} />
        <meshStandardMaterial 
          color="#8a8a8a"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Smaller accompanying rocks */}
      <mesh position={[0.7 * scale, 0, 0.3 * scale]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.4 * scale, 0]} />
        <meshStandardMaterial 
          color="#999999"
          roughness={0.9}
        />
      </mesh>

      <mesh position={[-0.5 * scale, 0, -0.4 * scale]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.3 * scale, 0]} />
        <meshStandardMaterial 
          color="#7a7a7a"
          roughness={0.9}
        />
      </mesh>
    </group>
  )
}
