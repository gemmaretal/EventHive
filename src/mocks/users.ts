export interface User {
  id: string
  name: string
  gender: 'male' | 'female' | 'other'
  birthYear: number
  latitude: number
  longitude: number
  interests: string[]
  lastActiveAt: string
}

export const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Alice Chen',
    gender: 'female',
    birthYear: 1995,
    latitude: 37.7749,
    longitude: -122.4194,
    interests: ['tech-conference', 'startup-meetup', 'ai-workshop'],
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'user-002',
    name: 'Bob Martinez',
    gender: 'male',
    birthYear: 1988,
    latitude: 37.8044,
    longitude: -122.2712,
    interests: ['music-festival', 'food-fair', 'art-exhibition'],
    lastActiveAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: 'user-003',
    name: 'Charlie Kim',
    gender: 'other',
    birthYear: 2001,
    latitude: 37.3382,
    longitude: -121.8863,
    interests: ['gaming-tournament', 'tech-conference', 'anime-convention'],
    lastActiveAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: 'user-004',
    name: 'Diana Patel',
    gender: 'female',
    birthYear: 1992,
    latitude: 37.5485,
    longitude: -121.9886,
    interests: ['yoga-retreat', 'wellness-expo', 'food-fair'],
    lastActiveAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
  },
  {
    id: 'user-005',
    name: 'Ethan Brown',
    gender: 'male',
    birthYear: 1985,
    latitude: 38.5816,
    longitude: -121.4944,
    interests: ['wine-tasting', 'food-fair', 'jazz-concert'],
    lastActiveAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'user-006',
    name: 'Fiona Lee',
    gender: 'female',
    birthYear: 1998,
    latitude: 37.6879,
    longitude: -122.4702,
    interests: ['startup-meetup', 'tech-conference', 'hackathon'],
    lastActiveAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
  },
  {
    id: 'user-007',
    name: 'George Wilson',
    gender: 'male',
    birthYear: 1979,
    latitude: 37.9577,
    longitude: -122.3477,
    interests: ['wine-tasting', 'art-exhibition', 'classical-concert'],
    lastActiveAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
  },
  {
    id: 'user-008',
    name: 'Hannah Rodriguez',
    gender: 'female',
    birthYear: 2003,
    latitude: 37.4419,
    longitude: -122.143,
    interests: ['music-festival', 'gaming-tournament', 'anime-convention'],
    lastActiveAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
]
