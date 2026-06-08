/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import UnoCSS from 'unocss/vite';


// https://vite.dev/config/


// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  base: process.env.TAURI_ENV_PLATFORM ? '/' : '/preheat/',
  plugins: [
    UnoCSS(), 
    TanStackRouterVite({ routeFileIgnorePattern: '\\\\.test\\\\.(ts|tsx)$' }), 
    react(),
    tsconfigPaths({ projects: ['./tsconfig.app.json'] })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.tsx', 'src/**/*.test.ts', 'scripts/**/*.test.ts']
  }
});