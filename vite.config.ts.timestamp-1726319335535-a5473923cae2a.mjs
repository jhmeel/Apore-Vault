// vite.config.ts
import { defineConfig } from "file:///C:/Users/Jhmeel/Desktop/Apore-Vault/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Jhmeel/Desktop/Apore-Vault/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { nodePolyfills } from "file:///C:/Users/Jhmeel/Desktop/Apore-Vault/node_modules/vite-plugin-node-polyfills/dist/index.js";
import commonjs from "file:///C:/Users/Jhmeel/Desktop/Apore-Vault/node_modules/@rollup/plugin-commonjs/dist/es/index.js";
import babel from "file:///C:/Users/Jhmeel/Desktop/Apore-Vault/node_modules/vite-plugin-babel/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true
    }),
    commonjs(),
    babel()
  ],
  define: {
    "process.env": {},
    global: "globalThis"
  },
  resolve: {
    alias: {
      util: "util",
      events: "events",
      stream: "stream-browserify"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxKaG1lZWxcXFxcRGVza3RvcFxcXFxBcG9yZS1WYXVsdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSmhtZWVsXFxcXERlc2t0b3BcXFxcQXBvcmUtVmF1bHRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0pobWVlbC9EZXNrdG9wL0Fwb3JlLVZhdWx0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcclxuaW1wb3J0IHtub2RlUG9seWZpbGxzfSBmcm9tICd2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxscydcclxuaW1wb3J0IGNvbW1vbmpzIGZyb20gJ0Byb2xsdXAvcGx1Z2luLWNvbW1vbmpzJztcclxuaW1wb3J0IGJhYmVsIGZyb20gJ3ZpdGUtcGx1Z2luLWJhYmVsJztcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgbm9kZVBvbHlmaWxscyh7XHJcbiAgICAgIC8vIFdoZXRoZXIgdG8gcG9seWZpbGwgYG5vZGU6YCBwcm90b2NvbCBpbXBvcnRzLlxyXG4gICAgICBwcm90b2NvbEltcG9ydHM6IHRydWUsXHJcbiAgICB9KSxcclxuICAgIGNvbW1vbmpzKCksXHJcbiAgICBiYWJlbCgpXHJcbiAgXSxcclxuICBkZWZpbmU6IHtcclxuICAgICdwcm9jZXNzLmVudic6IHt9LFxyXG4gICAgZ2xvYmFsOiAnZ2xvYmFsVGhpcycsXHJcbiAgfSxcclxuICBcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICB1dGlsOiAndXRpbCcsXHJcbiAgICAgIGV2ZW50czogJ2V2ZW50cycsXHJcbiAgICAgIHN0cmVhbTogJ3N0cmVhbS1icm93c2VyaWZ5JyxcclxuICAgIH0sXHJcbiAgfSxcclxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQXFTLFNBQVMsb0JBQW9CO0FBQ2xVLE9BQU8sV0FBVztBQUNsQixTQUFRLHFCQUFvQjtBQUM1QixPQUFPLGNBQWM7QUFDckIsT0FBTyxXQUFXO0FBQ2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGNBQWM7QUFBQTtBQUFBLE1BRVosaUJBQWlCO0FBQUEsSUFDbkIsQ0FBQztBQUFBLElBQ0QsU0FBUztBQUFBLElBQ1QsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGVBQWUsQ0FBQztBQUFBLElBQ2hCLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
