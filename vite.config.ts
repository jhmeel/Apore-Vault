import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import commonjs from "@rollup/plugin-commonjs";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    commonjs({
      requireReturnsDefault: 'auto',
      include: [
        /node_modules/,
        /\/node_modules\/@tbdex\/http-client/,
        /\/node_modules\/@web5\/dids/,
      ],
    }),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      util: "util",
      events: "events",
      stream: "stream-browserify",
      crypto: "crypto-browserify",
      http: "stream-http",
      https: "https-browserify",
      buffer: "buffer",
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'ethers', '@tbdex/http-client', '@web5/dids'],
        },
      },
    },
  },
  define: {
    "process.env": {},
    global: "globalThis",
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'ethers', '@tbdex/http-client', '@web5/dids'],
    esbuildOptions: {
      target: 'esnext',
      supported: { bigint: true },
    },
  },
});