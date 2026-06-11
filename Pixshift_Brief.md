# Project: PixShift — Image Conversion SaaS

**Started:** 2026-06-09
**Updated:** 2026-06-11
**Goal:** A production-grade, publicly available image conversion SaaS. Users register, manage API keys from a dashboard, and use those keys to call a conversion API. The code quality itself is the portfolio piece.
**Status:** Planning
**GitHub:** Public repo — code quality is the pitch, not just the product

---

## Why This Project

Most image conversion APIs charge $84–150/month for what is, at its core, a Pillow operation. The gap is in packaging: a proper web app, user authentication, API key management, rate limiting, versioned endpoints, structured logging, and clean architecture. That packaging is what this project builds.

Secondary goal: prove that a non-engineer can direct AI to produce code that passes scrutiny from established engineers. The GitHub repo is a direct response to the "you must have coding experience" filter — it shows what production-grade looks like, built without a traditional coding background.

No payments in this phase. Ship the technical foundation first.

---

## What It Is

PixShift is a two-part product:

**1. The Web App** — a Next.js frontend that serves as the product interface:
- Landing page explaining the product and its value
- User registration and login (email + password)
- Dashboard where authenticated users manage everything

**2. The API** — a FastAPI Python backend that does the actual image work:
- Accepts API keys issued from the dashboard
- Converts, compresses, and resizes images
- Enforces rate limits and logs every operation

These two parts live in one repository, in two separate folders (`/api` and `/web`).

---

## User Flow

1. User lands on the PixShift landing page
2. User signs up with email + password
3. User is taken to their dashboard
4. From the dashboard, user creates one or more API keys (e.g. one for dev, one for prod)
5. User copies the API key — it is shown once at creation, never again
6. User uses that key in their code to call the image conversion endpoints
7. User can return to the dashboard at any time to see all their keys, revoke a key, or create a new one
8. Dashboard also shows usage stats: calls today, calls this month, rate limit status

---

## What It Does

### Web App (Next.js)
- Landing page: product description, feature list, quick start example, call to action
- Auth pages: Sign Up, Log In, Forgot Password
- Dashboard: API key management, usage overview
- API key management: create key, name it, see when it was created, copy it, revoke it
- Usage view: calls today, calls this month, per-key breakdown

### API (FastAPI)
- Format conversion: PNG → WebP, JPG → PNG, etc.
- Compression: control output quality (1–100)
- Resize: set width × height with optional aspect ratio lock
- Usage endpoint: returns usage data for the authenticated API key

**Supported input formats:** PNG, JPG/JPEG, WebP, AVIF, GIF, BMP, TIFF
**Supported output formats:** PNG, JPG, WebP, AVIF

---

## Tech Stack

Every choice has a reason. No random libraries.

### API Backend

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **FastAPI** | Async, type-safe, auto-generates Swagger/OpenAPI docs, industry standard for Python APIs |
| Image processing | **Pillow** | Native Python, handles all target formats, no third-party cost |
| Database | **PostgreSQL** | Production-appropriate, not SQLite. Shows the project was built to scale |
| ORM | **SQLAlchemy 2.x (async)** | Async-native, widely used, Alembic migrations included |
| Migrations | **Alembic** | Schema versioned properly — not "recreate tables on startup" |
| Validation | **Pydantic v2** | All inputs and outputs typed and validated. No raw dicts |
| Settings | **pydantic-settings** | Config from environment variables with type safety |
| Rate limiting | **SlowAPI** (dev) / **Redis** (prod) | Per-key rate limiting, not global |
| Testing | **Pytest + httpx** | Async test client, proper fixtures |
| Logging | **Python logging + structlog** | Structured JSON logs, not print() statements |

### Web Frontend

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 14 + TypeScript** | Handles landing page + dashboard in one framework. Server-side rendering for SEO. Industry standard for SaaS frontends |
| Styling | **Tailwind CSS** | Fast to build, clean output, no CSS file bloat |
| UI components | **shadcn/ui** | Accessible, unstyled-by-default components — no design lock-in |
| Forms | **React Hook Form + Zod** | Type-safe form validation that matches the API's validation approach |
| HTTP client | **Axios** | Consistent request/response handling across all API calls |
| Auth state | **JWT stored in httpOnly cookie** | Secure, no localStorage token exposure |

