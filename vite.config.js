import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Forward all /api/* requests to the FastAPI backend in dev.
      // In production, serve the FastAPI app on the same host or configure
      // your reverse proxy (nginx/caddy) to do this.
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
