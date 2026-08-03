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

  useFrame((state, delta) => {
    const currentP = progressRef.current || 0
    if (Math.abs(localProgress - currentP) > 0.0005) {
      setLocalProgress(currentP)
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
  const [hasWebGL, setHasWebGL] = useState<boolean>(true)

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false)
    }
  }, [])

  if (!hasWebGL) {
    return <FallbackPoster stateIndex={currentStateIndex} />
  }

  return (
    <div className="w-full h-full relative min-h-[350px] lg:min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 36 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        {/* Ambient & Studio Lights */}
        <ambientLight intensity={1.1} />
        <directionalLight position={[6, 8, 6]} intensity={2.0} castShadow />
        <directionalLight position={[-6, -4, -3]} intensity={0.6} color="#78BDE7" />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#FFFFFF" />

        {/* 3D Scene */}
        <VectorScene progressRef={progressRef} />
      </Canvas>
    </div>
  )
}
