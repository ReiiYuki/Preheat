import { useContext } from 'react';
import { AppStateContext, type AppStateContextValue } from '@/modules/core/contexts/AppStateContext';

export function useApp(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppStateProvider');
  }
  return ctx;
}
