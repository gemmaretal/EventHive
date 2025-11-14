'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import { type Event } from '@/mocks/events'
import { type AddOn } from '@/mocks/addons'

interface EventDetailProps {
  event: Event
  addOns: AddOn[]
}

export default function EventDetail({ event, addOns }: EventDetailProps) {
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>(
    {}
  )

  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleAddOnQuantityChange = (addOnId: string, quantity: number) => {
    if (quantity <= 0) {
      const newSelectedAddOns = { ...selectedAddOns }
      delete newSelectedAddOns[addOnId]
      setSelectedAddOns(newSelectedAddOns)
    } else {
      setSelectedAddOns({
        ...selectedAddOns,
        [addOnId]: quantity,
      })
    }
  }

  const handleAddToCart = () => {
    console.log('Adding to cart:', {
      event: event.slug,
      ticketQuantity,
      addOns: selectedAddOns,
    })
    alert('Added to cart! (Mock functionality)')
  }

  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          height: 400,
          backgroundImage: `url(${event.bannerUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          mb: 4,
        }}
      />

      <Typography variant="h3" component="h1" gutterBottom>
        {event.title}
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {event.tags.map(tag => (
          <Chip key={tag} label={tag} color="primary" />
        ))}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            About This Event
          </Typography>
          <Typography variant="body1" paragraph>
            {event.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom>
            Event Details
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>📅 Date:</strong> {eventDate}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>📍 Location:</strong> {event.location}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>👥 Capacity:</strong> {event.capacity} attendees
            </Typography>
          </Box>

          {addOns.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h5" gutterBottom>
                Available Add-Ons
              </Typography>
              <Grid container spacing={2}>
                {addOns.map(addOn => (
                  <Grid item xs={12} sm={6} key={addOn.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {addOn.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${addOn.price.toFixed(2)}
                          {addOn.perTicket ? ' per ticket' : ''}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Stock: {addOn.stock} available
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <TextField
                            type="number"
                            size="small"
                            label="Quantity"
                            value={selectedAddOns[addOn.id] || 0}
                            onChange={e =>
                              handleAddOnQuantityChange(
                                addOn.id,
                                parseInt(e.target.value) || 0
                              )
                            }
                            inputProps={{ min: 0, max: addOn.stock }}
                            sx={{ width: 100 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Get Your Tickets
              </Typography>
              <Box sx={{ mb: 3 }}>
                <TextField
                  type="number"
                  label="Number of Tickets"
                  value={ticketQuantity}
                  onChange={e =>
                    setTicketQuantity(
                      Math.max(1, parseInt(e.target.value) || 1)
                    )
                  }
                  inputProps={{ min: 1, max: event.capacity }}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
