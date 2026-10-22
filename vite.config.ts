import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { target: 'es2022', cssCodeSplit: true, sourcemap: false },
  server: { host: '0.0.0.0', port: 4173 },
});
