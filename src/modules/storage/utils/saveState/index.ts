import LZString from 'lz-string';
import { set } from 'idb-keyval';
import type { AppState } from '@/modules/core/types';
import { writeTextFile, mkdir, exists } from '@tauri-apps/plugin-fs';
import { appDataDir } from '@tauri-apps/api/path';
import { dispatchSyncStatus } from '@/modules/core/hooks/useSyncStatus';

declare global {
  interface Window {
    __TAURI__?: boolean;
  }
}

export const STORAGE_KEY = 'preheat-data';
let webhookTimeoutId: any = null;

export async function saveState(state: AppState): Promise<void> {
  try {
    const json = JSON.stringify(state);
    const compressed = LZString.compressToUTF16(json);
    
    try {
      await set(STORAGE_KEY, compressed);
    } catch {
      localStorage.setItem(STORAGE_KEY, compressed);
    }

    // Also sync to local filesystem if running in Tauri and MCP is enabled
    if (window.__TAURI__ && state.mcpEnabled) {
      try {
        const appDataDirPath = await appDataDir();
        if (!(await exists(appDataDirPath))) {
          await mkdir(appDataDirPath, { recursive: true });
        }
        await writeTextFile(`${appDataDirPath}/state.json`, JSON.stringify(state, null, 2));
      } catch (err) {
        console.error('Failed to sync state to Tauri FS:', err);
      }
    }

    if (state.syncProvider && state.syncProvider !== 'none') {
      if (webhookTimeoutId) clearTimeout(webhookTimeoutId);
      webhookTimeoutId = setTimeout(async () => {
        try {
          dispatchSyncStatus('syncing');
          if (state.syncProvider === 'webhook' && state.webhookSyncUrl) {
            await fetch(state.webhookSyncUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(state)
            });
          } else if (state.syncProvider === 'firebase' && state.firebaseConfig) {
            const { initializeApp, getApps } = await import('firebase/app');
            const { getDatabase, ref, set } = await import('firebase/database');
            const config = JSON.parse(state.firebaseConfig);
            const apps = getApps();
            const app = apps.length === 0 ? initializeApp(config) : apps[0];
            const db = getDatabase(app);
            await set(ref(db, 'preheat_state'), state);
          } else if (state.syncProvider === 'supabase' && state.supabaseConfig?.url && state.supabaseConfig?.anonKey) {
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(state.supabaseConfig.url, state.supabaseConfig.anonKey);
            const { error } = await supabase
              .from('preheat_state')
              .upsert({ id: 'latest', state_data: state });
            if (error) throw error;
          }
          dispatchSyncStatus('success');
        } catch (err) {
          console.error('Failed to cloud sync:', err);
          dispatchSyncStatus('error');
        }
      }, 2000);
    }
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}
