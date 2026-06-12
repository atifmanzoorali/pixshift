export interface Parameter {
  field: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
}

export interface ErrorEntry {
  code: string;
  http: number;
  meaning: string;
}

export interface HighlightedExample {
  html: string;
  code: string;
}

export interface CodeExamples {
  curl: HighlightedExample;
  js: HighlightedExample;
  python: HighlightedExample;
}

export interface ExampleTemplates {
  curl: (key: string) => string;
  js: (key: string) => string;
  python: (key: string) => string;
}

export interface DocsData {
  quickStart: HighlightedExample;
  authHeader: HighlightedExample;
  errorShape: HighlightedExample;
  convert: CodeExamples;
  compress: CodeExamples;
  resize: CodeExamples;
}

// ── Static snippets ──────────────────────────────────────────────────────────

export const AUTH_HEADER = 'X-API-Key: pxs_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

export const ERROR_SHAPE_JSON = `{
  "success": false,
  "error": {
    "message": "Human-readable explanation",
    "code": "MACHINE_READABLE_CODE"
  }
}`;

// ── Code example templates ────────────────────────────────────────────────────

export const convertExamples: ExampleTemplates = {
  curl: (key) =>
    `curl -X POST https://pixshift.com/api/v1/convert \\
  -H "X-API-Key: ${key}" \\
  -F "file=@/path/to/image.png" \\
  -F "target_format=webp" \\
  --output converted.webp`,

  js: (key) =>
    `const form = new FormData()
form.append('file', fileInput.files[0])
form.append('target_format', 'webp')

const res = await fetch('https://pixshift.com/api/v1/convert', {
  method: 'POST',
  headers: { 'X-API-Key': '${key}' },
  body: form,
})

if (!res.ok) {
  const err = await res.json()
  throw new Error(err.error.message)
}

const blob = await res.blob()
// blob is the converted image`,

  python: (key) =>
    `import requests

with open('image.png', 'rb') as f:
    res = requests.post(
        'https://pixshift.com/api/v1/convert',
        headers={'X-API-Key': '${key}'},
        files={'file': f},
        data={'target_format': 'webp'},
    )

res.raise_for_status()
with open('converted.webp', 'wb') as out:
    out.write(res.content)`,
};

export const compressExamples: ExampleTemplates = {
  curl: (key) =>
    `curl -X POST https://pixshift.com/api/v1/compress \\
  -H "X-API-Key: ${key}" \\
  -F "file=@/path/to/photo.jpg" \\
  -F "quality=80" \\
  --output compressed.jpg`,

  js: (key) =>
    `const form = new FormData()
form.append('file', fileInput.files[0])
form.append('quality', '80')

const res = await fetch('https://pixshift.com/api/v1/compress', {
  method: 'POST',
  headers: { 'X-API-Key': '${key}' },
  body: form,
})

if (!res.ok) {
  const err = await res.json()
  throw new Error(err.error.message)
}

const blob = await res.blob()`,

  python: (key) =>
    `import requests

with open('photo.jpg', 'rb') as f:
    res = requests.post(
        'https://pixshift.com/api/v1/compress',
        headers={'X-API-Key': '${key}'},
        files={'file': f},
        data={'quality': 80},
    )

res.raise_for_status()
with open('compressed.jpg', 'wb') as out:
    out.write(res.content)`,
};

export const resizeExamples: ExampleTemplates = {
  curl: (key) =>
    `curl -X POST https://pixshift.com/api/v1/resize \\
  -H "X-API-Key: ${key}" \\
  -F "file=@/path/to/image.png" \\
  -F "width=800" \\
  -F "height=600" \\
  -F "keep_aspect_ratio=true" \\
  --output resized.png`,

  js: (key) =>
    `const form = new FormData()
form.append('file', fileInput.files[0])
form.append('width', '800')
form.append('height', '600')
form.append('keep_aspect_ratio', 'true')

const res = await fetch('https://pixshift.com/api/v1/resize', {
  method: 'POST',
  headers: { 'X-API-Key': '${key}' },
  body: form,
})

if (!res.ok) {
  const err = await res.json()
  throw new Error(err.error.message)
}

const blob = await res.blob()`,

  python: (key) =>
    `import requests

with open('image.png', 'rb') as f:
    res = requests.post(
        'https://pixshift.com/api/v1/resize',
        headers={'X-API-Key': '${key}'},
        files={'file': f},
        data={'width': 800, 'height': 600, 'keep_aspect_ratio': 'true'},
    )

res.raise_for_status()
with open('resized.png', 'wb') as out:
    out.write(res.content)`,
};

// ── Endpoint parameter definitions ───────────────────────────────────────────

export const CONVERT_PARAMS: Parameter[] = [
  { field: 'file', type: 'File', required: true, description: 'The image to convert. Max 4 MB.' },
  {
    field: 'target_format',
    type: 'string',
    required: true,
    description: 'Output format. One of: png, jpg, webp, avif.',
  },
];

export const COMPRESS_PARAMS: Parameter[] = [
  { field: 'file', type: 'File', required: true, description: 'The image to compress. Max 4 MB.' },
  {
    field: 'quality',
    type: 'integer',
    required: true,
    description: '1 (smallest file) to 100 (best quality). Recommended: 75–85.',
  },
];

