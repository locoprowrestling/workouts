import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/workouts/',
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
