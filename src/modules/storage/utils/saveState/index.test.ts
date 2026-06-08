import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveState, STORAGE_KEY } from './index';
import * as idb from 'idb-keyval';
import LZString from 'lz-string';

vi.mock('idb-keyval', () => ({
  set: vi.fn(),
  get: vi.fn(),
  del: vi.fn(),
  clear: vi.fn(),
}));

describe('saveState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Storage.prototype.setItem = vi.fn();
  });

  it('saves compressed state to idb successfully', async () => {
    const mockState = { user: { name: 'test' }, projects: [], activeProjectId: null, activePlanId: null };
    vi.mocked(idb.set).mockResolvedValue();
    
    await saveState(mockState as any);

    const expectedCompressed = LZString.compressToUTF16(JSON.stringify(mockState));
    
    expect(idb.set).toHaveBeenCalledWith(STORAGE_KEY, expectedCompressed);
    // localStorage should not be called if idb succeeds
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('falls back to localStorage if idb throws', async () => {
    const mockState = { user: { name: 'fallback' }, projects: [], activeProjectId: null, activePlanId: null };
    vi.mocked(idb.set).mockRejectedValue(new Error('IDB err'));

    await saveState(mockState as any);

    const expectedCompressed = LZString.compressToUTF16(JSON.stringify(mockState));
    
    expect(idb.set).toHaveBeenCalledWith(STORAGE_KEY, expectedCompressed);
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, expectedCompressed);
  });
});
