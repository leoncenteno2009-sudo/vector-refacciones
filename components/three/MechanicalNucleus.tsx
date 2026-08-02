'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MechanicalNucleusProps {
  progress: number
}

// Helper to generate a Gear Geometry with teeth
function createGearGeometry(innerRadius: number, outerRadius: number, teeth: number, depth: number) {
  const shape = new THREE.Shape()
  const step = (Math.PI * 2) / teeth
  const toothWidth = step * 0.25

  for (let i = 0; i < teeth; i++) {
    const a = i * step
    const a1 = a + toothWidth * 0.5
    const a2 = a + toothWidth * 1.5
    const a3 = a + step - toothWidth * 0.5

    if (i === 0) {
      shape.moveTo(Math.cos(a) * innerRadius, Math.sin(a) * innerRadius)
    } else {
      shape.lineTo(Math.cos(a) * innerRadius, Math.sin(a) * innerRadius)
    }
    shape.lineTo(Math.cos(a1) * outerRadius, Math.sin(a1) * outerRadius)
    shape.lineTo(Math.cos(a2) * outerRadius, Math.sin(a2) * outerRadius)
    shape.lineTo(Math.cos(a3) * innerRadius, Math.sin(a3) * innerRadius)
  }

  // Center hole
  const holePath = new THREE.Path()
  holePath.absarc(0, 0, innerRadius * 0.4, 0, Math.PI * 2, true)
  shape.holes.push(holePath)

  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 3,
  })
}

// Helper for Helical Spring Geometry
function createSpringGeometry(radius: number, tubeRadius: number, turns: number, height: number) {
  const points: THREE.Vector3[] = []
  const steps = turns * 32
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const angle = t * turns * Math.PI * 2
    const x = Math.cos(angle) * radius
    const y = (t - 0.5) * height
    const z = Math.sin(angle) * radius
    points.push(new THREE.Vector3(x, y, z))
  }
  const curve = new THREE.CatmullRomCurve3(points)
  return new THREE.TubeGeometry(curve, 128, tubeRadius, 12, false)
}

