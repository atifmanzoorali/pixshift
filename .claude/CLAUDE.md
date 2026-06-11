# PixShift — Claude Instructions

## What This Project Is

PixShift is a production-grade image conversion SaaS with two parts: a FastAPI Python backend that converts, compresses, and resizes images via API keys, and a Next.js TypeScript frontend that serves as the product interface — landing page, user registration/login, and a dashboard where users create and manage API keys. Engineers who visit the GitHub repo should not be able to call this AI slop. Code quality is the portfolio piece.

---

## Tech Stack — Locked

- **API Backend:** Python 3.12 + FastAPI + SQLAlchemy 2.x (async) + Alembic + Pydantic v2 + pydantic-settings
- **Image Processing:** Pillow
- **Web Frontend:** Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- **Auth (Web → API):** JWT (Bearer token) — issued on login, used for dashboard operations
- **Auth (Developer → API):** API Keys (X-API-Key header) — issued from dashboard, used for conversion calls
- **Database:** PostgreSQL (shared by both parts)
- **Cache / Rate Limiting:** Redis (SlowAPI in dev, Redis in prod)
- **Forms:** React Hook Form + Zod
- **HTTP Client (Web):** Axios
- **Testing (API):** Pytest + httpx (async)
- **Testing (Web):** Vitest
- **Containerization:** Docker + docker-compose (API + Web + PostgreSQL + Redis)
- **Logging (API):** structlog (structured JSON)

Do NOT introduce new libraries without Atif's explicit approval.
Do NOT upgrade major versions mid-project.
TypeScript is non-negotiable in `/web` — never write plain JavaScript files.
Python type hints are non-negotiable in `/api` — every function must be fully typed.

---

## Repository Structure

This is a monorepo. Two separate codebases, one repository.