export const RESIZE_PARAMS: Parameter[] = [
  { field: 'file', type: 'File', required: true, description: 'The image to resize. Max 4 MB.' },
  {
    field: 'width',
    type: 'integer',
    required: true,
    description: 'Target width in pixels. Range: 1–5000.',
  },
  {
    field: 'height',
    type: 'integer',
    required: true,
    description: 'Target height in pixels. Range: 1–5000.',
  },
  {
    field: 'keep_aspect_ratio',
    type: '"true" | "false"',
    required: false,
    defaultValue: '"true"',
    description: 'When true, image is fit within the box without distortion.',
  },
];

// ── Error definitions ─────────────────────────────────────────────────────────

export const CONVERT_ERRORS: ErrorEntry[] = [
  { code: 'UNAUTHORIZED', http: 401, meaning: 'Missing or invalid API key' },
  {
    code: 'VALIDATION_ERROR',
    http: 400,
    meaning:
      'file or target_format missing, invalid target_format value, or request is not multipart/form-data',
  },
  { code: 'FILE_TOO_LARGE', http: 413, meaning: 'File exceeds 4 MB' },
  {
    code: 'UNSUPPORTED_MEDIA_TYPE',
    http: 415,
    meaning: 'File content not recognised as a supported format',
  },
  { code: 'INTERNAL_ERROR', http: 500, meaning: 'Conversion failed on the server' },
];

export const COMPRESS_ERRORS: ErrorEntry[] = [
  { code: 'UNAUTHORIZED', http: 401, meaning: 'Missing or invalid API key' },
  {
    code: 'VALIDATION_ERROR',
    http: 400,
    meaning: 'file or quality missing, or quality not in range 1–100',
  },
  { code: 'FILE_TOO_LARGE', http: 413, meaning: 'File exceeds 4 MB' },
  {
    code: 'UNSUPPORTED_MEDIA_TYPE',
    http: 415,
    meaning: 'File content not recognised as a supported format',
  },
  { code: 'INTERNAL_ERROR', http: 500, meaning: 'Compression failed on the server' },
];

export const RESIZE_ERRORS: ErrorEntry[] = [
  { code: 'UNAUTHORIZED', http: 401, meaning: 'Missing or invalid API key' },
  {
    code: 'VALIDATION_ERROR',
    http: 400,
    meaning: 'file, width, or height missing; dimensions outside 1–5000',
  },
  { code: 'FILE_TOO_LARGE', http: 413, meaning: 'File exceeds 4 MB' },
  {
    code: 'UNSUPPORTED_MEDIA_TYPE',
    http: 415,
    meaning: 'File content not recognised as a supported format',
  },
  { code: 'INTERNAL_ERROR', http: 500, meaning: 'Resize failed on the server' },
];

export const ALL_ERRORS: ErrorEntry[] = [
  {
    code: 'VALIDATION_ERROR',
    http: 400,
    meaning:
      'A required field is missing, a value is out of range, or the request body is malformed',
  },
  {
    code: 'UNAUTHORIZED',
    http: 401,
    meaning: 'No API key in the header, or the key is invalid or revoked',
  },
  {
    code: 'FORBIDDEN',
    http: 403,
    meaning: 'Authenticated but not permitted to access this resource',
  },
  { code: 'NOT_FOUND', http: 404, meaning: 'The requested resource does not exist' },
  { code: 'CONFLICT', http: 409, meaning: 'Resource already exists' },
  { code: 'FILE_TOO_LARGE', http: 413, meaning: 'File exceeds the 4 MB limit' },
  {
    code: 'UNSUPPORTED_MEDIA_TYPE',
    http: 415,
    meaning: 'File type not accepted — see Limits section for supported formats',
  },
  {
    code: 'RATE_LIMITED',
    http: 429,
    meaning: 'Reserved for future rate limiting — not currently triggered',
  },
  {
    code: 'INTERNAL_ERROR',
    http: 500,
    meaning: 'Something went wrong on the server — try again or contact support',
  },
];

// ── Sidebar structure ─────────────────────────────────────────────────────────

export interface SidebarSection {
  id: string;
  label: string;
}

export interface SidebarGroup {
  label: string | null;
  sections: SidebarSection[];
}

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    label: null,
    sections: [
      { id: 'quick-start', label: 'Quick Start' },
      { id: 'overview', label: 'Overview' },
      { id: 'authentication', label: 'Authentication' },
      { id: 'limits', label: 'Limits' },
    ],
  },
  {
    label: 'Endpoints',
    sections: [
      { id: 'endpoint-convert', label: 'Convert' },
      { id: 'endpoint-compress', label: 'Compress' },
      { id: 'endpoint-resize', label: 'Resize' },
    ],
  },
  {
    label: 'Reference',
    sections: [
      { id: 'errors', label: 'Error Reference' },
      { id: 'common-mistakes', label: 'Common Mistakes' },
    ],
  },
];

export const SIDEBAR_SECTIONS: SidebarSection[] = SIDEBAR_GROUPS.flatMap((g) => g.sections);
