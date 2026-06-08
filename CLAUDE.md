# Preheat Agent Instructions & Repository Rules

Welcome, Claude! You are working on the **Preheat** codebase. Ensure extreme consistency by adhering to these guidelines.

## 🏗️ 1. Coding Conventions

1. **Module-Based Structure**: Code must be strictly nested inside `src/modules/<module_name>/<type>/<ItemName>/index.ts(x)`. 
   - **Rule**: 1 file = 1 function/component.
2. **Absolute Imports**: Always use `@/...` for cross-directory imports. Never use `../`.
3. **Styling**: Always use UnoCSS utility classes. Never use inline styles.
4. **Mandatory Tests**: Every `index.ts` or `index.tsx` file MUST have a sibling `index.test.ts(x)` file.
5. **Strict Logic Testing**: Tests must actively mock nested dependencies and assert on logical outcomes explicitly (no `.toBeDefined()`).

**⚠️ ENFORCEMENT**: After generating or modifying code, you MUST run:
`pnpm run lint:conventions`
If it fails, fix the errors before finishing.

## 💼 2. Business Logic Constitution

### A. State Management & Data Hierarchy
- **Hierarchy**: `User` → has many `Projects` → have many `Plans`.
- **Centralized State**: All global state must be manipulated via the `useApp()` hook. No direct mutations.

### B. Storage & Persistence
- **IndexedDB First**: You must rely on `idb-keyval` (IndexedDB) as the primary storage mechanism.
- **Compression Enforcement**: Before persisting data, you must compress it using `lz-string`. `localStorage` is maintained strictly as a secondary compressed fallback.

### C. Content & Markdown Export
- **Tiptap Natively**: Internal document content uses Tiptap's HTML/JSON format. Do not transform to Markdown during runtime.
- **Export Transforms**: HTML must be passed through `turndown` to convert to Markdown when downloading. 
- **Dynamic Titles**: When exporting a plan, inject the plan's `title` as an `<h1>` header.

### D. CI/CD & Deployments
- **Semantic Release**: Deployment scripts must respect `semantic-release` automation.
- **Workflow Dispatch**: Release jobs must be triggered manually via `workflow_dispatch`.