```
pixshift/
├── .claude/          ← project rules (this file) + permissions
├── api/              ← FastAPI Python backend
│   ├── app/
│   │   ├── main.py                   # App factory, middleware, router mounting
│   │   ├── config.py                 # pydantic-settings — all config lives here
│   │   ├── api/v1/
│   │   │   ├── router.py             # Mounts all v1 routes
│   │   │   └── routes/
│   │   │       ├── auth.py           # POST /auth/register, POST /auth/login, GET /auth/me
│   │   │       ├── keys.py           # POST /keys, GET /keys, DELETE /keys/{id}
│   │   │       ├── convert.py        # POST /convert, POST /compress, POST /resize
│   │   │       ├── usage.py          # GET /usage
│   │   │       └── health.py         # GET /health
│   │   ├── core/
│   │   │   ├── security.py           # Password hashing, JWT, API key generation + hashing
│   │   │   ├── rate_limiter.py       # Per-key rate limit logic
│   │   │   └── exceptions.py         # Custom exception classes + global handlers
│   │   ├── models/
│   │   │   ├── user.py               # SQLAlchemy: User
│   │   │   ├── api_key.py            # SQLAlchemy: APIKey
│   │   │   └── usage_log.py          # SQLAlchemy: UsageLog
│   │   ├── schemas/
│   │   │   ├── auth.py               # Pydantic: RegisterRequest, LoginRequest, TokenResponse
│   │   │   ├── keys.py               # Pydantic: CreateKeyRequest, KeyResponse, KeyListResponse
│   │   │   ├── convert.py            # Pydantic: ConvertResponse, CompressRequest, ResizeRequest
│   │   │   └── usage.py              # Pydantic: UsageResponse
│   │   ├── services/
│   │   │   ├── auth_service.py       # Register, login, JWT issuance
│   │   │   ├── key_service.py        # Create, list, revoke API keys
│   │   │   ├── image_service.py      # Convert, compress, resize via Pillow
│   │   │   └── usage_service.py      # Log and query usage per API key
│   │   ├── db/
│   │   │   ├── database.py           # Async engine, session factory, get_db dependency
│   │   │   └── base.py               # SQLAlchemy Base for all models
│   │   └── utils/
│   │       ├── validators.py         # MIME type check (magic bytes, not extension)
│   │       └── file_helpers.py       # In-memory BytesIO handling
│   ├── tests/
│   │   ├── conftest.py               # Fixtures: test DB, test client, sample images, test user
│   │   ├── test_auth.py
│   │   ├── test_keys.py
│   │   ├── test_convert.py
│   │   ├── test_compress.py
│   │   └── test_health.py
│   ├── alembic/versions/             # One file per migration — never edit applied migrations
│   ├── .env.example
│   ├── requirements.txt
│   └── requirements-dev.txt
│
├── web/              ← Next.js TypeScript frontend
│   ├── src/
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── layout.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   └── dashboard/
│   │   │       ├── page.tsx          # Usage overview
│   │   │       └── keys/page.tsx     # API key management
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui base components
│   │   │   ├── landing/              # Landing page sections
│   │   │   ├── dashboard/            # Dashboard-specific components
│   │   │   └── shared/               # Used across multiple pages
│   │   ├── services/
│   │   │   ├── auth.service.ts       # login(), register(), logout(), getMe()
│   │   │   ├── keys.service.ts       # createKey(), listKeys(), revokeKey()
│   │   │   └── usage.service.ts      # getUsage()
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useApiKeys.ts
│   │   ├── lib/
│   │   │   ├── axios.ts              # Axios instance + auth interceptor
│   │   │   └── utils.ts              # cn() helper, formatters
│   │   └── types/
│   │       ├── auth.types.ts
│   │       ├── key.types.ts
│   │       └── api.types.ts          # Standard API response shape
│   └── public/
│
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── docker-compose.yml
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

API: `Route → Service → Model/DB`
Web: `Page/Component → Hook → Service → API`

Routes contain no logic. Services contain no HTTP knowledge. Components contain no business logic.

---

## Two Auth Systems — Never Mix Them

This is the most important architectural detail in this project.

**JWT (Bearer token)**
- Used by the web dashboard to authenticate the logged-in user
- Issued on `POST /api/v1/auth/login`
- Sent as `Authorization: Bearer <token>`
- Used for: creating/listing/revoking API keys, viewing account info, usage stats in dashboard

**API Key (X-API-Key header)**
- Used by developers in their code to call the image conversion endpoints
- Created from the dashboard, shown once, never stored in plain text
- Sent as `X-API-Key: pxs_live_xxxxxx`
- Used for: convert, compress, resize, usage check from code

If you are ever unsure which auth system an endpoint uses — look at who the caller is. Dashboard UI = JWT. Developer's code = API Key.

---

## Naming Conventions

### Python (api/)
- Files: `snake_case` → `auth_service.py`, `rate_limiter.py`
- Functions and variables: `snake_case` → `get_user_by_email`
- Classes: `PascalCase` → `UserService`, `APIKeyModel`
- Constants: `UPPER_SNAKE_CASE` → `MAX_FILE_SIZE_MB`
- Database tables: `snake_case` → `api_keys`, `usage_logs`

### TypeScript (web/)
- Files: `kebab-case` → `auth.service.ts`, `use-auth.ts`
- React components: `PascalCase` → `ApiKeyCard.tsx`
- Functions and variables: `camelCase` → `createApiKey`
- Constants: `UPPER_SNAKE_CASE` → `MAX_RETRY_ATTEMPTS`
- Test files: same name + `.test.ts` → `auth.service.test.ts`
- API routes: always versioned → `/api/v1/keys`, `/api/v1/auth/login`

---

## Python Rules (api/)

- Every function must have explicit type hints on all parameters and return type
- No `Any` type without a comment explaining why it cannot be avoided
- No bare `except Exception` — always catch specific exceptions
- No `print()` anywhere — use `structlog`
- No `os.getenv()` scattered through the code — all config through `app/config.py`
- No temp files for image processing — use `BytesIO` in memory only
- No `Base.metadata.create_all()` in production — Alembic migrations only
- Routes do not contain business logic — they call services
- Services do not import from `fastapi` — they are framework-independent
- Custom exceptions only — never raise a plain `Exception`

---

## TypeScript Rules (web/)

- Strict mode enabled — `tsconfig.json` has `"strict": true`
- No `any` types without justification and a comment
- Every function must have an explicit return type
- All shared types live in `/src/types` — never define the same type twice
- API request and response bodies must have typed interfaces
- No `fetch()` calls inside components or pages — all API calls go through `/src/services`
- No business logic in components — move it to `/src/hooks` or `/src/services`

---

## API Response Format — Standard Shape

Every API endpoint returns this exact shape. No exceptions.

**Success:**
```json
{ "success": true, "data": {} }
```

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "MACHINE_READABLE_CODE"
  }
}
```

Never return raw error objects, raw exception messages, or unstructured responses to the client.

---

## Custom Exception Hierarchy (api/)

All exceptions must use this hierarchy. Never raise a plain `Exception`.

```python
class PixshiftException(Exception): ...
class InvalidFormatError(PixshiftException): ...
class FileTooLargeError(PixshiftException): ...
class UnsupportedMimeTypeError(PixshiftException): ...
class RateLimitExceeded(PixshiftException): ...
class InvalidAPIKeyError(PixshiftException): ...
class InvalidCredentialsError(PixshiftException): ...
class UserAlreadyExistsError(PixshiftException): ...
class KeyNotFoundError(PixshiftException): ...
```

Global exception handlers in `main.py` catch these and return proper HTTP responses.

### Standard Error Codes

| Code | HTTP Status | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Input failed validation |
| `UNAUTHORIZED` | 401 | Missing or invalid credentials |
| `FORBIDDEN` | 403 | Authenticated but no permission |
| `NOT_FOUND` | 404 | Resource does not exist |
| `CONFLICT` | 409 | Resource already exists (duplicate email, etc.) |
| `FILE_TOO_LARGE` | 413 | File exceeds size limit |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | MIME type not supported |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server bug |

---

