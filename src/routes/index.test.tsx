import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route } from './index';

// Mock child component
vi.mock('@/modules/onboarding/components/WelcomeScreen', () => ({
  WelcomeScreen: () => <div data-testid="welcome-screen">Welcome Screen Mock</div>
}));

// Mock hooks
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  createFileRoute: (path: string) => (config: any) => config.component
}));

const mockUseApp = vi.fn();
vi.mock('@/modules/core/hooks/useAppState', () => ({
  useApp: () => mockUseApp()
}));

describe('WelcomePage (Route /)', () => {
  // @ts-ignore
  const WelcomePage = Route;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nested WelcomeScreen by default if no user', () => {
    mockUseApp.mockReturnValue({ state: { user: null, projects: [] } });
    const { getByTestId } = render(<WelcomePage />);
    expect(getByTestId('welcome-screen')).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('useEffect navigates to /dashboard if user exists with projects', () => {
    mockUseApp.mockReturnValue({ state: { user: 'Test', projects: [{ id: '1', name: 'Test' }] } });
    render(<WelcomePage />);
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard' });
  });

  it('useEffect navigates to /create-project if user exists without projects', () => {
    mockUseApp.mockReturnValue({ state: { user: 'Test', projects: [] } });
    render(<WelcomePage />);
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/create-project' });
  });
});
