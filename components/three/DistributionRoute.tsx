'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DistributionRouteProps {
  progress: number
}

export const DistributionRoute: React.FC<DistributionRouteProps> = ({ progress }) => {
  const routeGroupRef = useRef<THREE.Group>(null)
  const partOnTrackRef = useRef<THREE.Mesh>(null)

  // Create smooth CatmullRom curve for conveyor track
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4, -1.5, -1),
      new THREE.Vector3(-1.5, 0, 0),
      new THREE.Vector3(0.5, -0.5, 0.5),
      new THREE.Vector3(2.5, 0.5, -0.2),
      new THREE.Vector3(4.5, 1.2, -0.8),
    ])
  }, [])

  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 64, 0.06, 8, false), [curve])

  const redTrackMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#B62025',
        roughness: 0.3,
        metalness: 0.8,
        emissive: '#86171B',
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0,
      }),
    []
  )

  const scannerPortalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        roughness: 0.2,
        metalness: 0.9,
        emissive: '#B62025',
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0,
      }),
    []
  )

  const partMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D4D8DC',
        roughness: 0.3,
        metalness: 0.85,
        transparent: true,
        opacity: 0,
      }),
    []
  )

  useFrame(() => {
    // Visible during State 03 (0.45 <= progress <= 0.80)
    let opacity = 0
    if (progress >= 0.42 && progress <= 0.82) {
      if (progress < 0.5) {
        opacity = (progress - 0.42) / 0.08
      } else if (progress > 0.74) {
        opacity = 1 - (progress - 0.74) / 0.08
      } else {
        opacity = 1
      }
    }

    redTrackMaterial.opacity = opacity
    scannerPortalMaterial.opacity = opacity
    partMaterial.opacity = opacity

    // Move part along curve deterministically based on scroll
    if (partOnTrackRef.current && progress >= 0.45 && progress <= 0.78) {
      const t = (progress - 0.45) / 0.33
      const clampedT = THREE.MathUtils.clamp(t, 0, 1)
      const point = curve.getPointAt(clampedT)
      partOnTrackRef.current.position.copy(point)
    }
  })

  return (
    <group ref={routeGroupRef} position={[0, 0, 0]}>
      {/* 3D Track Tube */}
      {/* @ts-ignore */}
      <mesh geometry={tubeGeometry} material={redTrackMaterial} />

      {/* Validation Scanner Arch 1 */}
      <mesh position={[-1.5, 0, 0]} rotation={[0, Math.PI / 4, 0]} material={scannerPortalMaterial}>
        <torusGeometry args={[0.45, 0.03, 12, 32]} />
      </mesh>

      {/* Validation Scanner Arch 2 */}
      <mesh position={[2.5, 0.5, -0.2]} rotation={[0, -Math.PI / 6, 0]} material={scannerPortalMaterial}>
        <torusGeometry args={[0.45, 0.03, 12, 32]} />
      </mesh>

      {/* Auto Part travelling on track */}
      <mesh ref={partOnTrackRef} material={partMaterial}>
        <boxGeometry args={[0.3, 0.25, 0.4]} />
      </mesh>
    </group>
  )
}
