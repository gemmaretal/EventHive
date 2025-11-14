'use client'

import { notFound } from 'next/navigation'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from 'next/link'
import { useMockEvents } from '@/lib/useMockEvents'
import EventDetail from '@/components/EventDetail'
import { mockAddOns } from '@/mocks/addons'

interface EventDetailPageProps {
  params: {
    slug: string
  }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const { findBySlug } = useMockEvents()
  const event = findBySlug(params.slug)

  if (!event) {
    notFound()
  }

  const addOns = mockAddOns[event.slug] || []

  return (
    <Box>
      <Button component={Link} href="/events" variant="text" sx={{ mb: 3 }}>
        ← Back to Events
      </Button>
      <EventDetail event={event} addOns={addOns} />
    </Box>
  )
}
