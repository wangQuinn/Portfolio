'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import Model from './Model'

export default function Scene() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '420px',
        aspectRatio: '1',
        minHeight: '320px',
  
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto',
      }}
    >
      <Canvas
        camera={{ fov: 45, position: [0, 0, 4.5] }}
        style={{ width: '100%', height: '100%' }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <directionalLight position={[-3, -2, -4]} intensity={0.25} />
        <Suspense fallback={null}>
          <group position = {[0, -0.8, 0]}>
            <Model mouse={mouse} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  )
}
