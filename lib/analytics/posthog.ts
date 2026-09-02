import posthog from 'posthog-js'

const VISITOR_ID_KEY = 'ai_feelz_visitor_id'

let initialized = false

/** Initializes the PostHog client once. No-ops without env vars set (e.g. local dev without a project). */
export function initPosthog() {
  if (initialized || typeof window === 'undefined') return

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST
  if (!key || !host) return

  posthog.init(key, {
    api_host: host,
    person_profiles: 'identified_only',
    capture_pageview: false,
    autocapture: false,
    disable_session_recording: true,
  })
  initialized = true
}

/**
 * Anonymous, persistent per-browser identifier — no accounts, no PII.
 * `isReturning` reflects whether this id already existed before this call.
 * localStorage can throw (Safari private browsing, storage-blocked embeds) —
 * fall back to a fresh, non-persisted id rather than breaking the caller.
 */
export function getOrCreateVisitorId(): { id: string; isReturning: boolean } {
  if (typeof window === 'undefined') return { id: '', isReturning: false }

  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY)
    if (existing) return { id: existing, isReturning: true }

    const id = crypto.randomUUID()
    window.localStorage.setItem(VISITOR_ID_KEY, id)
    return { id, isReturning: false }
  } catch {
    return { id: crypto.randomUUID(), isReturning: false }
  }
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !initialized) return
  posthog.capture(event, properties)
}
