import { render, screen } from '@testing-library/react'
import EventDetailPage from '../app/events/[slug]/page'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

describe('Event Detail Page', () => {
  it('renders event details by slug', () => {
    render(<EventDetailPage params={{ slug: 'berdendang-bersama-haerin' }} />)

    expect(screen.getByText('Karoke Bareng Haerin')).toBeInTheDocument()
    expect(
      screen.getByText(/biggest tech conference of the year/i)
    ).toBeInTheDocument()
  })

  it('renders event tags', () => {
    render(<EventDetailPage params={{ slug: 'berdendang-bersama-haerin' }} />)

    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Conference')).toBeInTheDocument()
    expect(screen.getByText('Networking')).toBeInTheDocument()
  })

  it('renders event location and capacity', () => {
    render(<EventDetailPage params={{ slug: 'berdendang-bersama-haerin' }} />)

    expect(
      screen.getByText(/San Francisco Convention Center/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/500 attendees/i)).toBeInTheDocument()
  })

  it('renders add-ons for the event', () => {
    render(<EventDetailPage params={{ slug: 'berdendang-bersama-haerin' }} />)

    expect(screen.getByText('Workshop Access')).toBeInTheDocument()
    expect(screen.getByText('VIP Networking Dinner')).toBeInTheDocument()
    expect(screen.getByText('Conference T-Shirt')).toBeInTheDocument()
    expect(screen.getByText('Premium Swag Bag')).toBeInTheDocument()
  })

  it('renders add-on prices', () => {
    render(<EventDetailPage params={{ slug: 'berdendang-bersama-haerin' }} />)

    expect(screen.getByText('$50.00 per ticket')).toBeInTheDocument()
    expect(screen.getByText('$75.00 per ticket')).toBeInTheDocument()
  })

  it('renders Add to Cart button', () => {
    render(<EventDetailPage params={{ slug: 'berdendang-bersama-haerin' }} />)

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    expect(addToCartButton).toBeInTheDocument()
  })

  it('renders Back to Events link', () => {
    render(<EventDetailPage params={{ slug: 'berdendang-bersama-haerin' }} />)

    const backLink = screen.getByRole('link', { name: /back to events/i })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/events')
  })

  it('renders different event by slug', () => {
    render(<EventDetailPage params={{ slug: 'liz-ive-fan-meet' }} />)

    expect(screen.getByText('Liz Ive Fan Meet')).toBeInTheDocument()
    expect(
      screen.getByText(/unforgettable weekend of live music/i)
    ).toBeInTheDocument()
  })

  it('renders add-ons specific to the event', () => {
    render(<EventDetailPage params={{ slug: 'liz-ive-fan-meet' }} />)

    expect(screen.getByText('VIP Pass Upgrade')).toBeInTheDocument()
    expect(screen.getByText('Camping Spot')).toBeInTheDocument()
    expect(screen.getByText('Festival Merchandise Bundle')).toBeInTheDocument()
    expect(screen.getByText('Backstage Tour')).toBeInTheDocument()
  })
})
