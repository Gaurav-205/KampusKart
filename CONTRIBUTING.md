# Contributing to KampusKart

Thanks for helping improve KampusKart. This guide explains how to pick up work, set up the project and get a pull request merged.

By participating you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before you start

1. **Find or open an issue.** Every pull request should link to an issue. Search [open issues](https://github.com/Gaurav-205/KampusKart/issues) first; duplicates are closed in favour of the earliest report.
2. **Ask to be assigned.** Comment on the issue saying what you plan to do. Wait for a maintainer to assign you before starting a large change, so two people don't build the same thing.
3. **Unassignment.** If an assigned issue sees no pull request or update for 14 days, it may be reassigned.
4. **Large features need a design first.** For new modules, schema changes or anything touching auth, describe the approach in the issue and get agreement before writing code.

Security vulnerabilities must **not** be reported in public issues. Use a [private security advisory](https://github.com/Gaurav-205/KampusKart/security/advisories/new) instead.

## Local setup

Requires Node.js 20.19+ (see `.nvmrc`) and MongoDB, either local through Docker or a MongoDB Atlas connection string.

```bash
git clone https://github.com/<your-username>/KampusKart.git
cd KampusKart
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run mongo:up
npm run dev
```

Run `npm install` **only at the repository root**. The project uses npm workspaces with a single root `package-lock.json`; don't add a `package-lock.json` inside `frontend/` or `backend/`.

## Making changes

- **Branch from `main`:** `git checkout -b fix/<issue-number>-short-description`.
- **Keep pull requests focused.** One issue per PR. Don't mix refactors, formatting, dependency upgrades or unrelated fixes into a bug fix.
- **Follow the existing structure.**
  - Frontend features live in `frontend/src/features/<feature>/` (`api.ts`, `types.ts`, `hooks/`, `components/`).
  - The backend flows `routes/` → `controllers/` → `services/` → `repositories/` → `models/`.
- **Validate input on the server.** Use the validators in `backend/middleware/validation.js`. On multipart routes, validators must run _after_ the upload middleware, because `req.body` is empty before multer parses it.
- **Dark mode:** pair light-mode colour classes with a `dark:` variant (e.g. `text-black dark:text-white`), and check both themes.
- **Never commit secrets or `.env` files.** Use the `.env.example` templates.

## Checks

Run these before pushing. CI runs the same checks and must be green before review:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Add or update tests for the behaviour you change:

- Frontend tests: `frontend/src/tests/`
- Backend tests: `backend/tests/`

A bug fix should include a test that fails without the fix.

## Commits and pull requests

- Write commit messages in the imperative: `fix(chat): rejoin room after reconnect`.
- Fill in the pull request template, link the issue with `Fixes #123`, and add before/after screenshots for UI changes.
- Keep your branch up to date by merging `main` into it. Don't force-push over review history once review has started.
- Respond to review comments, or explain why a suggestion doesn't apply.

## Licensing

KampusKart is proprietary software (see [LICENSE](LICENSE)). By submitting a contribution you confirm it is your own work, and you grant the copyright owner the right to use, modify and distribute it as part of the project.
