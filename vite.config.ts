import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import {nodePolyfills} from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  define: {
    'process.env': {},
    global: 'globalThis',
  }, 
  optimizeDeps: {
    include: ['string.prototype.matchall']
  },
  build: {
    rollupOptions: {
      external: ['string.prototype.matchall']
    }
  },
  resolve: {
    alias: {
      util: 'util',
      events: 'events',
      stream: 'stream-browserify',
    },
  },
})