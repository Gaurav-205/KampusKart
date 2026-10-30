# Frontend Overview

## Runtime and tooling
- React 18 with TypeScript
- Vite for dev server and builds
- React Router for routing
- Tailwind CSS plus MUI for styling
- Framer Motion for animation
- Socket.IO client for chat
- Google Maps JavaScript API for campus map

## Entry points
- frontend/src/main.jsx mounts the app
- frontend/src/App.tsx defines routes and layout
- frontend/src/config.ts resolves API and socket base URLs

## Styling and UI
- Tailwind utility classes drive the base layout
- MUI is used heavily in the chat UI
- Shared UI patterns and design rules live in [ui-ux-standards.md](ui-ux-standards.md)

## Asset and build tooling
- build:verify runs Vite build plus asset verification
- Netlify configuration defines caching headers and SPA redirects
