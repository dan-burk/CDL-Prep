import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site at /CDL-Prep/; dev stays at the root
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/CDL-Prep/' : '/',
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
}))
