'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DistributionRouteProps {
  progress: number
}

export const DistributionRoute: React.FC<DistributionRouteProps> = ({ progress }) => {
  const routeGroupRef = useRef<THREE.Group>(null)
  const part1Ref = useRef<THREE.Group>(null)
  const part2Ref = useRef<THREE.Group>(null)

  // S-curve route for industrial logistics track matching Keyframe 03
  const mainCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.8, -1.9, -0.8),
      new THREE.Vector3(-2.2, -0.4, 0),
      new THREE.Vector3(0, -0.7, 0.4),
      new THREE.Vector3(2.4, 0.5, -0.2),
      new THREE.Vector3(4.9, 1.5, -0.9),
    ])
  }, [])

  const trackTubeGeom = useMemo(() => new THREE.TubeGeometry(mainCurve, 96, 0.09, 12, false), [mainCurve])

  // Photorealistic Red LED Track & Scanner Materials
  const redLedTrackMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#B62025',
        roughness: 0.2,
        metalness: 0.85,
        emissive: '#86171B',
        emissiveIntensity: 0.85,
        transparent: true,
        opacity: 0,
      }),
    []
  )

  const scannerArchMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#F4F1EA',
        roughness: 0.15,
        metalness: 0.9,
        emissive: '#B62025',
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0,
      }),
    []
  )

  const metallicPartMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#CBD5E1',
        roughness: 0.25,
        metalness: 0.9,
        transparent: true,
        opacity: 0,
      }),
    []
  )

  useFrame(() => {
    // State 03 Window: 0.44 <= progress <= 0.80
    let opacity = 0
    if (progress >= 0.44 && progress <= 0.8) {
      if (progress < 0.5) {
        opacity = (progress - 0.44) / 0.06
      } else if (progress > 0.74) {
        opacity = 1 - (progress - 0.74) / 0.06
      } else {
        opacity = 1
      }
    }

    redLedTrackMat.opacity = opacity
    scannerArchMat.opacity = opacity
    metallicPartMat.opacity = opacity

    // Move parts along curve deterministically with scroll
    if (progress >= 0.45 && progress <= 0.78) {
      const t1 = THREE.MathUtils.clamp((progress - 0.45) / 0.32, 0, 1)
      const t2 = THREE.MathUtils.clamp((progress - 0.48) / 0.32, 0, 1)

      if (part1Ref.current) {
        const pt = mainCurve.getPointAt(t1)
        part1Ref.current.position.copy(pt)
        part1Ref.current.rotation.y = t1 * Math.PI * 2
      }

      if (part2Ref.current) {
        const pt = mainCurve.getPointAt(t2)
        part2Ref.current.position.copy(pt)
        part2Ref.current.rotation.z = t2 * Math.PI * 1.5
      }
    }
  })

  return (
    <group ref={routeGroupRef} position={[0, 0, 0]}>
      {/* Main Red LED Conveyor Track */}
      {/* @ts-ignore */}
      <mesh geometry={trackTubeGeom} material={redLedTrackMat} />

      {/* Industrial Scanner Gantry 1 */}
      <group position={[-2.2, -0.4, 0]} rotation={[0, Math.PI / 4, 0]}>
        <mesh material={scannerArchMat}>
          <boxGeometry args={[0.12, 1.3, 1.3]} />
        </mesh>
      </group>

      {/* Industrial Scanner Gantry 2 */}
      <group position={[2.4, 0.5, -0.2]} rotation={[0, -Math.PI / 6, 0]}>
        <mesh material={scannerArchMat}>
          <boxGeometry args={[0.12, 1.3, 1.3]} />
        </mesh>
      </group>

      {/* Auto Parts Traveling along Conveyor Track */}
      <group ref={part1Ref} position={[-4.8, -1.9, -0.8]}>
        <mesh material={metallicPartMat}>
          <cylinderGeometry args={[0.32, 0.32, 0.08, 24]} />
        </mesh>
      </group>

      <group ref={part2Ref} position={[-4.8, -1.9, -0.8]}>
        <mesh material={metallicPartMat}>
          <cylinderGeometry args={[0.22, 0.22, 0.38, 16]} />
        </mesh>
      </group>
    </group>
  )
}
