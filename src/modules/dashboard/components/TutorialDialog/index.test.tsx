import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TutorialDialog } from './index';
import * as useAppState from '@/modules/core/hooks/useAppState';

vi.mock('@/modules/core/hooks/useAppState');

describe('TutorialDialog', () => {
  it('renders correctly and paginates through steps', () => {
    const markTutorialSeenMock = vi.fn();
    vi.mocked(useAppState.useApp).mockReturnValue({
      markTutorialSeen: markTutorialSeenMock,
    } as any);

    const onOpenChangeMock = vi.fn();

    render(<TutorialDialog open={true} onOpenChange={onOpenChangeMock} />);

    // Step 1
    expect(screen.getByText('Welcome to Preheat')).toBeInTheDocument();
    
    const nextBtn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextBtn);

    // Step 2
    expect(screen.getByText('Slash Commands')).toBeInTheDocument();
    fireEvent.click(nextBtn);

    // Step 3
    expect(screen.getByText('Bi-directional Linking')).toBeInTheDocument();
    fireEvent.click(nextBtn);

    // Step 4
    expect(screen.getByText('Privacy First')).toBeInTheDocument();
    
    // Finish
    const getStartedBtn = screen.getByRole('button', { name: 'Get Started' });
    fireEvent.click(getStartedBtn);

    expect(markTutorialSeenMock).toHaveBeenCalled();
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });
});
