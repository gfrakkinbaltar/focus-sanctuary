import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  
  void main() {
    float pulse = sin(uTime * 3.0) * 0.5 + 0.5;
    float alpha = pulse * (1.0 - distance(vUv, vec2(0.5)) * 2.0);
    gl_FragColor = vec4(uColor, alpha * 0.8);
  }
`

interface FireflyProps {
  position: THREE.Vector3
  color: THREE.Color
  speed: number
  radius: number
}

export const Fireflies = ({ count = 50 }: { count?: number }) => {
  const firefliesRef = useRef<THREE.Points>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  
  const { positions, colors, speeds, radii, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    const rad = new Float32Array(count)
    const phs = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const angle = Math.random() * Math.PI * 2
      const distance = 5 + Math.random() * 15
      
      pos[i3] = Math.cos(angle) * distance
      pos[i3 + 1] = 0.5 + Math.random() * 4
      pos[i3 + 2] = Math.sin(angle) * distance
      
      const colorChoice = Math.random()
      if (colorChoice < 0.7) {
        col[i3] = 1.0; col[i3 + 1] = 0.95; col[i3 + 2] = 0.6
      } else {
        col[i3] = 0.6; col[i3 + 1] = 1.0; col[i3 + 2] = 0.8
      }
      
      spd[i] = 0.2 + Math.random() * 0.3
      rad[i] = 2 + Math.random() * 3
      phs[i] = Math.random() * Math.PI * 2
    }
    
    return { positions: pos, colors: col, speeds: spd, radii: rad, phases: phs }
  }, [count])

  useFrame(({ clock }) => {
    if (!firefliesRef.current || !materialRef.current) return
    
    const time = clock.getElapsedTime()
    materialRef.current.uniforms.uTime.value = time
    
    const pos = firefliesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const t = time * speeds[i] + phases[i]
      
      pos[i3] = positions[i3] + Math.sin(t) * radii[i]
      pos[i3 + 1] = positions[i3 + 1] + Math.sin(t * 2) * 0.5
      pos[i3 + 2] = positions[i3 + 2] + Math.cos(t) * radii[i]
    }
    
    firefliesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={firefliesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color('#ffeb3b') }
        }}
        vertexColors
      />
    </points>
  )
}
