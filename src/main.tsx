import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'virtual:uno.css';
import { RouterProvider, createRouter, Navigate } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';

const router = createRouter({ 
  routeTree,
  basepath: import.meta.env.BASE_URL,
  defaultNotFoundComponent: () => <Navigate to="/" />
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
  document.addEventListener('contextmenu', e => e.preventDefault());
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
