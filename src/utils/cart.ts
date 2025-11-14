import { AddOn, mockAddOns } from '@/mocks/addons'

export interface CartTicket {
  eventId: string
  quantity: number
  price: number
}

export interface CartAddon {
  addonId: string
  eventId: string
  quantity: number
  perTicket: boolean
}

export interface CartSummary {
  subtotal: number
  tax: number
  total: number
}

const TAX_RATE = 0.08

export function calculateTicketsSubtotal(tickets: CartTicket[]): number {
  return tickets.reduce((sum, ticket) => {
    return sum + ticket.price * ticket.quantity
  }, 0)
}

export function calculateAddonsSubtotal(
  addons: CartAddon[],
  tickets: CartTicket[]
): number {
  return addons.reduce((sum, addon) => {
    const eventAddons = mockAddOns[addon.eventId] || []
    const addonData = eventAddons.find(a => a.id === addon.addonId)

    if (!addonData) return sum

    if (addon.perTicket) {
      const eventTicket = tickets.find(t => t.eventId === addon.eventId)
      const ticketQuantity = eventTicket?.quantity || 0
      return sum + addonData.price * addon.quantity * ticketQuantity
    } else {
      return sum + addonData.price * addon.quantity
    }
  }, 0)
}

export function calculateCartSummary(
  tickets: CartTicket[],
  addons: CartAddon[]
): CartSummary {
  const ticketsSubtotal = calculateTicketsSubtotal(tickets)
  const addonsSubtotal = calculateAddonsSubtotal(addons, tickets)
  const subtotal = ticketsSubtotal + addonsSubtotal
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2)),
  }
}

export function validateAddonStock(
  addonId: string,
  eventId: string,
  requestedQuantity: number,
  currentCartAddons: CartAddon[],
  tickets: CartTicket[]
): { valid: boolean; message?: string; availableStock?: number } {
  const eventAddons = mockAddOns[eventId]
  if (!eventAddons) {
    return {
      valid: false,
      message: 'Event not found',
    }
  }

  const addonData = eventAddons.find(a => a.id === addonId)
  if (!addonData) {
    return {
      valid: false,
      message: 'Add-on not found',
    }
  }

  const existingAddon = currentCartAddons.find(
    a => a.addonId === addonId && a.eventId === eventId
  )
  const currentQuantity = existingAddon?.quantity || 0

  let totalRequiredStock = requestedQuantity
  if (addonData.perTicket) {
    const eventTicket = tickets.find(t => t.eventId === eventId)
    const ticketQuantity = eventTicket?.quantity || 0
    totalRequiredStock = requestedQuantity * ticketQuantity
  }

  const alreadyInCart = addonData.perTicket
    ? currentQuantity *
      (tickets.find(t => t.eventId === eventId)?.quantity || 0)
    : currentQuantity

  const availableStock = addonData.stock - alreadyInCart

  if (totalRequiredStock > availableStock) {
    return {
      valid: false,
      message: `Insufficient stock. Only ${availableStock} available.`,
      availableStock,
    }
  }

  return {
    valid: true,
    availableStock,
  }
}

export function getAddonById(
  addonId: string,
  eventId: string
): AddOn | undefined {
  const eventAddons = mockAddOns[eventId]
  if (!eventAddons) return undefined
  return eventAddons.find(a => a.id === addonId)
}
