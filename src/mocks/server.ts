import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// This server is used in tests (Node environment via Vitest).
// It is started/stopped in src/setupTests.ts.
export const server = setupServer(...handlers)