### Infrastructure

| Layer | Choice | Why |
|-------|--------|-----|
| Containerization | **Docker + docker-compose** | One command to run the full stack — DB + API + Redis |
| Database | **PostgreSQL** (shared by both parts) | One source of truth |
| Cache / Rate limit store | **Redis** | Per-key rate limiting in production |

---

## Architecture

### Repository Structure

```
pixshift/
├── api/                              ← FastAPI backend (Python)
│   ├── app/
│   │   ├── main.py                   # App factory, middleware, router mounting
│   │   ├── config.py                 # pydantic-settings config
│   │   │
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── router.py         # Mounts all v1 routes
│   │   │       └── routes/
│   │   │           ├── auth.py       # POST /auth/register, POST /auth/login
│   │   │           ├── keys.py       # POST /keys, GET /keys, DELETE /keys/{id}
│   │   │           ├── convert.py    # POST /convert, POST /compress, POST /resize
│   │   │           ├── usage.py      # GET /usage
│   │   │           └── health.py     # GET /health
│   │   │
│   │   ├── core/
│   │   │   ├── security.py           # Password hashing, JWT, API key generation + hashing
│   │   │   ├── rate_limiter.py       # Per-key rate limit logic
│   │   │   └── exceptions.py         # Custom exception classes + global handlers
│   │   │
│   │   ├── models/
│   │   │   ├── user.py               # SQLAlchemy model: User
│   │   │   ├── api_key.py            # SQLAlchemy model: APIKey
│   │   │   └── usage_log.py          # SQLAlchemy model: UsageLog
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py               # Pydantic: RegisterRequest, LoginRequest, TokenResponse
│   │   │   ├── keys.py               # Pydantic: CreateKeyRequest, KeyResponse, KeyListResponse
│   │   │   ├── convert.py            # Pydantic: ConvertResponse, CompressRequest, ResizeRequest
│   │   │   └── usage.py              # Pydantic: UsageResponse
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.py       # Register, login, JWT issuance
│   │   │   ├── key_service.py        # Create, list, revoke API keys
│   │   │   ├── image_service.py      # Convert, compress, resize via Pillow
│   │   │   └── usage_service.py      # Log and query usage per API key
│   │   │
│   │   ├── db/
│   │   │   ├── database.py           # Async engine, session factory, get_db dependency
│   │   │   └── base.py               # SQLAlchemy Base
│   │   │
│   │   └── utils/
│   │       ├── validators.py         # File size check, MIME type check (magic bytes)
│   │       └── file_helpers.py       # In-memory BytesIO handling
│   │
│   ├── tests/
│   │   ├── conftest.py               # Fixtures: test DB, test client, sample images, test user
│   │   ├── test_auth.py              # Register, login, duplicate email, invalid credentials
│   │   ├── test_keys.py              # Create key, list keys, revoke key, unauthorized access
│   │   ├── test_convert.py           # Format conversion, unsupported format, oversized file
│   │   ├── test_compress.py          # Quality bounds, invalid quality value
│   │   └── test_health.py            # Health check, DB connectivity
│   │
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/                 # One file per migration
│   │
│   ├── .env.example
│   ├── requirements.txt
│   └── requirements-dev.txt
│
├── web/                              ← Next.js frontend (TypeScript)
│   ├── src/
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   └── dashboard/
│   │   │       ├── page.tsx          # Dashboard home — usage overview
│   │   │       └── keys/page.tsx     # API key management
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui base components
│   │   │   ├── landing/              # Landing page sections
│   │   │   ├── dashboard/            # Dashboard-specific components
│   │   │   └── shared/               # Used across multiple pages
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.ts       # login(), register(), logout(), getMe()
│   │   │   ├── keys.service.ts       # createKey(), listKeys(), revokeKey()
│   │   │   └── usage.service.ts      # getUsage()
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts            # Auth state, redirect logic
│   │   │   └── useApiKeys.ts         # Key CRUD with loading/error states
│   │   │
│   │   ├── lib/
│   │   │   ├── axios.ts              # Axios instance with base URL + auth interceptor
│   │   │   └── utils.ts              # cn() helper, formatters
│   │   │
│   │   └── types/
│   │       ├── auth.types.ts
│   │       ├── key.types.ts
│   │       └── api.types.ts          # Standard API response shape
│   │
│   ├── public/
│   ├── .env.example
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── docker-compose.yml            # API + Web + PostgreSQL + Redis
│
├── docs/
│   ├── architecture.md               # How the system is structured and why
│   ├── api-contracts.md              # Every API endpoint documented
│   ├── decisions.md                  # ADR log — every major technical decision
│   └── lessons.md                    # Mistake log — bugs fixed outside tests
│
├── .gitignore
└── README.md
```

