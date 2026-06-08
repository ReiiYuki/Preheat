import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTheme } from './index';

describe('useTheme', () => {
  let mockMatchMedia: any;
  let mockAddListener: any;
  let mockRemoveListener: any;

  beforeEach(() => {
    mockAddListener = vi.fn();
    mockRemoveListener = vi.fn();
    mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: mockAddListener,
      removeEventListener: mockRemoveListener,
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.clear();
  });

  it('initializes with system preference if no localStorage (defaults to light)', () => {
    mockMatchMedia.mockImplementation((query: string) => ({
      matches: query.includes('dark'),
      addEventListener: mockAddListener,
      removeEventListener: mockRemoveListener,
    }));

    const { result } = renderHook(() => useTheme());
    // Since useTheme defaults to light in Preheat
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('toggles theme correctly', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
