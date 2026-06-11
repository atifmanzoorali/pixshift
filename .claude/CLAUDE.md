# PixShift — Claude Instructions

## What This Project Is

PixShift is a production-grade image conversion SaaS. It is a single Next.js application that does everything: landing page, authentication, a developer dashboard for managing API keys, and image conversion endpoints. Engineers who visit the GitHub repo should not be able to call this AI slop. Code quality is the portfolio piece.

---

## Tech Stack — Locked

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth + Database:** Supabase (email/password auth, PostgreSQL via Supabase, Row Level Security)
- **Image Processing:** Sharp (runs in Next.js Route Handlers — no separate server)
- **Forms:** React Hook Form + Zod
- **Supabase Client:** @supabase/supabase-js + @supabase/ssr
- **Testing:** Vitest
- **Deployment:** Vercel (free plan)

Do NOT introduce new libraries without Atif's explicit approval.
Do NOT upgrade major versions mid-project.
TypeScript is non-negotiable — never write plain JavaScript files.
Python, Docker, Redis, and FastAPI are NOT in this project.

---

## Single Codebase Structure

This is a single Next.js app. Everything lives in `web/`.

Files marked `✓` exist. Files marked `→` are planned but not yet built.

```
pixshift/
├── .claude/              ← project rules (this file)
├── web/                  ← the entire application
│   ├── supabase/         ✓ Supabase CLI config + migrations
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    ✓ Landing page
│   │   │   ├── layout.tsx                  ✓ Root layout — wraps AuthProvider
│   │   │   ├── globals.css                 ✓
│   │   │   ├── (auth)/                     ✓ Route group — no URL segment
│   │   │   │   ├── layout.tsx              ✓ Logo link back to landing page
│   │   │   │   ├── login/page.tsx          ✓
│   │   │   │   ├── register/page.tsx       ✓
│   │   │   │   └── forgot-password/page.tsx ✓
│   │   │   ├── auth/
│   │   │   │   └── callback/route.ts       ✓ Supabase email confirmation handler
│   │   │   ├── dashboard/
│   │   │   │   ├── layout.tsx              ✓ Pass-through (shell is in each page)
│   │   │   │   ├── page.tsx                ✓ Usage overview (stub)
│   │   │   │   ├── keys/page.tsx           ✓ API key management (stub)
│   │   │   │   └── settings/page.tsx       ✓ Settings (stub)
│   │   │   └── api/
│   │   │       └── v1/
│   │   │           ├── convert/route.ts    → POST — format conversion via Sharp
│   │   │           ├── compress/route.ts   → POST — quality compression via Sharp
│   │   │           ├── resize/route.ts     → POST — dimension resize via Sharp
│   │   │           ├── keys/route.ts       → GET / POST / DELETE — API key management
│   │   │           └── usage/route.ts      → GET — usage stats per key
│   │   ├── components/
│   │   │   ├── landing/                    ✓ All landing page sections
│   │   │   ├── dashboard/                  ✓ Sidebar, topbar, mobile drawer, shell
│   │   │   ├── ui/                         → shadcn/ui base components (add as needed)
│   │   │   └── shared/                     → Cross-page components (add as needed)
│   │   ├── services/
│   │   │   ├── auth.service.ts             ✓ signUp(), signIn(), signOut(), resetPassword()
│   │   │   ├── keys.service.ts             → createKey(), listKeys(), revokeKey()
│   │   │   └── usage.service.ts            → getUsage()
│   │   ├── hooks/
│   │   │   ├── useAuth.tsx                 ✓ AuthProvider + useAuth hook
│   │   │   └── useApiKeys.ts               → API key state management
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts               ✓ createBrowserClient — for 'use client' files
│   │   │   │   └── server.ts               ✓ createServerClient — for Server Components + Route Handlers
│   │   │   └── utils.ts                    ✓ cn() helper, formatBytes(), formatDate()
│   │   ├── middleware.ts                    ✓ Supabase session refresh + route protection
│   │   └── types/
│   │       ├── key.types.ts                → API key TypeScript interfaces
│   │       ├── api.types.ts                ✓ Standard API response shape
│   │       └── database.types.ts           ✓ Auto-generated from Supabase schema
│   └── public/
├── docs/
│   ├── architecture.md
│   ├── api-contracts.md
│   ├── decisions.md
│   └── lessons.md
├── DESIGN.md
├── .gitignore
└── README.md
```

