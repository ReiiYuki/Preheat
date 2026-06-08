import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useApp } from './index';
import React from 'react';
import { AppStateContext } from '../../contexts/AppStateContext';

describe('useApp', () => {
  it('throws an error if used outside of AppStateProvider', () => {
    // Suppress console.error for this expected throw
    const originalError = console.error;
    console.error = () => {};
    
    expect(() => renderHook(() => useApp())).toThrow('useApp must be used within an AppStateProvider');
    
    console.error = originalError;
  });

  it('returns context value if used within AppStateProvider', () => {
    const mockContextValue = { state: { user: { name: 'test' } } } as any;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppStateContext.Provider value={mockContextValue}>
        {children}
      </AppStateContext.Provider>
    );

    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current).toEqual(mockContextValue);
  });
});
