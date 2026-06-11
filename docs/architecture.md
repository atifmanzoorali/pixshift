# Architecture — PixShift

## Overview

PixShift is a two-part product in one repository:

| Part | Technology | Purpose |
|------|-----------|---------|
| `/api` | FastAPI + Python | Image conversion API, user auth, API key management |
| `/web` | Next.js + TypeScript | Landing page, user dashboard, API key UI |

They share one PostgreSQL database. They communicate over HTTP.

## How Requests Flow

### Web Dashboard User

```
Browser → Next.js (web) → FastAPI (api) → PostgreSQL
```

1. User visits the landing page, clicks Sign Up
2. Next.js sends `POST /api/v1/auth/register` to FastAPI
3. FastAPI creates a user in PostgreSQL, returns a JWT
4. Next.js stores the JWT in an httpOnly cookie
5. User navigates to the dashboard — Next.js checks for the cookie
6. Dashboard calls `GET /api/v1/keys` with the JWT to load the user's API keys
7. User creates a key → `POST /api/v1/keys` → FastAPI generates key, stores hash, returns raw key once

### Developer Using the API

```
Developer's code → FastAPI (api) → PostgreSQL
```

1. Developer copies their API key from the dashboard
2. Developer calls `POST /api/v1/convert` with `X-API-Key: pxs_live_xxxx`
3. FastAPI hashes the provided key, looks up the hash in the database
4. If found and active: process the image, log the usage, return the result
5. If not found: return 401 Unauthorized

## Database Schema

Three tables. One foreign key chain: `users → api_keys → usage_logs`.

```
users
  id (UUID PK)
  email (unique)
  name
  hashed_password
  created_at, updated_at

api_keys
  id (UUID PK)
  user_id (FK → users.id)
  name
  key_prefix          ← shown in dashboard (e.g. "pxs_live_xK9m")
  hashed_key          ← SHA-256 of the raw key, used for lookup
  is_active           ← false = revoked
  created_at, last_used_at

usage_logs
  id (UUID PK)
  api_key_id (FK → api_keys.id)
  endpoint
  source_format, target_format
  file_size_bytes
  duration_ms
  status_code
  created_at
```

## Layer Responsibilities

### API (FastAPI)

| Layer | Location | Responsibility |
|-------|----------|---------------|
| Routes | `app/api/v1/routes/` | URL definitions, request parsing, call service |
| Services | `app/services/` | Business logic, no HTTP knowledge |
| Models | `app/models/` | SQLAlchemy table definitions |
| Schemas | `app/schemas/` | Pydantic request/response types |
| Core | `app/core/` | Security, rate limiting, exceptions |

### Web (Next.js)

| Layer | Location | Responsibility |
|-------|----------|---------------|
| Pages | `src/app/` | Routing, layout, composing components |
| Components | `src/components/` | UI, no API calls |
| Hooks | `src/hooks/` | State management, calls services |
| Services | `src/services/` | All Axios calls to the API |
| Types | `src/types/` | TypeScript interfaces |

## Security Model

- Passwords: bcrypt hash via passlib
- API keys: SHA-256 hash, raw key never stored
- JWTs: signed with SECRET_KEY, expire after ACCESS_TOKEN_EXPIRE_MINUTES
- Cookies: httpOnly flag prevents JavaScript access (XSS protection)
- MIME validation: reads magic bytes, not filename extension
- Rate limiting: per API key, enforced at the route level
