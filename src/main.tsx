import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'virtual:uno.css';
import './index.css';
import { RouterProvider, createRouter, Navigate } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';

const router = createRouter({ 
  routeTree,
  basepath: '/preheat/',
  defaultNotFoundComponent: () => <Navigate to="/" />
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