---

## API Endpoints

All endpoints under `/api/v1/`. Versioned from day one.

### User Authentication (Web App → API)

```
POST /api/v1/auth/register
Body: { "email": "user@example.com", "password": "...", "name": "Atif" }
Response: { "access_token": "...", "token_type": "bearer" }

POST /api/v1/auth/login
Body: { "email": "user@example.com", "password": "..." }
Response: { "access_token": "...", "token_type": "bearer" }

GET /api/v1/auth/me
Header: Authorization: Bearer <jwt_token>
Response: { "id": "...", "email": "...", "name": "..." }
```

### API Key Management (Dashboard → API)

```
POST /api/v1/keys
Header: Authorization: Bearer <jwt_token>
Body: { "name": "Production" }
Response: { "id": "...", "name": "Production", "key": "pxs_live_xxxxxx", "message": "Store this key — it will not be shown again." }

GET /api/v1/keys
Header: Authorization: Bearer <jwt_token>
Response: [ { "id": "...", "name": "Production", "prefix": "pxs_live_xxxx", "created_at": "...", "last_used_at": "..." } ]

DELETE /api/v1/keys/{key_id}
Header: Authorization: Bearer <jwt_token>
Response: { "message": "Key revoked." }
```

### Image Operations (Developer's Code → API)

```
POST /api/v1/convert
Header: X-API-Key: pxs_live_xxxxxxxxxxxxxx
Body: multipart/form-data — file + target_format
Response: converted image file (binary)

POST /api/v1/compress
Header: X-API-Key: pxs_live_xxxxxxxxxxxxxx
Body: multipart/form-data — file + quality (1–100)
Response: compressed image file (binary)

POST /api/v1/resize
Header: X-API-Key: pxs_live_xxxxxxxxxxxxxx
Body: multipart/form-data — file + width + height + keep_aspect_ratio (bool)
Response: resized image file (binary)
```

### Usage & Health

```
GET /api/v1/usage
Header: X-API-Key: pxs_live_xxxxxxxxxxxxxx  (or Bearer JWT for dashboard)
Response: { "calls_today": 12, "calls_this_month": 87, "rate_limit": "100/hour" }

GET /api/v1/health
Response: { "status": "ok", "db": "connected", "version": "1.0.0" }
```

---

## Database Schema

### users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| email | VARCHAR | Unique |
| name | VARCHAR | |
| hashed_password | VARCHAR | bcrypt hash — plain text never stored |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### api_keys
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key → users.id |
| name | VARCHAR | User-defined label (e.g. "Production") |
| key_prefix | VARCHAR | First 12 chars of key — shown in dashboard |
| hashed_key | VARCHAR | SHA-256 hash — used for lookup |
| is_active | BOOLEAN | False = revoked |
| created_at | TIMESTAMP | |
| last_used_at | TIMESTAMP | Updated on every successful API call |

### usage_logs
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| api_key_id | UUID | Foreign key → api_keys.id |
| endpoint | VARCHAR | e.g. "/api/v1/convert" |
| source_format | VARCHAR | |
| target_format | VARCHAR | |
| file_size_bytes | INTEGER | |
| duration_ms | INTEGER | |
| status_code | INTEGER | |
| created_at | TIMESTAMP | |

---

## Two Auth Systems — Clearly Separated

This is an important architectural detail. There are two different authentication mechanisms used for different purposes:

