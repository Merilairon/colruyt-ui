
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      hot: !process.env.VITEST,
    }),
  ],
  resolve: {
    conditions: ['browser'],
    alias: {
      '$app/environment': '/home/runner/work/colruyt-ui/colruyt-ui/src/__mocks__/app-environment.ts',
      '$app/stores': '/home/runner/work/colruyt-ui/colruyt-ui/src/__mocks__/app-stores.ts',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    setupFiles: './setupTests.ts',
  },
});
