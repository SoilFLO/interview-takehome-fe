import type { Truck, Load } from '../types'

// ─── Seed Trucks ──────────────────────────────────────────────────────────────

export const seedTrucks: Truck[] = [
  {
    id: 'truck-1',
    name: 'Freightliner Alpha',
    licensePlate: 'ABC-1234',
    createdAt: '2024-03-01T07:00:00.000Z',
  },
  {
    id: 'truck-2',
    name: 'Kenworth Bravo',
    licensePlate: 'XYZ-5678',
    createdAt: '2024-03-01T07:15:00.000Z',
  },
  {
    id: 'truck-3',
    name: 'Mack Charlie',
    licensePlate: 'DEF-9012',
    createdAt: '2024-03-02T08:00:00.000Z',
  },
  {
    id: 'truck-4',
    name: 'Peterbilt Delta',
    licensePlate: 'GHI-3456',
    createdAt: '2024-03-03T06:30:00.000Z',
  },
]

// ─── Seed Loads ───────────────────────────────────────────────────────────────

export const seedLoads: Load[] = [
  // Freightliner Alpha — 4 loads over two days
  {
    id: 'load-1',
    truckId: 'truck-1',
    timestamp: '2024-03-05T08:15:00.000Z',
    direction: 'export',
    weight: 14.2,
    volume: 9.5,
  },
  {
    id: 'load-2',
    truckId: 'truck-1',
    timestamp: '2024-03-05T11:30:00.000Z',
    direction: 'export',
    weight: 13.8,
    volume: null,
  },
  {
    id: 'load-3',
    truckId: 'truck-1',
    timestamp: '2024-03-06T09:00:00.000Z',
    direction: 'import',
    weight: null,
    volume: 8.0,
  },
  {
    id: 'load-4',
    truckId: 'truck-1',
    timestamp: '2024-03-06T14:45:00.000Z',
    direction: 'import',
    weight: 12.5,
    volume: 8.3,
  },

  // Kenworth Bravo — 3 loads
  {
    id: 'load-5',
    truckId: 'truck-2',
    timestamp: '2024-03-05T07:45:00.000Z',
    direction: 'export',
    weight: 16.0,
    volume: 10.5,
  },
  {
    id: 'load-6',
    truckId: 'truck-2',
    timestamp: '2024-03-05T13:00:00.000Z',
    direction: 'export',
    weight: 15.5,
    volume: null,
  },
  {
    id: 'load-7',
    truckId: 'truck-2',
    timestamp: '2024-03-07T10:20:00.000Z',
    direction: 'import',
    weight: 11.0,
    volume: 7.4,
  },

  // Mack Charlie — 3 loads
  {
    id: 'load-8',
    truckId: 'truck-3',
    timestamp: '2024-03-06T08:30:00.000Z',
    direction: 'import',
    weight: 18.3,
    volume: 12.2,
  },
  {
    id: 'load-9',
    truckId: 'truck-3',
    timestamp: '2024-03-06T12:00:00.000Z',
    direction: 'export',
    weight: null,
    volume: 11.0,
  },
  {
    id: 'load-10',
    truckId: 'truck-3',
    timestamp: '2024-03-07T15:30:00.000Z',
    direction: 'import',
    weight: 17.0,
    volume: null,
  },

  // Peterbilt Delta — 2 loads
  {
    id: 'load-11',
    truckId: 'truck-4',
    timestamp: '2024-03-07T07:00:00.000Z',
    direction: 'export',
    weight: 20.0,
    volume: 13.3,
  },
  {
    id: 'load-12',
    truckId: 'truck-4',
    timestamp: '2024-03-07T11:15:00.000Z',
    direction: 'import',
    weight: 19.5,
    volume: 12.9,
  },
]
