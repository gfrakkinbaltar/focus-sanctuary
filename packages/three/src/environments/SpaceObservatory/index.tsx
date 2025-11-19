import { Stars } from '@react-three/drei'
import { ShootingStar } from './ShootingStar'

export const SpaceObservatory = () => {
  return (
    <>
      {/* Multi-layered starfield with parallax */}
      <Stars 
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade={false}
        speed={0.1}
      />
      
      <Stars 
        radius={150}
        depth={80}
        count={3000}
        factor={3}
        saturation={0.3}
        fade={false}
        speed={0.05}
      />
      
      <Stars 
        radius={200}
        depth={100}
        count={2000}
        factor={2}
        saturation={0}
        fade={false}
        speed={0.02}
      />

      {/* Multiple shooting stars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <ShootingStar key={i} />
      ))}

      {/* Ambient space lighting */}
      <ambientLight intensity={0.1} color="#1a1a3e" />
      
      {/* Distant galaxy glow */}
      <pointLight 
        position={[50, 30, -40]} 
        intensity={0.3} 
        color="#6b5b95"
        distance={100}
      />

      {/* Observatory platform */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[8, 8, 0.5, 32]} />
        <meshStandardMaterial 
          color="#2c2c2c"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Space fog */}
      <fog attach="fog" args={['#000000', 50, 150]} />
    </>
  )
}
