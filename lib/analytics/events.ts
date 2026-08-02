/**
 * Eventos de analítica desacoplados para VECTOR
 * Cumple con privacidad y permite integración con cualquier proveedor (GA4, Plausible, PostHog).
 */

export type AnalyticsEventName =
  | 'hero_search_click'
  | 'hero_quote_click'
  | 'scroll_state_view'
  | 'compatibility_start'
  | 'compatibility_submit'
  | 'distribution_cta_click'
  | 'quote_start'
  | 'quote_submit_success'
  | 'quote_submit_error'
  | 'advisor_click'

export interface AnalyticsPayload {
  stateIndex?: number
  category?: string
  make?: string
  model?: string
  year?: string
  errorMessage?: string
  [key: string]: unknown
}

export function trackEvent(eventName: AnalyticsEventName, payload?: AnalyticsPayload): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Event] ${eventName}`, payload || {})
  }

  // Hook para integrar proveedores externos sin contaminar la lógica de negocio
  if (typeof window !== 'undefined' && (window as unknown as { datalayer?: unknown[] }).datalayer) {
    ;(window as unknown as { datalayer: unknown[] }).datalayer.push({
      event: eventName,
      ...payload,
      timestamp: new Date().toISOString(),
    })
  }
}
