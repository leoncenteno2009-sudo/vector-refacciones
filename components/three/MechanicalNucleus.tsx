'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MechanicalNucleusProps {
  progress: number
}

export const MechanicalNucleus: React.FC<MechanicalNucleusProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null)
  const brakeDiscRef = useRef<THREE.Group>(null)
  const gearsGroupRef = useRef<THREE.Group>(null)
  const pistonsGroupRef = useRef<THREE.Group>(null)
  const sparkPlugsGroupRef = useRef<THREE.Group>(null)
  const laserLineRef = useRef<THREE.Line>(null)

  // Materials
  const metallicMaterial = new THREE.MeshStandardMaterial({
    color: '#AAB0B6',
    roughness: 0.35,
    metalness: 0.85,
  })

  const darkSteelMaterial = new THREE.MeshStandardMaterial({
    color: '#2A2E33',
    roughness: 0.5,
    metalness: 0.7,
  })

  const brakeCeramicMaterial = new THREE.MeshStandardMaterial({
    color: '#D8DCDD',
    roughness: 0.4,
    metalness: 0.3,
  })

  const redLaserMaterial = new THREE.MeshBasicMaterial({
    color: '#B62025',
    transparent: true,
    opacity: 0.9,
  })

  const blueDiagMaterial = new THREE.MeshStandardMaterial({
    color: '#78BDE7',
    roughness: 0.2,
    metalness: 0.6,
    emissive: '#3689BE',
    emissiveIntensity: 0.5,
  })

  // Synchronize 3D positions with scroll progress deterministically without React state
  useFrame(() => {
    if (!groupRef.current) return

    // Base subtle rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, progress * Math.PI * 0.35, 0.1)

    // State 01: 0 - 0.24 (Exploded view)
    // State 02: 0.24 - 0.50 (Compatibility concentric focus)
    // State 03: 0.50 - 0.76 (Logistics track movement)
    // State 04: 0.76 - 1.0 (Assembly into vehicle silhouette)

    if (progress <= 0.24) {
      const p = progress / 0.24
      // Brake disc central anchor
      if (brakeDiscRef.current) {
        brakeDiscRef.current.rotation.z = p * Math.PI * 0.5
        brakeDiscRef.current.position.set(0, 0, 0)
      }
      // Gears spread out
      if (gearsGroupRef.current) {
        gearsGroupRef.current.position.x = THREE.MathUtils.lerp(1.8, 1.2, p)
        gearsGroupRef.current.position.y = THREE.MathUtils.lerp(0.8, 0.4, p)
      }
      // Pistons spread out
      if (pistonsGroupRef.current) {
        pistonsGroupRef.current.position.x = THREE.MathUtils.lerp(-1.8, -1.1, p)
        pistonsGroupRef.current.position.y = THREE.MathUtils.lerp(-0.9, -0.3, p)
      }
    } else if (progress <= 0.5) {
      const p = (progress - 0.24) / 0.26
      if (gearsGroupRef.current) {
        gearsGroupRef.current.position.x = THREE.MathUtils.lerp(1.2, 0.6, p)
        gearsGroupRef.current.rotation.z = p * Math.PI * 0.8
      }
      if (pistonsGroupRef.current) {
        pistonsGroupRef.current.position.x = THREE.MathUtils.lerp(-1.1, -0.4, p)
      }
    } else if (progress <= 0.76) {
      const p = (progress - 0.5) / 0.26
      // Route flow
      if (groupRef.current) {
        groupRef.current.position.x = THREE.MathUtils.lerp(0, -0.5, p)
        groupRef.current.position.y = THREE.MathUtils.lerp(0, 0.3, p)
      }
    } else {
      const p = (progress - 0.76) / 0.24
      // Assembly into vehicle silhouette
      if (groupRef.current) {
        groupRef.current.position.x = THREE.MathUtils.lerp(-0.5, 0.2, p)
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.85, p))
      }
    }
  })

  // Laser line points
  const points = [
    new THREE.Vector3(-4, -2, 0),
    new THREE.Vector3(-1.5, -0.5, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1.5, 0.8, 0),
    new THREE.Vector3(4, 2, 0),
  ]
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Brake Disc */}
      <group ref={brakeDiscRef}>
        {/* Outer rotor */}
        <mesh material={brakeCeramicMaterial}>
          <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
        </mesh>
        {/* Inner hat */}
        <mesh material={darkSteelMaterial} position={[0, 0, 0.08]}>
          <cylinderGeometry args={[0.5, 0.5, 0.12, 24]} />
        </mesh>
        {/* Ventilation holes simulation */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <mesh
            key={i}
            material={darkSteelMaterial}
            position={[
              Math.cos((angle * Math.PI) / 180) * 0.85,
              Math.sin((angle * Math.PI) / 180) * 0.85,
              0.05,
            ]}
          >
            <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
          </mesh>
        ))}
      </group>

      {/* Gears Group */}
      <group ref={gearsGroupRef} position={[1.8, 0.8, 0]}>
        <mesh material={metallicMaterial}>
          <cylinderGeometry args={[0.6, 0.6, 0.15, 16]} />
        </mesh>
        <mesh material={darkSteelMaterial} position={[0.7, -0.3, -0.1]}>
          <cylinderGeometry args={[0.4, 0.4, 0.12, 12]} />
        </mesh>
      </group>

      {/* Pistons Group */}
      <group ref={pistonsGroupRef} position={[-1.8, -0.9, 0]}>
        <mesh material={metallicMaterial} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.25, 0.25, 0.7, 16]} />
        </mesh>
        <mesh material={darkSteelMaterial} position={[0.3, -0.4, 0.1]} rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.22, 0.22, 0.6, 16]} />
        </mesh>
      </group>

      {/* Spark Plugs */}
      <group ref={sparkPlugsGroupRef} position={[0.2, 1.4, -0.2]}>
        <mesh material={brakeCeramicMaterial}>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 12]} />
        </mesh>
        <mesh material={metallicMaterial} position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.2, 12]} />
        </mesh>
      </group>

      {/* Red VECTOR laser line crossing the axial center */}
      {/* @ts-ignore */}
      <line ref={laserLineRef} geometry={lineGeometry} material={redLaserMaterial} />
    </group>
  )
}
