import { del } from 'idb-keyval';
import { STORAGE_KEY } from '@/modules/storage/utils/saveState';

export async function clearState(): Promise<void> {
  try {
    await del(STORAGE_KEY);
  } catch {
    // ignore
  }
  localStorage.removeItem(STORAGE_KEY);
}
