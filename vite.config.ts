import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // `npm run dev` serves the SPA; API calls go to `wrangler dev` next door.
    // Without it running the site still works — the catalogue falls back to the
    // seed data in src/data/catalog.ts.
    proxy: {
      "/api": { target: "http://127.0.0.1:8787", changeOrigin: true },
      "/media": { target: "http://127.0.0.1:8787", changeOrigin: true },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // the dashboard is lazy-loaded; keep it out of the storefront chunk
        manualChunks: { react: ["react", "react-dom", "react-router-dom"] },
      },
    },
  },
});
