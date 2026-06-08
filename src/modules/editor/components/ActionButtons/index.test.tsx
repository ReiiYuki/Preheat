import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ActionButtons } from './index';
import * as downloadModule from '@/modules/markdown/utils/downloadMarkdown';

const mockToggleTheme = vi.fn();
const mockWriteText = vi.fn();

Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
});

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(_query => ({ matches: false })),
});

vi.mock('@/modules/core/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: mockToggleTheme }),
}));

vi.mock('@/modules/core/hooks/useAppState', () => ({
  useApp: () => ({
    state: {
      activePlanId: 'plan-1',
      projects: [{ plans: [{ id: 'plan-1', title: 'Plan 1', content: '<p>test</p>' }] }],
    },
  }),
}));

vi.mock('@/modules/markdown/utils/downloadMarkdown', () => ({
  downloadMarkdown: vi.fn(),
}));

describe('ActionButtons', () => {
  it('calls correct functions on button clicks', () => {
    render(<ActionButtons />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    // Toggle Theme
    fireEvent.click(buttons[0]);
    expect(mockToggleTheme).toHaveBeenCalled();
    
    // Copy
    fireEvent.click(buttons[1]);
    expect(mockWriteText).toHaveBeenCalled();
    
    // Download
    fireEvent.click(buttons[2]);
    expect(downloadModule.downloadMarkdown).toHaveBeenCalledWith('Plan 1', '# Plan 1\n\ntest');
  });
});