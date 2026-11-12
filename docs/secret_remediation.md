Secret remediation & key rotation checklist

This document collects safe, repeatable steps to remove leaked secrets from the repository, rotate them with providers, and update deployment secrets.

1) Immediate: stop using leaked keys
- Revoke or rotate any keys you found in the repository (Google Maps, Cloudinary, email app password).
- Remove the committed files from the Git index (keeps local copies):

```bash
git rm --cached backend/.env frontend/.env frontend/.env.development
git commit -m "chore(secrets): remove committed .env files; rotate leaked keys"
git push origin <branch>
```

2) Replace with placeholders
- Ensure `.env.example` contains placeholders and instruct developers to copy into local `.env` files.
- Confirm `.gitignore` includes `.env` (already present in repo).

3) Rotate keys at providers (high-level)
- Google Maps (Browser key):
  - In Google Cloud Console -> APIs & Services -> Credentials
  - Delete the exposed API key (or restrict and regenerate); create a new browser key.
  - Restrict to HTTP referrers for production domains (e.g., `https://kampuskartmitadt.vercel.app`) and to localhost for development.
- Cloudinary:
  - In Cloudinary console -> Settings -> Security, rotate the API key/secret.
  - For client-side uploads use an *unsigned upload preset* that is restricted to a folder, allowed formats, and maximum file size. Prefer server-side signed uploads when possible.
- Email (Gmail app password): rotate the app password or service credential.

4) Update hosting and CI secrets
- Update secrets in Render/Vercel/GitHub Actions/other deployment platforms (replace old keys immediately).
- In GitHub repo: Settings -> Secrets -> Actions — update or add `VITE_GOOGLE_MAPS_API_KEY`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `SENTRY_DSN`, etc.

5) Purge secrets from Git history (optional, disruptive)
Warning: rewriting history requires force-push and coordination with collaborators.

Option A — BFG (easy):
```bash
# Install BFG (https://rtyley.github.io/bfg-repo-cleaner/)
# Create a mirror clone
git clone --mirror git@github.com:kalviumcommunity/S72_Gaurav_Capstone_KampusKart.git
cd S72_Gaurav_Capstone_KampusKart.git
# Remove specific file blobs
bfg --delete-files backend/.env
bfg --delete-files frontend/.env
bfg --delete-files frontend/.env.development
# Or remove text patterns
bfg --replace-text passwords.txt
# Cleanup and push
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```
Option B — git filter-repo (recommended if available):
```bash
# Install git-filter-repo
git clone --mirror git@github.com:kalviumcommunity/S72_Gaurav_Capstone_KampusKart.git
cd S72_Gaurav_Capstone_KampusKart.git
git filter-repo --invert-paths --paths backend/.env --paths frontend/.env --paths frontend/.env.development
git push --force
```
After history rewrite:
- Inform collaborators to re-clone the repository.
- Rotate any remaining secrets — assume leaked values are compromised.

6) Verify and scan
- Run `git grep` locally to confirm no secrets remain:
```bash
git grep -n "AIzaSy\|CLOUDINARY_API_KEY\|CLOUDINARY_API_SECRET" || true
```
- Add a secret scanning tool (GitHub Advanced Security or third-party) to detect future leaks.

7) Post-rotation checks and redeploy
- Update `frontend/.env` and `backend/.env` in the deployment platform (use secrets, not committed files).
- Trigger a redeploy (Vercel / Render) and confirm the app functions.
- Monitor logs and Sentry for new errors.

8) Optional: short message for README
- Add a short note: "Some credentials were rotated after an accidental commit. If you had clones with leaked keys, rotate your usage."

If you want, I can:
- Prepare the exact `git filter-repo` or BFG commands customized for this repository and create a short step-by-step script.
- Draft the GitHub PR text and README note to communicate the rotation to collaborators.

Included remediation helpers

- `scripts/remediate-secrets.sh` — bash script that creates a mirror clone and runs `git-filter-repo` or BFG, then optionally force-pushes the cleaned history. Review before pushing.
- `scripts/remediate-secrets.ps1` — PowerShell equivalent for Windows.

Usage example (bash):
```bash
# Make script executable and run
chmod +x scripts/remediate-secrets.sh
./scripts/remediate-secrets.sh
```

Usage example (PowerShell):
```powershell
.
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.
scripts\remediate-secrets.ps1
```
