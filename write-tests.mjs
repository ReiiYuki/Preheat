import fs from 'fs';
import path from 'path';

const tests = {
  'src/modules/onboarding/components/WelcomeScreen/index.test.tsx': `
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
  `.trim(),

  'src/modules/onboarding/components/CreateProjectScreen/index.test.tsx': `
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
  `.trim(),

  'src/modules/editor/components/ActionButtons/index.test.tsx': `
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
  value: vi.fn().mockImplementation(query => ({ matches: false })),
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
    expect(downloadModule.downloadMarkdown).toHaveBeenCalledWith('Plan 1', 'test');
  });
});
  `.trim(),

  'src/modules/dashboard/components/Sidebar/index.test.tsx': `
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from './index';

const mockAddProject = vi.fn();
const mockSetActiveProject = vi.fn();

vi.mock('@/modules/core/hooks/useAppState', () => ({
  useApp: () => ({
    state: {
      user: { name: 'Alice' },
      activeProjectId: 'proj-1',
      projects: [
        { id: 'proj-1', name: 'Proj 1', plans: [] },
        { id: 'proj-2', name: 'Proj 2', plans: [] }
      ],
    },
    addProject: mockAddProject,
    setActiveProject: mockSetActiveProject,
  }),
}));

// Base UI Dialog uses ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Sidebar', () => {
  it('renders correctly and handles project clicks', () => {
    render(<Sidebar />);
    
    expect(screen.getByText('Hi, Alice')).toBeInTheDocument();
    expect(screen.getByText('Proj 1')).toBeInTheDocument();
    expect(screen.getByText('Proj 2')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Proj 2'));
    expect(mockSetActiveProject).toHaveBeenCalledWith('proj-2');
    
    fireEvent.click(screen.getByText('+ New Project'));
    expect(mockAddProject).toHaveBeenCalledWith('New Project');
  });
});
  `.trim()
};

for (const [file, content] of Object.entries(tests)) {
  fs.writeFileSync(file, content, 'utf-8');
  console.log('Updated ' + file);
}
