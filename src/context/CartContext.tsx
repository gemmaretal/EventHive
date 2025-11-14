'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { CartTicket, CartAddon, validateAddonStock } from '@/utils/cart'

interface CartContextType {
  tickets: CartTicket[]
  addons: CartAddon[]
  selectedGroupId?: string
  addTicket: (ticket: CartTicket) => void
  removeTicket: (eventId: string) => void
  updateTicketQuantity: (eventId: string, quantity: number) => void
  addAddon: (addon: CartAddon) => { success: boolean; message?: string }
  removeAddon: (addonId: string, eventId: string) => void
  updateAddonQuantity: (
    addonId: string,
    eventId: string,
    quantity: number
  ) => { success: boolean; message?: string }
  setSelectedGroup: (groupId?: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'eventhive_cart'

interface CartState {
  tickets: CartTicket[]
  addons: CartAddon[]
  selectedGroupId?: string
}

function loadCartFromStorage(): CartState {
  if (typeof window === 'undefined') {
    return { tickets: [], addons: [] }
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
  }

  return { tickets: [], addons: [] }
}

function saveCartToStorage(state: CartState): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<CartTicket[]>([])
  const [addons, setAddons] = useState<CartAddon[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const loaded = loadCartFromStorage()
    setTickets(loaded.tickets)
    setAddons(loaded.addons)
    setSelectedGroupId(loaded.selectedGroupId)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage({ tickets, addons, selectedGroupId })
    }
  }, [tickets, addons, selectedGroupId, isInitialized])

  const addTicket = (ticket: CartTicket) => {
    setTickets(prev => {
      const existing = prev.find(t => t.eventId === ticket.eventId)
      if (existing) {
        return prev.map(t =>
          t.eventId === ticket.eventId
            ? { ...t, quantity: t.quantity + ticket.quantity }
            : t
        )
      }
      return [...prev, ticket]
    })
  }

  const removeTicket = (eventId: string) => {
    setTickets(prev => prev.filter(t => t.eventId !== eventId))
    setAddons(prev => prev.filter(a => a.eventId !== eventId))
  }

  const updateTicketQuantity = (eventId: string, quantity: number) => {
    if (quantity <= 0) {
      removeTicket(eventId)
      return
    }

    setTickets(prev =>
      prev.map(t => (t.eventId === eventId ? { ...t, quantity } : t))
    )
  }

  const addAddon = (
    addon: CartAddon
  ): { success: boolean; message?: string } => {
    const validation = validateAddonStock(
      addon.addonId,
      addon.eventId,
      addon.quantity,
      addons,
      tickets
    )

    if (!validation.valid) {
      return {
        success: false,
        message: validation.message,
      }
    }

    setAddons(prev => {
      const existing = prev.find(
        a => a.addonId === addon.addonId && a.eventId === addon.eventId
      )
      if (existing) {
        return prev.map(a =>
          a.addonId === addon.addonId && a.eventId === addon.eventId
            ? { ...a, quantity: a.quantity + addon.quantity }
            : a
        )
      }
      return [...prev, addon]
    })

    return { success: true }
  }

  const removeAddon = (addonId: string, eventId: string) => {
    setAddons(prev =>
      prev.filter(a => !(a.addonId === addonId && a.eventId === eventId))
    )
  }

  const updateAddonQuantity = (
    addonId: string,
    eventId: string,
    quantity: number
  ): { success: boolean; message?: string } => {
    if (quantity <= 0) {
      removeAddon(addonId, eventId)
      return { success: true }
    }

    const validation = validateAddonStock(
      addonId,
      eventId,
      quantity,
      addons.filter(a => !(a.addonId === addonId && a.eventId === eventId)),
      tickets
    )

    if (!validation.valid) {
      return {
        success: false,
        message: validation.message,
      }
    }

    setAddons(prev =>
      prev.map(a =>
        a.addonId === addonId && a.eventId === eventId ? { ...a, quantity } : a
      )
    )

    return { success: true }
  }

  const setSelectedGroup = (groupId?: string) => {
    setSelectedGroupId(groupId)
  }

  const clearCart = () => {
    setTickets([])
    setAddons([])
    setSelectedGroupId(undefined)
  }

  const value: CartContextType = {
    tickets,
    addons,
    selectedGroupId,
    addTicket,
    removeTicket,
    updateTicketQuantity,
    addAddon,
    removeAddon,
    updateAddonQuantity,
    setSelectedGroup,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
