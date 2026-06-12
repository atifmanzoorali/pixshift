# Architecture Decisions — PixShift

Every significant technical decision is recorded here with the date and reason.
This file tells the story of why the project is built the way it is.

---

## ADR-001 | 2026-06-11 | Single Next.js application

**Decision:** One Next.js 14 app handles everything — landing page, auth, dashboard, and image processing API routes.

**Reason:** Eliminates a service boundary entirely. No separate API server to deploy, no CORS to configure, no network hop between frontend and backend. Sharp runs inside Next.js Route Handlers. Single deployment to Vercel. One git history tells the complete story.

**Alternatives considered:** Separate FastAPI + Next.js — rejected because Python/Docker are unnecessary overhead when Sharp handles all image processing natively in Node.js.

---

## ADR-002 | 2026-06-11 | Two separate auth systems

**Decision:** Supabase session (httpOnly cookie) for dashboard operations. API keys in `X-API-Key` header for image conversion routes.

**Reason:** These serve fundamentally different use cases. Dashboard users are humans who log in once and work interactively — Supabase session is the right pattern. Developers integrating the API into their code need a static credential they can store in an environment variable — API keys are the right pattern. Mixing them would force awkward compromises in both directions.

**Alternatives considered:** Single session for everything — rejected because sessions expire and require refresh logic, making them unsuitable as a stable integration credential.

---

## ADR-003 | 2026-06-11 | API key hash-only storage

**Decision:** Raw API key shown once at creation. Only SHA-256 hash stored in the database. Key prefix stored separately for dashboard display.

**Reason:** This is how Stripe and GitHub do it. If the database is compromised, an attacker gets hashes, not usable keys. Engineers reviewing the code will recognise this as a deliberate security choice.

---

## ADR-004 | 2026-06-11 | Images processed in memory via Sharp

**Decision:** All image operations are performed in memory using Sharp. No temporary files written to disk.

**Reason:** Eliminates an entire class of bugs — temp file cleanup failures, race conditions between concurrent requests, disk space exhaustion. In-memory processing is also faster. Sharp supports Buffer input/output natively.

---

## ADR-005 | 2026-06-11 | Supabase for auth and database

**Decision:** Supabase handles both authentication and PostgreSQL storage. Row Level Security enforced on all tables.

**Reason:** Supabase gives email/password auth, a managed Postgres database, and RLS in one service. No need to build auth from scratch or manage a separate database. The `@supabase/ssr` package handles session cookies correctly in Next.js App Router.

---

## ADR-006 | 2026-06-11 | Service layer between Route Handlers and Supabase

**Decision:** Route Handlers never call Supabase directly. All data access goes through `src/services/`.

**Reason:** Route Handlers handle HTTP concerns only — parsing requests, verifying auth, returning responses. Services own business logic and data access. This makes each layer independently testable and keeps the codebase navigable as it grows.

---
