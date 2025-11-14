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
    slug: 'tech-conference-2025',
    title: 'Tech Conference 2025',
    description:
      'Join us for the biggest tech conference of the year! Featuring keynote speakers from leading tech companies, hands-on workshops, and networking opportunities. Learn about the latest trends in AI, cloud computing, and software development.',
    date: '2025-03-15T09:00:00Z',
    location: 'San Francisco Convention Center',
    capacity: 500,
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    tags: ['Technology', 'Conference', 'Networking'],
  },
  {
    id: '2',
    slug: 'summer-music-festival',
    title: 'Summer Music Festival',
    description:
      'Experience an unforgettable weekend of live music featuring top artists from around the world. Multiple stages, food vendors, and camping options available. Bring your friends and enjoy the ultimate summer festival experience.',
    date: '2025-07-20T14:00:00Z',
    location: 'Golden Gate Park, San Francisco',
    capacity: 2000,
    bannerUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
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
