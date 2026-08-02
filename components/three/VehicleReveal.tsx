'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface VehicleRevealProps {
  progress: number
}

// Procedural aerodynamic sports car body shape
function createVehicleBodyGeometry() {
  const shape = new THREE.Shape()

  // Profile curve of car body
  shape.moveTo(-1.8, 0)
  shape.lineTo(-1.8, 0.25)
  shape.bezierCurveTo(-1.5, 0.35, -1.0, 0.45, -0.6, 0.45) // Hood
  shape.bezierCurveTo(-0.3, 0.85, 0.4, 0.85, 0.7, 0.5)   // Cabin windshield/roof
  shape.bezierCurveTo(1.2, 0.45, 1.6, 0.35, 1.8, 0.3)    // Rear deck
  shape.lineTo(1.8, 0)
  shape.lineTo(-1.8, 0)

  const extrudeSettings = {
    depth: 1.1,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 2,
    bevelSize: 0.08,
    bevelThickness: 0.08,
  }

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  geom.center()
  return geom
}

export const VehicleReveal: React.FC<VehicleRevealProps> = ({ progress }) => {
  const carGroupRef = useRef<THREE.Group>(null)

  const bodyGeom = useMemo(() => createVehicleBodyGeometry(), [])

  // Translucent Graphite Aerodynamic Chassis Material
  const translucentGraphiteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1B1F24',
        roughness: 0.25,
        metalness: 0.95,
        transparent: true,
        opacity: 0,
        wireframe: false,
      }),
    []
  )

  const redAccentMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#B62025',
        transparent: true,
        opacity: 0,
      }),
    []
  )

  const wheelSteelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2A2E33',
        roughness: 0.4,
        metalness: 0.8,
        transparent: true,
        opacity: 0,
      }),
    []
  )

  useFrame(() => {
    // State 04 Window: progress > 0.72
    let opacity = 0
    if (progress > 0.72) {
      opacity = (progress - 0.72) / 0.24
    }

    translucentGraphiteMat.opacity = Math.min(opacity * 0.7, 0.7)
    redAccentMat.opacity = Math.min(opacity, 0.9)
    wheelSteelMat.opacity = Math.min(opacity * 0.85, 0.85)

    if (carGroupRef.current) {
      carGroupRef.current.rotation.y = Math.PI * 0.12 + (1 - progress) * 0.25
    }
  })

  return (
    <group ref={carGroupRef} position={[0.4, -0.1, 0.2]} scale={[1.1, 1.1, 1.1]}>
      {/* Aerodynamic Vehicle Chassis Silhouette */}
      {/* @ts-ignore */}
      <mesh geometry={bodyGeom} material={translucentGraphiteMat} />

      {/* Red VECTOR Character Accent Line */}
      <mesh position={[0, 0.3, 0.58]} material={redAccentMat}>
        <boxGeometry args={[3.2, 0.03, 0.03]} />
      </mesh>

      {/* Wheel Arches / Wheel Hubs Simulation */}
      <mesh material={wheelSteelMat} position={[-1.1, -0.1, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 24]} />
      </mesh>
      <mesh material={wheelSteelMat} position={[1.1, -0.1, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 24]} />
      </mesh>
      <mesh material={wheelSteelMat} position={[-1.1, -0.1, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 24]} />
      </mesh>
      <mesh material={wheelSteelMat} position={[1.1, -0.1, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 24]} />
      </mesh>
    </group>
  )
}
