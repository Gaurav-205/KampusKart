# Deployment and CI/CD

## Hosting

- Frontend: Netlify (current), Vercel (configured via `vercel.json`)
- Backend: Render

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
| `VITE_API_URL`             | Backend URL, e.g. `https://s72-gaurav-capstone-kampuskart.onrender.com` |
| `VITE_SOCKET_URL`          | Same as `VITE_API_URL`                                                  |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JS API key (restrict it to the Vercel domains)              |
| `VITE_GOOGLE_MAPS_MAP_ID`  | Optional map style ID                                                   |

Backend changes required on Render before switching traffic:

- Add the Vercel origins to `ALLOWED_ORIGINS`, e.g.
  `https://kampuskart.vercel.app,https://kampuskart-*-yourteam.vercel.app` (the wildcard covers previews)
- Set `FRONTEND_URL` to the production Vercel URL so Google sign-in redirects back to it
- Add the Vercel URL to the Google OAuth client's authorized JavaScript origins

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
