import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadState } from './index';
import * as idb from 'idb-keyval';
import LZString from 'lz-string';

vi.mock('idb-keyval', () => ({
  set: vi.fn(),
  get: vi.fn(),
  del: vi.fn(),
  clear: vi.fn(),
}));

describe('loadState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Storage.prototype.getItem = vi.fn();
    // Supress warn log for fallback in tests
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('loads and decompresses state from idb successfully', async () => {
    const mockState = { user: { name: 'test' }, projects: [], activeProjectId: null, activePlanId: null };
    const compressed = LZString.compressToUTF16(JSON.stringify(mockState));
    vi.mocked(idb.get).mockResolvedValue(compressed);

    const result = await loadState();
    expect(result).toEqual(mockState);
  });

  it('loads and decompresses state from localStorage if idb throws', async () => {
    const mockState = { user: { name: 'fallback' }, projects: [], activeProjectId: null, activePlanId: null };
    const compressed = LZString.compressToUTF16(JSON.stringify(mockState));
    
    vi.mocked(idb.get).mockRejectedValue(new Error('IDB missing'));
    vi.mocked(Storage.prototype.getItem).mockReturnValue(compressed);

    const result = await loadState();
    expect(result).toEqual(mockState);
  });

  it('returns null if no state is found in either storage', async () => {
    vi.mocked(idb.get).mockResolvedValue(undefined);
    vi.mocked(Storage.prototype.getItem).mockReturnValue(null);

    const result = await loadState();
    expect(result).toBeNull();
  });
});
