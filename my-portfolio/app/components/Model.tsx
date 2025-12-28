'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const getTextureSourceId = (texture: THREE.Texture) => {
  const userUrl = (texture.userData && (texture.userData.url as string)) || ''
  if (userUrl) return userUrl
  if (texture.name) return texture.name
  const image: any = texture.image
  return image?.currentSrc || image?.src || ''
}

export default function Model({ mouse }: { mouse: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null!)
  const { scene } = useGLTF('/kirbymario/kirbymario.gltf')
  const replacementTexture = useLoader(THREE.TextureLoader, '/kirbymario/361BA670_c.png')

  replacementTexture.flipY = false
  replacementTexture.center.set(0.5, 0.5)
  replacementTexture.rotation = Math.PI
  if ('colorSpace' in replacementTexture) {
    replacementTexture.colorSpace = THREE.SRGBColorSpace
  }

  const centeredScene = useMemo(() => {
    const cloned = scene.clone()
    const box = new THREE.Box3().setFromObject(cloned)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxAxis = Math.max(size.x, size.y, size.z) || 1

    cloned.position.sub(center)
    cloned.scale.setScalar(2.4 / maxAxis)

    cloned.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((material) => {
        if (!material || !(material instanceof THREE.MeshStandardMaterial)) return

        const map = material.map
        if (!map) return

        const source = getTextureSourceId(map)
        if (typeof source === 'string' && source.includes('baseColor_5')) {
          material.map = replacementTexture
          material.needsUpdate = true
        }
      })
    })

    return cloned
  }, [replacementTexture, scene])

  useFrame(() => {
    if (!groupRef.current) return

    const targetX = (mouse.y - 0.5) * 0.6
    const targetY = (mouse.x - 0.5) * 0.6

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.08)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.08)
  })

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      <primitive object={centeredScene} />
    </group>
  )
}

useGLTF.preload('/kirbymario/kirbymario.gltf')
