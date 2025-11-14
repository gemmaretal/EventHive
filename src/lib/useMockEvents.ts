'use client'

import { mockEvents, type Event } from '@/mocks/events'

export function useMockEvents() {
  const events = mockEvents

  const findBySlug = (slug: string): Event | undefined => {
    return events.find(event => event.slug === slug)
  }

  return {
    events,
    findBySlug,
  }
}
