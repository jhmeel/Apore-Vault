import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import {nodePolyfills} from 'vite-plugin-node-polyfills'
import commonjs from '@rollup/plugin-commonjs';
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
    commonjs()
  ],
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  
  resolve: {
    alias: {
      util: 'util',
      events: 'events',
      stream: 'stream-browserify',
    },
  },
})