# JioLeh — Marketing Site

The landing page for **JioLeh**, Singapore's friends-only map. Pin the spots you love, *jio* the squad out, and climb the leaderboard — all on one map made for your kakis. The app is currently in private beta on **TestFlight**.

This repo contains the static marketing website only (not the app itself).

## Tech stack

- Plain **HTML / CSS / JavaScript** — no framework, no build step
- Google Fonts (Gabarito, Hanken Grotesk, Space Mono)
- Deployed on **Vercel**

## Project structure

```
.
├── index.html      # Main landing page (hero, how it works, features, ranks, beta CTA, privacy)
├── privacy.html    # Privacy policy page
├── styles.css      # All site styles
├── site.js         # Interactions: theme toggle, sticky nav, scroll reveals, lazy images
├── vercel.json     # Vercel config (clean URLs, no trailing slash)
└── assets/         # Logos and app screenshots
    ├── logo-light.png / logo-dark.png
    └── screen-map.png, screen-map-dark.png, screen-jios.png, screen-ranks.png, screen-you.png
```

## Features

- **Light / dark theme** — toggle in the nav, preference saved to `localStorage`
- **Sticky nav** that gains a shadow on scroll
- **Scroll-reveal animations** via `IntersectionObserver` (with fallbacks)
- **Lazy-loaded, async-decoded images** for performance
- **Theme-aware screenshots** (separate light/dark phone mockups)
- Fully **responsive** layout

## Running locally

No build step is required. Serve the folder with any static server, e.g.:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>. You can also just open `index.html` directly in a browser.

## Deployment

The site is configured for **Vercel** via `vercel.json`:

- `cleanUrls: true` — serve `/privacy` instead of `/privacy.html`
- `trailingSlash: false`

Pushing to the connected repository deploys automatically.

## Beta access

JioLeh is in early access on iOS via TestFlight. App Store & Google Play coming soon. To request a spot, use the "Join the TestFlight beta" CTA on the site (emails kimiyang@u.nus.edu).