**The chain of responsibility — never skip a layer, never merge two layers:**

`Page/Component → Hook → Service → API Route Handler → Supabase / Sharp`

Route Handlers contain no business logic. Services contain no component state. Components contain no API calls.

---

## Two Auth Systems — Never Mix Them

**Supabase Session (for the dashboard user)**
- Who uses it: the person logged into the PixShift website
- How it works: Supabase session is stored in an httpOnly cookie, refreshed by middleware on every request
- Used for: all dashboard operations — creating/listing/revoking API keys, viewing usage
- Verified via: `supabase.auth.getUser()` in Route Handlers that serve the dashboard

**API Key (X-API-Key header — for developers calling the image API)**
- Who uses it: developers who registered on PixShift and want to convert images in their own code
- How it works: generated in the dashboard, shown once, SHA-256 hash stored in Supabase
- Sent as: `X-API-Key: pxs_live_xxxxxxxxxx`
- Used for: `POST /api/v1/convert`, `POST /api/v1/compress`, `POST /api/v1/resize`
- Verified via: hash the incoming key, look it up in `api_keys` table, check `is_active`

If you are ever unsure which auth to use — look at who the caller is. Dashboard UI = Supabase session. Developer's code = API Key.

---

## Supabase Database Schema

### Tables (created via Supabase migrations)

**profiles** — auto-created when a user registers (trigger on auth.users)
- `id` uuid (FK → auth.users)
- `email` text
- `full_name` text
- `created_at` timestamptz

**api_keys** — created from the dashboard, used for image conversion calls
- `id` uuid
- `user_id` uuid (FK → auth.users)
- `name` text — human label ("My App", "Production")
- `key_hash` text — SHA-256 of the raw key — never store raw
- `key_prefix` text — first 12 chars shown in dashboard (e.g. `pxs_live_xxxx`)
- `is_active` boolean
- `created_at` timestamptz
- `last_used_at` timestamptz

**usage_logs** — one row per image API call
- `id` uuid
- `api_key_id` uuid (FK → api_keys)
- `user_id` uuid (FK → auth.users)
- `operation` text — `'convert'` | `'compress'` | `'resize'`
- `source_format` text — `'png'` | `'jpg'` | `'webp'` etc.
- `target_format` text — null for compress/resize
- `file_size_bytes` integer
- `duration_ms` integer
- `status` text — `'success'` | `'error'`
- `created_at` timestamptz

Row Level Security is enabled on all tables. Users can only read their own rows.

---

## Naming Conventions

- Files: `kebab-case` → `auth.service.ts`, `use-auth.ts`
- React components: `PascalCase` → `ApiKeyCard.tsx`
- Functions and variables: `camelCase` → `createApiKey`
- Constants: `UPPER_SNAKE_CASE` → `MAX_FILE_SIZE_BYTES`
- Test files: same name + `.test.ts` → `auth.service.test.ts`
- API routes: always versioned → `/api/v1/keys`, `/api/v1/convert`
- Supabase table names: `snake_case` → `api_keys`, `usage_logs`

---

## TypeScript Rules

- Strict mode enabled — `tsconfig.json` has `"strict": true`
- No `any` types without justification and a comment
- Every function must have an explicit return type
- All shared types live in `src/types/` — never define the same type twice
- API request and response bodies must have typed interfaces
- No API calls inside components or pages — all go through `src/services/`
- No business logic in components — move it to hooks or services

---

## API Response Format — Standard Shape

Every Route Handler returns this exact shape.

