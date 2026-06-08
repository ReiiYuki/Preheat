import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useApp } from '@/modules/core/hooks/useAppState';
import { Dashboard } from '@/modules/dashboard/components/Dashboard';

export const Route = createFileRoute('/dashboard/')({ component: DashboardPage });

function DashboardPage() {
  const { state } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.user) {
      navigate({ to: '/' });
    } else if (state.projects.length === 0) {
      navigate({ to: '/create-project' });
    }
  }, [state.user, state.projects.length, navigate]);

  return <Dashboard />;
}
