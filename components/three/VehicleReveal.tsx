'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface VehicleRevealProps {
  progress: number
}

export const VehicleReveal: React.FC<VehicleRevealProps> = ({ progress }) => {
  const carGroupRef = useRef<THREE.Group>(null)
  const bodyMeshRef = useRef<THREE.Mesh>(null)

  // Technical Translucent Graphite Material
  const translucentGraphiteMaterial = new THREE.MeshStandardMaterial({
    color: '#1B1F24',
    roughness: 0.2,
    metalness: 0.9,
    transparent: true,
    opacity: 0,
    wireframe: false,
  })

  const redAccentLineMaterial = new THREE.MeshBasicMaterial({
    color: '#B62025',
    transparent: true,
    opacity: 0,
  })

  useFrame(() => {
    // Fade in during State 04 (progress > 0.70)
    let opacity = 0
    if (progress > 0.7) {
      opacity = (progress - 0.7) / 0.25
    }

    translucentGraphiteMaterial.opacity = Math.min(opacity * 0.75, 0.75)
    redAccentLineMaterial.opacity = Math.min(opacity, 0.9)

    if (carGroupRef.current) {
      carGroupRef.current.rotation.y = Math.PI * 0.15 + (1 - progress) * 0.2
    }
  })

  return (
    <group ref={carGroupRef} position={[0.4, -0.2, 0.2]} scale={[1.2, 1.2, 1.2]}>
      {/* Sleek Aerodynamic Car Silhouette Body */}
      <mesh ref={bodyMeshRef} material={translucentGraphiteMaterial}>
        {/* Procedural aerodynamic vehicle cabin/body shape */}
        <cylinderGeometry args={[0.7, 1.3, 3.4, 16]} />
      </mesh>

      {/* Red VECTOR Character Line Accent */}
      <mesh position={[0, 0.45, 0]} material={redAccentLineMaterial}>
        <boxGeometry args={[0.04, 0.04, 3.2]} />
      </mesh>
    </group>
  )
}
