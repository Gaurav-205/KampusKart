<div align="center">
  <img src="frontend/public/Logo.png" alt="KampusKart logo" width="96" />

# KampusKart

**Your campus, all in one place.** Events, news, lost & found, complaints, facilities, club recruitment and live chat for MIT ADT University.

[![CI](https://github.com/Gaurav-205/KampusKart/actions/workflows/ci.yml/badge.svg)](https://github.com/Gaurav-205/KampusKart/actions/workflows/ci.yml)
[![Live demo](https://img.shields.io/badge/demo-kampuskartmitadt.vercel.app-000000?logo=vercel&logoColor=white)](https://kampuskartmitadt.vercel.app)
[![Node](https://img.shields.io/badge/node-%3E%3D20.19-339933?logo=node.js&logoColor=white)](.nvmrc)
[![License](https://img.shields.io/badge/license-proprietary-red)](LICENSE)

</div>

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

| Module            | What it does                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Campus Map        | Google Maps with facility markers and location search                                        |
| News & Events     | Announcements and event listings, managed by admins                                          |
| Lost & Found      | Report and search lost or found items with photos; resolved items are archived after 14 days |
| Complaints        | File complaints by category, priority and department, and follow their status history        |
| Facilities        | Directory with type, opening hours, contact details and images                               |
| Clubs Recruitment | Open recruitment drives with deadlines and application links                                 |
| Global Chat       | Real-time chat with replies, reactions, read receipts and attachments                        |
| Accounts          | Email/password sign-in (Google optional), JWT sessions, OTP password reset, profiles         |

Admins are configured by email (`ADMIN_EMAILS`) and can manage news, events, facilities and clubs, review every complaint and Lost & Found item, and restore or permanently delete soft-deleted records.

<details>
<summary>Screenshots</summary>

|              Campus Map              |              Global Chat              |                 Lost & Found                  |
| :----------------------------------: | :-----------------------------------: | :-------------------------------------------: |
| ![Map](frontend/public/images/3.png) | ![Chat](frontend/public/images/1.png) | ![Lost & Found](frontend/public/images/2.png) |

</details>

## Tech stack

| Layer    | Technologies                                                                  |
| -------- | ----------------------------------------------------------------------------- |
| Frontend | React 18, TypeScript, Vite 6, Tailwind CSS 3, Material UI 7, Socket.IO client |
| Backend  | Node.js 20 (CommonJS), Express 5, MongoDB + Mongoose, Passport, Socket.IO     |
| Services | Cloudinary (media), Nodemailer (OTP email), Google OAuth, Google Maps         |
| Hosting  | Netlify or Vercel (frontend), Render (backend), MongoDB Atlas                 |
| Quality  | Vitest + Testing Library, Jest + Supertest, ESLint, Prettier, GitHub Actions  |

## Quick start

**Prerequisites:** Node.js 20.19+ (see [`.nvmrc`](.nvmrc)) and MongoDB, either local through Docker or a MongoDB Atlas connection string.

```bash
git clone https://github.com/Gaurav-205/KampusKart.git
cd KampusKart
npm install
```

`npm install` at the root installs both workspaces (`frontend/` and `backend/`) from the single root `package-lock.json`. Don't run `npm install` inside a workspace folder on its own.

Create your environment files and fill them in (see [Configuration](#configuration)):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Start MongoDB locally, if you aren't using Atlas:

```bash
npm run mongo:up
```

Run the backend and frontend together:

```bash
npm run dev
```

The frontend runs at <http://localhost:5173> and the API at <http://localhost:5000>. On Windows or macOS/Linux you can also run `scripts/setup.bat` or `scripts/setup.sh` for a guided setup.

## Configuration

### Backend: `backend/.env`

| Variable                                                               | Required    | Purpose                                                                                                              |
| ---------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`                                                          | Yes         | MongoDB connection string                                                                                            |
| `JWT_SECRET`                                                           | Yes         | Token signing secret, 32+ characters                                                                                 |
| `PORT`, `NODE_ENV`                                                     | No          | Defaults: `5000`, `development`                                                                                      |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | For uploads | Image and attachment storage                                                                                         |
| `GOOGLE_AUTH_ENABLED`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`      | Optional    | Google sign-in; off unless `GOOGLE_AUTH_ENABLED=true`                                                                |
| `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASS`                            | For reset   | Sends password-reset OTPs (use a Gmail app password)                                                                 |
| `FRONTEND_URL`, `BACKEND_URL`                                          | Production  | OAuth redirect and callback URLs                                                                                     |
| `ALLOWED_ORIGINS`                                                      | Production  | Extra CORS origins, comma-separated. `*` matches one hostname fragment (e.g. `https://kampuskart-*-team.vercel.app`) |
| `ADMIN_EMAILS`                                                         | Optional    | Comma-separated admin accounts                                                                                       |
| `TRUST_PROXY`                                                          | Optional    | Proxy hops to trust for client IPs used by rate limiting; defaults to `1` in production                              |

The full list, including keep-alive and seeding options, is in [docs/environment.md](docs/environment.md).

### Frontend: `frontend/.env`

| Variable                   | Required | Purpose                                            |
| -------------------------- | -------- | -------------------------------------------------- |
| `VITE_API_URL`             | Yes      | Backend base URL                                   |
| `VITE_SOCKET_URL`          | Yes      | Socket.IO URL (usually the same as `VITE_API_URL`) |
| `VITE_GOOGLE_MAPS_API_KEY` | For maps | Google Maps JavaScript API key                     |
| `VITE_GOOGLE_MAPS_MAP_ID`  | Optional | Custom map style                                   |
| `VITE_ENABLE_GOOGLE_AUTH`  | Optional | `true` shows the Google sign-in button             |

All uploads go through the authenticated backend, so the frontend needs no Cloudinary credentials.

## Project structure

```
KampusKart/
├── frontend/                 React + TypeScript app (Vite)
│   ├── public/               Static assets
│   └── src/
│       ├── features/         Feature modules: api, types, hooks, components per feature
│       │   ├── chat/  clubs/  complaints/  events/
│       │   └── facilities/  lostfound/  map/  news/
│       ├── pages/            Route entry points (lazy-loaded)
│       ├── components/       App-level screens, shared components (common/), UI primitives (ui/)
│       ├── contexts/         Auth and theme providers
│       ├── hooks/  utils/  theme/  lib/
│       └── tests/            Vitest suites
├── backend/                  Express API + Socket.IO
│   ├── routes/               Route definitions and middleware wiring
│   ├── controllers/          HTTP layer
│   ├── services/             Business logic
│   ├── repositories/         Data access
│   ├── models/               Mongoose schemas
│   ├── middleware/           Auth, validation, uploads, rate limiting
│   ├── config/  cron/  utils/  scripts/
│   └── tests/                Jest suites
├── docs/                     Architecture, API, deployment and operations handbook
├── scripts/                  Setup and maintenance scripts
├── .github/                  CI/CD workflows, issue and PR templates
├── netlify.toml  vercel.json Frontend hosting config
└── docker-compose.yml        Local MongoDB
```

## Scripts

Run these from the repository root.

| Command             | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Backend (nodemon) and frontend (Vite) together        |
| `npm run build`     | Build all workspaces                                  |
| `npm run lint`      | ESLint in both workspaces                             |
| `npm test`          | Vitest (frontend) and Jest (backend)                  |
| `npm run typecheck` | TypeScript check for the frontend                     |
| `npm run format`    | Prettier                                              |
| `npm run mongo:up`  | Start local MongoDB in Docker (`mongo:down` stops it) |

Workspace-specific scripts run with `npm --workspace frontend run <script>` or `npm --workspace backend run <script>`. For example, `npm --workspace backend run seed` loads sample data and creates a test account (`testuser@mitadt.edu` / `Test@12345`) when the database has no users.

## Testing

```bash
npm --workspace frontend test
npm --workspace backend test
```

Backend tests need MongoDB. They use `MONGODB_URI` if set, then a local MongoDB on port 27017, and finally an in-memory server. CI runs lint, tests, a production build and a dependency audit on every pull request. See [docs/testing.md](docs/testing.md).

## Deployment

| Part     | Host             | Config                                                       |
| -------- | ---------------- | ------------------------------------------------------------ |
| Frontend | Netlify / Vercel | [`netlify.toml`](netlify.toml), [`vercel.json`](vercel.json) |
| Backend  | Render           | Root `backend/`, `npm install`, `node server.js`             |

Pushing to `main` runs the CD workflow, which deploys the frontend to Netlify and triggers a Render deploy. Required GitHub secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, `RENDER_API_KEY`, `RENDER_SERVICE_ID` and `VITE_GOOGLE_MAPS_API_KEY`. The full guide, including Vercel and Google OAuth setup, is in [docs/deployment.md](docs/deployment.md).

## Documentation

- [docs/](docs/README.md) is the full handbook: architecture, API reference, data models, real-time chat, operations and troubleshooting.
- [docs/frontend/ui-ux-standards.md](docs/frontend/ui-ux-standards.md) covers the design system.
- [SECURITY.md](SECURITY.md) explains how to report a vulnerability privately.

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request, and follow the [Code of Conduct](CODE_OF_CONDUCT.md). Report security issues privately through a [security advisory](https://github.com/Gaurav-205/KampusKart/security/advisories/new), not in a public issue.

## License

Copyright © Gaurav Khandelwal. All rights reserved. See [LICENSE](LICENSE).
