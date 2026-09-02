'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'
import { getOrCreateVisitorId, initPosthog } from '@/lib/analytics/posthog'

export function PosthogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPosthog()
    const { id } = getOrCreateVisitorId()
    if (id) posthog.identify(id)
  }, [])

  return <>{children}</>
}
