import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/context/CartContext'
import { CartTicket, CartAddon } from '@/utils/cart'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should initialize with empty cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      expect(result.current.tickets).toEqual([])
      expect(result.current.addons).toEqual([])
      expect(result.current.selectedGroupId).toBeUndefined()
    })

    it('should throw error when used outside provider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useCart())
      }).toThrow('useCart must be used within a CartProvider')

      consoleError.mockRestore()
    })
  })

  describe('Ticket Management', () => {
    it('should add a ticket', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'event-1',
        quantity: 2,
        price: 50,
      }

      act(() => {
        result.current.addTicket(ticket)
      })

      expect(result.current.tickets).toHaveLength(1)
      expect(result.current.tickets[0]).toEqual(ticket)
    })

    it('should add quantity to existing ticket', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'event-1',
        quantity: 2,
        price: 50,
      }

      act(() => {
        result.current.addTicket(ticket)
        result.current.addTicket({ ...ticket, quantity: 3 })
      })

      expect(result.current.tickets).toHaveLength(1)
      expect(result.current.tickets[0].quantity).toBe(5)
    })

    it('should remove a ticket', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'event-1',
        quantity: 2,
        price: 50,
      }

      act(() => {
        result.current.addTicket(ticket)
        result.current.removeTicket('event-1')
      })

      expect(result.current.tickets).toHaveLength(0)
    })

    it('should update ticket quantity', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'event-1',
        quantity: 2,
        price: 50,
      }

      act(() => {
        result.current.addTicket(ticket)
        result.current.updateTicketQuantity('event-1', 5)
      })

      expect(result.current.tickets[0].quantity).toBe(5)
    })

    it('should remove ticket when quantity updated to 0', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'event-1',
        quantity: 2,
        price: 50,
      }

      act(() => {
        result.current.addTicket(ticket)
        result.current.updateTicketQuantity('event-1', 0)
      })

      expect(result.current.tickets).toHaveLength(0)
    })

    it('should remove associated addons when ticket is removed', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'tech-conference-2025',
        quantity: 2,
        price: 100,
      }

      const addon: CartAddon = {
        addonId: 'addon-1',
        eventId: 'tech-conference-2025',
        quantity: 1,
        perTicket: true,
      }

      act(() => {
        result.current.addTicket(ticket)
        result.current.addAddon(addon)
        result.current.removeTicket('tech-conference-2025')
      })

      expect(result.current.tickets).toHaveLength(0)
      expect(result.current.addons).toHaveLength(0)
    })
  })

  describe('Addon Management', () => {
    it('should add an addon with valid stock', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'tech-conference-2025',
        quantity: 2,
        price: 100,
      }

      const addon: CartAddon = {
        addonId: 'addon-1',
        eventId: 'tech-conference-2025',
        quantity: 1,
        perTicket: true,
      }

      act(() => {
        result.current.addTicket(ticket)
      })

      let addResult: { success: boolean; message?: string } = {
        success: false,
      }

      act(() => {
        addResult = result.current.addAddon(addon)
      })

      expect(addResult.success).toBe(true)
      expect(result.current.addons).toHaveLength(1)
      expect(result.current.addons[0]).toEqual(addon)
    })

    it('should reject addon with insufficient stock', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'tech-conference-2025',
        quantity: 2,
        price: 100,
      }

      const addon: CartAddon = {
        addonId: 'addon-1',
        eventId: 'tech-conference-2025',
        quantity: 101,
        perTicket: true,
      }

      act(() => {
        result.current.addTicket(ticket)
      })

      let addResult: { success: boolean; message?: string } = {
        success: false,
      }

      act(() => {
        addResult = result.current.addAddon(addon)
      })

      expect(addResult.success).toBe(false)
      expect(addResult.message).toContain('Insufficient stock')
      expect(result.current.addons).toHaveLength(0)
    })

    it('should add quantity to existing addon', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'tech-conference-2025',
        quantity: 2,
        price: 100,
      }

      const addon: CartAddon = {
        addonId: 'addon-3',
        eventId: 'tech-conference-2025',
        quantity: 1,
        perTicket: false,
      }

      act(() => {
        result.current.addTicket(ticket)
        result.current.addAddon(addon)
        result.current.addAddon({ ...addon, quantity: 2 })
      })

      expect(result.current.addons).toHaveLength(1)
      expect(result.current.addons[0].quantity).toBe(3)
    })

    it('should remove an addon', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'tech-conference-2025',
        quantity: 2,
        price: 100,
      }

      const addon: CartAddon = {
        addonId: 'addon-1',
        eventId: 'tech-conference-2025',
        quantity: 1,
        perTicket: true,
      }

      act(() => {
        result.current.addTicket(ticket)
        result.current.addAddon(addon)
        result.current.removeAddon('addon-1', 'tech-conference-2025')
      })

      expect(result.current.addons).toHaveLength(0)
    })

    it('should update addon quantity', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'tech-conference-2025',
        quantity: 2,
        price: 100,
      }

      const addon: CartAddon = {
        addonId: 'addon-3',
        eventId: 'tech-conference-2025',
        quantity: 1,
        perTicket: false,
      }

      act(() => {
        result.current.addTicket(ticket)
        result.current.addAddon(addon)
      })

      let updateResult: { success: boolean; message?: string } = {
        success: false,
      }

      act(() => {
        updateResult = result.current.updateAddonQuantity(
          'addon-3',
          'tech-conference-2025',
          5
        )
      })

      expect(updateResult.success).toBe(true)
      expect(result.current.addons[0].quantity).toBe(5)
    })

    it('should reject addon quantity update with insufficient stock', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'tech-conference-2025',
        quantity: 2,
        price: 100,
      }

      const addon: CartAddon = {
        addonId: 'addon-3',
        eventId: 'tech-conference-2025',
        quantity: 1,
        perTicket: false,
      }

      act(() => {
        result.current.addTicket(ticket)
        result.current.addAddon(addon)
      })

      let updateResult: { success: boolean; message?: string } = {
        success: false,
      }

      act(() => {
        updateResult = result.current.updateAddonQuantity(
          'addon-3',
          'tech-conference-2025',
          201
        )
      })

      expect(updateResult.success).toBe(false)
      expect(updateResult.message).toContain('Insufficient stock')
      expect(result.current.addons[0].quantity).toBe(1)
    })

    it('should remove addon when quantity updated to 0', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'tech-conference-2025',
        quantity: 2,
        price: 100,
      }

      const addon: CartAddon = {
        addonId: 'addon-1',
        eventId: 'tech-conference-2025',
        quantity: 1,
        perTicket: true,
      }

      act(() => {
        result.current.addTicket(ticket)
        result.current.addAddon(addon)
        result.current.updateAddonQuantity('addon-1', 'tech-conference-2025', 0)
      })

      expect(result.current.addons).toHaveLength(0)
    })
  })

  describe('Group Selection', () => {
    it('should set selected group', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      act(() => {
        result.current.setSelectedGroup('group-123')
      })

      expect(result.current.selectedGroupId).toBe('group-123')
    })

    it('should clear selected group', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      act(() => {
        result.current.setSelectedGroup('group-123')
        result.current.setSelectedGroup(undefined)
      })

      expect(result.current.selectedGroupId).toBeUndefined()
    })
  })

  describe('Clear Cart', () => {
    it('should clear all cart data', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'tech-conference-2025',
        quantity: 2,
        price: 100,
      }

      const addon: CartAddon = {
        addonId: 'addon-1',
        eventId: 'tech-conference-2025',
        quantity: 1,
        perTicket: true,
      }

      act(() => {
        result.current.addTicket(ticket)
        result.current.addAddon(addon)
        result.current.setSelectedGroup('group-123')
        result.current.clearCart()
      })

      expect(result.current.tickets).toHaveLength(0)
      expect(result.current.addons).toHaveLength(0)
      expect(result.current.selectedGroupId).toBeUndefined()
    })
  })

  describe('LocalStorage Persistence', () => {
    it('should save cart to localStorage', () => {
      const { result } = renderHook(() => useCart(), { wrapper })

      const ticket: CartTicket = {
        eventId: 'event-1',
        quantity: 2,
        price: 50,
      }

      act(() => {
        result.current.addTicket(ticket)
      })

      const stored = localStorage.getItem('eventhive_cart')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.tickets).toHaveLength(1)
      expect(parsed.tickets[0]).toEqual(ticket)
    })

    it('should load cart from localStorage on mount', () => {
      const initialData = {
        tickets: [{ eventId: 'event-1', quantity: 2, price: 50 }],
        addons: [],
        selectedGroupId: 'group-123',
      }

      localStorage.setItem('eventhive_cart', JSON.stringify(initialData))

      const { result } = renderHook(() => useCart(), { wrapper })

      expect(result.current.tickets).toHaveLength(1)
      expect(result.current.tickets[0]).toEqual(initialData.tickets[0])
      expect(result.current.selectedGroupId).toBe('group-123')
    })

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('eventhive_cart', 'invalid json')

      const consoleError = jest.spyOn(console, 'error').mockImplementation()

      const { result } = renderHook(() => useCart(), { wrapper })

      expect(result.current.tickets).toEqual([])
      expect(result.current.addons).toEqual([])

      consoleError.mockRestore()
    })
  })
})
