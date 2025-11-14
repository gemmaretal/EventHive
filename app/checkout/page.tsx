'use client'

import { useState, useEffect } from 'react'
import { processPayment } from '@/lib/paymentMock'

interface CartItem {
  eventId?: string
  addonId?: string
  quantity: number
  price: number
  perTicket?: boolean
  name?: string
}

interface Cart {
  tickets: CartItem[]
  addons: CartItem[]
  selectedGroupId?: string
}

interface Group {
  id: string
  title: string
  members: string[]
  maxMembers: number
}

interface Order {
  id: string
  createdAt: string
  items: Cart
  total: number
  groupId?: string
  members: string[]
  invited: string[]
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [group, setGroup] = useState<Group | null>(null)
  const [invited, setInvited] = useState<string[]>([])
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const cartData = localStorage.getItem('cart')
      const parsedCart: Cart = cartData
        ? JSON.parse(cartData)
        : { tickets: [], addons: [] }
      setCart(parsedCart)

      if (parsedCart.selectedGroupId) {
        const groupsData = localStorage.getItem('groupsState')
        if (groupsData) {
          const groupsState = JSON.parse(groupsData)
          const foundGroup = groupsState.groups?.find(
            (g: Group) => g.id === parsedCart.selectedGroupId
          )
          if (foundGroup) setGroup(foundGroup)
        }
      }

      const invitedData = localStorage.getItem('nearbyInvites')
      if (invitedData) {
        const invitedList = JSON.parse(invitedData)
        setInvited(Array.isArray(invitedList) ? invitedList : [])
      }
    } catch (err) {
      console.error('Error loading checkout data:', err)
      setError('Failed to load checkout data')
    }
  }, [])

  const calculateTotals = () => {
    if (!cart) return { subtotal: 0, tax: 0, total: 0 }

    let subtotal = 0

    cart.tickets.forEach(ticket => {
      subtotal += ticket.price * ticket.quantity
    })

    cart.addons.forEach(addon => {
      const addonTotal = addon.price * addon.quantity
      subtotal += addonTotal
    })

    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + tax

    return { subtotal, tax, total }
  }

  const { subtotal, tax, total } = calculateTotals()

  const handlePayment = async () => {
    if (!cart) return

    setError('')
    setLoading(true)

    try {
      for (const addon of cart.addons) {
        if (addon.quantity < 0) {
          setError('Invalid addon quantity')
          setLoading(false)
          return
        }
      }

      if (group) {
        const totalTickets = cart.tickets.reduce(
          (sum, t) => sum + t.quantity,
          0
        )
        if (group.members.length + totalTickets > group.maxMembers) {
          setError(`Group capacity exceeded (max ${group.maxMembers} members)`)
          setLoading(false)
          return
        }
      }

      const result = await processPayment({
        amount: total,
        deterministic: true,
      })

      if (!result.success) {
        setError(result.error || 'Payment failed')
        setLoading(false)
        return
      }

      const order: Order = {
        id: result.transactionId || 'unknown',
        createdAt: new Date().toISOString(),
        items: cart,
        total,
        groupId: cart.selectedGroupId,
        members: group?.members || [],
        invited,
      }

      const existingOrders = localStorage.getItem('mockOrders')
      const orders: Order[] = existingOrders ? JSON.parse(existingOrders) : []
      orders.push(order)
      localStorage.setItem('mockOrders', JSON.stringify(orders))

      localStorage.removeItem('cart')

      setSuccess(order)
      setLoading(false)
    } catch (err) {
      console.error('Payment error:', err)
      setError('Payment processing failed')
      setLoading(false)
    }
  }

  if (success) {
    const joinedCount = success.members.length + success.invited.length
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#4caf50' }}>Order Successful!</h1>
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        >
          <p>
            <strong>Order ID:</strong> {success.id}
          </p>
          <p>
            <strong>Total:</strong> ${success.total.toFixed(2)}
          </p>
          <p>
            <strong>Date:</strong>{' '}
            {new Date(success.createdAt).toLocaleString()}
          </p>
          {success.groupId && (
            <p>
              <strong>Joined Users:</strong> {joinedCount}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (!cart) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Checkout</h1>

      {/* Error message */}
      {error && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            marginBottom: '15px',
            borderRadius: '4px',
          }}
        >
          {error}
        </div>
      )}

      {/* Tickets */}
      {cart.tickets.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px' }}>Tickets</h2>
          {cart.tickets.map((ticket, idx) => (
            <div
              key={idx}
              style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
            >
              <span>{ticket.name || `Event ${ticket.eventId}`}</span>
              <span style={{ float: 'right' }}>
                {ticket.quantity} × ${ticket.price.toFixed(2)} = $
                {(ticket.quantity * ticket.price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add-ons */}
      {cart.addons.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px' }}>Add-ons</h2>
          {cart.addons.map((addon, idx) => (
            <div
              key={idx}
              style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
            >
              <span>{addon.name || `Addon ${addon.addonId}`}</span>
              <span style={{ float: 'right' }}>
                {addon.quantity} × ${addon.price.toFixed(2)} = $
                {(addon.quantity * addon.price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Group summary */}
      {group && (
        <div
          style={{
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <h2 style={{ fontSize: '18px' }}>Group</h2>
          <p>
            <strong>{group.title}</strong>
          </p>
          <p>Current members: {group.members.length}</p>
          <p>Invited: {invited.length}</p>
        </div>
      )}

      {/* Totals */}
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fafafa',
          borderRadius: '4px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <span>Tax (10%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            fontSize: '18px',
            paddingTop: '8px',
            borderTop: '2px solid #ddd',
          }}
        >
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment button */}
      <button
        onClick={handlePayment}
        disabled={loading || total <= 0}
        style={{
          marginTop: '20px',
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#ccc' : '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Processing...' : 'Mock Pay'}
      </button>
    </div>
  )
}
