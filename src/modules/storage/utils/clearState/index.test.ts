import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clearState } from './index';
import { STORAGE_KEY } from '../saveState';
import * as idb from 'idb-keyval';

vi.mock('idb-keyval', () => ({
  set: vi.fn(),
  get: vi.fn(),
  del: vi.fn(),
  clear: vi.fn(),
}));

describe('clearState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Storage.prototype.removeItem = vi.fn();
  });

  it('removes state from idb and localStorage', async () => {
    await clearState();
    expect(idb.del).toHaveBeenCalledWith(STORAGE_KEY);
    expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
  });
});
