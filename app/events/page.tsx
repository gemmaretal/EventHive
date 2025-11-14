'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { useMockEvents } from '@/lib/useMockEvents'
import EventCard from '@/components/EventCard'

export default function EventsPage() {
  const { events } = useMockEvents()

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom>
        Browse Events
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        Discover and join exciting group buying events
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {events.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
