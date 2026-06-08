import { describe, it, expect } from 'vitest';
import { htmlToMarkdown } from './index';

describe('htmlToMarkdown', () => {
  it('converts basic HTML tags to Markdown', () => {
    const html = '<p>Hello <strong>world</strong></p>';
    const md = htmlToMarkdown(html);
    expect(md.trim()).toBe('Hello **world**');
  });

  it('handles empty strings', () => {
    expect(htmlToMarkdown('')).toBe('');
  });
});
