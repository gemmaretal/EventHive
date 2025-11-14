import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home Page', () => {
  it('renders the Event Group Buy heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { name: /event group buy/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders Browse Events button', () => {
    render(<Home />)
    const button = screen.getByRole('link', { name: /browse events/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href', '/events')
  })

  it('renders Login button', () => {
    render(<Home />)
    const button = screen.getByRole('link', { name: /login/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href', '/auth/login')
  })
})
