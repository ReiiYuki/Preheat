import { useState, useEffect } from 'react';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export function dispatchSyncStatus(status: SyncStatus) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('preheat-sync-status', { detail: status }));
  }
}

export function useSyncStatus() {
  const [status, setStatus] = useState<SyncStatus>('idle');

  useEffect(() => {
    const handler = (e: Event) => {
      setStatus((e as CustomEvent).detail);
      
      // Auto-reset from success back to idle after 3 seconds
      if ((e as CustomEvent).detail === 'success') {
        setTimeout(() => {
          setStatus((current) => current === 'success' ? 'idle' : current);
        }, 3000);
      }
    };
    
    window.addEventListener('preheat-sync-status', handler);
    return () => window.removeEventListener('preheat-sync-status', handler);
  }, []);

  return status;
}
