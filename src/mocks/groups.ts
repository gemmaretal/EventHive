export interface Group {
  id: string
  eventSlug: string
  title: string
  organizerName: string
  maxMembers: number
  members: string[] // userIds
  pendingRequests: string[] // userIds
}

export const mockGroups: Group[] = [
  {
    id: 'group-001',
    eventSlug: 'tech-conference-2025',
    title: 'AI Enthusiasts Group',
    organizerName: 'Alice Chen',
    maxMembers: 10,
    members: ['user-001', 'user-003', 'user-006'],
    pendingRequests: ['user-002'],
  },
  {
    id: 'group-002',
    eventSlug: 'tech-conference-2025',
    title: 'Startup Founders Meetup',
    organizerName: 'Fiona Lee',
    maxMembers: 8,
    members: ['user-006', 'user-001'],
    pendingRequests: [],
  },
  {
    id: 'group-003',
    eventSlug: 'summer-music-festival',
    title: 'Festival Camping Crew',
    organizerName: 'Bob Martinez',
    maxMembers: 15,
    members: ['user-002', 'user-005', 'user-008'],
    pendingRequests: ['user-004'],
  },
  {
    id: 'group-004',
    eventSlug: 'startup-pitch-night',
    title: 'Investor Network',
    organizerName: 'George Wilson',
    maxMembers: 12,
    members: ['user-007', 'user-001', 'user-006'],
    pendingRequests: ['user-003', 'user-005'],
  },
]
