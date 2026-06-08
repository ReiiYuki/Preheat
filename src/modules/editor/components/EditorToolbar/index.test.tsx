import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EditorToolbar } from './index';

vi.mock('@tiptap/react/menus', () => ({
  BubbleMenu: ({ children }: any) => <div data-testid="bubble-menu">{children}</div>
}));

describe('EditorToolbar', () => {
  it('calls editor commands on button clicks', () => {
    const mockToggleBold = vi.fn().mockReturnThis();
    const mockToggleItalic = vi.fn().mockReturnThis();
    const mockRun = vi.fn();
    
    const mockEditor = {
      isActive: vi.fn().mockReturnValue(false),
      chain: vi.fn().mockReturnValue({
        focus: vi.fn().mockReturnValue({
          toggleBold: mockToggleBold,
          toggleItalic: mockToggleItalic,
          run: mockRun
        })
      })
    } as any;

    const { getAllByRole } = render(<EditorToolbar editor={mockEditor} />);
    const buttons = getAllByRole('button');
    
    // Click bold
    fireEvent.click(buttons[0]);
    expect(mockToggleBold).toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalled();
  });
});
