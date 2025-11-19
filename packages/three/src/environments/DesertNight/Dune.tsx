import * as THREE from 'three'

interface DuneProps {
  position: [number, number, number]
  scale?: number
}

export const Dune = ({ position, scale = 1 }: DuneProps) => {
  return (
    <mesh position={position} rotation={[0, Math.random() * Math.PI * 2, 0]} castShadow receiveShadow>
      <sphereGeometry args={[3 * scale, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial 
        color="#c9a068"
        roughness={0.95}
        metalness={0.05}
      />
    </mesh>
  )
}
