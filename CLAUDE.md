# CLAUDE.md - Game Dev Karaoke 2026

## Project Overview
Ticketing site for a GDC 2026 karaoke event at Pandora Karaoke in San Francisco. Visitors can browse rooms, sign up for notifications, and purchase tickets via Stripe.

## Tech Stack
- **Frontend:** React 19 (single-file SPA in `src/main.jsx`), Vite 7 build system
- **Backend:** Netlify serverless functions (`netlify/functions/`)
- **Database:** Neon (serverless Postgres) via `@neondatabase/serverless`
- **Payments:** Stripe (checkout sessions + webhooks)
- **Hosting:** Netlify (deploys from `dist/`)

## Project Structure
```
src/main.jsx           # Entire frontend app (~4500 lines, single file)
netlify/functions/     # Serverless API endpoints
public/images/         # Static images (room backgrounds, logos, etc.)
index.html             # Entry point (loads src/main.jsx)
vite.config.js         # Vite config with React plugin
netlify.toml           # Netlify build + headers config
```

## Architecture Notes
- The entire frontend lives in `src/main.jsx` — all components, styles, and config are in this one file. There are no separate component files or CSS files.
- CSS is defined as a template literal string (`const styles`) injected into the document, not in external stylesheets.
- The app uses inline React component functions (no router library) — navigation is managed via a `view` state variable (`home`, `room`, `admin`, `privacy`, `terms`).
- Room configuration is defined in `INITIAL_ROOMS` at the top of `main.jsx` (line ~19). This is the easiest place to update room names, pricing, capacity, and features.
- Event details (date, time, venue) are in the `CONFIG` object at the top of `main.jsx` (line ~9).

## Development
```bash
npm run dev        # Start local dev server (uses netlify dev for functions)
npm run build      # Production build to dist/
npm run preview    # Preview production build
```

## Key Serverless Functions
- `create-checkout.js` / `create-test-checkout.js` — Stripe checkout session creation
- `stripe-webhook.js` — Handles Stripe payment webhooks
- `get-room-availability.js` / `get-rooms.js` — Room data and booking counts
- `signup.js` / `get-signups.js` — Email notification signups
- `join-waitlist.js` — Waitlist for sold-out rooms
- `get-orders.js` — Admin order listing
- `update-room.js` — Admin room management

## Common Edits
- **Change event details:** Edit `CONFIG` object at top of `src/main.jsx`
- **Change room names/pricing/capacity:** Edit `INITIAL_ROOMS` object at top of `src/main.jsx`
- **Change room images:** Add images to `public/images/` and reference them as `/images/filename.jpg` in `INITIAL_ROOMS`
- **Change styles/colors:** Edit the `styles` template literal in `src/main.jsx` (starts around line 65). CSS variables are defined in `:root` (neon-green, neon-pink, neon-blue, etc.)
- **Change fonts:** Currently uses Outfit + Space Mono from Google Fonts, imported in the styles block

## Environment Variables (Netlify)
The serverless functions expect these env vars (set in Netlify dashboard, not committed):
- `DATABASE_URL` — Neon Postgres connection string
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `ADMIN_PASSWORD` — Password for the admin panel
- Stripe public key is hardcoded in `CONFIG.stripePublicKey` in `main.jsx`
