'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function EyeModel({ mouse }: { mouse: { x: number; y: number } }) {
  const ref = useRef<THREE.Group>(null!)
  const { scene } = useGLTF('/kirbymario/kirbymario.gltf')

  useFrame(() => {
    if (!ref.current) return

    // ref.current.rotation.y = -
    // ref.current.rotation.x = -1.2 
  })

  return <primitive ref={ref} object={scene} scale = {20} />
}

useGLTF.preload('/kirbymario/kirbymario.gltf')
