'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
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
        roughness: 0.15,
        metalness: 0.8,
        emissive: '#2A7BB5',
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0,
      }),
    []
  )

  // VECTOR Red Selection Material for Central Rotor Highlight
  const redMatchMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#B62025',
        roughness: 0.1,
        metalness: 0.85,
        emissive: '#86171B',
        emissiveIntensity: 0.85,
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
    gridLineMaterial.opacity = opacity * 0.5

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
    pts.push(new THREE.Vector3(-4.5, 0, -0.2), new THREE.Vector3(4.5, 0, -0.2))
    pts.push(new THREE.Vector3(0, -3.5, -0.2), new THREE.Vector3(0, 3.5, -0.2))
    return pts
  }, [])
  const gridGeom = useMemo(() => new THREE.BufferGeometry().setFromPoints(gridPoints), [gridPoints])

  const showHtml = progress >= 0.24 && progress <= 0.52

  return (
    <group position={[0, 0, -0.05]}>
      {/* Outer Ring: MARCA */}
      <group ref={outerRingRef}>
        <mesh material={blueRingMaterial}>
          <torusGeometry args={[2.35, 0.045, 16, 64]} />
        </mesh>
        {showHtml && (
          <Html position={[0, 2.38, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-carbon shadow-md border border-steel/20 whitespace-nowrap">
              Marca: Selección
            </div>
          </Html>
        )}
      </group>

      {/* Middle Ring: MODELO */}
      <group ref={middleRingRef}>
        <mesh material={blueRingMaterial}>
          <torusGeometry args={[1.8, 0.04, 16, 64]} />
        </mesh>
        {showHtml && (
          <Html position={[0, 1.83, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-carbon shadow-md border border-steel/20 whitespace-nowrap">
              Modelo: Selección
            </div>
          </Html>
        )}
      </group>

      {/* Inner Ring: AÑO (Highlight Red) */}
      <group ref={innerRingRef}>
        <mesh material={redMatchMaterial}>
          <torusGeometry args={[1.3, 0.055, 16, 64]} />
        </mesh>
        {showHtml && (
          <Html position={[0, 1.33, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
            <div className="bg-vector-red text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-md whitespace-nowrap">
              Año: Coincidencia
            </div>
          </Html>
        )}
      </group>

      {/* Blueprint Schematic Grid Lines */}
      {/* @ts-ignore */}
      <lineSegments geometry={gridGeom} material={gridLineMaterial} />
    </group>
  )
}
