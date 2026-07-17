import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// Sub-path app on the apex (tools.opsette.io/digital-card/): the build base must
// be "/digital-card/" so assets resolve under the route, but DEV must serve at
// "/" so the tool loads at http://localhost:8104/ (and iframes cleanly as
// /?embed=1). Hardcoded per command — never process.env — matching the rest of
// the Opsette Tools family.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/digital-card/" : "/",
  server: {
    host: "::",
    port: 8104,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: false },
      manifest: false,
      workbox: {
        navigateFallback: "index.html",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
