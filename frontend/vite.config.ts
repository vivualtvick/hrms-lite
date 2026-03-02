import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8000', // The URL of your backend server
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // Set to true if the backend uses a valid HTTPS certificate
      },
    },
  },
})
