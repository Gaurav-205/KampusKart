# Deployment and CI/CD

## Hosting

- Frontend: Vercel (<https://kampuskart-navy.vercel.app>), Netlify (<https://kampuskart.netlify.app>)
- Backend: Render (<https://s72-gaurav-capstone.onrender.com>, service `S72_Gaurav_Capstone`)

## Vercel (frontend)

`vercel.json` at the repository root builds only the frontend; the backend stays on Render because it
runs a long-lived Socket.IO server and cron jobs, which do not fit Vercel's serverless functions.

Project settings (leave the overrides in the dashboard empty so `vercel.json` applies):

- Root directory: repository root (`./`) — the npm workspace lockfile lives there
- Install: `npm ci --include=optional --no-audit --no-fund`
- Build: `npm --workspace frontend run build:verify`
- Output directory: `frontend/dist`
- SPA routing: every non-asset path rewrites to `/index.html`
- Caching: `/assets/*` (content-hashed) is immutable; `index.html`, `sw.js`, `manifest.json` revalidate

Environment variables (Production and Preview):

| Variable                   | Value                                                                   |
| -------------------------- | ----------------------------------------------------------------------- |
| `VITE_API_URL`             | Backend URL, e.g. `https://s72-gaurav-capstone.onrender.com` |
| `VITE_SOCKET_URL`          | Same as `VITE_API_URL`                                                  |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JS API key (restrict it to the Vercel domains)              |
| `VITE_GOOGLE_MAPS_MAP_ID`  | Optional map style ID                                                   |

Backend changes required on Render before switching traffic:

- Add the Vercel origins to `ALLOWED_ORIGINS` (the wildcard covers preview deployments)
- Set `FRONTEND_URL` to the production Vercel URL
- Google sign-in is disabled by default. To turn it on, set `GOOGLE_AUTH_ENABLED=true` (plus the client
  credentials) on Render and `VITE_ENABLE_GOOGLE_AUTH=true` on Vercel, and add the Vercel URL to the
  Google OAuth client's authorized JavaScript origins

Values for the current Vercel project (`kampuskart`, team `orbit-s-projects71`):

```env
ALLOWED_ORIGINS=https://kampuskart.netlify.app,https://kampuskart-navy.vercel.app,https://kampuskart-*-orbit-s-projects71.vercel.app
FRONTEND_URL=https://kampuskart-navy.vercel.app
TRUST_PROXY=1
```

Render applies environment changes with a redeploy, so a suspended service must be resumed first
(Render dashboard → service → **Resume**).

Deploy with the Vercel GitHub integration (previews per PR, production from `main`) or the CLI:

```bash
npx vercel deploy            # preview
npx vercel deploy --prod     # production, after the preview is verified
```

## Netlify

- Build command: npm run build:verify
- Publish directory: dist (base directory: frontend)
- SPA redirect to /index.html
- Cache headers set for assets, service worker, and manifest
- Production API URLs set in netlify.toml

## Render

- Backend deployed as a Node service
- Uses MONGODB_URI, JWT_SECRET, and other backend env vars

## GitHub Actions

### CI workflow

- Runs on push and PR to main, master, develop
- Frontend lint, test, and build with artifact upload
- Backend lint and tests using a MongoDB service container
- Security audits for frontend and backend dependencies

### CD workflow

- Deploys frontend to Netlify on main and master
- Triggers Render deploy via Render API

### Keep alive workflow

- Scheduled GitHub Action pings /api/health every 14 minutes
