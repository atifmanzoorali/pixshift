# Project: PixShift — Image Conversion SaaS

**Started:** 2026-06-09
**Updated:** 2026-06-12
**Goal:** A production-grade, publicly available image conversion SaaS. Users register, manage API keys from a dashboard, and use those keys to call a conversion API. The code quality itself is the portfolio piece.
**Status:** Feature-complete. Pending Vercel deployment.
**GitHub:** https://github.com/atifmanzoorali/pixshift — public repo, code quality is the pitch

---

## Why This Project

Most image conversion APIs charge $84–150/month for what is, at its core, a Sharp operation. The gap is in packaging: a proper web app, user authentication, API key management, versioned endpoints, and clean architecture. That packaging is what this project builds.

Secondary goal: prove that a non-engineer can direct AI to produce code that passes scrutiny from established engineers. The GitHub repo is a direct response to the "you must have coding experience" filter — it shows what production-grade looks like, built without a traditional coding background.

No payments in this phase. Ship the technical foundation first.

---

## What It Is

PixShift is a single Next.js application. It does everything: landing page, authentication, developer dashboard, and image processing API endpoints. There is no separate backend service.

**The Web App** — Next.js 14 App Router serves as both the product interface and the API:
- Landing page explaining the product and its value
- User registration and login (email + password via Supabase)
- Dashboard where authenticated users manage API keys and view usage stats
- API documentation page — accessible both publicly and from inside the dashboard

**The API** — Next.js Route Handlers process images using Sharp:
- Accepts API keys issued from the dashboard
- Converts, compresses, and resizes images in memory
- Logs every operation with format, file size, and duration

Everything lives in one repository, in one folder (`/web`).

---

## User Flow

1. User lands on the PixShift landing page
2. User signs up with email + password (Supabase handles auth)
3. User confirms their email (Supabase sends the confirmation link)
4. User is taken to their dashboard
5. From the dashboard, user creates one or more API keys (e.g. one for dev, one for prod)
6. User copies the raw API key — it is shown once at creation, never again
7. User stores the key in their environment variables
8. User calls image endpoints from their own code using the `X-API-Key` header
9. User returns to the dashboard to see usage stats, create more keys, or revoke existing ones

---

## What It Does

### Web App (Next.js — dashboard + marketing)
- Landing page: product description, feature list, how-it-works, FAQ, call to action
- Auth pages: Sign Up, Log In, Forgot Password (all via Supabase email/password)
- Dashboard overview: total calls, successful calls, failed calls, breakdown by operation, recent activity table
- API key management: create key, name it, see key prefix, revoke it, copy reminder
- Settings page: update display name, change password, delete account
- API docs: full reference — public at `/docs`, with real key prefix shown inside `/dashboard/docs`

### Image API (Next.js Route Handlers — developer-facing)
- Format conversion: JPEG → WebP, PNG → AVIF, etc.
- Compression: control output quality (1–100), keeps source format
- Resize: set width × height, optional aspect ratio lock, caps at 5000px

**Supported input formats:** JPEG, PNG, WebP, AVIF, GIF
**Supported output formats:** JPEG, PNG, WebP, AVIF
**Note:** GIF is accepted as input but cannot be the output format. Format is detected by reading the first 12 bytes of the file — the extension is ignored.

---

## Tech Stack

Every choice has a reason. No random libraries.

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 14 (App Router) + TypeScript** | Single codebase for landing page, dashboard, and API. Server Components + Route Handlers eliminate the need for a separate backend service |
| Styling | **Tailwind CSS** | Fast to build, clean output, no CSS file bloat |
| UI components | **shadcn/ui** | Accessible, unstyled-by-default components — no design lock-in |
| Auth + Database | **Supabase** | Email/password auth with httpOnly cookie session, PostgreSQL, Row Level Security on every table |
| Image processing | **Sharp** | Node.js native bindings, handles all target formats, runs inside Route Handlers — no separate server needed |
| Forms | **React Hook Form + Zod** | Type-safe form validation, same Zod schemas used for type inference and runtime validation |
| Animations | **Framer Motion** | Landing page animations |
| Syntax highlighting | **Shiki** | Server-side code highlighting in the API docs — pre-rendered HTML sent to the client |
| Testing | **Vitest** | Unit tests for all service functions |
| Deployment | **Vercel** | Free plan, native Next.js support |

