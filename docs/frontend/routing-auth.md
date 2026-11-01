# Routing and Authentication

## Route map
Public routes:
- /
- /login
- /signup
- /auth/google/callback
- /privacy
- /terms

Protected routes:
- /home
- /chat
- /lostfound
- /complaints
- /campus-map
- /profile
- /profile/:userId
- /events
- /news
- /facilities
- /clubs-recruitment

## ProtectedRoute
ProtectedRoute checks AuthContext token. If no token is present, it redirects to /login.

## Navbar visibility
The navbar is hidden on /login and /signup to support full screen auth layouts.

## Google OAuth callback
The /auth/google/callback route reads token from the query string and passes it to AuthContext.handleGoogleCallback. On success, the user is redirected to /home.
