// ─── Truck Domain Types ───────────────────────────────────────────────────────

export interface Truck {
  id: string
  name: string
  licensePlate: string
  createdAt: string // ISO date string
}

export type CreateTruckPayload = Omit<Truck, 'id' | 'createdAt'>

export type UpdateTruckPayload = Partial<Omit<Truck, 'id' | 'createdAt'>>

// ─── Load Domain Types ────────────────────────────────────────────────────────

export type LoadDirection = 'import' | 'export'

export interface Load {
  id: string
  truckId: string
  timestamp: string     // ISO date string — when the load was recorded
  direction: LoadDirection
  /**
   * Weight in tonnes. At least one of `weight` or `volume` must be provided.
   */
  weight: number | null
  /**
   * Volume in cubic metres (m³). At least one of `weight` or `volume` must be provided.
   */
  volume: number | null
}

export type CreateLoadPayload = Omit<Load, 'id' | 'truckId'>

export type UpdateLoadPayload = Partial<Omit<Load, 'id' | 'truckId'>>

// ─── Filter / Query Types ─────────────────────────────────────────────────────

export interface LoadFilters {
  direction?: LoadDirection | 'all'
}

// ─── Summary Types (derived / computed) ──────────────────────────────────────

export interface TruckSummary extends Truck {
  loadCount: number
  totalWeight: number | null  // null if no loads have weight values
  totalVolume: number | null  // null if no loads have volume values
}
