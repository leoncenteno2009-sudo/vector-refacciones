'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MechanicalNucleusProps {
  progress: number
}

// Gear Geometry with teeth
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

  const holePath = new THREE.Path()
  holePath.absarc(0, 0, innerRadius * 0.45, 0, Math.PI * 2, true)
  shape.holes.push(holePath)

  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 3,
  })
}

// Spring Coil Geometry
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
  const piston1Ref = useRef<THREE.Group>(null)
  const piston2Ref = useRef<THREE.Group>(null)
  const sparkPlug1Ref = useRef<THREE.Group>(null)
  const sparkPlug2Ref = useRef<THREE.Group>(null)
  const shock1Ref = useRef<THREE.Group>(null)
  const shock2Ref = useRef<THREE.Group>(null)

  // Geometries
  const mainGearGeom = useMemo(() => createGearGeometry(0.75, 1.0, 18, 0.16), [])
  const secGearGeom = useMemo(() => createGearGeometry(0.45, 0.62, 12, 0.14), [])
  const springGeom = useMemo(() => createSpringGeometry(0.2, 0.035, 6, 1.1), [])

  // Photorealistic Metallic Materials
  const satinSteelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#E2E8F0',
        roughness: 0.22,
        metalness: 0.95,
      }),
    []
  )

  const darkGunmetalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1E293B',
        roughness: 0.35,
        metalness: 0.85,
      }),
    []
  )

  const redBrakeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#B62025',
        roughness: 0.2,
        metalness: 0.7,
      }),
    []
  )

  const ceramicInsulatorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        roughness: 0.12,
        metalness: 0.05,
      }),
    []
  )

  const copperMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#D97706',
        roughness: 0.28,
        metalness: 0.9,
      }),
    []
  )

  const laserRedMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#B62025',
        transparent: true,
        opacity: 0.9,
      }),
    []
  )

  // Motion & Animation Frame Loop
  useFrame((state) => {
    if (!groupRef.current) return

    const t = state.clock.getElapsedTime()

    // Smooth baseline idle spin for gears & mechanical cluster
    if (mainGearRef.current) mainGearRef.current.rotation.z = t * 0.35 + progress * Math.PI * 0.8
    if (secGearRef.current) secGearRef.current.rotation.z = -t * 0.5 - progress * Math.PI * 1.2

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      progress * Math.PI * 0.35 + Math.sin(t * 0.4) * 0.03,
      0.08
    )

    // State 01 Keyframe Alignment (0 - 0.24):
    // Central Brake Disc as anchor, components suspended along red laser line
    if (progress <= 0.24) {
      const p = progress / 0.24
      if (brakeGroupRef.current) {
        brakeGroupRef.current.rotation.z = p * Math.PI * 0.5
        brakeGroupRef.current.position.set(0, 0, 0)
      }
      if (mainGearRef.current) mainGearRef.current.position.set(1.45 - p * 0.4, 0.55 - p * 0.15, 0)
      if (secGearRef.current) secGearRef.current.position.set(2.1 - p * 0.5, 0.15 - p * 0.1, -0.15)
      if (piston1Ref.current)
        piston1Ref.current.position.set(-1.6 + p * 0.4, -0.65 + p * 0.2 + Math.sin(t * 1.5) * 0.02, 0.1)
      if (piston2Ref.current)
        piston2Ref.current.position.set(-2.2 + p * 0.6, 0.75 - p * 0.3 + Math.cos(t * 1.5) * 0.02, -0.2)
      if (sparkPlug1Ref.current) sparkPlug1Ref.current.position.set(1.6 - p * 0.3, 1.45 - p * 0.3, -0.1)
      if (sparkPlug2Ref.current) sparkPlug2Ref.current.position.set(-1.5 + p * 0.3, -1.5 + p * 0.3, 0.1)
      if (shock1Ref.current) shock1Ref.current.position.set(0.7 - p * 0.15, -1.45 + p * 0.4, 0.15)
    } else if (progress <= 0.5) {
      // State 02: Compatibility Rings & Concentric Focus
      const p = (progress - 0.24) / 0.26
      if (mainGearRef.current) mainGearRef.current.position.set(1.05 - p * 0.4, 0.4 - p * 0.2, 0)
      if (piston1Ref.current) piston1Ref.current.position.set(-1.2 + p * 0.5, -0.45 + p * 0.2, 0)
    } else if (progress <= 0.76) {
      // State 03: Logistics Track Alignment
      const p = (progress - 0.5) / 0.26
      if (groupRef.current) {
        groupRef.current.position.x = THREE.MathUtils.lerp(0, -0.5, p)
        groupRef.current.position.y = THREE.MathUtils.lerp(0, 0.25, p)
      }
    } else {
      // State 04: Silhouette Assembly
      const p = (progress - 0.76) / 0.24
      if (groupRef.current) {
        groupRef.current.position.x = THREE.MathUtils.lerp(-0.5, 0.2, p)
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(1, 0.85, p))
      }
    }
  })

  // Diagonal Red VECTOR Laser Lines crossing axial center as in Keyframe 01
  const laserPoints1 = useMemo(
    () => [new THREE.Vector3(-4.2, -2.1, 0), new THREE.Vector3(4.2, 2.1, 0)],
    []
  )
  const laserPoints2 = useMemo(
    () => [new THREE.Vector3(-3.8, 1.9, 0), new THREE.Vector3(3.8, -1.9, 0)],
    []
  )

  const laserGeom1 = useMemo(() => new THREE.BufferGeometry().setFromPoints(laserPoints1), [laserPoints1])
  const laserGeom2 = useMemo(() => new THREE.BufferGeometry().setFromPoints(laserPoints2), [laserPoints2])

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. CENTRAL VENTED BRAKE ROTOR & CALIPER (Keyframe 01 Anchor) */}
      <group ref={brakeGroupRef}>
        {/* Outer Vented Disc */}
        <mesh material={satinSteelMat}>
          <cylinderGeometry args={[1.3, 1.3, 0.08, 48]} />
        </mesh>
        {/* Vented Inner Core */}
        <mesh material={darkGunmetalMat} position={[0, 0, 0]}>
          <cylinderGeometry args={[1.25, 1.25, 0.04, 48]} />
        </mesh>
        {/* Center Mounting Hat */}
        <mesh material={darkGunmetalMat} position={[0, 0, 0.07]}>
          <cylinderGeometry args={[0.5, 0.5, 0.12, 32]} />
        </mesh>

        {/* Cross-Drilled Holes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 12
          return (
            <mesh
              key={i}
              material={darkGunmetalMat}
              position={[Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0.05]}
            >
              <cylinderGeometry args={[0.04, 0.04, 0.14, 12]} />
            </mesh>
          )
        })}

        {/* High-Performance Red Brake Caliper */}
        <group position={[0.9, 0.6, 0.08]} rotation={[0, 0, -Math.PI / 4]}>
          <mesh material={redBrakeMat}>
            <boxGeometry args={[0.55, 0.7, 0.3]} />
          </mesh>
          <mesh material={satinSteelMat} position={[-0.15, 0, 0.12]}>
            <cylinderGeometry args={[0.11, 0.11, 0.1, 16]} />
          </mesh>
        </group>
      </group>

      {/* 2. GEARS (Main & Secondary) */}
      <mesh ref={mainGearRef} geometry={mainGearGeom} material={satinSteelMat} position={[1.45, 0.55, 0]} />
      <mesh ref={secGearRef} geometry={secGearGeom} material={darkGunmetalMat} position={[2.1, 0.15, -0.15]} />

      {/* 3. PISTONS WITH CONNECTING RODS */}
      <group ref={piston1Ref} position={[-1.6, -0.65, 0.1]}>
        <mesh material={satinSteelMat}>
          <cylinderGeometry args={[0.3, 0.3, 0.42, 24]} />
        </mesh>
        <mesh material={darkGunmetalMat} position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.03, 24]} />
        </mesh>
        <mesh material={darkGunmetalMat} position={[0.2, -0.4, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[0.11, 0.6, 0.07]} />
        </mesh>
      </group>

      <group ref={piston2Ref} position={[-2.2, 0.75, -0.2]}>
        <mesh material={satinSteelMat}>
          <cylinderGeometry args={[0.26, 0.26, 0.38, 24]} />
        </mesh>
        <mesh material={darkGunmetalMat} position={[0.15, -0.38, 0]} rotation={[0, 0, Math.PI / 8]}>
          <boxGeometry args={[0.09, 0.5, 0.06]} />
        </mesh>
      </group>

      {/* 4. SPARK PLUGS */}
      <group ref={sparkPlug1Ref} position={[1.6, 1.45, -0.1]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh material={ceramicInsulatorMat}>
          <cylinderGeometry args={[0.08, 0.08, 0.65, 16]} />
        </mesh>
        <mesh material={satinSteelMat} position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.18, 6]} />
        </mesh>
        <mesh material={copperMat} position={[0, -0.75, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        </mesh>
      </group>

      <group ref={sparkPlug2Ref} position={[-1.5, -1.5, 0.1]} rotation={[0, 0, Math.PI / 3]}>
        <mesh material={ceramicInsulatorMat}>
          <cylinderGeometry args={[0.08, 0.08, 0.65, 16]} />
        </mesh>
        <mesh material={satinSteelMat} position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.18, 6]} />
        </mesh>
      </group>

      {/* 5. SUSPENSION SHOCK ABSORBERS */}
      <group ref={shock1Ref} position={[0.7, -1.45, 0.15]} rotation={[0, 0, -Math.PI / 5]}>
        <mesh material={satinSteelMat}>
          <cylinderGeometry args={[0.055, 0.055, 1.3, 16]} />
        </mesh>
        {/* @ts-ignore */}
        <mesh geometry={springGeom} material={redBrakeMat} />
        <mesh material={darkGunmetalMat} position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.07, 24]} />
        </mesh>
      </group>

      {/* 6. RED VECTOR LASER LINES (Keyframe 01 Exact Aesthetic) */}
      {/* @ts-ignore */}
      <line geometry={laserGeom1} material={laserRedMat} />
      {/* @ts-ignore */}
      <line geometry={laserGeom2} material={laserRedMat} />
    </group>
  )
}
