# PixShift — Image Conversion API

A production-grade image conversion SaaS. Register, create API keys from a dashboard, and use those keys to convert, compress, and resize images via a clean REST API.

Built as a portfolio project to demonstrate what production-grade code looks like: layered architecture, hash-only key storage, MIME validation from file bytes, Row Level Security, and a full test suite — not a prototype.

---

## What It Does

- **Format conversion** — PNG, JPG, WebP, AVIF, GIF as input; PNG, JPG, WebP, AVIF as output
- **Compression** — quality control from 1–100, output smaller than input
- **Resize** — width × height with optional aspect ratio lock
- **API key management** — create multiple keys, name them, revoke them from the dashboard
- **Usage tracking** — calls per key, per operation, with timestamps

---

## Architecture

A single Next.js application. No separate backend, no Docker, no Python.

```
pixshift/
└── web/                    ← the entire application
    └── src/
        ├── app/
        │   ├── page.tsx                # Landing page
        │   ├── (auth)/                 # Register / Login / Forgot password
        │   ├── dashboard/              # Protected dashboard UI
        │   └── api/v1/                 # Image conversion API (Route Handlers)
        ├── components/
        │   ├── landing/                # Landing page sections
        │   └── dashboard/              # Dashboard shell + UI
        ├── services/                   # Auth, keys, usage — business logic layer
        ├── hooks/                      # useAuth, useApiKeys
        ├── lib/supabase/               # Browser + server Supabase clients
        └── types/                      # TypeScript interfaces
```

**Stack:**
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase — PostgreSQL database + email/password auth + Row Level Security
- Sharp — image processing inside Next.js API Route Handlers
- Vercel — deployment (free plan)

**Two auth systems — never mixed:**

| Auth type | Who uses it | How |
|---|---|---|
| Supabase session | Dashboard users (humans) | httpOnly cookie via @supabase/ssr |
| API key (`X-API-Key`) | Developers calling the image API | SHA-256 hash stored in Supabase |

---

## Quick Start

Requires: Node.js 20+ and a Supabase project.

```bash
git clone https://github.com/atifmanzoorali/pixshift.git
cd pixshift/web

npm install

cp .env.example .env.local
# Edit .env.local — fill in your Supabase URL and keys (see Environment Variables below)

npm run dev
```

App runs at: **http://localhost:3000**

---

## Environment Variables

`web/.env.local` (never committed — copy from `.env.example`):

```env
# Supabase — get from: supabase.com/dashboard/project/YOUR_REF/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only — it bypasses Row Level Security for API key verification. Never expose it to the client or add a `NEXT_PUBLIC_` prefix.

---

## API Reference

All endpoints require an API key in the `X-API-Key` header. Keys are created from the dashboard after registering.

**Convert format**
```bash
curl -X POST https://your-domain.com/api/v1/convert \
  -H "X-API-Key: pxs_live_your_key_here" \
  -F "file=@image.png" \
  -F "target_format=webp" \
  --output result.webp
```

**Compress**
```bash
curl -X POST https://your-domain.com/api/v1/compress \
  -H "X-API-Key: pxs_live_your_key_here" \
  -F "file=@image.jpg" \
  -F "quality=75" \
  --output compressed.jpg
```

**Resize**
```bash
curl -X POST https://your-domain.com/api/v1/resize \
  -H "X-API-Key: pxs_live_your_key_here" \
  -F "file=@image.png" \
  -F "width=800" \
  -F "height=600" \
  --output resized.png
```

**Limits:** 4MB max file size. Supported input: JPEG, PNG, WebP, AVIF, GIF. MIME type verified from file bytes — file extension is ignored.

See [docs/api-contracts.md](docs/api-contracts.md) for full endpoint documentation.

---

## npm Scripts

| Script | What it does |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm test` | Run all Vitest tests |
| `npm run typecheck` | TypeScript check with no emit |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run db:types` | Regenerate TypeScript types from Supabase schema |

---

## Design Decisions

**Why a single Next.js app instead of a separate API?** Sharp runs in Node.js, which is the same runtime Next.js uses. Keeping everything in one app removes a service boundary, eliminates CORS, and deploys as a single unit on Vercel. No Docker, no Python, no Redis.

**Why Supabase?** Handles authentication, PostgreSQL, and Row Level Security. Session management via `@supabase/ssr` keeps tokens in httpOnly cookies — not localStorage — and middleware refreshes them on every request. The database can be migrated off Supabase if needed; the schema is portable SQL.

**Why hash-only key storage?** This is how Stripe and GitHub store API keys. If the database is compromised, an attacker gets SHA-256 hashes, not usable credentials. The raw key is shown once at creation and never stored anywhere.

**Why two auth systems?** Supabase sessions are for the dashboard (humans logging in interactively). API keys are for developers calling the image endpoints from their code. Mixing them creates bad trade-offs in both directions: sessions are short-lived, API keys are long-lived by design.

See [docs/decisions.md](docs/decisions.md) for the full decision log.

---

## Database Schema

Three tables, all with Row Level Security enabled. Users can only read and write their own rows.

```sql
profiles       -- created automatically on signup (trigger on auth.users)
api_keys       -- created from the dashboard, SHA-256 hash stored, raw key never persisted
usage_logs     -- one row per image API call, linked to api_key_id and user_id
```

Run `npm run db:types` after any schema change to regenerate TypeScript types.
