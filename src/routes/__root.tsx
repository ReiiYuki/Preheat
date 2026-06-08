import { createRootRoute, Outlet } from '@tanstack/react-router';

import { AppStateProvider } from '@/modules/core/contexts/AppStateContext';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <AppStateProvider>
      <Outlet />
    </AppStateProvider>
  );
}
