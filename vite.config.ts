import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import {nodePolyfills} from 'vite-plugin-node-polyfills'
import vitePluginRequire from "vite-plugin-require";
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
    vitePluginRequire.default()
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