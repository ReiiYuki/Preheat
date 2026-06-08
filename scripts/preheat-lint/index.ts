import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve(process.cwd(), 'src');

function getFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function lintFile(filePath: string): string[] {
  const errors: string[] = [];
  const ext = path.extname(filePath);
  const relPath = path.relative(process.cwd(), filePath);
  
  if (!['.ts', '.tsx'].includes(ext)) return errors;

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check 1: Absolute Imports (Forbid `../`)
  if (!filePath.includes('.test.') && /from\s+['"]\.\.\//.test(content)) {
    errors.push('Relative parent imports (../) are forbidden in source code. Use absolute imports (@/...)');
  }

  // Check 2: No inline styles
  if (ext === '.tsx' && /style=\{/.test(content)) {
    errors.push('Inline styles (style={...}) are forbidden. Use UnoCSS classes.');
  }

  // Check 3: Anti-lazy tests
  if (filePath.includes('.test.')) {
    if (/\.toBeDefined\(\)/.test(content)) {
      errors.push('Lazy test assertions (toBeDefined) are forbidden. Assert strict logic and component/useEffect behaviors.');
    }
  }

  // Check 4: Sibling Test File
  if (!filePath.includes('.test.') && !filePath.includes('.stories.') && !filePath.includes('routeTree.gen') && !filePath.includes('main.tsx') && !filePath.includes('vite-env.d.ts') && !filePath.includes('.d.ts')) {
    const isIndex = path.basename(filePath).startsWith('index.');
    if (isIndex) {
      const dir = path.dirname(filePath);
      const hasTest = fs.existsSync(path.join(dir, 'index.test.ts')) || fs.existsSync(path.join(dir, 'index.test.tsx'));
      if (!hasTest) {
        errors.push(`Missing sibling unit test. Expected index.test.ts or index.test.tsx in ${path.relative(process.cwd(), dir)}`);
      }
    }
  }

  // Check 5: Module-based Architecture Structure
  if (relPath.startsWith('src/modules/')) {
    const parts = relPath.split(path.sep);
    // e.g. src/modules/editor/components/Editor/index.tsx (6 parts)
    if (parts.length >= 6) {
      const fileName = parts[parts.length - 1];
      if (!fileName.startsWith('index.')) {
         errors.push(`Invalid file structure. Files inside module categories (components, utils, etc.) must be named index.ts or index.tsx inside a named folder. Found: ${fileName}`);
      }
    }
  }

  return errors;
}

function runLint() {
  const args = process.argv.slice(2);
  const command = args[0];

  let filesToLint: string[] = [];
  if (command === 'audit-all') {
    filesToLint = getFiles(SRC_DIR);
  } else if (command === 'audit-file' && args[1]) {
    const target = path.resolve(process.cwd(), args[1]);
    if (fs.existsSync(target)) {
      filesToLint = [target];
    } else {
      console.error(`File not found: ${args[1]}`);
      process.exit(1);
    }
  } else {
    console.error('Usage: pnpm tsx scripts/preheat-lint/index.ts [audit-all | audit-file <path>]');
    process.exit(1);
  }

  let totalErrors = 0;
  for (const file of filesToLint) {
    const errors = lintFile(file);
    if (errors.length > 0) {
      const relPath = path.relative(process.cwd(), file);
      console.log(`\\n❌ ${relPath}`);
      for (const err of errors) {
        console.log(`   - ${err}`);
      }
      totalErrors += errors.length;
    }
  }

  if (totalErrors > 0) {
    console.log(`\\nFound ${totalErrors} convention violations.`);
    process.exit(1);
  } else {
    console.log('\\n✅ All convention checks passed!');
  }
}

export { lintFile, getFiles };

import { fileURLToPath } from 'node:url';

// Run only if executed directly
if (process.argv[1]) {
  const currentFilePath = fileURLToPath(import.meta.url);
  if (process.argv[1] === currentFilePath || process.argv[1].endsWith('scripts/preheat-lint/index.ts')) {
    runLint();
  }
}