## Security — Non-Negotiable

**API (Python):**
- Passwords hashed with `bcrypt` via `passlib` — plain text never stored, never logged
- API keys hashed with `SHA-256` — raw key shown once at creation, only hash stored
- JWT tokens have expiry — always pass `expires_delta` when creating tokens
- MIME type validation reads actual file bytes (magic bytes) — filename extension is not trusted
- All images processed in memory (`BytesIO`) — no temp files on disk
- CORS configured to only allow the frontend domain — not `*` in production

**Web (TypeScript):**
- JWT stored in `httpOnly` cookie — not `localStorage` (protects against XSS)
- All form inputs validated with Zod before submission
- No secrets in frontend code — everything through environment variables prefixed `NEXT_PUBLIC_`

---

## Environment Variables

Two separate `.env` files — one per part of the monorepo.

`api/.env` (never committed):
```
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/pixshift
REDIS_URL=redis://localhost:6379
SECRET_KEY=
ENVIRONMENT=development
ACCESS_TOKEN_EXPIRE_MINUTES=60
MAX_FILE_SIZE_MB=10
RATE_LIMIT_PER_HOUR=100
```

`web/.env.local` (never committed):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Validation at startup:** On API start, pydantic-settings validates all required env vars. The app crashes immediately with a clear message if any are missing. It must never start silently in a broken state.

---

## Logging (api/)

Never use `print()` in any Python file. Use `structlog` configured in `app/config.py`.

Every request logs: timestamp, endpoint, api_key_prefix (if applicable), file_size, source_format, target_format, duration_ms, status_code.

Errors log the full stack trace in development. In production, stack traces go to the log but never to the HTTP response.

---

## Health Check Endpoint

`GET /api/v1/health` — build this first, before any feature work.

Returns `{ "status": "ok", "db": "connected", "version": "1.0.0" }` with HTTP 200.
Used by Docker healthcheck and hosting platforms to verify the server is alive.

---

## Database Migrations (api/)

Never run `Base.metadata.create_all()` in production. All schema changes go through Alembic:

```bash
cd api
alembic revision --autogenerate -m "description of change"
alembic upgrade head
```

Migration files in `alembic/versions/` are committed to git — they are the complete history of the database schema.
**Never delete or edit a migration file that has already been applied.**

---

## Testing Requirements

**API (Pytest):**
- Every route → integration test (happy path + at least one error case)
- Every utility function → unit test
- Tests use a separate test database — never the development database
- `conftest.py` provides: async test client, test DB session, sample images, test user, valid API key

```python
def test_convert_png_to_webp(client, valid_api_key, sample_png):
    response = client.post(
        "/api/v1/convert",
        headers={"X-API-Key": valid_api_key},
        files={"file": ("test.png", sample_png, "image/png")},
        data={"target_format": "webp"}
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/webp"
    img = Image.open(BytesIO(response.content))
    assert img.format == "WEBP"
```

Tests verify actual output, not just status codes.

**Web (Vitest):**
- Every service function → unit test
- Every API call mocked with `vi.mock`
- Tests must pass before declaring any feature complete

---

## Code Quality Rules

1. No function longer than 50 lines — extract helpers
2. No file longer than 300 lines — split into modules
3. No TODO comments committed to main — do it now or log it as a task
4. Every external API call has error handling with a meaningful error message
5. No hardcoded URLs, port numbers, secrets, or magic numbers — use config or constants
6. No direct database calls outside of services — controllers/routes call services only
7. No `console.log` in web code (use structured logging or remove before commit)
8. No `print()` in Python code (use structlog)

---

## Git Branching Strategy

- `main` is always deployable — never commit directly to main
- All work on feature branches: `feature/user-auth`, `fix/login-bug`, `add/api-key-management`
- Merge to main only when: tests pass + feature is complete
- Delete the branch after merging

## Git Commit Conventions

Format: `[Type]: [Short description]`

Types: `Add:` `Fix:` `Update:` `Refactor:` `Test:` `Docs:` `Config:` `Security:`

Example: `Add: API key creation and revocation endpoints`

---

## Definition of Done

A feature is NOT done until all of these are true:
- [ ] It works correctly (tested manually or via API call)
- [ ] Returns the standard API response shape
- [ ] At least one integration test written and passing
- [ ] Input validated — bad data returns a clean error, not a server crash
- [ ] No hardcoded values
- [ ] TypeScript compiles with zero errors (web) / mypy passes (api)
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

## What Atif Does Not Want

- Plain JavaScript in `/web` — TypeScript always
- Python without type hints — every function fully typed
- Spaghetti code — everything has a defined home, use it
- Silent library additions — ask before adding anything new
- "It works on my machine" — if it is not tested, it is not done
- Over-engineering — build what the brief says, nothing more
- Raw errors returned to the client — always use the standard response shape
- Direct commits to main — always use a feature branch
- Repeating the same mistake twice — read lessons.md
- The two auth systems mixed up — JWT is for the dashboard, API keys are for conversion calls
