import {
  defineConfig,
  minimal2023Preset as preset,
} from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: { preset: "2023" },
  // minimal2023Preset emits: pwa-64x64.png, pwa-192x192.png, pwa-512x512.png,
  // maskable-icon-512x512.png, apple-touch-icon-180x180.png, favicon.ico
  preset,
  images: ["public/logo.svg"],
});
