import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from './index';

const mockAddProject = vi.fn();
const mockSetActiveProject = vi.fn();
const mockRenameProject = vi.fn();

vi.mock('@/modules/core/hooks/useAppState', () => ({
  useApp: () => ({
    state: {
      user: { name: 'Alice' },
      activeProjectId: 'proj-1',
      projects: [
        { id: 'proj-1', name: 'Proj 1', plans: [] },
      ],
    },
    addProject: mockAddProject,
    setActiveProject: mockSetActiveProject,
    renameProject: mockRenameProject,
    markTutorialSeen: vi.fn(),
  }),
}));

vi.mock('@base-ui/react/dialog', () => ({
  Dialog: {
    Root: ({ children }: any) => <div data-testid="dialog-root">{children}</div>,
    Portal: ({ children }: any) => <>{children}</>,
    Backdrop: () => <div data-testid="dialog-backdrop" />,
    Popup: ({ children }: any) => <div data-testid="dialog-popup">{children}</div>,
    Title: ({ children }: any) => <div>{children}</div>,
    Description: ({ children }: any) => <div>{children}</div>,
    Close: ({ children }: any) => <button>{children}</button>
  }
}));

// Base UI Dialog uses ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

describe('Sidebar', () => {
  it('useEffect focuses the input field when renaming a project', async () => {
    render(<Sidebar />);
    
    // Double click to trigger rename
    const projSpan = screen.getByText('Proj 1');
    fireEvent.doubleClick(projSpan);
    
    // The input should appear and be focused
    await waitFor(() => {
      const input = screen.getByDisplayValue('Proj 1');
      expect(input).toBeTruthy();
      expect(document.activeElement).toBe(input);
    });
  });
});