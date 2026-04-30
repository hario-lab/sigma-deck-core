import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sigma-deck-core/',
  server: {
    proxy: {
      '/v2': { target: 'https://api.ransomware.live', changeOrigin: true }
    }
  }
})
