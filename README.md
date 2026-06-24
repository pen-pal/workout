# 4-Week Workout Plan — iPhone PWA

Your `workout_plan.jsx` is now an installable, **fully offline** iPhone app
(Progressive Web App). No App Store, no Xcode, no weekly re-signing — install
once via Safari and it lives on your home screen and works in airplane mode.

## Project layout

```
index.html              # PWA entry: iOS meta tags + safe-area CSS
vite.config.js          # vite-plugin-pwa (auto-update SW, offline precache)
pwa-assets.config.js    # icon generation from public/logo.svg
public/logo.svg         # source icon (edit this to change the app icon)
src/main.jsx            # React entry
src/WorkoutPlan.jsx     # the workout plan UI (mobile-adapted)
```

## Local development

```bash
npm install
npm run dev        # http://localhost:5173  (no service worker in dev)
```

To test the **real** PWA / offline behavior, you must use a production build
(the service worker is disabled in dev):

```bash
npm run build      # generates icons, bundles, emits the service worker
npm run preview    # serves dist/ at http://localhost:4173 (and your LAN IP)
```

## Getting it onto your iPhone

The service worker (required for offline) only runs over **HTTPS** (localhost is
the one exception, but that's your Mac, not your phone). So you need an HTTPS URL.
Two ways:

### Option A — Deploy to a free static host (recommended: permanent, no Mac needed)

This gives you a permanent HTTPS URL. Install once, works offline forever.

**Vercel:**
```bash
npm i -g vercel       # once
npm run build
vercel deploy --prod  # follow prompts; serve the `dist` directory
```

**Netlify:**
```bash
npm i -g netlify-cli  # once
npm run build
netlify deploy --prod --dir=dist
```

Both have a free tier. The URL is obscure but technically public — fine for a
personal workout plan. (If you'd rather not host it publicly at all, use Option B.)

> GitHub Pages note: it serves under `/<repo>/`, so you'd need to set
> `base: '/<repo>/'` in `vite.config.js` (and it's mirrored into the SW scope).
> Vercel/Netlify serve at the root, which matches the current `base: '/'`.

### Option B — Serve from your Mac over a temporary HTTPS tunnel (most private)

Keeps the app entirely on your machine. You only need the Mac online for the
**first** load (so the service worker can cache everything); after that the app
runs offline on your phone.

```bash
npm run build
npm run preview                      # terminal 1 — serves dist/ on :4173
npx cloudflared tunnel --url http://localhost:4173   # terminal 2 — prints an https://...trycloudflare.com URL
```

Open that `https://…` URL on your iPhone (Option C below). Once installed and
loaded once, you can stop the tunnel and the Mac — the app stays offline-usable.

### Option C — Add to Home Screen (the actual install, on the iPhone)

1. Open the HTTPS URL in **Safari** (must be Safari) **while online**.
2. Tap the **Share** button (square with an up-arrow) in the bottom toolbar.
3. Scroll down, tap **Add to Home Screen**.
4. Confirm the name (“Workout”) and icon, tap **Add**.
5. Launch from the new home-screen icon. It opens fullscreen — no Safari bar,
   dark status bar, content respecting the notch and home indicator.

The first launch must be online so the service worker can precache. After that,
enable Airplane Mode and relaunch — it boots fully offline.

## Updating the plan later

Edit `src/WorkoutPlan.jsx` (the `weeks` / `weightStrategy` data at the top is
where the exercises live), then `npm run build` and redeploy (Option A) or
re-serve (Option B). Because the service worker uses `registerType: 'autoUpdate'`,
the installed app silently updates to the new version the next time you open it
online — no reinstall needed.

To change the app icon, replace `public/logo.svg` (keep it square, opaque, with
~10% padding so the maskable/rounded version isn't clipped), then rebuild.

## iOS facts worth knowing

- **Offline persistence:** a home-screen-installed PWA keeps its cache
  indefinitely. Deleting the icon wipes its storage (there's no iCloud backup).
- **No true fullscreen:** iOS always shows the status bar for PWAs; the app is
  designed around that (`black-translucent` status bar, safe-area padding).
- **HTTPS is mandatory** for offline. Plain `http://<LAN-IP>` will install but
  won't cache or work offline.