---

## Architecture

### Repository Structure

```
pixshift/
├── .claude/              ← project rules (CLAUDE.md)
├── web/                  ← the entire application
│   ├── supabase/         ← Supabase CLI config + migrations
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    Landing page
│   │   │   ├── layout.tsx                  Root layout — wraps AuthProvider
│   │   │   ├── globals.css
│   │   │   ├── docs/page.tsx               Public API docs
│   │   │   ├── (auth)/                     Route group — no URL segment
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   ├── auth/callback/route.ts      Supabase email confirmation handler
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx                Usage overview — stat cards + activity table
│   │   │   │   ├── keys/page.tsx           API key management
│   │   │   │   ├── docs/page.tsx           Docs with real key prefix shown
│   │   │   │   └── settings/page.tsx       Profile, password, delete account
│   │   │   └── api/v1/
│   │   │       ├── convert/route.ts        POST — format conversion via Sharp
│   │   │       ├── compress/route.ts       POST — quality compression via Sharp
│   │   │       ├── resize/route.ts         POST — dimension resize via Sharp
│   │   │       ├── keys/route.ts           GET / POST / DELETE — API key management
│   │   │       ├── usage/route.ts          GET — usage stats + recent logs
│   │   │       └── account/route.ts        DELETE — delete account and all data
│   │   │
│   │   ├── components/
│   │   │   ├── landing/                    All landing page sections
│   │   │   ├── dashboard/                  Sidebar, topbar, mobile drawer, shell
│   │   │   ├── docs/                       DocsLayout, DocsSections, EndpointCard, CodeBlock, etc.
│   │   │   └── ui/                         shadcn/ui base components
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts             signUp(), signIn(), signOut(), resetPassword(), updateProfile()
│   │   │   ├── keys.service.ts             createKey(), listKeys(), revokeKey(), verifyKey()
│   │   │   └── usage.service.ts            getLogs(), getSummary()
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.tsx                 AuthProvider + useAuth hook
│   │   │   ├── useApiKeys.ts               keys state, loading, error, createKey(), revokeKey(), refresh()
│   │   │   └── useUsage.ts                 summary, logs, total, loading, error, refresh()
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts               createBrowserClient — for 'use client' files
│   │   │   │   └── server.ts               createServerClient — for Server Components + Route Handlers
│   │   │   ├── image.ts                    Magic byte detector, MAX_FILE_SIZE_BYTES, OUTPUT_MIME map
│   │   │   ├── shiki.ts                    Server-only syntax highlighter helper (Shiki)
│   │   │   ├── docs-data.ts                Builds pre-highlighted code examples for the docs page
│   │   │   └── utils.ts                    cn(), formatBytes(), formatDate()
│   │   │
│   │   ├── middleware.ts                   Supabase session refresh + route protection
│   │   └── types/
│   │       ├── key.types.ts                ApiKey, CreateApiKeyRequest/Response, etc.
│   │       ├── api.types.ts                Standard API response shape
│   │       └── database.types.ts           Auto-generated from Supabase schema
│   │
│   └── public/
│
├── docs/
│   ├── architecture.md
│   ├── api-contracts.md
│   ├── decisions.md
│   └── lessons.md
│
├── DESIGN.md
├── .gitignore
└── README.md
```

**The chain of responsibility — never skip a layer, never merge two layers:**

`Page/Component → Hook → Service → API Route Handler → Supabase / Sharp`

Route Handlers contain no business logic. Services contain no component state. Components make no API calls directly.

---

## API Endpoints

All endpoints under `/api/v1/`. Versioned from day one.

### API Key Management (Dashboard → API — uses Supabase session cookie)

