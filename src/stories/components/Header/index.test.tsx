import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Header } from './index';

describe('Header', () => {
  it('renders without crashing', () => {
    const { container } = render(<Header />);
    expect(container).not.toBeNull();
  });
});