**1. JWT (Bearer token)**
Used by the web dashboard to authenticate the logged-in user.
Issued on login. Sent in the `Authorization: Bearer` header.
Used for: managing API keys, viewing usage, account settings.

**2. API Key (X-API-Key header)**
Used by developers in their code to call the image conversion endpoints.
Issued from the dashboard. Sent in the `X-API-Key` header.
Used for: convert, compress, resize, usage check.

These are never mixed. The dashboard uses JWT. The API uses API keys.

---

## Code Quality Standards

These are the specific things that separate production code from AI slop.

**API (Python/FastAPI)**

1. Type hints on every function signature — mypy runs clean
2. Custom exception hierarchy:
   ```python
   class PixshiftException(Exception): ...
   class InvalidFormatError(PixshiftException): ...
   class FileTooLargeError(PixshiftException): ...
   class RateLimitExceeded(PixshiftException): ...
   class InvalidAPIKeyError(PixshiftException): ...
   class InvalidCredentialsError(PixshiftException): ...
   class KeyNotFoundError(PixshiftException): ...
   ```
3. MIME type validation — reads actual file bytes, not the filename extension
4. Passwords hashed with bcrypt — never stored in plain text
5. API keys never stored in plain text — SHA-256 hash only
6. Images processed in memory — no temp files written to disk
7. Proper HTTP status codes (200, 400, 401, 403, 404, 409, 413, 415, 429, 500)
8. Structured logging on every request
9. All config via pydantic-settings — no scattered os.getenv()
10. Database migrations via Alembic — no create_all() in production

**Web (Next.js/TypeScript)**

1. TypeScript strict mode — no `any` types without justification
2. Every function has explicit return types
3. All API calls go through `/services` — no fetch() calls inside components
4. Auth state managed in one place — not scattered across components
5. No hardcoded URLs — all in environment variables
6. Form validation with Zod — same schema used for type inference and runtime validation
7. Loading and error states handled on every API call — no silent failures

---

## File Size & Format Limits

| Constraint | Value |
|-----------|-------|
| Max file size | 10MB (configurable via env var) |
| Supported input formats | PNG, JPG, JPEG, WebP, AVIF, GIF, BMP, TIFF |
| Supported output formats | PNG, JPG, WebP, AVIF |
| Min quality (compress) | 1 |
| Max quality (compress) | 100 |
| Max dimension (resize) | 5000px |
| Rate limit | 100 calls/hour per API key |

---

## GitHub Strategy

The repo is public from the start. The README is written for two audiences simultaneously: a developer who wants to use the API, and a technical reviewer who wants to evaluate the code.

**README structure:**
1. What it does (one paragraph)
2. Architecture overview (two-part product explained clearly)
3. Quick start (Docker — running in under 5 minutes)
4. API reference (every endpoint, with curl examples)
5. Design decisions (why this stack, why hash-only key storage, why two auth systems)
6. Running tests
7. Environment variables reference

---

## Phase 1 Scope (This Build)

**API (FastAPI)**
- [ ] User registration and login (email + password + JWT)
- [ ] API key creation, listing, and revocation
- [ ] Format conversion (PNG/JPG/WebP/AVIF/GIF/BMP/TIFF)
- [ ] Compression with quality control
- [ ] Resize with aspect ratio option
- [ ] Per-key rate limiting
- [ ] Usage tracking
- [ ] Health check endpoint
- [ ] Full test suite
- [ ] Docker + docker-compose

**Web (Next.js)**
- [ ] Landing page
- [ ] Sign up / Log in pages
- [ ] Dashboard — usage overview
- [ ] API key management page (create, view, copy, revoke)
- [ ] Protected routes — dashboard requires login

**Infrastructure**
- [ ] docker-compose runs the full stack: API + Web + PostgreSQL + Redis
- [ ] Public GitHub repo with full README

**Out of scope (Phase 1):**
- Payments / subscription tiers
- Email verification / password reset
- Batch conversion
- Webhook callbacks
- CDN delivery
- Admin panel

---

## Progress Log
- 2026-06-09: Brief written. Stack decided. Architecture defined.
- 2026-06-11: Brief updated. Full SaaS product scope confirmed. Frontend (Next.js) added. Two-auth-system architecture defined. Repository structure updated.
