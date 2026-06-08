import LZString from 'lz-string';
import { get } from 'idb-keyval';
import type { AppState } from '@/modules/core/types';
import { STORAGE_KEY } from '@/modules/storage/utils/saveState';

export async function loadState(): Promise<AppState | null> {
  try {
    let compressed: string | null | undefined = undefined;
    
    try {
      compressed = await get<string>(STORAGE_KEY);
    } catch (idbErr) {
      console.warn('IndexedDB get failed, falling back to localStorage', idbErr);
    }
    
    if (!compressed) {
      compressed = localStorage.getItem(STORAGE_KEY);
    }
    
    if (!compressed) return null;
    
    const json = LZString.decompressFromUTF16(compressed);
    if (!json) return null;
    
    return JSON.parse(json) as AppState;
  } catch (e) {
    console.error('Failed to load state:', e);
    return null;
  }
}
