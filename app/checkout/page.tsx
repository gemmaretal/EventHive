'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  TextField,
  Divider,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useCart } from '@/context/CartContext'
import { calculateCartSummary, getAddonById } from '@/utils/cart'
import { mockEvents } from '@/mocks/events'

export default function CheckoutPage() {
  const {
    tickets,
    addons,
    removeTicket,
    updateTicketQuantity,
    removeAddon,
    updateAddonQuantity,
  } = useCart()

  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error' | 'warning' | 'info'
  }>({
    open: false,
    message: '',
    severity: 'info',
  })

  const summary = calculateCartSummary(tickets, addons)

  const handleTicketQuantityChange = (eventId: string, newQuantity: number) => {
    if (newQuantity < 0) return
    updateTicketQuantity(eventId, newQuantity)
  }

  const handleAddonQuantityChange = (
    addonId: string,
    eventId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 0) return

    const result = updateAddonQuantity(addonId, eventId, newQuantity)
    if (!result.success) {
      setSnackbar({
        open: true,
        message: result.message || 'Failed to update quantity',
        severity: 'error',
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const getEventById = (eventId: string) => {
    return mockEvents.find(e => e.id === eventId || e.slug === eventId)
  }

  if (tickets.length === 0 && addons.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Add some tickets and add-ons to get started!
        </Typography>
        <Button variant="contained" href="/events">
          Browse Events
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Stack spacing={3} sx={{ mt: 3 }}>
        {tickets.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tickets
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {tickets.map(ticket => {
                const event = getEventById(ticket.eventId)
                return (
                  <Box
                    key={ticket.eventId}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">
                        {event?.title || ticket.eventId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${ticket.price.toFixed(2)} per ticket
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <TextField
                        type="number"
                        size="small"
                        value={ticket.quantity}
                        onChange={e =>
                          handleTicketQuantityChange(
                            ticket.eventId,
                            parseInt(e.target.value) || 0
                          )
                        }
                        inputProps={{ min: 0 }}
                        sx={{ width: 80 }}
                      />
                      <Typography variant="body1" sx={{ minWidth: 80 }}>
                        ${(ticket.price * ticket.quantity).toFixed(2)}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => removeTicket(ticket.eventId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          </Paper>
        )}

        {addons.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add-ons
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {addons.map(addon => {
                const addonData = getAddonById(addon.addonId, addon.eventId)
                const event = getEventById(addon.eventId)
                const ticket = tickets.find(t => t.eventId === addon.eventId)
                const ticketQuantity = ticket?.quantity || 0

                let totalPrice = 0
                if (addonData) {
                  if (addon.perTicket) {
                    totalPrice =
                      addonData.price * addon.quantity * ticketQuantity
                  } else {
                    totalPrice = addonData.price * addon.quantity
                  }
                }

                return (
                  <Box
                    key={`${addon.addonId}-${addon.eventId}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">
                        {addonData?.name || addon.addonId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event?.title || addon.eventId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${addonData?.price.toFixed(2) || '0.00'}{' '}
                        {addon.perTicket
                          ? `per ticket (× ${ticketQuantity} tickets)`
                          : 'per order'}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <TextField
                        type="number"
                        size="small"
                        value={addon.quantity}
                        onChange={e =>
                          handleAddonQuantityChange(
                            addon.addonId,
                            addon.eventId,
                            parseInt(e.target.value) || 0
                          )
                        }
                        inputProps={{ min: 0 }}
                        sx={{ width: 80 }}
                      />
                      <Typography variant="body1" sx={{ minWidth: 80 }}>
                        ${totalPrice.toFixed(2)}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() =>
                          removeAddon(addon.addonId, addon.eventId)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          </Paper>
        )}

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">
                ${summary.subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body1">Tax (8%)</Typography>
              <Typography variant="body1">${summary.tax.toFixed(2)}</Typography>
            </Box>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${summary.total.toFixed(2)}</Typography>
            </Box>
          </Stack>
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={tickets.length === 0}
          >
            Proceed to Payment
          </Button>
        </Paper>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
