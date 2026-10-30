import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Configuration Vite + Vitest.
// - L'alias "@" évite les imports relatifs profonds (ex: ../../components).
// - Le bloc "test" configure Vitest (jsdom + Testing Library) pour la suite du projet.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: false,
  },
})
