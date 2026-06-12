# API Contracts — PixShift

All endpoints are under `/api/v1/`. Every response uses the standard shape:

**Success:** `{ "success": true, "data": { ... } }`
**Error:** `{ "success": false, "error": { "message": "...", "code": "..." } }`

Authentication is handled by Supabase (email/password via the web app). There are no `/auth/*` API endpoints.

---

## Auth Methods

### Session Auth (dashboard operations)
Used by all `/keys`, `/usage`, and `/account` endpoints. The user must be logged into the PixShift website. The session is stored in an httpOnly cookie and verified server-side via `supabase.auth.getUser()`.

### API Key Auth (image processing)
Used by the image endpoints (`/convert`, `/compress`, `/resize`). Send the key in the request header:
```
X-API-Key: pxs_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
Keys are generated in the dashboard. The raw key is shown once at creation — only a SHA-256 hash is stored.

---

## API Key Endpoints

All three require session auth (logged-in user).

### GET /api/v1/keys

List all API keys for the current user. Includes revoked keys — check `is_active` to filter.

**Auth:** Session

**Response 200:**
```json
{
  "success": true,
  "data": {
    "keys": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "name": "Production",
        "key_hash": "sha256hash",
        "key_prefix": "pxs_live_xK9m",
        "is_active": true,
        "created_at": "2026-06-11T00:00:00Z",
        "last_used_at": "2026-06-11T12:00:00Z"
      }
    ]
  }
}
```

**Errors:** `401 UNAUTHORIZED`

---

### POST /api/v1/keys

Create a new API key. The raw key is returned once only — it cannot be retrieved again.

**Auth:** Session

**Request body:**
```json
{ "name": "Production" }
```

| Field | Type | Constraints |
|---|---|---|
| `name` | string | Required. 1–100 characters. |

**Response 201:**
```json
{
  "success": true,
  "data": {
    "key": {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Production",
      "key_hash": "sha256hash",
      "key_prefix": "pxs_live_xK9m",
      "is_active": true,
      "created_at": "2026-06-11T00:00:00Z",
      "last_used_at": null
    },
    "rawKey": "pxs_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

**Errors:** `401 UNAUTHORIZED`, `400 VALIDATION_ERROR`

---

### DELETE /api/v1/keys

Revoke an API key. This cannot be undone. The key is marked `is_active: false` — it is not deleted from the database.

**Auth:** Session

**Request body:**
```json
{ "id": "uuid" }
```

| Field | Type | Constraints |
|---|---|---|
| `id` | string (UUID) | Required. Must belong to the current user. |

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "uuid" }
}
```

**Errors:** `401 UNAUTHORIZED`, `400 VALIDATION_ERROR` (invalid UUID), `404 NOT_FOUND`, `403 FORBIDDEN`

---

## Image Processing Endpoints

All three require API key auth (`X-API-Key` header). Request body is `multipart/form-data`. Response is a **binary image** — not JSON.

Max file size: **4 MB**
Accepted input formats: JPEG, PNG, WebP, AVIF, GIF (detected from file content, not extension)
Accepted output formats: JPEG, PNG, WebP, AVIF (GIF cannot be an output)

---

### POST /api/v1/convert

Convert an image to a different format.

**Auth:** `X-API-Key` header

**Form fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | Yes | Image to convert. Max 4 MB. |
| `target_format` | string | Yes | One of: `png`, `jpg`, `webp`, `avif` |

**Response 200:** Binary image with `Content-Type` set to the target format's MIME type (e.g. `image/webp`).

**Errors:**

| Code | HTTP | Meaning |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `VALIDATION_ERROR` | 400 | Missing `file`, missing `target_format`, or invalid `target_format` value |
| `FILE_TOO_LARGE` | 413 | File exceeds 4 MB |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | File type not recognised from content |
| `INTERNAL_ERROR` | 500 | Conversion failed |

---

### POST /api/v1/compress

Compress an image. The output stays in the same format as the input.

**Auth:** `X-API-Key` header

**Form fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | Yes | Image to compress. Max 4 MB. |
| `quality` | integer | Yes | `1` (smallest file) to `100` (best quality) |

**Response 200:** Binary image (same format as input) with matching `Content-Type`.

**Errors:**

| Code | HTTP | Meaning |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `VALIDATION_ERROR` | 400 | Missing `file`, missing `quality`, or `quality` not in 1–100 |
| `FILE_TOO_LARGE` | 413 | File exceeds 4 MB |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | File type not recognised from content |
| `INTERNAL_ERROR` | 500 | Compression failed |

---

### POST /api/v1/resize

Resize an image to specific dimensions.

**Auth:** `X-API-Key` header

**Form fields:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `file` | File | Yes | — | Image to resize. Max 4 MB. |
| `width` | integer | Yes | — | Target width in pixels. 1–5000. |
| `height` | integer | Yes | — | Target height in pixels. 1–5000. |
| `keep_aspect_ratio` | `"true"` / `"false"` | No | `"true"` | If `"true"`, image is fit within the box without distortion. |

**Response 200:** Binary image (same format as input) with matching `Content-Type`.

**Errors:**

| Code | HTTP | Meaning |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or invalid API key |
| `VALIDATION_ERROR` | 400 | Missing field or dimension out of 1–5000 range |
| `FILE_TOO_LARGE` | 413 | File exceeds 4 MB |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | File type not recognised from content |
| `INTERNAL_ERROR` | 500 | Resize failed |

---

## Usage Endpoint

### GET /api/v1/usage

Returns paginated usage logs and an aggregate summary for the current user.

**Auth:** Session

**Query parameters:**

| Param | Type | Default | Constraints |
|---|---|---|---|
| `limit` | integer | `50` | Max `100` |
| `offset` | integer | `0` | Min `0` |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "logs": {
      "logs": [
        {
          "id": "uuid",
          "api_key_id": "uuid",
          "user_id": "uuid",
          "operation": "convert",
          "source_format": "png",
          "target_format": "webp",
          "file_size_bytes": 204800,
          "duration_ms": 42,
          "status": "success",
          "created_at": "2026-06-11T12:00:00Z"
        }
      ],
      "total": 87
    },
    "summary": {
      "totalCalls": 87,
      "successfulCalls": 82,
      "failedCalls": 5,
      "callsByOperation": {
        "convert": 40,
        "compress": 30,
        "resize": 17
      }
    }
  }
}
```

**Errors:** `401 UNAUTHORIZED`

---

## Account Endpoint

### DELETE /api/v1/account

Permanently deletes the user's account. Removes usage logs, API keys, profile, and auth record in FK-safe order. This cannot be undone.

**Auth:** Session

**Response 200:**
```json
{
  "success": true,
  "data": { "message": "Account deleted" }
}
```

**Errors:** `401 UNAUTHORIZED`, `500 INTERNAL_ERROR`

---

## Error Code Reference

| Code | HTTP Status | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | A required field is missing or a value is out of range |
| `UNAUTHORIZED` | 401 | No session, no API key, or the key is invalid/revoked |
| `FORBIDDEN` | 403 | Authenticated but not permitted to access this resource |
| `NOT_FOUND` | 404 | The requested resource does not exist |
| `CONFLICT` | 409 | Resource already exists |
| `FILE_TOO_LARGE` | 413 | File exceeds the 4 MB limit |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | File type not accepted |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server-side failure |
