Uptime and error monitoring

This project includes two options for uptime/alerting:

1) GitHub Actions heartbeat (added)
- A scheduled workflow (`.github/workflows/heartbeat.yml`) pings your backend `/api/health` endpoint every 15 minutes.
- If the endpoint returns a non-200 response, the workflow creates a GitHub Issue labeled `uptime` and `automated-alert`.
- Configure the monitored URL in repository secrets as `HEALTH_CHECK_URL` (defaults to `https://s72-gaurav-capstone.onrender.com/api/health` if unset).

2) External uptime monitors (recommended)
- Use UptimeRobot, Pingdom, or Grafana Cloud to monitor `/api/health` and configure alerting channels (email, Slack, SMS).
- Example UptimeRobot steps:
  1. Sign in to UptimeRobot.
  2. Create a new Monitor -> Type: HTTP(s)
  3. URL: `https://your-backend.example.com/api/health`
  4. Interval: 5 minutes
  5. Add alert contacts (email, SMS, Slack).

3) Error aggregation
- Sentry integration is scaffolded in `backend/server.js`. Add `SENTRY_DSN` to production secrets to enable full error capture and alerting.
- Consider adding log forwarding (Papertrail/Datadog/LogDNA) for structured logs.

Quick setup checklist:
- Add `HEALTH_CHECK_URL` to GitHub Secrets (Settings → Secrets → Actions).
- Optional: Configure UptimeRobot monitor with the same health URL.
- Verify Sentry is configured and `SENTRY_DSN` is present in production environment.

If you want, I can:
- Configure a Slack or email action to notify a channel when the heartbeat workflow fails.
- Add a Grafana dashboard example for latency and error rate (needs a metrics exporter).
