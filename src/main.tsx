import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './AppRouter';
import { ConfigProvider } from 'antd';
import './app.css';

async function prepare() {
  // Start MSW in development mode only.
  // In production (or test), this is a no-op.
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      // Silently bypass requests to URLs that have no matching MSW handler
      // (e.g. Vite HMR websocket, browser extension requests).
      onUnhandledRequest: 'bypass',
    });
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't retry failed requests — makes debugging easier during development.
      retry: false,
      // Keep data fresh for 1 minute by default.
      staleTime: 1000 * 60,
    },
  },
});

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <AppRouter />
        </ConfigProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
});
