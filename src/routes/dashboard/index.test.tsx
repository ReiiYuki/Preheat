import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route } from './index';

vi.mock('@/modules/dashboard/components/Dashboard', () => ({
  Dashboard: () => <div data-testid="dashboard-mock">Mock</div>
}));

const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  createFileRoute: (path: string) => (config: any) => config.component
}));

const mockUseApp = vi.fn();
vi.mock('@/modules/core/hooks/useAppState', () => ({
  useApp: () => mockUseApp()
}));

describe('DashboardPage (Route /dashboard/)', () => {
  // @ts-ignore
  const DashboardPage = Route;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nested Dashboard if user exists with projects', () => {
    mockUseApp.mockReturnValue({ state: { user: 'Test', projects: [{ id: '1' }] } });
    const { getByTestId } = render(<DashboardPage />);
    expect(getByTestId('dashboard-mock')).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('useEffect navigates to / if no user', () => {
    mockUseApp.mockReturnValue({ state: { user: null, projects: [] } });
    render(<DashboardPage />);
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
  });

  it('useEffect navigates to /create-project if user has no projects', () => {
    mockUseApp.mockReturnValue({ state: { user: 'Test', projects: [] } });
    render(<DashboardPage />);
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/create-project' });
  });
});
