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
    render(<CreateProjectScreen />);
    
    expect(screen.getByText('Create New Project')).toBeInTheDocument();
    expect(screen.getByText('What are you working on next?')).toBeInTheDocument();
    
    const input = screen.getByPlaceholderText('Project Name');
    fireEvent.change(input, { target: { value: 'My New Project' } });
    
    const button = screen.getByRole('button', { name: /create project/i });
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    
    expect(mockAddProject).toHaveBeenCalledWith('My New Project');
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard' });
  });
});