'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface VehicleRevealProps {
  progress: number
}

// Procedural aerodynamic sports car chassis shape matching Keyframe 04
function createVehicleBodyGeometry() {
  const shape = new THREE.Shape()

  shape.moveTo(-1.8, 0)
  shape.lineTo(-1.8, 0.25)
  shape.bezierCurveTo(-1.5, 0.35, -1.0, 0.45, -0.6, 0.45) // Hood
  shape.bezierCurveTo(-0.3, 0.85, 0.4, 0.85, 0.7, 0.5)   // Cabin windshield/roof
  shape.bezierCurveTo(1.2, 0.45, 1.6, 0.35, 1.8, 0.3)    // Rear deck
  shape.lineTo(1.8, 0)
  shape.lineTo(-1.8, 0)

  const extrudeSettings = {
    depth: 1.15,
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

  // Translucent Graphite Aerodynamic Chassis Material (Keyframe 04 Aesthetic)
  const translucentGraphiteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1E293B',
        roughness: 0.2,
        metalness: 0.95,
        transparent: true,
        opacity: 0,
      }),
    []
  )

  const redCharacterLineMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#B62025',
        transparent: true,
        opacity: 0,
      }),
    []
  )

  const blueGlowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#38BDF8',
        emissive: '#0284C7',
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0,
      }),
    []
  )

  const wheelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0F172A',
        roughness: 0.3,
        metalness: 0.85,
        transparent: true,
        opacity: 0,
      }),
    []
  )

  useFrame(() => {
    // State 04 Window: progress > 0.72
    let opacity = 0
    if (progress > 0.72) {
      opacity = (progress - 0.72) / 0.28
    }

    translucentGraphiteMat.opacity = Math.min(opacity * 0.75, 0.75)
    redCharacterLineMat.opacity = Math.min(opacity, 0.95)
    blueGlowMat.opacity = Math.min(opacity * 0.8, 0.8)
    wheelMat.opacity = Math.min(opacity * 0.9, 0.9)

    if (carGroupRef.current) {
      carGroupRef.current.rotation.y = Math.PI * 0.14 + (1 - progress) * 0.2
    }
  })

  return (
    <group ref={carGroupRef} position={[0.3, -0.05, 0.15]} scale={[1.15, 1.15, 1.15]}>
      {/* Translucent Technical Chassis */}
      {/* @ts-ignore */}
      <mesh geometry={bodyGeom} material={translucentGraphiteMat} />

      {/* Red VECTOR Character Accent Line */}
      <mesh position={[0, 0.32, 0.6]} material={redCharacterLineMat}>
        <boxGeometry args={[3.3, 0.035, 0.035]} />
      </mesh>

      {/* Blue Circuit Glow Accent (Powertrain Integration in Keyframe 04) */}
      <mesh position={[-0.2, 0.1, 0.2]} material={blueGlowMat}>
        <boxGeometry args={[0.8, 0.4, 0.4]} />
      </mesh>

      {/* Wheels */}
      <mesh material={wheelMat} position={[-1.15, -0.1, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.15, 24]} />
      </mesh>
      <mesh material={wheelMat} position={[1.15, -0.1, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.15, 24]} />
      </mesh>
      <mesh material={wheelMat} position={[-1.15, -0.1, -0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.15, 24]} />
      </mesh>
      <mesh material={wheelMat} position={[1.15, -0.1, -0.58]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.15, 24]} />
      </mesh>
    </group>
  )
}
