# Architecture Decisions — PixShift

Every significant technical decision is recorded here with the date and reason.
This file tells the story of why the project is built the way it is.

---

## ADR-001 | 2026-06-11 | Monorepo structure

**Decision:** One repository with two top-level folders: `/api` (FastAPI) and `/web` (Next.js).

**Reason:** Single source of truth for the entire product. Easier to keep API contracts and frontend types in sync. One git history tells the complete story. Simpler for a solo developer.

**Alternatives considered:** Separate repos — rejected because it adds coordination overhead for no benefit at this scale.

---

## ADR-002 | 2026-06-11 | Two separate auth systems

**Decision:** JWT Bearer tokens for dashboard operations (web → API). API Keys in X-API-Key header for image conversion (developer code → API).

**Reason:** These serve fundamentally different use cases. Dashboard users are humans who log in once and work interactively — JWT is the right pattern. Developers integrating the API into code need a static credential they can store in their environment — API keys are the right pattern. Mixing them would force awkward compromises in both directions.

**Alternatives considered:** Single JWT for everything — rejected because JWTs expire and require refresh logic, making them unsuitable as a stable integration credential.

---

## ADR-003 | 2026-06-11 | API key hash-only storage

**Decision:** Raw API key shown once at creation. Only SHA-256 hash stored in the database. Key prefix stored separately for dashboard display.

**Reason:** This is how Stripe and GitHub do it. If the database is compromised, an attacker gets hashes, not usable keys. Engineers reviewing the code will notice this and recognise it as a deliberate security choice.

---

## ADR-004 | 2026-06-11 | Images processed in memory (BytesIO)

**Decision:** All image operations read from BytesIO and write to BytesIO. No temporary files written to disk.

**Reason:** Eliminates an entire class of bugs: temp file cleanup failures, race conditions between concurrent requests, disk space exhaustion. In-memory processing is also faster. Pillow supports BytesIO natively.

---

## ADR-005 | 2026-06-11 | FastAPI + Python for the API

**Decision:** FastAPI with Python, not Node.js.

**Reason:** Pillow is a Python library. Processing images in the same runtime as the API eliminates a service boundary. FastAPI generates OpenAPI docs automatically. The async model handles concurrent image processing requests efficiently.

---

## ADR-006 | 2026-06-11 | Next.js for the web frontend

**Decision:** Next.js 14 with App Router, not a plain React SPA.

**Reason:** Handles both the marketing landing page (needs SEO / server-side rendering) and the dashboard (needs client-side interactivity) in one framework. Single deployment unit. Stronger portfolio signal than a plain SPA. TypeScript is first-class.

---
