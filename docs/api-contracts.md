# API Contracts — PixShift

All endpoints are under `/api/v1/`. Every response uses the standard shape:

**Success:** `{ "success": true, "data": { ... } }`
**Error:** `{ "success": false, "error": { "message": "...", "code": "..." } }`

---

## Auth Endpoints

### POST /api/v1/auth/register

Create a new user account.

**Auth:** None

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "minimum8chars",
  "name": "Atif"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "token_type": "bearer"
  }
}
```

**Errors:** `409 CONFLICT` (email already registered), `400 VALIDATION_ERROR`

---

### POST /api/v1/auth/login

Authenticate and receive a JWT.

**Auth:** None

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "..."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "token_type": "bearer"
  }
}
```

**Errors:** `401 UNAUTHORIZED` (wrong credentials)

---

### GET /api/v1/auth/me

Get the current user's profile.

**Auth:** `Authorization: Bearer <jwt_token>`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Atif",
    "created_at": "2026-06-11T00:00:00Z"
  }
}
```

**Errors:** `401 UNAUTHORIZED`

---

## API Key Endpoints

### POST /api/v1/keys

Create a new API key. The raw key is returned once only.

**Auth:** `Authorization: Bearer <jwt_token>`

**Request body:**
```json
{
  "name": "Production"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Production",
    "key": "pxs_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "message": "Store this key — it will not be shown again."
  }
}
```

**Errors:** `401 UNAUTHORIZED`, `400 VALIDATION_ERROR`

---

### GET /api/v1/keys

List all API keys for the current user. Raw keys are never returned here.

**Auth:** `Authorization: Bearer <jwt_token>`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Production",
      "prefix": "pxs_live_xK9m",
      "is_active": true,
      "created_at": "2026-06-11T00:00:00Z",
      "last_used_at": "2026-06-11T12:00:00Z"
    }
  ]
}
```

---

### DELETE /api/v1/keys/{key_id}

Revoke an API key. This cannot be undone.

**Auth:** `Authorization: Bearer <jwt_token>`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "message": "Key revoked."
  }
}
```

**Errors:** `401 UNAUTHORIZED`, `404 NOT_FOUND`, `403 FORBIDDEN` (key belongs to another user)

---

## Image Conversion Endpoints

### POST /api/v1/convert

Convert an image to a different format.

**Auth:** `X-API-Key: pxs_live_xxxxxx`

**Request:** `multipart/form-data`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| file | File | Yes | Max 10MB |
| target_format | string | Yes | One of: png, jpg, webp, avif |

**Response 200:** Binary image file with correct `Content-Type` header.

**Errors:** `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `413 FILE_TOO_LARGE`, `415 UNSUPPORTED_MEDIA_TYPE`, `429 RATE_LIMITED`

---

### POST /api/v1/compress

Compress an image with quality control.

**Auth:** `X-API-Key: pxs_live_xxxxxx`

**Request:** `multipart/form-data`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| file | File | Yes | Max 10MB |
| quality | integer | Yes | 1–100 |

**Response 200:** Binary compressed image.

**Errors:** `400 VALIDATION_ERROR` (quality out of range), `401 UNAUTHORIZED`, `413 FILE_TOO_LARGE`, `429 RATE_LIMITED`

---

### POST /api/v1/resize

Resize an image with optional aspect ratio lock.

**Auth:** `X-API-Key: pxs_live_xxxxxx`

**Request:** `multipart/form-data`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| file | File | Yes | Max 10MB |
| width | integer | Yes | 1–5000 |
| height | integer | Yes | 1–5000 |
| keep_aspect_ratio | boolean | No | Default: true |

**Response 200:** Binary resized image.

**Errors:** `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `413 FILE_TOO_LARGE`, `429 RATE_LIMITED`

---

## Usage & Health

### GET /api/v1/usage

Get usage stats. Accepts either auth method.

**Auth:** `X-API-Key` (developer) OR `Authorization: Bearer` (dashboard)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "calls_today": 12,
    "calls_this_month": 87,
    "rate_limit_per_hour": 100,
    "calls_this_hour": 5
  }
}
```

---

### GET /api/v1/health

Health check. No auth required.

**Response 200:**
```json
{
  "status": "ok",
  "db": "connected",
  "version": "1.0.0"
}
```
