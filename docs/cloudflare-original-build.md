# TailAdmin Free — Cloudflare Workers build review

Source repository: https://github.com/TailAdmin/free-nextjs-admin-dashboard
Pinned upstream commit: `1ef305c5b1332c899c5ffdeb72b56235d42d6d00`
Project package version: `2.5.0` (verified against package.json and package-lock.json at pinned commit).

## Isolation

This branch (`review/cloudflare-vinext`) is for testing the original TailAdmin Free build only. Keep `main` unchanged. Do not customize TALABOT or modify existing Cloudflare projects.

## Gate 1: original project

1. Confirm source commit and lockfile.
2. Install dependencies: `npm ci`.
3. Run original Next.js build: `npm run build`.
4. Confirm original dashboard runs before any adapter modifications.

## Gate 2: Cloudflare Workers adapter

Cloudflare's Next.js documentation recommends vinext on Workers, not classic Pages, for new Next.js apps: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/

1. Run `npx vinext check`; record compatibility output.
2. If compatible, initialize vinext on this review branch only; inspect and commit generated configuration separately.
3. Run `npm run build:vinext` and deploy to a distinct Worker named `talabot-tailadmin-review` only after successful build.
4. Save build logs and independently test the original dashboard URL.

Do not assert any of these commands passed before logs are available. No paid plan or production resources authorized.
