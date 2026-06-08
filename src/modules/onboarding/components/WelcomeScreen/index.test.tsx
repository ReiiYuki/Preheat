import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WelcomeScreen } from './index';

const mockSetUser = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@/modules/core/hooks/useAppState', () => ({
  useApp: () => ({ setUser: mockSetUser }),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

describe('WelcomeScreen', () => {
  it('renders text and handles form submission', () => {
    render(<WelcomeScreen />);
    
    expect(screen.getByText('Preheat')).toBeInTheDocument();
    expect(screen.getByText('What should we call you?')).toBeInTheDocument();
    
    const input = screen.getByPlaceholderText('e.g. John Doe');
    fireEvent.change(input, { target: { value: 'Test User' } });
    
    const button = screen.getByRole('button', { name: /continue/i });
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    
    expect(mockSetUser).toHaveBeenCalledWith('Test User');
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/create-project' });
  });
});