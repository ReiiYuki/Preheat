import { describe, it, expect } from 'vitest';
import { getSuggestionOptions } from './index';

describe('suggestion', () => {
  it('filters items correctly based on query', () => {
    const itemsFn = getSuggestionOptions().items as any;
    
    // Empty query returns all items
    const allItems = itemsFn({ query: '' });
    expect(allItems.length).toBeGreaterThan(0);
    
    // specific query
    const headingItems = itemsFn({ query: 'heading' });
    expect(headingItems.length).toBeGreaterThan(0);
    expect(headingItems.every((i: any) => i.title.toLowerCase().includes('heading'))).toBe(true);

    // non-matching query
    const noItems = itemsFn({ query: 'xyz123' });
    expect(noItems.length).toBe(0);
  });
});
