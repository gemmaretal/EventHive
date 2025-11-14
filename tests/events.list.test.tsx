import { render, screen } from '@testing-library/react'
import EventsPage from '../app/events/page'

describe('Events List Page', () => {
  it('renders the Browse Events heading', () => {
    render(<EventsPage />)
    const heading = screen.getByRole('heading', { name: /browse events/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders all mock events', () => {
    render(<EventsPage />)

    expect(screen.getByText('Karoke Bareng Haerin')).toBeInTheDocument()
    expect(screen.getByText('Liz Ive Fan Meet')).toBeInTheDocument()
    expect(screen.getByText('Startup Pitch Night')).toBeInTheDocument()
  })

  it('renders event cards with descriptions', () => {
    render(<EventsPage />)

    expect(
      screen.getByText(/biggest tech conference of the year/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/unforgettable weekend of live music/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/innovative startups pitch their ideas/i)
    ).toBeInTheDocument()
  })

  it('renders event tags', () => {
    render(<EventsPage />)

    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Conference')).toBeInTheDocument()
    expect(screen.getByText('Music')).toBeInTheDocument()
    expect(screen.getByText('Festival')).toBeInTheDocument()
    expect(screen.getByText('Startup')).toBeInTheDocument()
    expect(screen.getByText('Business')).toBeInTheDocument()
  })

  it('renders event cards as links', () => {
    render(<EventsPage />)

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(3)
  })
})
