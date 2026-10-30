# Backend Security

## Authentication
- JWT is used for REST and Socket.IO authentication.
- Tokens are signed with JWT_SECRET and expire after 24 hours.
- The auth middleware verifies the token, loads the user, and attaches req.user.

## Authorization
- Admin access is based on ADMIN_EMAILS (comma separated).
- isAdmin is computed in auth middleware and used in routes.

## Input validation and sanitization
- Express Validator validates signup, login, complaints, and lost and found inputs.
- sanitizeInput trims string fields in request bodies.
- Custom Mongo sanitizer strips $ and . from keys in req.body and req.params.

## Rate limiting
Limits use `express-rate-limit` and are keyed by client IP. Behind a reverse proxy (Render), Express must trust the proxy or every user shares one bucket; this is controlled by `TRUST_PROXY` (default `1` in production). Exceeding a limit returns `429`.

| Endpoint | Limit |
| --- | --- |
| `POST /api/auth/login` | 10 per 15 min |
| `POST /api/auth/signup` | 5 per hour |
| `POST /api/auth/forgot-password` | 5 per hour |
| `POST /api/auth/reset-password` | 10 per hour, plus 5 wrong guesses per issued OTP |
| `POST /api/auth/refresh` | 30 per 15 min |
| `POST /api/ai/semantic-search` | 20 per minute |
| `POST /api/chat/messages` | 30 per minute (the Socket.IO `send-message` path has the same per-socket limit) |
| Complaint create/update/delete | 30 per 15 min |
| Lost & Found create/update/delete/resolve | 100 per 15 min |
| News, events, facilities, clubs (admin writes) | 50 per 15 min |

## File upload safety
- All uploads go through the authenticated backend, which streams them to Cloudinary using private API keys. The frontend has no Cloudinary credentials and never uploads directly.
- Requests are capped at 5 files of 5MB each; violations return `400`.
- Images are validated by MIME type; chat attachments use a MIME allow list.
- Replacement images are uploaded before the old image is deleted, so a failed upload never loses the current image.
- Cloudinary public IDs are stored for later cleanup.

## Cloudinary key hygiene
- Rotate Cloudinary API keys if they were ever committed, and delete any unsigned upload presets in the Cloudinary dashboard, since the app does not need them.

## Google Maps API key safety
- Rotate any API keys exposed in the repository immediately.
- Restrict Maps API keys to appropriate referrers (HTTP referrers for browser keys, IPs for server keys, or restrict to specific Android/iOS apps when applicable).
- Use separate keys for development and production and store them in environment variables (see `.env.example`).

## OTP password reset
- OTP is hashed with SHA-256 before storage.
- Timing safe comparison is used to validate OTPs.
- OTPs expire after 15 minutes.

## CORS and headers
- CORS allow list is built from ALLOWED_ORIGINS plus localhost defaults.
- Helmet is enabled for secure HTTP headers.
- HPP is enabled to prevent parameter pollution.

## Error handling
- Centralized error handler logs details and avoids leaking internals in production.
