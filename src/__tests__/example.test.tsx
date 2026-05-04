/**
 * Example test file — feel free to delete this and start fresh,
 * or use it as a reference for test structure and patterns.
 *
 * This file shows:
 *   - How to wrap components in the QueryClientProvider for tests
 *   - How MSW intercepts API calls automatically (configured in setupTests.ts)
 *   - How to use `waitFor` / `findBy` for async rendering
 */

import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'

// A helper that wraps any component with a fresh QueryClient.
// Copy this pattern into your own test files.
function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>,
  )
}

// ─── Example: MSW integration checks ─────────────────────────────────────────
// These tests verify that the MSW server is running and the API endpoints
// return the expected seed data. They're sanity checks - replace them with
// real component tests as you build out the UI.

describe('Trucks API (sanity check)', () => {
  it('returns seed trucks from GET /api/trucks', async () => {
    const response = await fetch('/api/trucks')
    const trucks = await response.json() as Array<{ id: string; name: string; licensePlate: string }>

    expect(response.ok).toBe(true)
    expect(trucks.length).toBeGreaterThan(0)
    expect(trucks[0]).toHaveProperty('id')
    expect(trucks[0]).toHaveProperty('name')
    expect(trucks[0]).toHaveProperty('licensePlate')
  })

  it('returns 404 for a non-existent truck', async () => {
    const response = await fetch('/api/trucks/does-not-exist')
    expect(response.status).toBe(404)
  })
})

describe('Loads API (sanity check)', () => {
  it('returns loads for a known truck', async () => {
    const response = await fetch('/api/trucks/truck-1/loads')
    const loads = await response.json() as Array<{ id: string; direction: string }>

    expect(response.ok).toBe(true)
    expect(loads.length).toBeGreaterThan(0)
    expect(loads[0]).toHaveProperty('id')
    expect(loads[0]).toHaveProperty('direction')
  })

  it('filters loads by direction', async () => {
    const response = await fetch('/api/trucks/truck-1/loads?direction=import')
    const loads = await response.json() as Array<{ direction: string }>

    expect(response.ok).toBe(true)
    expect(loads.every((l) => l.direction === 'import')).toBe(true)
  })
})

// Export the helper so you can reuse it across test files
export { renderWithQueryClient }
