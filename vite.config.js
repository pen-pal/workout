import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// `base`: '/' is correct for a root deploy (https://example.com/).
// If you ever host under a subpath (e.g. https://user.github.io/workout/),
// set base to '/workout/' AND mirror it in manifest scope/start_url below,
// or the service-worker scope and install will break on iOS.
export default defineConfig({
  base: "/",
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
        scope: "/",
        start_url: "/",
        id: "/",
        // icons[] intentionally omitted: pwaAssets.overrideManifestIcons fills
        // them from the generated pwa-192x192 / pwa-512x512 / maskable assets.
      },

      workbox: {
        // Precache the whole built SPA shell so it loads fully offline.
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webp,woff2}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // Cold offline launch / deep links boot the cached shell.
        navigateFallback: "/index.html",
      },

      // SW only runs in the production build; test via `npm run build && npm run preview`.
      devOptions: { enabled: false, type: "module" },
    }),
  ],
});
