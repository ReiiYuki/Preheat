import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { lintFile } from './index';
import fs from 'node:fs';
import path from 'node:path';

describe('preheat-lint', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('lintFile', () => {
    it('returns empty array for non ts/tsx files', () => {
      const errors = lintFile(path.resolve(process.cwd(), 'src/index.css'));
      expect(errors).toHaveLength(0);
    });



    it('detects inline styles in .tsx files', () => {
      vi.spyOn(fs, 'readFileSync').mockReturnValue('<div style={{ color: "red" }}>Hello</div>');
      const errors = lintFile(path.resolve(process.cwd(), 'src/components/MyComp.tsx'));
      expect(errors).toContain('Inline styles (style={...}) are forbidden. Use UnoCSS classes.');
    });

    it('detects relative parent imports in source code', () => {
      vi.spyOn(fs, 'readFileSync').mockReturnValue('import { useApp } from "../hooks/useAppState";');
      const errors = lintFile(path.resolve(process.cwd(), 'src/components/MyComp.tsx'));
      expect(errors).toContain('Relative parent imports (../) are forbidden in source code. Use absolute imports (@/...)');
    });

    it('allows relative parent imports in test files', () => {
      vi.spyOn(fs, 'readFileSync').mockReturnValue('import { useApp } from "../hooks/useAppState";');
      const errors = lintFile(path.resolve(process.cwd(), 'src/components/MyComp.test.tsx'));
      // Should not contain the import error
      expect(errors.find(e => e.includes('Relative parent imports'))).toBeUndefined();
    });

    it('detects lazy tests (toBeDefined)', () => {
      vi.spyOn(fs, 'readFileSync').mockReturnValue('expect(x).toBeDefined();');
      const errors = lintFile(path.resolve(process.cwd(), 'src/components/MyComp.test.tsx'));
      expect(errors).toContain('Lazy test assertions (toBeDefined) are forbidden. Assert strict logic and component/useEffect behaviors.');
    });

    it('reports missing sibling tests for index files', () => {
      vi.spyOn(fs, 'readFileSync').mockReturnValue('const x = 1;');
      // pretend no sibling test exists
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const errors = lintFile(path.resolve(process.cwd(), 'src/modules/core/hooks/useApp/index.tsx'));
      expect(errors.find(e => e.includes('Missing sibling unit test'))).toBeDefined();
    });

    it('detects invalid module-based folder structure', () => {
      vi.spyOn(fs, 'readFileSync').mockReturnValue('const x = 1;');
      vi.spyOn(fs, 'existsSync').mockReturnValue(true); // pretend test exists so it doesn't fail on that
      
      const errors = lintFile(path.resolve(process.cwd(), 'src/modules/core/hooks/useApp/myHelper.ts'));
      expect(errors.find(e => e.includes('Invalid file structure'))).toBeDefined();
    });
  });
});
