# 4-Week Workout Plan

An installable, **fully-offline iPhone app** (PWA) for a 4-week progressive-overload
training plan. No App Store, no Xcode, no weekly re-signing — open it in Safari,
**Add to Home Screen**, and it lives on your home screen and works in airplane mode.

Built from a single React component; hosts on **GitHub Pages or Vercel** from the
same codebase.

## Features

- **4-week PPL plan** (Push/Pull/Legs, 6 days/week) — 3 build weeks + a deload week,
  with per-day exercise tables (sets, reps, rest, notes) and weekly progression guidance.
- **Sticky week/day selectors** — pinned to the top so you can switch days one-handed
  while scrolling through exercises.
- **Check off exercises** — tap to mark a set done (dims + strikes through). Progress
  (`X/Y done`) is saved **on-device** and survives reloads; a **Reset** clears the day.
- **Rest timer** — tap any rest value (e.g. `90s`, `2–3 min`) to start a countdown in a
  floating bar with pause/resume, ±15s, and a beep + vibrate on finish.
- **Installs like a native app** — fullscreen, dark status bar, respects the notch /
  Dynamic Island / home indicator, and runs **100% offline** after the first load.

## Tech stack

React 18 · Vite 6 · [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) (Workbox
service worker) · [`@vercel/analytics`](https://vercel.com/docs/analytics) +
[`@vercel/speed-insights`](https://vercel.com/docs/speed-insights). Fully static — no backend.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173  (dev mode — service worker is OFF here)
```

The service worker (offline + install) only runs in a **production build**, so to test
the real PWA:

```bash
npm run build      # generate icons → bundle → emit the service worker
npm run preview    # serve dist/ at http://localhost:4173 (and your LAN IP)
```

## Project layout

```
index.html                    PWA entry — iOS meta tags, safe-area + global CSS
vite.config.js                vite-plugin-pwa: auto-update SW, offline precache, base path
pwa-assets.config.js          icon generation from public/logo.svg
public/logo.svg               source app icon (edit this; PNGs + favicon are generated)
src/main.jsx                  React entry (mounts the app + Vercel Analytics)
src/WorkoutPlan.jsx           the whole app — plan data, UI, check-off, rest timer
.github/workflows/deploy.yml  GitHub Pages build & deploy
```

> `dist/`, `node_modules/`, and the generated icons (`public/pwa-*.png`,
> `maskable-*`, `apple-touch-icon-*`, `favicon.ico`) are gitignored — `npm run build`
> regenerates them from `public/logo.svg`.

## Deploy

The service worker requires **HTTPS** (localhost is the only exception, and that's your
Mac — not your phone), so the app needs an HTTPS URL. Pick one host:

The Vite `base` path is chosen at build time so one codebase serves both targets:

| Host | URL | `base` |
|------|-----|--------|
| Vercel / Netlify / custom domain | root domain | `/` (default) |
| GitHub Pages project site | `https://<user>.github.io/workout/` | `/workout/` (workflow sets `GITHUB_PAGES=true`) |

### GitHub Pages — auto-deploys on every push to `main`

1. **One-time (UI only):** repo **Settings → Pages → Build and deployment → Source =
   GitHub Actions**. A workflow can't enable this, and the first deploy fails without it.
2. Push to `main`. `.github/workflows/deploy.yml` builds with `GITHUB_PAGES=true` and publishes.
3. Live at `https://<your-user>.github.io/workout/`.

### Vercel — connect the GitHub repo

Import the repo at [vercel.com](https://vercel.com) → it auto-detects Vite (build
`npm run build`, output `dist`) and deploys on every push. No settings needed
(`GITHUB_PAGES` is unset, so `base` stays `/`). For page-view data, enable **Web
Analytics** in the project's **Analytics** tab.

### Local HTTPS tunnel — most private (app never leaves your Mac)

Only needs the Mac online for the **first** load (so the service worker can cache);
after that it runs offline on your phone.

```bash
npm run build
npm run preview                                      # terminal 1 — serves dist/ on :4173
npx cloudflared tunnel --url http://localhost:4173   # terminal 2 — prints an https://…trycloudflare.com URL
```

> To preview the **GitHub Pages** build locally (subpath), build with the flag:
> `GITHUB_PAGES=true npm run build && npm run preview` → http://localhost:4173/workout/

## Install on your iPhone (Add to Home Screen)

1. Open the HTTPS URL in **Safari** (must be Safari) **while online**.
2. Tap **Share** (the □↑ icon) in the bottom toolbar.
3. Scroll down → **Add to Home Screen** → **Add**.
4. Launch from the new icon — it opens fullscreen, no Safari chrome.

The first launch must be online so the service worker can precache. After that, turn on
Airplane Mode and relaunch — it boots fully offline.

## Customizing

- **Edit the plan:** the `weeks` and `weightStrategy` data at the top of
  `src/WorkoutPlan.jsx` is where exercises, sets/reps/rest, and notes live. Rebuild and
  redeploy. Thanks to `registerType: 'autoUpdate'`, an installed app silently updates to
  the new version the next time it's opened online — no reinstall.
- **Change the icon:** replace `public/logo.svg` (keep it square and opaque, with ~10%
  padding so the rounded/maskable version isn't clipped), then rebuild.

## Analytics & Speed Insights

`<Analytics />` and `<SpeedInsights />` (from `@vercel/analytics/react` and
`@vercel/speed-insights/react`) are mounted in `src/main.jsx`. They're **active on Vercel
and custom domains**, and **skipped on GitHub Pages** (`github.io`), where the `/_vercel`
beacons aren't served and would just 404. Enable **Web Analytics** and **Speed Insights**
in the Vercel project's respective tabs; data appears after the first visits (disable
content blockers when testing).

## iOS notes

- **Offline persistence:** a home-screen-installed PWA keeps its cache indefinitely.
  Deleting the icon wipes its storage (there's no iCloud backup), and check-off progress
  lives in that app's `localStorage`.
- **No true fullscreen:** iOS always shows the status bar for PWAs — the layout is
  designed around it (`black-translucent` status bar + safe-area padding).
- **Background timer:** iOS freezes JS timers when the app is backgrounded, so the rest
  timer can't chime while the app is closed; it reconciles and alerts the moment you
  reopen it.
- **HTTPS is mandatory** for offline. Plain `http://<LAN-IP>` will install but won't cache.
```

## Features
- ✅ Username-based user management
- ✅ Editable Sets, Reps, and Rest values
- ✅ Local storage with Excel export/import
- ✅ Multi-user support (data separated by username)
- ✅ Rest timer with notifications
- ✅ Exercise completion tracking
- ✅ Progressive overload plan (4-week PPL split)
- ✅ Works 100% offline after first load
