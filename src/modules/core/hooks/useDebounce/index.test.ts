import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from './index';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debounces the function call', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    // Call it multiple times
    act(() => {
      result.current('test1');
      result.current('test2');
      result.current('test3');
    });

    // Should not be called yet
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward 499ms
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward 1ms
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Should be called once with the last argument
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test3');
  });
});