```
POST /api/v1/keys
Body: { "name": "Production" }
Response: { "success": true, "data": { "id": "...", "name": "Production", "key": "pxs_live_...", "key_prefix": "pxs_live_xxxx", "created_at": "..." } }
Note: Raw key is returned once. Never stored. Store it now.

GET /api/v1/keys
Response: { "success": true, "data": [ { "id": "...", "name": "Production", "key_prefix": "pxs_live_xxxx", "is_active": true, "created_at": "...", "last_used_at": "..." } ] }

DELETE /api/v1/keys
Body: { "id": "uuid" }
Response: { "success": true, "data": { "message": "Key revoked." } }
```

### Usage Stats (Dashboard → API — uses Supabase session cookie)

```
GET /api/v1/usage?limit=20&offset=0
Response: {
  "success": true,
  "data": {
    "summary": { "total": 87, "success": 83, "error": 4, "by_operation": { "convert": 40, "compress": 30, "resize": 17 } },
    "logs": [ { "id": "...", "operation": "convert", "source_format": "png", "target_format": "webp", "file_size_bytes": 204800, "duration_ms": 42, "status": "success", "created_at": "..." } ],
    "total": 87
  }
}
```

### Image Operations (Developer's Code → API — uses X-API-Key header)

```
POST /api/v1/convert
Header: X-API-Key: pxs_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Body: multipart/form-data — file (image) + target_format (jpeg|png|webp|avif)
Response: converted image binary (Content-Type set to output format)

POST /api/v1/compress
Header: X-API-Key: pxs_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Body: multipart/form-data — file (image) + quality (1–100)
Response: compressed image binary (same format as input)

POST /api/v1/resize
Header: X-API-Key: pxs_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Body: multipart/form-data — file (image) + width (integer) + height (integer) + keep_aspect_ratio (boolean)
Response: resized image binary (same format as input)
```

### Account Management (Dashboard → API — uses Supabase session cookie)

```
DELETE /api/v1/account
Response: { "success": true, "data": { "message": "Account deleted." } }
Note: Deletes in FK-safe order — usage_logs → api_keys → profiles → auth user
```

### Standard Error Response

Every error in the system returns this exact shape:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable description",
    "code": "MACHINE_READABLE_CODE"
  }
}
```

Standard error codes: `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `FILE_TOO_LARGE` (413), `UNSUPPORTED_MEDIA_TYPE` (415), `RATE_LIMITED` (429), `INTERNAL_ERROR` (500)

---

## Database Schema (Supabase / PostgreSQL)

### profiles
Auto-created by a Supabase trigger when a user registers.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, FK → auth.users |
| email | text | |
| full_name | text | |
| created_at | timestamptz | |

### api_keys

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| user_id | uuid | FK → auth.users |
| name | text | Human label — "Production", "My App" |
| key_hash | text | SHA-256 of the raw key — raw key never stored |
| key_prefix | text | First 12 chars shown in dashboard (e.g. `pxs_live_xxxx`) |
| is_active | boolean | False = revoked |
| created_at | timestamptz | |
| last_used_at | timestamptz | Updated on every successful image API call |

