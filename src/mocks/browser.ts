import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// This worker is used in the browser (development mode).
// It is started in main.tsx before the React app is mounted.
export const worker = setupWorker(...handlers)
