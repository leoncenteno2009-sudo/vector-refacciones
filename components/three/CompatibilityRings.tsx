'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CompatibilityRingsProps {
  progress: number
}

export const CompatibilityRings: React.FC<CompatibilityRingsProps> = ({ progress }) => {
  const outerRingRef = useRef<THREE.Group>(null)
  const middleRingRef = useRef<THREE.Group>(null)
  const innerRingRef = useRef<THREE.Group>(null)

  // Diagnostics Blue PBR Material with subtle glow
  const blueRingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#78BDE7',
        roughness: 0.18,
        metalness: 0.8,
        emissive: '#2A7BB5',
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0,
      }),
    []
  )

  // VECTOR Red Selection Material
  const redMatchMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#B62025',
        roughness: 0.15,
        metalness: 0.85,
        emissive: '#86171B',
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0,
      }),
    []
  )

  // Technical blueprint line grid material
  const gridLineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: '#78BDE7',
        transparent: true,
        opacity: 0,
      }),
    []
  )

  useFrame(() => {
    // Precise state visibility window (State 02: 0.20 to 0.54)
    let opacity = 0
    if (progress >= 0.2 && progress <= 0.54) {
      if (progress < 0.26) {
        opacity = (progress - 0.2) / 0.06
      } else if (progress > 0.48) {
        opacity = 1 - (progress - 0.48) / 0.06
      } else {
        opacity = 1
      }
    }

    blueRingMaterial.opacity = opacity
    redMatchMaterial.opacity = opacity
    gridLineMaterial.opacity = opacity * 0.4

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = progress * Math.PI * 0.5
      outerRingRef.current.rotation.x = 0.38 + progress * 0.08
    }
    if (middleRingRef.current) {
      middleRingRef.current.rotation.z = -progress * Math.PI * 0.6
      middleRingRef.current.rotation.x = 0.38 + progress * 0.08
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = progress * Math.PI * 0.75
      innerRingRef.current.rotation.x = 0.38 + progress * 0.08
    }
  })

  // Blueprint background crosshair grid lines
  const gridPoints = useMemo(() => {
    const pts = []
    // Horizontal line
    pts.push(new THREE.Vector3(-4, 0, -0.2), new THREE.Vector3(4, 0, -0.2))
    // Vertical line
    pts.push(new THREE.Vector3(0, -3, -0.2), new THREE.Vector3(0, 3, -0.2))
    return pts
  }, [])
  const gridGeom = useMemo(() => new THREE.BufferGeometry().setFromPoints(gridPoints), [gridPoints])

  return (
    <group position={[0, 0, -0.05]}>
      {/* Outer Ring: MARCA */}
      <group ref={outerRingRef}>
        <mesh material={blueRingMaterial}>
          <torusGeometry args={[2.35, 0.045, 16, 64]} />
        </mesh>
        {/* Ring ticks */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            material={blueRingMaterial}
            position={[
              Math.cos((i * Math.PI) / 4) * 2.35,
              Math.sin((i * Math.PI) / 4) * 2.35,
              0,
            ]}
          >
            <boxGeometry args={[0.08, 0.02, 0.04]} />
          </mesh>
        ))}
      </group>

      {/* Middle Ring: MODELO */}
      <group ref={middleRingRef}>
        <mesh material={blueRingMaterial}>
          <torusGeometry args={[1.8, 0.04, 16, 64]} />
        </mesh>
      </group>

      {/* Inner Ring: AÑO (Highlight Red) */}
      <group ref={innerRingRef}>
        <mesh material={redMatchMaterial}>
          <torusGeometry args={[1.3, 0.05, 16, 64]} />
        </mesh>
      </group>

      {/* Blueprint Schematic Grid Lines */}
      {/* @ts-ignore */}
      <lineSegments geometry={gridGeom} material={gridLineMaterial} />
    </group>
  )
}