**Success:**
```json
{ "success": true, "data": {} }
```

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "Human-readable message",
    "code": "MACHINE_READABLE_CODE"
  }
}
```

Never return raw Supabase errors, raw Sharp errors, or unstructured responses.

### Standard Error Codes

| Code | HTTP Status | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Input failed Zod validation |
| `UNAUTHORIZED` | 401 | No session or invalid API key |
| `FORBIDDEN` | 403 | Authenticated but no permission |
| `NOT_FOUND` | 404 | Resource does not exist |
| `CONFLICT` | 409 | Resource already exists |
| `FILE_TOO_LARGE` | 413 | File exceeds 4MB limit |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | MIME type not allowed |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server bug |

---

## Image Processing Rules (Sharp)

- Max file size: **4MB** — Vercel free plan request body limit is 4.5MB
- Supported input formats: JPEG, PNG, WebP, AVIF, GIF
- Supported output formats: JPEG, PNG, WebP, AVIF
- All processing is in memory — no temp files written to disk
- MIME type validated by reading the first bytes of the file (magic bytes) — never trust the file extension
- Sharp runs inside Next.js Route Handlers at `src/app/api/v1/`

---

## Security — Non-Negotiable

- API keys: raw key shown once at creation, never stored. SHA-256 hash stored in Supabase.
- API key format: `pxs_live_` prefix + 32 random hex chars
- Supabase session: stored in httpOnly cookie by @supabase/ssr — never localStorage
- Middleware always calls `supabase.auth.getUser()` — never `getSession()` (server-verified)
- All form inputs validated with Zod before submission
- `SUPABASE_SERVICE_ROLE_KEY` is server-only — no `NEXT_PUBLIC_` prefix, never sent to the browser
- CORS not needed — same origin (Next.js serves both frontend and API routes)

---

## Supabase Project

- **Project ref:** `uvfeqoisjxdmvzxqnpis`
- **Project URL:** `https://uvfeqoisjxdmvzxqnpis.supabase.co`
- **Dashboard:** `https://supabase.com/dashboard/project/uvfeqoisjxdmvzxqnpis`
- **API keys page:** `https://supabase.com/dashboard/project/uvfeqoisjxdmvzxqnpis/settings/api`

**Tables confirmed in live database:** `profiles` (with trigger on auth.users)
**Tables still to be created:** `api_keys`, `usage_logs`

### Running Schema Changes — Use MCP

Docker is not installed on this machine. Do NOT use `npx supabase db push` or `npx supabase migration new`.

**All schema changes go through the Supabase MCP connector:**

1. Apply SQL directly using the MCP tool `apply_migration`:
   - `project_id`: `uvfeqoisjxdmvzxqnpis`
   - `name`: a short descriptive name (e.g. `create_api_keys_table`)
   - `query`: the SQL to run

2. Verify the change using the MCP tool `list_tables` with `project_id: uvfeqoisjxdmvzxqnpis`.

3. After any schema change, regenerate TypeScript types using the MCP tool `generate_typescript_types`
   with `project_id: uvfeqoisjxdmvzxqnpis`. Write the output to `web/src/types/database.types.ts`.

---

## Environment Variables

`web/.env.local` (never committed):
```
NEXT_PUBLIC_SUPABASE_URL=https://uvfeqoisjxdmvzxqnpis.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (get from dashboard settings/api)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (get from dashboard settings/api)
```

