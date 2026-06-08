import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadMarkdown } from './index';

describe('downloadMarkdown', () => {
  let appendChildMock: any;
  let removeChildMock: any;
  let clickMock: any;
  let createObjectURLMock: any;
  let revokeObjectURLMock: any;
  let mockAnchor: any;

  beforeEach(() => {
    appendChildMock = vi.fn();
    removeChildMock = vi.fn();
    clickMock = vi.fn();
    createObjectURLMock = vi.fn().mockReturnValue('blob:test');
    revokeObjectURLMock = vi.fn();

    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;
    document.body.appendChild = appendChildMock;
    document.body.removeChild = removeChildMock;

    mockAnchor = {
      click: clickMock,
      href: '',
      download: ''
    };

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return mockAnchor as any;
      }
      return document.createElement(tagName);
    });
  });

  it('creates an anchor element and clicks it to download', () => {
    downloadMarkdown('test-title', '# Content');

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(appendChildMock).toHaveBeenCalledWith(mockAnchor);
    expect(clickMock).toHaveBeenCalled();
    expect(mockAnchor.download).toBe('test-title.md');
    expect(mockAnchor.href).toBe('blob:test');
    expect(removeChildMock).toHaveBeenCalledWith(mockAnchor);
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:test');
  });
});
