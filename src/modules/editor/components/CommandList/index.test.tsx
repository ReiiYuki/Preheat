import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CommandList } from './index';

// Mock window.HTMLElement.prototype.scrollIntoView
const scrollIntoViewMock = vi.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

describe('CommandList', () => {
  it('useEffect calls scrollIntoView when selected index changes', () => {
    const items = [
      { title: 'Item 1', icon: '1', command: vi.fn() },
      { title: 'Item 2', icon: '2', command: vi.fn() }
    ];
    
    // By default it selects index 0 on mount
    render(<CommandList items={items} command={vi.fn()} />);
    
    // Check that it's called at least once
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: 'nearest' });
  });
});
