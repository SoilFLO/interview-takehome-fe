import { delay, http, HttpResponse  } from 'msw'
import { seedTrucks, seedLoads } from './data'
import type {
  Truck,
  Load,
  TruckSummary,
  CreateTruckPayload,
  UpdateTruckPayload,
  CreateLoadPayload,
  UpdateLoadPayload,
} from '../types'

// ─── In-Memory Store ──────────────────────────────────────────────────────────
// Mutable copies of the seed data. All mutations are reflected immediately
// within the same session. DO NOT MODIFY THIS FILE.

let trucks: Truck[] = [...seedTrucks]
let loads: Load[] = [...seedLoads]

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

// ─── Truck Handlers ───────────────────────────────────────────────────────────

export const handlers = [
  // This matches all requests and applies a random delay before continuing
  http.all('*', async () => {
    await delay();
  }),
  /**
   * GET /api/trucks
   * Returns all trucks with computed summary fields (loadCount, totalWeight, totalVolume).
   */
  http.get('/api/trucks', () => {
    const summaries: TruckSummary[] = trucks.map((truck) => {
      const truckLoads = loads.filter((l) => l.truckId === truck.id)
      const weights = truckLoads.map((l) => l.weight).filter((w): w is number => w !== null)
      const volumes = truckLoads.map((l) => l.volume).filter((v): v is number => v !== null)

      return {
        ...truck,
        loadCount: truckLoads.length,
        totalWeight: weights.length > 0 ? parseFloat(weights.reduce((a, b) => a + b, 0).toFixed(2)) : null,
        totalVolume: volumes.length > 0 ? parseFloat(volumes.reduce((a, b) => a + b, 0).toFixed(2)) : null,
      }
    })

    return HttpResponse.json(summaries)
  }),

  /**
   * GET /api/trucks/:id
   * Returns a single truck with summary fields, or 404 if not found.
   */
  http.get('/api/trucks/:id', ({ params }) => {
    const truck = trucks.find((t) => t.id === params.id)

    if (!truck) {
      return HttpResponse.json({ message: 'Truck not found' }, { status: 404 })
    }

    const truckLoads = loads.filter((l) => l.truckId === truck.id)
    const weights = truckLoads.map((l) => l.weight).filter((w): w is number => w !== null)
    const volumes = truckLoads.map((l) => l.volume).filter((v): v is number => v !== null)

    const summary: TruckSummary = {
      ...truck,
      loadCount: truckLoads.length,
      totalWeight: weights.length > 0 ? parseFloat(weights.reduce((a, b) => a + b, 0).toFixed(2)) : null,
      totalVolume: volumes.length > 0 ? parseFloat(volumes.reduce((a, b) => a + b, 0).toFixed(2)) : null,
    }

    return HttpResponse.json(summary)
  }),

  /**
   * POST /api/trucks
   * Creates a new truck. Body: { name, licensePlate }
   */
  http.post('/api/trucks', async ({ request }) => {
    const body = await request.json() as CreateTruckPayload

    if (!body.name || !body.licensePlate) {
      return HttpResponse.json(
        { message: 'name and licensePlate are required' },
        { status: 400 },
      )
    }

    const newTruck: Truck = {
      id: generateId(),
      name: body.name,
      licensePlate: body.licensePlate,
      createdAt: new Date().toISOString(),
    }

    trucks = [...trucks, newTruck]

    return HttpResponse.json(newTruck, { status: 201 })
  }),

  /**
   * PATCH /api/trucks/:id
   * Partially updates a truck. Returns the updated truck, or 404 if not found.
   */
  http.patch('/api/trucks/:id', async ({ params, request }) => {
    const index = trucks.findIndex((t) => t.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Truck not found' }, { status: 404 })
    }

    const body = await request.json() as UpdateTruckPayload
    const updated: Truck = { ...trucks[index], ...body }
    trucks = trucks.map((t) => (t.id === params.id ? updated : t))

    return HttpResponse.json(updated)
  }),

  /**
   * DELETE /api/trucks/:id
   * Deletes a truck and all of its associated loads. Returns 204 on success.
   */
  http.delete('/api/trucks/:id', ({ params }) => {
    const exists = trucks.some((t) => t.id === params.id)

    if (!exists) {
      return HttpResponse.json({ message: 'Truck not found' }, { status: 404 })
    }

    trucks = trucks.filter((t) => t.id !== params.id)
    // Cascade: remove all loads belonging to this truck
    loads = loads.filter((l) => l.truckId !== params.id)

    return new HttpResponse(null, { status: 204 })
  }),

  // ─── Load Handlers ──────────────────────────────────────────────────────────

  /**
   * GET /api/trucks/:truckId/loads
   * Returns all loads for a truck, sorted by timestamp (newest first).
   * Supports optional ?direction=import|export query param.
   */
  http.get('/api/trucks/:truckId/loads', ({ params, request }) => {
    const truckExists = trucks.some((t) => t.id === params.truckId)

    if (!truckExists) {
      return HttpResponse.json({ message: 'Truck not found' }, { status: 404 })
    }

    const url = new URL(request.url)
    const direction = url.searchParams.get('direction')

    let result = loads.filter((l) => l.truckId === params.truckId)

    if (direction && direction !== 'all') {
      result = result.filter((l) => l.direction === direction)
    }

    // Sort by timestamp, newest first
    result = [...result].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    return HttpResponse.json(result)
  }),

  /**
   * GET /api/loads/:id
   * Returns a single load by ID, or 404 if not found.
   */
  http.get('/api/loads/:id', ({ params }) => {
    const load = loads.find((l) => l.id === params.id)

    if (!load) {
      return HttpResponse.json({ message: 'Load not found' }, { status: 404 })
    }

    return HttpResponse.json(load)
  }),

  /**
   * POST /api/trucks/:truckId/loads
   * Creates a new load for a truck.
   * Body: { timestamp, direction, weight?, volume? }
   * At least one of weight or volume must be provided.
   */
  http.post('/api/trucks/:truckId/loads', async ({ params, request }) => {
    const truckExists = trucks.some((t) => t.id === params.truckId)

    if (!truckExists) {
      return HttpResponse.json({ message: 'Truck not found' }, { status: 404 })
    }

    const body = await request.json() as CreateLoadPayload

    if (!body.timestamp || !body.direction) {
      return HttpResponse.json(
        { message: 'timestamp and direction are required' },
        { status: 400 },
      )
    }

    if (body.weight == null && body.volume == null) {
      return HttpResponse.json(
        { message: 'At least one of weight or volume must be provided' },
        { status: 400 },
      )
    }

    const newLoad: Load = {
      id: generateId(),
      truckId: params.truckId as string,
      timestamp: body.timestamp,
      direction: body.direction,
      weight: body.weight ?? null,
      volume: body.volume ?? null,
    }

    loads = [...loads, newLoad]

    return HttpResponse.json(newLoad, { status: 201 })
  }),

  /**
   * PATCH /api/loads/:id
   * Partially updates a load. Returns the updated load, or 404 if not found.
   */
  http.patch('/api/loads/:id', async ({ params, request }) => {
    const index = loads.findIndex((l) => l.id === params.id)

    if (index === -1) {
      return HttpResponse.json({ message: 'Load not found' }, { status: 404 })
    }

    const body = await request.json() as UpdateLoadPayload
    const updated: Load = { ...loads[index], ...body }

    // Re-validate that at least one of weight or volume is set after the update
    if (updated.weight == null && updated.volume == null) {
      return HttpResponse.json(
        { message: 'At least one of weight or volume must be provided' },
        { status: 400 },
      )
    }

    loads = loads.map((l) => (l.id === params.id ? updated : l))

    return HttpResponse.json(updated)
  }),

  /**
   * DELETE /api/loads/:id
   * Deletes a load by ID. Returns 204 on success, 404 if not found.
   */
  http.delete('/api/loads/:id', ({ params }) => {
    const exists = loads.some((l) => l.id === params.id)

    if (!exists) {
      return HttpResponse.json({ message: 'Load not found' }, { status: 404 })
    }

    loads = loads.filter((l) => l.id !== params.id)

    return new HttpResponse(null, { status: 204 })
  }),
]
