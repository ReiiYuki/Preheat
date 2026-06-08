import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Route } from './index';

vi.mock('@/modules/onboarding/components/CreateProjectScreen', () => ({
  CreateProjectScreen: () => <div data-testid="create-project-screen">Mock</div>
}));

const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  createFileRoute: (_path: string) => (config: any) => config.component
}));

const mockUseApp = vi.fn();
vi.mock('@/modules/core/hooks/useAppState', () => ({
  useApp: () => mockUseApp()
}));

describe('CreateProjectPage (Route /create-project/)', () => {
  // @ts-ignore
  const CreateProjectPage = Route as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nested CreateProjectScreen if user exists but no projects', () => {
    mockUseApp.mockReturnValue({ state: { user: 'Test', projects: [] } });
    const { getByTestId } = render(<CreateProjectPage />);
    expect(getByTestId('create-project-screen')).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('useEffect navigates to / if no user', () => {
    mockUseApp.mockReturnValue({ state: { user: null, projects: [] } });
    render(<CreateProjectPage />);
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
  });

  it('useEffect navigates to /dashboard if user has projects', () => {
    mockUseApp.mockReturnValue({ state: { user: 'Test', projects: [{ id: '1' }] } });
    render(<CreateProjectPage />);
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard' });
  });
});
