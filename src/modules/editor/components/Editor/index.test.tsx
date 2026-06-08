import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Editor } from './index';

// Mock child component
vi.mock('@/modules/editor/components/EditorToolbar', () => ({
  EditorToolbar: () => <div data-testid="editor-toolbar-mock">Toolbar</div>
}));

// Mock hooks and EditorContent
const mockSetContent = vi.fn();
const mockGetHTML = vi.fn();
const mockEditor = {
  commands: { setContent: mockSetContent },
  getHTML: mockGetHTML
};

vi.mock('@tiptap/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tiptap/react')>();
  return {
    ...actual,
    useEditor: () => mockEditor,
    EditorContent: () => <div data-testid="editor-content-mock">EditorContent</div>
  };
});

const mockUseApp = vi.fn();
vi.mock('@/modules/core/hooks/useAppState', () => ({
  useApp: () => mockUseApp()
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

describe('Editor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders placeholder if no active plan', () => {
    mockUseApp.mockReturnValue({
      state: { projects: [], activePlanId: null },
      updatePlanTitle: vi.fn(),
      updatePlanContent: vi.fn()
    });

    const { getByText } = render(<Editor />);
    expect(getByText(/Select a plan/i)).toBeTruthy();
  });

  it('useEffect calls setContent if plan content differs from editor content', () => {
    const plan = { id: 'p1', title: 'Test', content: '<p>New Content</p>' };
    mockUseApp.mockReturnValue({
      state: { 
        projects: [{ id: 'proj1', plans: [plan], name: 'Proj' }], 
        activePlanId: 'p1' 
      },
      updatePlanTitle: vi.fn(),
      updatePlanContent: vi.fn()
    });

    mockGetHTML.mockReturnValue('<p>Old Content</p>');

    render(<Editor />);
    
    // useEffect should have called setContent
    expect(mockSetContent).toHaveBeenCalledWith('<p>New Content</p>');
  });
});
