# Deployment

## Environments

| | Staging | Production |
|---|---|---|
| Git | `develop` | tag `v*` (from `main`) |
| Neon | `staging` branch | `main` branch |
| Worker | `[env.staging]` | `[env.production]` |
| R2 | `docket-documents-staging` | `docket-documents` |
| App | `jobtracker-staging.baseer.co.uk` | `jobtracker.baseer.co.uk` |
| API | `jobtracker-api-staging.baseer.co.uk` | `jobtracker-api.baseer.co.uk` |

## DNS / custom domains

1. Ensure `baseer.co.uk` is an active zone on the **same** Cloudflare account Wrangler uses (`wrangler whoami`).
2. Deploy Workers/Pages first (custom domains are **not** in `wrangler.toml` routes — that fails if the zone is missing).
3. In the dashboard, attach custom domains:

| Hostname | Target |
|---|---|
| `jobtracker.baseer.co.uk` | Pages project (production) |
| `jobtracker-staging.baseer.co.uk` | Pages project (staging) |
| `jobtracker-api.baseer.co.uk` | Worker `docket-api` (production) |
| `jobtracker-api-staging.baseer.co.uk` | Worker `docket-api-staging` |

Use single-level subdomains only (avoid `api.jobtracker.baseer.co.uk`).

## Commands

```bash
npm run deploy:staging
npm run deploy:production
```

GitHub Actions:

- CI on PRs
- Deploy staging on push to `develop`
- Deploy production on tags matching `v*`

Use Cloudflare API credentials for the **baseer.co.uk** account (`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`).

## Secrets

Set via Cloudflare dashboard / `wrangler secret put` and GitHub Actions secrets:

- `DATABASE_URL` (or Hyperdrive)
- `OWNER_ID` (defaults to `seed-user-baseer` in wrangler vars)
- Hyperdrive config IDs
