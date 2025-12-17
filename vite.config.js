import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),   // @ = src 폴더
    },
  },
  server: {
    proxy: {
      "/api/user": { target: "http://localhost:8081", changeOrigin: true },
      "/api/catalog": { target: "http://localhost:8082", changeOrigin: true },
    },
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
  },
})