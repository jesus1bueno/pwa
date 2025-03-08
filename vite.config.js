import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000, // Usa el puerto de Render, o 3000 si no está disponible
    host: '0.0.0.0', // Asegura que la aplicación escuche en todas las interfaces de red
  },
})
