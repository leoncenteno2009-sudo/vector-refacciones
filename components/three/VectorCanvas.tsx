'use client'

import React, { useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MechanicalNucleus } from './MechanicalNucleus'
import { CompatibilityRings } from './CompatibilityRings'
import { DistributionRoute } from './DistributionRoute'
import { VehicleReveal } from './VehicleReveal'
import { FallbackPoster } from './FallbackPoster'
import { isWebGLAvailable } from '@/lib/webgl/detectWebGL'

interface VectorCanvasProps {
  progressRef: React.MutableRefObject<number>
  currentStateIndex: number
}

// Inner Scene wrapper to read progressRef continuously inside R3F useFrame
const VectorScene: React.FC<{ progressRef: React.MutableRefObject<number> }> = ({ progressRef }) => {
  const [localProgress, setLocalProgress] = useState(0)

  useFrame(() => {
    if (Math.abs(localProgress - progressRef.current) > 0.001) {
      setLocalProgress(progressRef.current)
    }
  })

  return (
    <>
      <MechanicalNucleus progress={localProgress} />
      <CompatibilityRings progress={localProgress} />
      <DistributionRoute progress={localProgress} />
      <VehicleReveal progress={localProgress} />
    </>
  )
}

export const VectorCanvas: React.FC<VectorCanvasProps> = ({ progressRef, currentStateIndex }) => {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null)

  useEffect(() => {
    setHasWebGL(isWebGLAvailable())
  }, [])

  if (hasWebGL === false) {
    return <FallbackPoster stateIndex={currentStateIndex} />
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        {/* PBR Lights */}
        <ambientLight intensity={0.85} />
        <directionalLight position={[5, 8, 5]} intensity={1.6} castShadow />
        <directionalLight position={[-5, -4, -3]} intensity={0.4} color="#78BDE7" />
        <pointLight position={[0, 0, 4]} intensity={0.6} color="#FFFFFF" />

        {/* 3D Scene */}
        <VectorScene progressRef={progressRef} />
      </Canvas>
    </div>
  )
}
