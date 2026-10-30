# KampusKart Documentation

This folder is the technical handbook for the KampusKart capstone. It explains architecture, backend APIs, data models, frontend structure, testing, deployment, and operations.

## How to use this handbook
- Start with architecture.md and environment.md
- Backend details live in docs/backend/
- Frontend details live in docs/frontend/
- Operations, testing, and deployment are in the top-level docs

## Documentation map
- architecture.md
- environment.md
- backend/overview.md
- backend/api.md
- backend/data-models.md
- backend/security.md
- backend/realtime-chat.md
- backend/jobs-and-scripts.md
- frontend/overview.md
- frontend/routing-auth.md
- frontend/components.md
- frontend/state-and-hooks.md
- frontend/ui-ux.md
- frontend/ui-ux-standards.md (full design system)
- testing.md
- deployment.md
- operations.md
- troubleshooting.md
- project-report.md (capstone project report)
- archive/ (historical notes and analysis; may be out of date)

## Conventions used in the docs
- Auth required means Authorization: Bearer <token> is required
- Admin only means the user email is listed in ADMIN_EMAILS
- Pagination uses page and limit query params and returns totalItems and totalPages
- Dates are stored as ISO 8601 strings in the API; the UI formats them for display

## Related docs in the repo
- ../README.md for setup, scripts, and high level overview
- frontend/ui-ux-standards.md for the UI design system
- ../SECURITY.md for security policy and reporting
- ../CONTRIBUTING.md for the contribution workflow
