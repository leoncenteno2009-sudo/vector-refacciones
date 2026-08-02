'use client'

import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { MechanicalNucleus } from './MechanicalNucleus'
import { CompatibilityRings } from './CompatibilityRings'
import { DistributionRoute } from './DistributionRoute'
import { VehicleReveal } from './VehicleReveal'
import { FallbackPoster } from './FallbackPoster'
import { isWebGLAvailable } from '@/lib/webgl/detectWebGL'

interface VectorCanvasProps {
  progress: number
  currentStateIndex: number
}

export const VectorCanvas: React.FC<VectorCanvasProps> = ({ progress, currentStateIndex }) => {
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
        {/* Lights */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-5, -4, -3]} intensity={0.4} color="#78BDE7" />
        <pointLight position={[0, 0, 4]} intensity={0.6} color="#FFFFFF" />

        {/* 3D Scene Components */}
        <MechanicalNucleus progress={progress} />
        <CompatibilityRings progress={progress} />
        <DistributionRoute progress={progress} />
        <VehicleReveal progress={progress} />
      </Canvas>
    </div>
  )
}
