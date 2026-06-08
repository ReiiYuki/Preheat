import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from './index';

describe('Button', () => {
  it('renders without crashing', () => {
    const { container } = render(<Button label="test" />);
    expect(container).not.toBeNull();
  });
});