`web/.env.example` (always committed — placeholders only):
```
# Supabase — get from: supabase.com/dashboard/project/YOUR_REF/settings/api
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — use it only in server-side Route Handlers for operations like API key verification. Never on the client.

---

## Testing

- Every service function → unit test with Vitest
- Every Route Handler → integration test (happy path + at least one error case)
- Supabase calls mocked with `vi.mock`
- Tests must pass before declaring any feature complete

---

## Code Quality Rules

1. No function longer than 50 lines — extract helpers
2. No file longer than 300 lines — split into modules
3. No TODO comments committed to main — do it now or log it as a task
4. Every external call has error handling with a typed error response
5. No hardcoded values — use constants or environment variables
6. No `console.log` — remove before committing
7. No direct Supabase calls in components — go through services

---

## Git Branching Strategy

- `main` is always deployable
- All work on feature branches: `feature/user-auth`, `fix/key-creation-bug`
- Merge to main only when: TypeScript compiles clean + feature is complete
- Delete the branch after merging

## Git Commit Conventions

Format: `[Type]: [Short description]`

Types: `Add:` `Fix:` `Update:` `Refactor:` `Test:` `Docs:` `Config:` `Security:`

Example: `Add: API key creation and revocation endpoints`

---

## Definition of Done

A feature is NOT done until all of these are true:
- [ ] It works correctly (tested manually in browser or via curl)
- [ ] Returns the standard API response shape
- [ ] Input validated — bad data returns a clean error, not a server crash
- [ ] No hardcoded values
- [ ] TypeScript compiles with zero errors
- [ ] Follows naming conventions
- [ ] Committed to git from a feature branch

---

## Self-Learning Loop

Read `docs/lessons.md` at the start of every session alongside this file.

Write an entry in `docs/lessons.md` every time:
- A bug is fixed that was not caught by existing tests
- A wrong architectural decision is discovered and corrected
- A library or pattern causes an unexpected problem
- Any mistake takes more than 15 minutes to diagnose

Entry format:
```
## LESSON-[ID] | [DATE] | [Area affected]

**What broke:** one sentence
**Root cause:** exact file, function, reason
**Fix applied:** what changed and where
**Test added:** Yes/No
**Promoted to CLAUDE.md rule:** Yes/No
```

If the same category of mistake happens twice — stop logging it and add a permanent rule to this CLAUDE.md.

---

## Session Start Checklist

At the start of every session, before writing any code:
1. Read `.claude/CLAUDE.md` — the project rules
2. Read `docs/lessons.md` — the mistake history
3. Read `docs/decisions.md` — the architectural decisions

Only then begin work.

---

## Current Build Status

Last updated: 2026-06-11. Update this section whenever a phase is completed.

### Done
- [x] Landing page — all sections, Framer Motion animations
- [x] Auth system — register, login, forgot password, email callback
- [x] Dashboard shell — sidebar, topbar, mobile drawer, route protection via middleware
- [x] Supabase project created and linked — ref: `uvfeqoisjxdmvzxqnpis`
- [x] Database schema — `profiles`, `api_keys`, `usage_logs` tables with RLS

### Next Up (in order)
- [ ] `src/types/key.types.ts` — TypeScript interfaces for API keys
- [ ] `src/services/keys.service.ts` — createKey(), listKeys(), revokeKey()
- [ ] `src/services/usage.service.ts` — getUsage()
- [ ] `src/hooks/useApiKeys.ts` — API key state management
- [ ] `src/app/api/v1/keys/route.ts` — GET / POST / DELETE
- [ ] `src/app/api/v1/usage/route.ts` — GET
- [ ] Dashboard keys page — API key management UI
- [ ] Dashboard overview page — usage stats
- [ ] `src/app/api/v1/convert/route.ts` — Sharp format conversion
- [ ] `src/app/api/v1/compress/route.ts` — Sharp compression
- [ ] `src/app/api/v1/resize/route.ts` — Sharp resize
- [ ] Deploy to Vercel + connect Supabase env vars

---

## What Atif Does Not Want

- Plain JavaScript — TypeScript always
- Spaghetti code — everything has a defined home, use it
- Silent library additions — ask before adding anything new
- "It works on my machine" — if it is not tested, it is not done
- Over-engineering — build what the brief says, nothing more
- Raw errors returned to the client — always use the standard response shape
- Direct commits to main — always use a feature branch
- Repeating the same mistake twice — read lessons.md
- The two auth systems mixed up — Supabase session is for the dashboard, API keys are for image conversion
- Python, Docker, FastAPI, Redis — these are not in this project
