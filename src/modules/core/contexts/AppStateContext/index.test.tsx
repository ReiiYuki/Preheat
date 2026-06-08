import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppStateProvider } from './index';
import { useApp } from '../../hooks/useAppState';

vi.mock('@/modules/storage/utils/loadState', () => ({
  loadState: vi.fn().mockResolvedValue(undefined)
}));
vi.mock('@/modules/storage/utils/saveState', () => ({
  saveState: vi.fn()
}));

describe('AppStateContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides state and actions to children', async () => {
    let resultRef: any;
    const TestComponent = () => {
      const app = useApp();
      resultRef = app;
      return null;
    };

    await act(async () => {
      render(
        <AppStateProvider>
          <TestComponent />
        </AppStateProvider>
      );
    });

    expect(resultRef.state).not.toBeNull();
    
    // Test setUser
    act(() => {
      resultRef.setUser('Alice');
    });
    expect(resultRef.state.user).toEqual({ name: 'Alice' });

    // Test addProject
    act(() => {
      resultRef.addProject('Test Project');
    });
    expect(resultRef.state.projects).toHaveLength(1);
    expect(resultRef.state.projects[0].name).toBe('Test Project');
  });
});
