import LZString from 'lz-string';
import { set } from 'idb-keyval';
import type { AppState } from '@/modules/core/types';

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
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}
