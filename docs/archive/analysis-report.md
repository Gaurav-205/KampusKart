# Repository Analysis Report

## 1. Executive Summary & Tech Stack

KampusKart is a client-server web application designed as a campus portal for MIT ADT University.

### Tech Stack

- **Frontend**: React (v18), Vite (v6), Tailwind CSS (v3 / v4 docs), Vitest (v4) for testing.
- **Backend**: Express (v5), Socket.IO (v4) for real-time messaging, MongoDB & Mongoose (v8).
- **APIs & Services**: Google Maps, Cloudinary (media assets), Google OAuth, Nodemailer (OTP mailings), Sentry.

---

## 2. Directory Structure & Workspace Architecture

```
KampusKart/
├── backend/                  # Express API Server & Socket.IO
│   ├── config/               # Passport OAuth & db connection keys
│   ├── controllers/          # Request handlers separated by domain
│   ├── cron/                 # Background clean-up and keep-alive processes
│   ├── middleware/           # JWT verification, sanitization, role check
│   ├── models/               # Mongoose DB schema definitions
│   ├── routes/               # API endpoints mappings
│   ├── scripts/              # Data seeding and automation scripts
│   ├── services/             # Third-party utilities (e.g. Cloudinary, AI)
│   ├── tests/                # Jest integration & unit test suites
│   ├── server.js             # Main server setup and Socket server
│   └── package.json
├── frontend/                 # React SPA
│   ├── public/               # Static icons, logos, map markers
│   ├── src/
│   │   ├── components/       # Layouts, common components (Navbar, Signup)
│   │   ├── contexts/         # React Context APIs (Auth, Socket, Theme)
│   │   ├── features/         # Features sliced by domain (Complaints, Events)
│   │   ├── hooks/            # Custom hooks
│   │   ├── theme/            # Design tokens & color patterns
│   │   ├── main.tsx          # Client-side render target
│   │   └── App.tsx           # Client router configuration
│   ├── vite.config.ts
│   └── package.json
└── docs/                     # System architecture & deployment docs
```

---

## 3. Database Schema Analysis

Mongoose schemas located in `backend/models/`:

- **User**: Name, email, hashed password, role (Student, Faculty, Admin, Club Representative), verification flags, Google ID, OTP.
- **Event**: Title, description, date, location, category, banner image reference, organizer (User ref), status.
- **Club**: Club name, recruitment role, description, skills required, Google Form link, deadline, status flag.
- **Complaint**: Student user reference, title, description, category, priority (Low to Urgent), assigned staff, estimated resolution duration, status history, attached media.
- **LostFound**: Title, description, type (Lost or Found), category, location, date, contact details, image references, reporter reference, status.
- **Chat**: Sender reference, message text, timestamp, deletion status.

---

## 4. Real-time Message Sync

WebSockets are handled via Socket.IO:

- Query-based token verification on connection setup.
- Active connection mappings maintained in a server-side `onlineUsers` Map.
- Event tracking for message broadcasts (`send-message` relays messages to room listeners, excluding sender), typing indicators (`typing` / `stop-typing`), and graceful state cleanup on `disconnect`.

---

## 5. Security Protocols

- **HTTP Protection**: Secure headers set via Helmet, parameter pollution guarded by HPP.
- **NoSQL Injection Guard**: Custom middleware sanitizing query/body input keys containing `$` or `.`.
- **Identity Guarding**: Bcrypt hashed passwords, JWT validation middleware, Google authentication via Passport.

---

## 6. Frontend & Design Token Architecture

- **Typography**: Google Fonts' Work Sans primary.
- **Color Palette**: Dark dominant `#181818`, Vibrant Teal `#00C6A7`, destruct orange `#F05A25`.
- **Transitions**: Global hover/modal micro-animations.
- **Theme support**: Persistence context to maintain dark/light toggles.

---

## 7. QA & Testing Coverage

- **Backend tests (Jest & Supertest)**: 121 integration and unit tests cover all API route endpoints. Fallback MongoMemoryServer runs test database when the local MongoDB container is unavailable.
- **Frontend tests (Vitest)**: 37 tests covering validation helpers, routing components, and page loading.

---

## 8. Audit of Recent Session Fixes

1. **Frontend `Signup.tsx` Fix**: Fixed syntax errors caused by an incorrect merge conflict resolution. Balanced HTML tags, removed duplicated input segments, and restored full Vite compilation capability.
2. **Backend `server.js` Fix**: Restored the async wrapper `connectDB` and its database connection try-catch structure, fixing syntax errors (`await` inside synchronous callback) that crashed the server at startup.
3. **Execution**: Confirmed all 158 tests (37 frontend + 121 backend) pass successfully.
