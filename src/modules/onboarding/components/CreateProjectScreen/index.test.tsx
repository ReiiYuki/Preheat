import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateProjectScreen } from './index';

const mockAddProject = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@/modules/core/hooks/useAppState', () => ({
  useApp: () => ({ addProject: mockAddProject }),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

describe('CreateProjectScreen', () => {
  it('renders text and handles project creation', () => {
    const { getByTestId, getByText } = render(<CreateProjectScreen />);
    
    expect(getByText('Create Project')).not.toBeNull();
    
    const input = screen.getByPlaceholderText('Project Name');
    fireEvent.change(input, { target: { value: 'My New Project' } });
    
    const button = screen.getByRole('button', { name: /create project/i });
    expect((button as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(button);
    
    expect(mockAddProject).toHaveBeenCalledWith('My New Project');
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard' });
  });
});