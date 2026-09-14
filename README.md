# OpenNext Starter

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Read the documentation at <https://opennext.js.org/cloudflare>.

## Develop

Run the Next.js development server:

```bash
npm run dev
# or similar package manager command
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or similar package manager command
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or similar package manager command
```

## Admin access

Public signup is disabled, and the temporary setup page has been removed. Signing
in does not grant admin access by itself. Set `ADMIN_EMAILS` to a comma-separated
list of approved existing account emails. Matching is case-insensitive. Missing
or empty configuration denies all admin access. Do not approve unknown accounts
that may have registered while signup was public.

For local development, add `ADMIN_EMAILS` to `.dev.vars` (see `.dev.vars.example`).
The approved allowlist is configured in `wrangler.jsonc` for both production and
development Workers and takes effect on deployment. Keep those entries and the
local `.dev.vars` setting consistent when changing administrator access.
This setting does not create accounts. Provision any new accounts through a trusted
operator workflow; do not re-enable public signup. No database migration is needed.

Admin pages, order listing, and item/artist mutations require an authenticated
allowlisted account. Public catalog reads, image reads, and order submission remain
available to visitors.
