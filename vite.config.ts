import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import commonjs from "@rollup/plugin-commonjs";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { visualizer } from "rollup-plugin-visualizer";
import { babel } from "@rollup/plugin-babel";

export default defineConfig({
  plugins: [
    react(),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ["@babel/plugin-transform-runtime"],
      exclude: "node_modules/**",
    }),
    commonjs({
      requireReturnsDefault: "auto",
      transformMixedEsModules: true,
    }),
    nodePolyfills({
      protocolImports: true,
    }),
    visualizer(),
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
      process: "process/browser",
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },

    sourcemap: true,
  },
  define: {
    "process.env": {},
    global: "globalThis",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
      supported: { bigint: true },
    },
  },
});
