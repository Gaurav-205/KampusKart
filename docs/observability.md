Observability recommendations

- Request IDs: middleware sets `X-Request-Id` on requests (already added in `backend/middleware/requestId.js`). Include `requestId` in logs and tracing.
- Structured logs: use `backend/utils/logger.js` for JSON-structured logs; replace with `pino` or `winston` in production.
- Error tracking: integrate Sentry (quick) or OpenTelemetry (advanced). Example Sentry init (Node):

```js
// backend/server.js (production)
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV });
app.use(Sentry.Handlers.requestHandler());
// app routes
app.use(Sentry.Handlers.errorHandler());
```

- Tracing / metrics: add OpenTelemetry + exporter (OTLP) if you need distributed traces and metrics.
- Uptime / Error dashboard: use Render / Vercel health checks plus an external monitoring service (UptimeRobot, Grafana Cloud, or a simple GitHub Actions cron that hits `/api/health`).

Quick steps to enable:
1. Rotate exposed API keys immediately (Google Maps, Cloudinary, email). Replace in hosting provider secrets.
2. Add `SENTRY_DSN` to production environment and enable Sentry in `server.js` when `NODE_ENV === 'production'`.
3. Configure an uptime monitor to ping `/api/health` and alert on failure.
4. Forward logs to a log management service (LogDNA, Datadog, Papertrail) or use `pino` + `pino-pretty` for local debugging.