### usage_logs

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| api_key_id | uuid | FK → api_keys |
| user_id | uuid | FK → auth.users |
| operation | text | `'convert'` \| `'compress'` \| `'resize'` |
| source_format | text | `'png'` \| `'jpg'` \| `'webp'` etc. |
| target_format | text | null for compress/resize (format doesn't change) |
| file_size_bytes | integer | |
| duration_ms | integer | |
| status | text | `'success'` \| `'error'` |
| created_at | timestamptz | |

Row Level Security is enabled on all three tables. Users can only read and modify their own rows.

---

## Two Auth Systems — Never Mixed

This is the most important architectural detail. There are two completely separate authentication mechanisms used for different callers.

**1. Supabase Session (httpOnly cookie)**
- Who uses it: the person logged into the PixShift website
- How it works: Supabase sets a session cookie on login. Middleware refreshes it on every request. Route Handlers verify it with `supabase.auth.getUser()`.
- Used for: all dashboard operations — creating/listing/revoking API keys, viewing usage, account settings
- Never used for image processing endpoints

**2. API Key (X-API-Key header)**
- Who uses it: developers calling the image API from their own code
- How it works: raw key generated on creation, shown once, SHA-256 hash stored in Supabase. Incoming key is hashed and looked up in `api_keys` table.
- Format: `pxs_live_` prefix + 32 random hex chars
- Used for: `POST /api/v1/convert`, `POST /api/v1/compress`, `POST /api/v1/resize`
- Never used for dashboard operations

If there is any question about which to use — look at who the caller is. Dashboard UI = Supabase session. Developer's application code = API key.

---

## Code Quality Standards

These are the specific things that separate production code from AI slop.

1. TypeScript strict mode throughout — `tsconfig.json` has `"strict": true`, no `any` types without a comment explaining why
2. Every function has an explicit return type
3. All API calls go through `/services` — no fetch() calls inside components or pages
4. All inputs validated with Zod before processing — bad data returns a clean error, not a server crash
5. MIME type validated by reading the first 12 bytes of the file (magic bytes) — file extension is never trusted
6. API keys: SHA-256 hash stored, raw key never written anywhere after creation
7. Supabase session stored in httpOnly cookie — never localStorage
8. Images processed in memory — no temp files written to disk
9. `SUPABASE_SERVICE_ROLE_KEY` is server-only — no `NEXT_PUBLIC_` prefix, never reaches the browser
10. Standard error response shape on every failure — no raw Supabase errors, no unstructured messages
11. No function longer than 50 lines, no file longer than 300 lines
12. No `console.log` committed — all removed before commits
13. No hardcoded values — constants or environment variables for everything

---

## Image Processing Limits

| Constraint | Value |
|-----------|-------|
| Max file size | 4 MB (Vercel free plan request body limit is 4.5 MB) |
| Supported input formats | JPEG, PNG, WebP, AVIF, GIF |
| Supported output formats | JPEG, PNG, WebP, AVIF |
| Min quality (compress) | 1 |
| Max quality (compress) | 100 |
| Max dimension (resize) | 5000px |

---

## GitHub Strategy

The repo is public from the start. The README is written for two audiences simultaneously: a developer who wants to use the API, and a technical reviewer who wants to evaluate the code.

**README structure:**
1. What it does (one paragraph)
2. Architecture overview (single Next.js app explained clearly)
3. Quick start (register, get a key, first curl call)
4. API reference (every endpoint, with examples)
5. Design decisions (why this stack, why hash-only key storage, why two auth systems)
6. Running tests
7. Environment variables reference

---

## Current Build Status

### Done
- [x] Landing page — all sections, Framer Motion animations
- [x] Auth system — register, login, forgot password, email callback
- [x] Dashboard shell — sidebar, topbar, mobile drawer, route protection via middleware
- [x] Supabase project created — ref: `uvfeqoisjxdmvzxqnpis`
- [x] Database schema — `profiles`, `api_keys`, `usage_logs` tables with RLS
- [x] API key management — create, list, revoke (Route Handler + service + hook + UI)
- [x] Usage tracking — per-call logging, summary stats, recent activity table
- [x] Image endpoints — convert, compress, resize (Sharp, magic bytes validation, usage logging)
- [x] Account deletion — removes all data in FK-safe order
- [x] Settings page — update profile, change password, delete account
- [x] API documentation page — public at `/docs`, personalized version at `/dashboard/docs`
- [x] Sharp installed and working — `sharp` + `@types/sharp`
- [x] All code committed to `feature/supabase-auth` branch

### Next Up
- [ ] Deploy to Vercel + connect Supabase environment variables
- [ ] Merge `feature/supabase-auth` to `main` after deployment confirmed

---

## Phase 2 Scope (Not Yet Started)

- Payments / subscription tiers
- Email verification on password change
- Batch conversion endpoint
- Webhook callbacks
- Rate limiting per API key
- Admin panel

---

## Progress Log
- 2026-06-09: Brief written. Stack decided. Architecture defined (FastAPI + Next.js).
- 2026-06-11: Brief updated. Full SaaS product scope confirmed. Two-auth-system architecture defined.
- 2026-06-12: Brief rewritten to reflect actual implementation. Stack changed from FastAPI/Python to single Next.js 14 app. Sharp replaces Pillow. Supabase replaces standalone PostgreSQL + JWT. Docker/Redis not used. Feature-complete build documented accurately.
