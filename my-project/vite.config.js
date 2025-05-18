import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for deployment
  base: '/',
  build: {
    // Output directory that will be served
    outDir: 'dist',
    // Generate source maps for better debugging
    sourcemap: true,
  },
})
