import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
  ],
  preflights: [
    {
      getCSS: () => `
:root {
  --color-bg: #fafafa;
  --color-surface: #f5f5f4;
  --color-text: #1a1a1a;
  --color-text-secondary: #6b6b6b;
  --color-text-tertiary: #a3a3a3;
  --color-border: #e8e8e6;
  --color-hover: rgba(0, 0, 0, 0.03);
  --color-accent: #1a1a1a;
  --color-accent-soft: rgba(26, 26, 26, 0.08);

  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;

  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;

  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.08);

  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;

  --gradient-primary: linear-gradient(135deg, #8b5cf6, #ec4899);
  --gradient-hover: linear-gradient(135deg, #7c3aed, #db2777);
}

html[data-theme='dark'] {
  --color-bg: #111111;
  --color-surface: #1a1a1a;
  --color-text: #fafafa;
  --color-text-secondary: #a3a3a3;
  --color-text-tertiary: #6b6b6b;
  --color-border: #2a2a2a;
  --color-hover: rgba(255, 255, 255, 0.05);
  --color-accent: #fafafa;
  --color-accent-soft: rgba(250, 250, 250, 0.1);
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  overflow: hidden;
}

#root {
  width: 100vw;
  height: 100vh;
}

::selection {
  background: var(--color-accent-soft);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}

input,
button,
textarea {
  font-family: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}
.editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: var(--color-bg);
}

.editor-container {
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 24px;
}

.editor-title {
  width: 100%;
  border: none;
  outline: none;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  background: transparent;
  margin-bottom: 24px;
  font-family: inherit;
}

.editor-title::placeholder {
  color: var(--color-text-tertiary);
}

/* Tiptap ProseMirror styles */
.ProseMirror {
  outline: none;
  min-height: 60vh;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text);
}

.ProseMirror p {
  margin: 4px 0;
}

.ProseMirror h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 24px 0 8px;
}

.ProseMirror h2 {
  font-size: 1.375rem;
  font-weight: 600;
  margin: 20px 0 6px;
}

.ProseMirror h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 16px 0 4px;
}

.ProseMirror ul,
.ProseMirror ol {
  padding-left: 24px;
}

.ProseMirror li {
  margin: 2px 0;
}

.ProseMirror blockquote {
  border-left: 3px solid var(--color-border);
  padding-left: 16px;
  color: var(--color-text-secondary);
  margin: 8px 0;
}

.ProseMirror code {
  background: var(--color-hover);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.875em;
}

.ProseMirror pre {
  background: var(--color-surface);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.ProseMirror pre code {
  background: none;
  padding: 0;
}

.ProseMirror hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 16px 0;
}

.ProseMirror a {
  color: var(--color-accent);
  text-decoration: underline;
}

.ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 12px 0;
}

.ProseMirror img.ProseMirror-selectednode {
  outline: 2px solid var(--color-accent);
}

/* Placeholder */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: var(--color-text-tertiary);
  pointer-events: none;
  float: left;
  height: 0;
}

/* Task list */
.ProseMirror ul[data-type='taskList'] {
  list-style: none;
  padding-left: 0;
}

.ProseMirror ul[data-type='taskList'] li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.ProseMirror ul[data-type='taskList'] li label {
  margin-top: 4px;
}

.ProseMirror ul[data-type='taskList'] li[data-checked='true'] > div > p {
  text-decoration: line-through;
  color: var(--color-text-tertiary);
}

/* Empty state */
.editor-empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
}

/* Primary Button with Gradient */
.btn-primary {
  background: var(--gradient-primary) !important;
  color: white !important;
  border: none;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:active:not(:disabled) {
  transform: scale(0.98);
}
      `
    }
  ]
});
