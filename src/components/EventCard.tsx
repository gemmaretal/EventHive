import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Link from 'next/link'
import { type Event } from '@/mocks/events'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card
      component={Link}
      href={`/events/${event.slug}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={event.bannerUrl}
        alt={event.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {event.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {event.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          📅 {eventDate}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          📍 {event.location}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          👥 Capacity: {event.capacity}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {event.tags.map(tag => (
            <Chip key={tag} label={tag} size="small" color="primary" />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
