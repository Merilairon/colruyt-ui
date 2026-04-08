
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [
    svelte({
      hot: !process.env.VITEST,
    }),
  ],
  resolve: {
    conditions: ['browser'],
    alias: {
      '$app/environment': path.resolve('./src/__mocks__/app-environment.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    setupFiles: './setupTests.ts',
  },
});
