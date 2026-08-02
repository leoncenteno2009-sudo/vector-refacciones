/**
 * Detección robusta de soporte WebGL y fallbacks de rendimiento
 */

export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    return !!(gl && gl instanceof WebGLRenderingContext)
  } catch (e) {
    return false
  }
}

export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory
  const cores = navigator.hardwareConcurrency

  if (memory && memory < 4) return true
  if (cores && cores < 4) return true

  return false
}
