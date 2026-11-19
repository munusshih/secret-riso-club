# SRC Next.js + Sanity test

Minimal Secret Riso Club integration test with TypeScript, Next.js App Router,
Tailwind CSS, ESLint, and the official `next-sanity` toolkit. This is a test
foundation, not the full SRC website.

## Local setup

Use Node.js 22.12 or newer (Node 22 LTS is recorded in `.nvmrc`) and npm.

```sh
npm ci
cp .env.example .env.local
```

Set `NEXT_PUBLIC_SANITY_PROJECT_ID` to the real project ID, then run:

```sh
npm run dev
```

- Homepage: http://localhost:3000
- Embedded Studio: http://localhost:3000/studio
- Sanity project: **SRC Test** (`8kwmm0xx`)
- Dataset: **production**, public
- Project management: https://www.sanity.io/manage/project/8kwmm0xx

The initial local `.env.local` is already configured for this project. A fresh
clone must create its own `.env.local`. Restart Next.js after changing variables.
The CLI loads `.env.local` through `@next/env` as well.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID from project management |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Yes | Pinned API behavior date, `2026-02-01` |

These three values are public configuration, visible to Studio in the browser.
No API token is needed for published reads from this public dataset. Studio uses
your Sanity login for editing. Never put secrets in `NEXT_PUBLIC_*` variables.
`.env.local` and other `.env*` files are ignored; only `.env.example` is tracked.
Missing required configuration produces a clear error rather than using fake IDs.
Do not publish confidential information to the public dataset.

## Verify content fetching

See [SANITY_DEMO.md](SANITY_DEMO.md) for the current live demonstration.

1. Open `/studio`, sign in to Sanity, and select **Homepage**.
2. Edit the **Introduction** field and click **Publish**.
3. Refresh `/`; the long introduction paragraph shows the published text.

The Homepage singleton is seeded with the original introduction. Drafts are
excluded. The homepage renders per request and fetches without caching
(`cache: "no-store"`, `useCdn: false`), so refreshing shows published updates.
Missing or empty published content uses the original paragraph as fallback.
The original Sample Note schema remains available but is not used by the homepage.

Optional repeatable seed command (creates a note only when none is published):

```sh
npx sanity login
npm run seed
```

This optional seed creates a Sample Note only; the homepage demo uses Homepage.
The seed uses the CLI's authenticated user token in memory, without writing it
to an environment file or source file. Sanity assigns the document ID.

Local Studio CORS access was configured with:

```sh
npx sanity cors add http://localhost:3000 --credentials
```

If you change the port or deploy, add the corresponding origin in Sanity project
settings or with the same CLI command. Run `npm run dev -- --port 3001` for an
alternate port, and add `http://localhost:3001` as a credential-enabled CORS origin.

## Checks and production

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

`npm run build` checks TypeScript but does not run ESLint; run both checks.
Production uses the same local URLs by default. Set the three environment
variables in the hosting platform before building. Studio is embedded and does
not require a separate `sanity deploy`. Its route exports noindex metadata.

Verified during setup: lint, TypeScript, production build, published sample
creation and read-back, and successful HTTP responses for `/`, `/studio`, and
`/studio/structure`. The homepage response contains the fetched sample note;
Studio responses include noindex metadata.
Dependencies use the stable npm releases available at setup and are locked in
`package-lock.json`: Next.js 16.4.2, React 19.3.1, next-sanity 13.3.4, Sanity 6.20.0,
and Tailwind CSS 4.3.3. ESLint 9 and TypeScript 5 follow the compatible scaffold.

`npm audit` currently reports advisories in transitive Sanity dependencies.
The suggested `npm audit fix --force` downgrades Sanity/next-sanity across major
versions, so it was not applied. Review `npm audit` and upstream updates before
using this starter for a production deployment.

## Structure

```text
src/app/
  page.tsx                       # Basic homepage, server-side content fetch
  layout.tsx                     # Shared HTML shell
  globals.css                    # Tailwind and minimal global styles
  studio/[[...tool]]/page.tsx     # Embedded Studio, including nested routes
src/sanity/
  env.ts                         # Required public config
  lib/client.ts                  # Server-only client and sample GROQ query
  schemaTypes/                   # Sample Note document schema
scripts/seed-sample.ts            # Authenticated, repeatable sample seed
sanity.config.ts                 # Studio configuration
sanity.cli.ts                    # Sanity CLI environment/configuration
.env.example                    # Committed placeholders only
```

## GitHub

GitHub CLI was not installed at setup. After installing `gh`, authenticate with
`gh auth login`, then run from this project directory:

```sh
gh auth status
gh repo create src-next-sanity-test --private --source=. --remote=origin --push
```

The project has its own Git repository on `main`, separate from the enclosing
workspace's existing `secret-riso-club` remote. No GitHub repository creation or
push is claimed until authenticated execution succeeds.

## Official references

- https://nextjs.org/docs/app/getting-started/installation
- https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs
- https://github.com/sanity-io/next-sanity
