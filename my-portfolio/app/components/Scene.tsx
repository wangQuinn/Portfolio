'use client'

import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import Model from './Model'
import {Suspense } from 'react'

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
    <Canvas
      camera={{ fov: 75, position: [0, 0, 5] }}
      style={{ width: '100%', height: '100%' }} 
      gl={{ alpha: true }}
    >
      {/* Lights */}
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <ambientLight intensity={1} />

        <Suspense fallback = {null}>
      <Model mouse={mouse} />
      </Suspense>
    </Canvas>
   
  )
}
