import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from './index';

vi.mock('@/modules/dashboard/components/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar-mock">Sidebar Mock</div>
}));

vi.mock('@/modules/editor/components/Editor', () => ({
  Editor: () => <div data-testid="editor-mock">Editor Mock</div>
}));

vi.mock('@/modules/editor/components/ActionButtons', () => ({
  ActionButtons: () => <div data-testid="action-buttons-mock">ActionButtons Mock</div>
}));

describe('Dashboard', () => {
  it('renders successfully with nested mocked components', () => {
    const { getByTestId } = render(<Dashboard />);
    expect(getByTestId('sidebar-mock')).toBeTruthy();
    expect(getByTestId('editor-mock')).toBeTruthy();
    expect(getByTestId('action-buttons-mock')).toBeTruthy();
  });
});