export const MechanicalNucleus: React.FC<MechanicalNucleusProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null)
  const brakeGroupRef = useRef<THREE.Group>(null)
  const mainGearRef = useRef<THREE.Mesh>(null)
  const secGearRef = useRef<THREE.Mesh>(null)
  const piston1GroupRef = useRef<THREE.Group>(null)
  const piston2GroupRef = useRef<THREE.Group>(null)
  const sparkPlugRef = useRef<THREE.Group>(null)
  const shockRef = useRef<THREE.Group>(null)
  const laserLineRef = useRef<THREE.Line>(null)

  // Geometries
  const mainGearGeom = useMemo(() => createGearGeometry(0.8, 1.05, 18, 0.18), [])
  const secGearGeom = useMemo(() => createGearGeometry(0.5, 0.68, 12, 0.15), [])
  const springGeom = useMemo(() => createSpringGeometry(0.22, 0.04, 6, 1.2), [])

  // High Quality PBR Materials
  const brushedSteelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D0D5DD',
        roughness: 0.28,
        metalness: 0.92,
      }),
    []
  )

  const darkGraphiteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#23272E',
        roughness: 0.45,
        metalness: 0.75,
      }),
    []
  )

  const brakeCaliperRedMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#B62025',
        roughness: 0.3,
        metalness: 0.6,
      }),
    []
  )

  const ceramicMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#F4F1EA',
        roughness: 0.15,
        metalness: 0.1,
      }),
    []
  )

  const copperMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D97706',
        roughness: 0.35,
        metalness: 0.85,
      }),
    []
  )

  const laserMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#B62025',
        transparent: true,
        opacity: 0.95,
      }),
    []
  )

  // Frame Interpolation
  useFrame(() => {
    if (!groupRef.current) return

    // Gentle baseline axial rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      progress * Math.PI * 0.4,
      0.08
    )

    // State 01: Exploded View (0 - 0.24)
    // State 02: Compatibility Rings & Concentric Focus (0.24 - 0.50)
    // State 03: Logistics Track Alignment (0.50 - 0.76)
    // State 04: Silhouette Assembly (0.76 - 1.0)
    if (progress <= 0.24) {
      const p = progress / 0.24
      if (brakeGroupRef.current) {
        brakeGroupRef.current.rotation.z = p * Math.PI * 0.6
        brakeGroupRef.current.position.set(0, 0, 0)
      }
      if (mainGearRef.current) mainGearRef.current.position.set(1.7 - p * 0.5, 0.7 - p * 0.2, 0)
      if (secGearRef.current) secGearRef.current.position.set(2.4 - p * 0.6, 0.2 - p * 0.1, -0.2)
      if (piston1GroupRef.current) piston1GroupRef.current.position.set(-1.8 + p * 0.5, -0.8 + p * 0.3, 0.1)
      if (piston2GroupRef.current) piston2GroupRef.current.position.set(-2.4 + p * 0.7, 0.9 - p * 0.4, -0.3)
      if (shockRef.current) shockRef.current.position.set(0.8 - p * 0.2, -1.6 + p * 0.5, 0.2)
    } else if (progress <= 0.5) {
      const p = (progress - 0.24) / 0.26
      if (mainGearRef.current) {
        mainGearRef.current.position.set(1.2 - p * 0.5, 0.5 - p * 0.3, 0)
        mainGearRef.current.rotation.z = p * Math.PI * 0.8
      }
      if (secGearRef.current) {
        secGearRef.current.rotation.z = -p * Math.PI * 1.2
      }
      if (piston1GroupRef.current) {
        piston1GroupRef.current.position.set(-1.3 + p * 0.6, -0.5 + p * 0.3, 0)
      }
    } else if (progress <= 0.76) {
      const p = (progress - 0.5) / 0.26
      if (groupRef.current) {
        groupRef.current.position.x = THREE.MathUtils.lerp(0, -0.6, p)
        groupRef.current.position.y = THREE.MathUtils.lerp(0, 0.3, p)
      }
    } else {
      const p = (progress - 0.76) / 0.24
      if (groupRef.current) {
        groupRef.current.position.x = THREE.MathUtils.lerp(-0.6, 0.25, p)
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.82, p))
      }
    }
  })

  // Red laser axis line
  const laserPoints = useMemo(
    () => [
      new THREE.Vector3(-4.5, -2.2, 0),
      new THREE.Vector3(-1.8, -0.8, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1.8, 0.9, 0),
      new THREE.Vector3(4.5, 2.2, 0),
    ],
    []
  )
  const laserGeom = useMemo(() => new THREE.BufferGeometry().setFromPoints(laserPoints), [laserPoints])

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. CENTRAL VENTED BRAKE DISC & RED CALIPER */}
      <group ref={brakeGroupRef}>
        {/* Outer Vented Disc */}
        <mesh material={brushedSteelMat}>
          <cylinderGeometry args={[1.35, 1.35, 0.08, 48]} />
        </mesh>
        {/* Vented Center Gap */}
        <mesh material={darkGraphiteMat} position={[0, 0, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 0.04, 48]} />
        </mesh>
        {/* Inner Hat */}
        <mesh material={darkGraphiteMat} position={[0, 0, 0.07]}>
          <cylinderGeometry args={[0.55, 0.55, 0.12, 32]} />
        </mesh>

        {/* Cross-Drilled Holes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 12
          return (
            <mesh
              key={i}
              material={darkGraphiteMat}
              position={[Math.cos(angle) * 0.95, Math.sin(angle) * 0.95, 0.05]}
            >
              <cylinderGeometry args={[0.045, 0.045, 0.14, 12]} />
            </mesh>
          )
        })}

        {/* High-Performance Red Brake Caliper */}
        <group position={[0.95, 0.65, 0.08]} rotation={[0, 0, -Math.PI / 4]}>
          <mesh material={brakeCaliperRedMat}>
            <boxGeometry args={[0.6, 0.75, 0.32]} />
          </mesh>
          {/* Caliper Pistons detail */}
          <mesh material={brushedSteelMat} position={[-0.15, 0, 0.12]}>
            <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
          </mesh>
        </group>
      </group>

      {/* 2. MAIN & SECONDARY GEARS WITH REAL TEETH */}
      <mesh ref={mainGearRef} geometry={mainGearGeom} material={brushedSteelMat} position={[1.7, 0.7, 0]} />
      <mesh ref={secGearRef} geometry={secGearGeom} material={darkGraphiteMat} position={[2.4, 0.2, -0.2]} />

      {/* 3. MULTI-STAGE PISTONS WITH CONNECTING RODS */}
      <group ref={piston1GroupRef} position={[-1.8, -0.8, 0.1]}>
        {/* Piston Crown */}
        <mesh material={brushedSteelMat}>
          <cylinderGeometry args={[0.32, 0.32, 0.45, 24]} />
        </mesh>
        {/* Piston Rings */}
        <mesh material={darkGraphiteMat} position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.33, 0.33, 0.03, 24]} />
        </mesh>
        {/* Connecting Rod */}
        <mesh material={darkGraphiteMat} position={[0.2, -0.45, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[0.12, 0.65, 0.08]} />
        </mesh>
      </group>

      <group ref={piston2GroupRef} position={[-2.4, 0.9, -0.3]}>
        <mesh material={brushedSteelMat}>
          <cylinderGeometry args={[0.28, 0.28, 0.4, 24]} />
        </mesh>
        <mesh material={darkGraphiteMat} position={[0.15, -0.4, 0]} rotation={[0, 0, Math.PI / 8]}>
          <boxGeometry args={[0.1, 0.55, 0.07]} />
        </mesh>
      </group>

      {/* 4. SPARK PLUG WITH CERAMIC INSULATOR & COPPER TIP */}
      <group ref={sparkPlugRef} position={[0.3, 1.6, -0.15]} rotation={[0, 0, Math.PI / 3]}>
        {/* White Ceramic Insulator */}
        <mesh material={ceramicMat}>
          <cylinderGeometry args={[0.09, 0.09, 0.7, 16]} />
        </mesh>
        {/* Metal Hex Nut */}
        <mesh material={brushedSteelMat} position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.2, 6]} />
        </mesh>
        {/* Thread Body */}
        <mesh material={darkGraphiteMat} position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.25, 16]} />
        </mesh>
        {/* Copper Electrode Tip */}
        <mesh material={copperMat} position={[0, -0.82, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        </mesh>
      </group>

      {/* 5. SUSPENSION SHOCK ABSORBER WITH HELICAL SPRING */}
      <group ref={shockRef} position={[0.8, -1.6, 0.2]} rotation={[0, 0, -Math.PI / 6]}>
        {/* Central Damper Rod */}
        <mesh material={brushedSteelMat}>
          <cylinderGeometry args={[0.06, 0.06, 1.4, 16]} />
        </mesh>
        {/* Helical Spring Coil */}
        {/* @ts-ignore */}
        <mesh geometry={springGeom} material={brakeCaliperRedMat} />
        {/* Top/Bottom Spring Seats */}
        <mesh material={darkGraphiteMat} position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.08, 24]} />
        </mesh>
        <mesh material={darkGraphiteMat} position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.08, 24]} />
        </mesh>
      </group>

      {/* 6. RED VECTOR AXIAL LASER LINE */}
      {/* @ts-ignore */}
      <line ref={laserLineRef} geometry={laserGeom} material={laserMat} />
    </group>
  )
}
