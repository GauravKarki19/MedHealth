import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
  build: {
    outDir: 'build', 
  },
  plugins: [
    react(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  server: {
    port: 3000, // Optional; doesn't affect production
  },
  optimizeDeps: {
    include: ['framer-motion', '@popperjs/core'],
    exclude: [],
  },
  resolve: {
    alias: {},
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Suppress deprecation warnings
        silenceDeprecations: ['legacy-js-api', 'import'],
      },
    },
  },
});
