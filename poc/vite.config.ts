import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Correct import for v4
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(), // Tailwind v4 engine
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api-proxy': {
        target: 'https://preprodapisix.omnenest.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, ''),
        secure: false,
      },
    },
  },
});