Immediate steps for leaked keys

1. Rotate keys now:
   - Google Cloud Console: delete or restrict the exposed Maps key and create a new one.
   - Cloudinary: rotate API key/secret; delete any unsafe unsigned presets.
   - Email provider: rotate app passwords.
2. Replace values in hosting provider secrets (Render, Vercel, GitHub Actions Secrets).
3. Remove secrets from the repository (recommended):
   - Use `git rm --cached backend/.env frontend/.env frontend/.env.development` and commit.
   - To purge from history, use `git filter-repo` or `bfg` (careful, this rewrites history and requires force-push).
4. Add a short note in the README explaining keys were rotated and where to find the new secrets.

If you want, I can prepare the `git` commands to remove the files from history and a PR that updates docs and CI secrets guidance.
