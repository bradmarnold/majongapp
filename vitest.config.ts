import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        '**/*.test.{ts,tsx,js,jsx}',
        '**/*.config.{ts,js}',
        '**/index.{ts,tsx,js,jsx}',
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
        'packages/core/src/shanten.ts': {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95,
        },
        'packages/core/src/advisor.ts': {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@majongapp/core': '/packages/core/src',
      '@majongapp/ui': '/packages/ui/src',
    },
  },
});