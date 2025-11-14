import {
  calculateTicketsSubtotal,
  calculateAddonsSubtotal,
  calculateCartSummary,
  validateAddonStock,
  getAddonById,
  CartTicket,
  CartAddon,
} from '@/utils/cart'

describe('Cart Calculation Utilities', () => {
  describe('calculateTicketsSubtotal', () => {
    it('should calculate subtotal for single ticket', () => {
      const tickets: CartTicket[] = [
        { eventId: 'event-1', quantity: 2, price: 50 },
      ]
      expect(calculateTicketsSubtotal(tickets)).toBe(100)
    })

    it('should calculate subtotal for multiple tickets', () => {
      const tickets: CartTicket[] = [
        { eventId: 'event-1', quantity: 2, price: 50 },
        { eventId: 'event-2', quantity: 3, price: 75 },
      ]
      expect(calculateTicketsSubtotal(tickets)).toBe(325)
    })

    it('should return 0 for empty tickets array', () => {
      expect(calculateTicketsSubtotal([])).toBe(0)
    })

    it('should handle zero quantity tickets', () => {
      const tickets: CartTicket[] = [
        { eventId: 'event-1', quantity: 0, price: 50 },
      ]
      expect(calculateTicketsSubtotal(tickets)).toBe(0)
    })
  })

  describe('calculateAddonsSubtotal', () => {
    it('should calculate subtotal for per-order addon', () => {
      const tickets: CartTicket[] = [
        { eventId: 'berdendang-bersama-haerin', quantity: 2, price: 100 },
      ]
      const addons: CartAddon[] = [
        {
          addonId: 'addon-3',
          eventId: 'berdendang-bersama-haerin',
          quantity: 1,
          perTicket: false,
        },
      ]
      expect(calculateAddonsSubtotal(addons, tickets)).toBe(25)
    })

    it('should calculate subtotal for per-ticket addon', () => {
      const tickets: CartTicket[] = [
        { eventId: 'berdendang-bersama-haerin', quantity: 3, price: 100 },
      ]
      const addons: CartAddon[] = [
        {
          addonId: 'addon-1',
          eventId: 'berdendang-bersama-haerin',
          quantity: 1,
          perTicket: true,
        },
      ]
      expect(calculateAddonsSubtotal(addons, tickets)).toBe(150)
    })

    it('should calculate subtotal for multiple per-ticket addons', () => {
      const tickets: CartTicket[] = [
        { eventId: 'berdendang-bersama-haerin', quantity: 2, price: 100 },
      ]
      const addons: CartAddon[] = [
        {
          addonId: 'addon-1',
          eventId: 'berdendang-bersama-haerin',
          quantity: 2,
          perTicket: true,
        },
      ]
      expect(calculateAddonsSubtotal(addons, tickets)).toBe(200)
    })

    it('should calculate subtotal for mixed per-ticket and per-order addons', () => {
      const tickets: CartTicket[] = [
        { eventId: 'berdendang-bersama-haerin', quantity: 2, price: 100 },
      ]
      const addons: CartAddon[] = [
        {
          addonId: 'addon-1',
          eventId: 'berdendang-bersama-haerin',
          quantity: 1,
          perTicket: true,
        },
        {
          addonId: 'addon-3',
          eventId: 'berdendang-bersama-haerin',
          quantity: 1,
          perTicket: false,
        },
      ]
      expect(calculateAddonsSubtotal(addons, tickets)).toBe(125)
    })

    it('should return 0 for empty addons array', () => {
      const tickets: CartTicket[] = [
        { eventId: 'berdendang-bersama-haerin', quantity: 2, price: 100 },
      ]
      expect(calculateAddonsSubtotal([], tickets)).toBe(0)
    })

    it('should return 0 for addon with non-existent event', () => {
      const tickets: CartTicket[] = [
        { eventId: 'non-existent-event', quantity: 2, price: 100 },
      ]
      const addons: CartAddon[] = [
        {
          addonId: 'addon-1',
          eventId: 'non-existent-event',
          quantity: 1,
          perTicket: true,
        },
      ]
      expect(calculateAddonsSubtotal(addons, tickets)).toBe(0)
    })

    it('should return 0 for per-ticket addon when no tickets exist', () => {
      const tickets: CartTicket[] = []
      const addons: CartAddon[] = [
        {
          addonId: 'addon-1',
          eventId: 'berdendang-bersama-haerin',
          quantity: 1,
          perTicket: true,
        },
      ]
      expect(calculateAddonsSubtotal(addons, tickets)).toBe(0)
    })
  })

  describe('calculateCartSummary', () => {
    it('should calculate complete cart summary with tickets only', () => {
      const tickets: CartTicket[] = [
        { eventId: 'event-1', quantity: 2, price: 50 },
      ]
      const addons: CartAddon[] = []
      const summary = calculateCartSummary(tickets, addons)

      expect(summary.subtotal).toBe(100)
      expect(summary.tax).toBe(8)
      expect(summary.total).toBe(108)
    })

    it('should calculate complete cart summary with tickets and addons', () => {
      const tickets: CartTicket[] = [
        { eventId: 'berdendang-bersama-haerin', quantity: 2, price: 100 },
      ]
      const addons: CartAddon[] = [
        {
          addonId: 'addon-1',
          eventId: 'berdendang-bersama-haerin',
          quantity: 1,
          perTicket: true,
        },
        {
          addonId: 'addon-3',
          eventId: 'berdendang-bersama-haerin',
          quantity: 1,
          perTicket: false,
        },
      ]
      const summary = calculateCartSummary(tickets, addons)

      expect(summary.subtotal).toBe(325)
      expect(summary.tax).toBe(26)
      expect(summary.total).toBe(351)
    })

    it('should return zero summary for empty cart', () => {
      const summary = calculateCartSummary([], [])

      expect(summary.subtotal).toBe(0)
      expect(summary.tax).toBe(0)
      expect(summary.total).toBe(0)
    })

    it('should round values to 2 decimal places', () => {
      const tickets: CartTicket[] = [
        { eventId: 'event-1', quantity: 3, price: 33.33 },
      ]
      const summary = calculateCartSummary(tickets, [])

      expect(summary.subtotal).toBe(99.99)
      expect(summary.tax).toBe(8)
      expect(summary.total).toBe(107.99)
    })
  })

  describe('validateAddonStock', () => {
    it('should validate sufficient stock for per-order addon', () => {
      const tickets: CartTicket[] = [
        { eventId: 'berdendang-bersama-haerin', quantity: 2, price: 100 },
      ]
      const currentCartAddons: CartAddon[] = []

      const result = validateAddonStock(
        'addon-3',
        'berdendang-bersama-haerin',
        1,
        currentCartAddons,
        tickets
      )

      expect(result.valid).toBe(true)
      expect(result.availableStock).toBe(200)
    })

    it('should validate sufficient stock for per-ticket addon', () => {
      const tickets: CartTicket[] = [
        { eventId: 'berdendang-bersama-haerin', quantity: 2, price: 100 },
      ]
      const currentCartAddons: CartAddon[] = []

      const result = validateAddonStock(
        'addon-1',
        'berdendang-bersama-haerin',
        1,
        currentCartAddons,
        tickets
      )

      expect(result.valid).toBe(true)
      expect(result.availableStock).toBe(100)
    })

    it('should reject insufficient stock for per-order addon', () => {
      const tickets: CartTicket[] = [
        { eventId: 'berdendang-bersama-haerin', quantity: 2, price: 100 },
      ]
      const currentCartAddons: CartAddon[] = []

      const result = validateAddonStock(
        'addon-3',
        'berdendang-bersama-haerin',
        201,
        currentCartAddons,
        tickets
      )

      expect(result.valid).toBe(false)
      expect(result.message).toContain('Insufficient stock')
      expect(result.availableStock).toBe(200)
    })

    it('should reject insufficient stock for per-ticket addon', () => {
      const tickets: CartTicket[] = [
        { eventId: 'berdendang-bersama-haerin', quantity: 10, price: 100 },
      ]
      const currentCartAddons: CartAddon[] = []

      const result = validateAddonStock(
        'addon-1',
        'berdendang-bersama-haerin',
        11,
        currentCartAddons,
        tickets
      )

      expect(result.valid).toBe(false)
      expect(result.message).toContain('Insufficient stock')
    })

    it('should account for existing cart items when validating stock', () => {
      const tickets: CartTicket[] = [
        { eventId: 'berdendang-bersama-haerin', quantity: 2, price: 100 },
      ]
      const currentCartAddons: CartAddon[] = [
        {
          addonId: 'addon-3',
          eventId: 'berdendang-bersama-haerin',
          quantity: 150,
          perTicket: false,
        },
      ]

      const result = validateAddonStock(
        'addon-3',
        'berdendang-bersama-haerin',
        51,
        currentCartAddons,
        tickets
      )

      expect(result.valid).toBe(false)
      expect(result.availableStock).toBe(50)
    })

    it('should reject non-existent event', () => {
      const tickets: CartTicket[] = []
      const currentCartAddons: CartAddon[] = []

      const result = validateAddonStock(
        'addon-1',
        'non-existent-event',
        1,
        currentCartAddons,
        tickets
      )

      expect(result.valid).toBe(false)
      expect(result.message).toBe('Event not found')
    })

    it('should reject non-existent addon', () => {
      const tickets: CartTicket[] = [
        { eventId: 'berdendang-bersama-haerin', quantity: 2, price: 100 },
      ]
      const currentCartAddons: CartAddon[] = []

      const result = validateAddonStock(
        'non-existent-addon',
        'berdendang-bersama-haerin',
        1,
        currentCartAddons,
        tickets
      )

      expect(result.valid).toBe(false)
      expect(result.message).toBe('Add-on not found')
    })
  })

  describe('getAddonById', () => {
    it('should return addon data for valid addon', () => {
      const addon = getAddonById('addon-1', 'berdendang-bersama-haerin')

      expect(addon).toBeDefined()
      expect(addon?.id).toBe('addon-1')
      expect(addon?.name).toBe('Workshop Access')
      expect(addon?.price).toBe(50)
    })

    it('should return undefined for non-existent addon', () => {
      const addon = getAddonById('non-existent', 'berdendang-bersama-haerin')

      expect(addon).toBeUndefined()
    })

    it('should return undefined for non-existent event', () => {
      const addon = getAddonById('addon-1', 'non-existent-event')

      expect(addon).toBeUndefined()
    })
  })
})
