import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { WelcomeScreen } from '@/modules/onboarding/components/WelcomeScreen';
import { useApp } from '@/modules/core/hooks/useAppState';
import { useEffect } from 'react';

export const Route = createFileRoute('/')({ component: WelcomePage });

function WelcomePage() {
  const { state } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.user && state.projects.length > 0) {
      navigate({ to: '/dashboard' });
    } else if (state.user) {
      navigate({ to: '/create-project' });
    }
  }, [state.user, state.projects.length, navigate]);

  return <WelcomeScreen />;
}
