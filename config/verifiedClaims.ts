'use client'

import React from 'react'

export interface VerifiedClaimsConfig {
  fastQuoteResponse20Min: boolean
  guaranteedCompatibility: boolean
  inspectionDimensional100: boolean
  activeNationalDistribution: boolean
  wholesalePricing: boolean
  priorityDeliveries: boolean
  originalOemProducts: boolean
  nationalCoverage: boolean
  vinVerification: boolean
}

export const verifiedClaims: VerifiedClaimsConfig = {
  fastQuoteResponse20Min: false,
  guaranteedCompatibility: true,
  inspectionDimensional100: true,
  activeNationalDistribution: true,
  wholesalePricing: false,
  priorityDeliveries: false,
  originalOemProducts: true,
  nationalCoverage: true,
  vinVerification: true,
}
