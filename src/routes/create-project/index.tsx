import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useApp } from '@/modules/core/hooks/useAppState';
import { CreateProjectScreen } from '@/modules/onboarding/components/CreateProjectScreen';

export const Route = createFileRoute('/create-project/')({ component: CreateProjectPage });

function CreateProjectPage() {
  const { state } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.user) {
      navigate({ to: '/' });
    } else if (state.projects.length > 0) {
      navigate({ to: '/dashboard' });
    }
  }, [state.user, state.projects.length, navigate]);

  return <CreateProjectScreen />;
}
