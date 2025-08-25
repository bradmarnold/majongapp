import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@majongapp/core': path.resolve(__dirname, '../../packages/core/src'),
      '@majongapp/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  base: '/majongapp/',
});