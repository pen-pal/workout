import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Base path is host-dependent and chosen at build time so ONE config serves both targets:
//   - Vercel / custom domain  -> served at root        -> base "/"
//   - GitHub Pages project site -> https://<user>.github.io/workout/ -> base "/workout/"
// The GitHub Actions workflow sets GITHUB_PAGES=true; Vercel leaves it unset.
const base = process.env.GITHUB_PAGES === "true" ? "/workout/" : "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      // New service worker activates and reloads automatically — no update
      // prompt UI needed, which is ideal for a single-user app.
      registerType: "autoUpdate",
      injectRegister: "auto",

      // Generate icons + apple-touch-icon + favicon from one source image
      // (public/logo.svg via pwa-assets.config.js) and inject the matching
      // <link>/<meta> tags into index.html and icons[] into the manifest.
      pwaAssets: {
        disabled: false,
        config: true,
        htmlPreset: "2023",
        overrideManifestIcons: true,
        injectThemeColor: true,
      },

      manifest: {
        name: "4-Week Workout Plan",
        short_name: "Workout",
        description: "Progressive-overload 4-week workout plan",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "portrait",
        // scope / start_url / id track the base so install + SW scope are correct on both hosts.
        scope: base,
        start_url: base,
        id: base,
        // icons[] intentionally omitted: pwaAssets.overrideManifestIcons fills
        // them with RELATIVE srcs (pwa-192x192.png …) that resolve against the
        // manifest URL, so they work at both "/" and "/workout/".
      },

      workbox: {
        // Precache the whole built SPA shell so it loads fully offline.
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webp,woff2}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // Cold offline launch / deep links boot the cached shell (base-aware).
        navigateFallback: `${base}index.html`,
      },

      // SW only runs in the production build; test via `npm run build && npm run preview`.
      devOptions: { enabled: false, type: "module" },
    }),
  ],
});
