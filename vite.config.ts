import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import commonjs from "@rollup/plugin-commonjs";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    commonjs(),
    nodePolyfills({
      protocolImports: true,
    }),
  
  ],
  resolve: {
    alias: {
      util: "util",
      events: "events",
      stream: "stream-browserify",
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Prevent chunk splitting
        manualChunks: () => 'main',
      },
    }
  },
  define: {
    "process.env": {},
    global: "globalThis",
  },
});
