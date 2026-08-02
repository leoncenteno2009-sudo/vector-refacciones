'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CompatibilityRingsProps {
  progress: number
}

export const CompatibilityRings: React.FC<CompatibilityRingsProps> = ({ progress }) => {
  const outerRingRef = useRef<THREE.Mesh>(null)
  const middleRingRef = useRef<THREE.Mesh>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)

  // Diagnostics Blue & VECTOR Red Materials
  const blueRingMaterial = new THREE.MeshStandardMaterial({
    color: '#78BDE7',
    roughness: 0.25,
    metalness: 0.7,
    emissive: '#2A7BB5',
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0,
  })

  const redMatchMaterial = new THREE.MeshStandardMaterial({
    color: '#B62025',
    roughness: 0.2,
    metalness: 0.8,
    emissive: '#86171B',
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0,
  })

  useFrame(() => {
    // Fade in between progress 0.20 and 0.55
    let opacity = 0
    if (progress >= 0.18 && progress <= 0.55) {
      if (progress < 0.26) {
        opacity = (progress - 0.18) / 0.08
      } else if (progress > 0.48) {
        opacity = 1 - (progress - 0.48) / 0.07
      } else {
        opacity = 1
      }
    }

    blueRingMaterial.opacity = opacity
    redMatchMaterial.opacity = opacity

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = progress * Math.PI * 0.4
      outerRingRef.current.rotation.x = 0.35 + progress * 0.1
    }
    if (middleRingRef.current) {
      middleRingRef.current.rotation.z = -progress * Math.PI * 0.5
      middleRingRef.current.rotation.x = 0.35 + progress * 0.1
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = progress * Math.PI * 0.6
      innerRingRef.current.rotation.x = 0.35 + progress * 0.1
    }
  })

  return (
    <group position={[0, 0, -0.1]}>
      {/* Outer Ring: Marca */}
      <mesh ref={outerRingRef} material={blueRingMaterial}>
        <torusGeometry args={[2.2, 0.04, 16, 64]} />
      </mesh>

      {/* Middle Ring: Modelo */}
      <mesh ref={middleRingRef} material={blueRingMaterial}>
        <torusGeometry args={[1.7, 0.035, 16, 64]} />
      </mesh>

      {/* Inner Ring: Año (Highlights in Red) */}
      <mesh ref={innerRingRef} material={redMatchMaterial}>
        <torusGeometry args={[1.25, 0.045, 16, 64]} />
      </mesh>
    </group>
  )
}
