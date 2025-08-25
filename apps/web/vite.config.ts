import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const isGh = process.env.GITHUB_REPOSITORY?.endsWith('/majongapp');
export default defineConfig({
  base: isGh ? '/majongapp/' : '/',
  plugins: [react()],
  build: { outDir: 'dist' }
});
