# PixShift — Image Conversion API

A production-grade image conversion SaaS. Register, create API keys from a dashboard, and use those keys to convert, compress, and resize images via a clean REST API.

Built to demonstrate what production-grade code looks like: layered architecture, hash-only key storage, MIME validation, structured logging, Alembic migrations, and a full test suite — not just a working prototype.

---

## What It Does

- **Format conversion** — PNG, JPG, WebP, AVIF, GIF, BMP, TIFF as input; PNG, JPG, WebP, AVIF as output
- **Compression** — quality control from 1–100
- **Resize** — width × height with optional aspect ratio lock
- **API key management** — create multiple keys, name them, revoke them from a dashboard
- **Usage tracking** — see calls today, this month, and this hour per key

---

## Architecture

Two parts. One repository.

```
pixshift/
├── api/     ← FastAPI + Python: the image conversion API
└── web/     ← Next.js + TypeScript: the product UI
```

The web app handles registration, login, and API key management. The API handles image processing. Developers integrate using API keys from the dashboard, not the web JWT.

See [docs/architecture.md](docs/architecture.md) for the full breakdown.

---

## Quick Start (Docker)

Requires: Docker and docker-compose installed.

```bash
git clone https://github.com/atifmanzoorali/pixshift.git
cd pixshift

# Copy environment files
cp api/.env.example api/.env
cp web/.env.example web/.env.local

# Start everything
docker-compose -f docker/docker-compose.yml up --build
```

- Web app: http://localhost:3000
- API: http://localhost:8000
- API docs (Swagger): http://localhost:8000/docs

---

## Running Locally (without Docker)

### API

Requires Python 3.12 and a running PostgreSQL + Redis instance.

```bash
cd api
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt

cp .env.example .env
# Edit .env — fill in DATABASE_URL, REDIS_URL, SECRET_KEY

alembic upgrade head
uvicorn app.main:app --reload
```

### Web

Requires Node.js 20+.

```bash
cd web
npm install

cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL

npm run dev
```

---

## Running Tests

### API tests

```bash
cd api
pytest tests/ -v
pytest tests/ --cov=app --cov-report=term-missing
```

### Web tests

```bash
cd web
npm test
```

---

## API Reference

See [docs/api-contracts.md](docs/api-contracts.md) for full endpoint documentation.

Quick example — convert a PNG to WebP:

```bash
# 1. Register and get an API key from the dashboard at localhost:3000
# 2. Use the key in your API calls:

curl -X POST http://localhost:8000/api/v1/convert \
  -H "X-API-Key: pxs_live_your_key_here" \
  -F "file=@image.png" \
  -F "target_format=webp" \
  --output result.webp
```

---

## Environment Variables

### api/.env

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL async connection string |
| `REDIS_URL` | Yes | — | Redis connection string |
| `SECRET_KEY` | Yes | — | JWT signing secret (generate with `secrets.token_hex(32)`) |
| `ENVIRONMENT` | No | `development` | `development` or `production` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `60` | JWT lifetime |
| `MAX_FILE_SIZE_MB` | No | `10` | Max upload size |
| `RATE_LIMIT_PER_HOUR` | No | `100` | API calls per key per hour |

### web/.env.local

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | URL of the FastAPI backend |

---

## Design Decisions

**Why FastAPI + Python?** Pillow is a Python library. Processing images in the same runtime as the API eliminates a service boundary. FastAPI generates OpenAPI docs automatically and handles async requests efficiently.

**Why Next.js?** Handles the marketing landing page (needs SEO) and the interactive dashboard in one framework. TypeScript first-class. Single deployment unit.

**Why hash-only key storage?** This is how Stripe and GitHub store API keys. If the database is compromised, an attacker gets hashes, not usable credentials. The raw key is shown once at creation and never stored.

**Why two auth systems?** JWT for the dashboard (humans who log in interactively), API keys for the integration (developers who store a credential in their environment). Mixing them would force bad compromises in both directions.

**Why Alembic migrations?** `Base.metadata.create_all()` is fine for prototypes. It is not acceptable for a production codebase because it provides no migration history and cannot safely evolve an existing database. Every schema change in this project is a versioned, reversible migration file.

See [docs/decisions.md](docs/decisions.md) for the full ADR log.

---

## npm Scripts (web/)

| Script | What it does |
|--------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Compile TypeScript, build for production |
| `npm run start` | Run the production build |
| `npm test` | Run all tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run typecheck` | TypeScript check with no emit |

## Python Commands (api/)

| Command | What it does |
|---------|-------------|
| `uvicorn app.main:app --reload` | Start API development server |
| `pytest tests/ -v` | Run all tests |
| `alembic upgrade head` | Apply all pending migrations |
| `alembic revision --autogenerate -m "description"` | Generate a new migration |
| `black app/ tests/` | Format Python code |
| `ruff check app/ tests/` | Lint Python code |
| `mypy app/` | Type check Python code |
