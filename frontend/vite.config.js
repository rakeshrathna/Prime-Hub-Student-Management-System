import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// NOTE: dev server is pinned to port 5173 because the Spring Boot backend's
// CorsConfigurationSource (SecurityConfig.java) explicitly whitelists
// http://localhost:5173 as an allowed origin. Changing this port will break
// API calls in local development unless the backend CORS config is updated too.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
})
