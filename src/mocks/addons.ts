export interface AddOn {
  id: string
  name: string
  price: number
  stock: number
  perTicket: boolean
}

export const mockAddOns: Record<string, AddOn[]> = {
  'tech-conference-2025': [
    {
      id: 'addon-1',
      name: 'Workshop Access',
      price: 50,
      stock: 100,
      perTicket: true,
    },
    {
      id: 'addon-2',
      name: 'VIP Networking Dinner',
      price: 75,
      stock: 50,
      perTicket: true,
    },
    {
      id: 'addon-3',
      name: 'Conference T-Shirt',
      price: 25,
      stock: 200,
      perTicket: false,
    },
    {
      id: 'addon-4',
      name: 'Premium Swag Bag',
      price: 40,
      stock: 150,
      perTicket: false,
    },
  ],
  'summer-music-festival': [
    {
      id: 'addon-5',
      name: 'VIP Pass Upgrade',
      price: 150,
      stock: 100,
      perTicket: true,
    },
    {
      id: 'addon-6',
      name: 'Camping Spot',
      price: 80,
      stock: 300,
      perTicket: false,
    },
    {
      id: 'addon-7',
      name: 'Festival Merchandise Bundle',
      price: 60,
      stock: 500,
      perTicket: false,
    },
    {
      id: 'addon-8',
      name: 'Backstage Tour',
      price: 200,
      stock: 30,
      perTicket: true,
    },
  ],
  'startup-pitch-night': [
    {
      id: 'addon-9',
      name: 'Investor Meetup Access',
      price: 100,
      stock: 50,
      perTicket: true,
    },
    {
      id: 'addon-10',
      name: 'Startup Toolkit',
      price: 35,
      stock: 100,
      perTicket: false,
    },
    {
      id: 'addon-11',
      name: 'One-on-One Mentoring Session',
      price: 250,
      stock: 20,
      perTicket: true,
    },
  ],
}
