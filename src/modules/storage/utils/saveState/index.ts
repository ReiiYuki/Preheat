import LZString from 'lz-string';
import { set } from 'idb-keyval';
import type { AppState } from '@/modules/core/types';
import { writeTextFile, mkdir, exists } from '@tauri-apps/plugin-fs';
import { appDataDir } from '@tauri-apps/api/path';

declare global {
  interface Window {
    __TAURI__?: boolean;
  }
}

export const STORAGE_KEY = 'preheat-data';

export async function saveState(state: AppState): Promise<void> {
  try {
    const json = JSON.stringify(state);
    const compressed = LZString.compressToUTF16(json);
    
    try {
      await set(STORAGE_KEY, compressed);
    } catch {
      localStorage.setItem(STORAGE_KEY, compressed);
    }

    // Also sync to local filesystem if running in Tauri
    if (window.__TAURI__) {
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
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}
