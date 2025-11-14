export interface Event {
  id: string
  slug: string
  title: string
  description: string
  date: string
  location: string
  capacity: number
  bannerUrl: string
  tags: string[]
}

export const mockEvents: Event[] = [
  {
    id: '1',
    slug: 'berdendang-bersama-haerin',
    title: 'Karoke Bareng Haerin',
    description:
      `Oh my, oh my God, I knew this would happen I was really hoping that he will come through Oh my, oh my God, it's only you Asking all the time about what I should do`,
    date: '2025-03-15T09:00:00Z',
    location: 'San Francisco Convention Center',
    capacity: 500,
    bannerUrl: '/Image/haerin.jpg',
    tags: ['Music', 'Festival', 'Noraebang'],
  },
  {
    id: '2',
    slug: 'liz-ive-fan-meet',
    title: 'Liz Ive Fan Meet',
    description:
      `Brighter, redder It's okay to rise up and burn Higher, up higher Even if you hide, you're still in the palm of my hand The deep darkness, the thick clouds will Hide you beneath a long night again Chew and swallow, get ready for it, baby Listen when I say-ay-ay-ay-ay-ay-ay-ay-ay-ay (Yeah) *Every time I see you, I can't resist*`,
    date: '2025-07-20T14:00:00Z',
    location: 'Golden Gate Park, San Francisco',
    capacity: 2000,
    bannerUrl: '/Image/liz.jpg',
    tags: ['Music', 'Festival', 'Outdoor'],
  },
  {
    id: '3',
    slug: 'startup-pitch-night',
    title: 'Startup Pitch Night',
    description:
      'Watch innovative startups pitch their ideas to a panel of experienced investors and entrepreneurs. Network with founders, investors, and industry professionals. Great opportunity for aspiring entrepreneurs to learn and connect.',
    date: '2025-04-10T18:00:00Z',
    location: 'Innovation Hub, Palo Alto',
    capacity: 150,
    bannerUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd',
    tags: ['Startup', 'Business', 'Networking'],
  },
]
