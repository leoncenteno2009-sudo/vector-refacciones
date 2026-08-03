/**
 * Detección robusta de soporte WebGL 1 y 2
 */

export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    return !!gl
  } catch (e) {
    return false
  }
}

export function isLowEndDevice(): boolean {
  return false
}
