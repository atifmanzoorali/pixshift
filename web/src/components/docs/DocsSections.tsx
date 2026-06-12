import { CodeBlock } from './CodeBlock';
import { ErrorTable } from './ErrorTable';
import { EndpointCard } from './EndpointCard';
import { DocsLayout } from './DocsLayout';
import {
  CONVERT_PARAMS,
  COMPRESS_PARAMS,
  RESIZE_PARAMS,
  CONVERT_ERRORS,
  COMPRESS_ERRORS,
  RESIZE_ERRORS,
  ALL_ERRORS,
  type DocsData,
} from './docs-content';

interface DocsSectionsProps {
  data: DocsData;
}

export function DocsSections({ data }: DocsSectionsProps): JSX.Element {
  return (
    <DocsLayout>
      {/* ── Quick Start ───────────────────────────────────────── */}
      <section id="quick-start" className="scroll-mt-24 space-y-6">
        <h2 className="font-display text-2xl font-bold text-neutral-50">Quick Start</h2>
        <p className="leading-relaxed text-neutral-400">
          Get your first API call working in under 5 minutes.
        </p>
        <ol className="list-none space-y-4">
          {[
            <>
              <span className="font-medium text-neutral-200">Register</span> at{' '}
              <a href="/register" className="text-accent hover:underline">
                pixshift.com/register
              </a>
            </>,
            <>
              Log in → go to{' '}
              <a href="/dashboard/keys" className="text-accent hover:underline">
                API Keys
              </a>{' '}
              → create a key →{' '}
              <span className="font-medium text-neutral-200">copy it immediately</span>. It is shown
              once only.
            </>,
            <>Make your first call — convert a PNG to WebP:</>,
            <>
              Check your usage at{' '}
              <a href="/dashboard" className="text-accent hover:underline">
                the dashboard
              </a>
              .
            </>,
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/20 text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span className="pt-0.5 leading-relaxed text-neutral-300">{item}</span>
            </li>
          ))}
        </ol>
        <CodeBlock html={data.quickStart.html} code={data.quickStart.code} />
      </section>

      {/* ── Overview ─────────────────────────────────────────── */}
      <section id="overview" className="scroll-mt-24 space-y-6">
        <h2 className="font-display text-2xl font-bold text-neutral-50">Overview</h2>
        <p className="leading-relaxed text-neutral-400">
          The PixShift API converts, compresses, and resizes images via simple HTTP requests. Send a
          file, get a file back. No SDKs required.
        </p>
        <div className="overflow-hidden rounded-lg border border-neutral-800">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-neutral-800">
              {[
                ['Base URL', 'https://pixshift.com/api/v1'],
                ['Current version', 'v1 — included in the URL path'],
                ['Request format', 'multipart/form-data for all image endpoints'],
                ['Success response', '{ "success": true, "data": { … } }'],
                [
                  'Error response',
                  '{ "success": false, "error": { "message": "…", "code": "…" } }',
                ],
                ['Image response', 'Binary image body with Content-Type header — not JSON'],
              ].map(([label, value]) => (
                <tr key={label} className="bg-neutral-900/40">
                  <td className="w-40 shrink-0 px-4 py-3 text-xs font-medium text-neutral-500">
                    {label}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-300">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-neutral-500">
          Breaking changes will increment the version to{' '}
          <code className="text-neutral-400">v2</code>. The{' '}
          <code className="text-neutral-400">v1</code> endpoint will remain available with advance
          notice before any deprecation.
        </p>
      </section>

      {/* ── Authentication ───────────────────────────────────── */}
      <section id="authentication" className="scroll-mt-24 space-y-6">
        <h2 className="font-display text-2xl font-bold text-neutral-50">Authentication</h2>
        <p className="leading-relaxed text-neutral-400">
          Image endpoints use API key authentication. Create a key in{' '}
          <a href="/dashboard/keys" className="text-accent hover:underline">
            your dashboard
          </a>
          , then include it in every request:
        </p>
        <CodeBlock html={data.authHeader.html} code={data.authHeader.code} />
        <div className="space-y-3 text-sm leading-relaxed text-neutral-400">
          <p>
            <span className="font-medium text-neutral-200">Key format:</span>{' '}
            <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-accent">
              pxs_live_
            </code>{' '}
            prefix followed by 32 random hex characters.
          </p>
          <p>
            <span className="font-medium text-neutral-200">Security rules:</span> Store the key in
            an environment variable, never in source code. The raw key is shown once at creation —
            if lost, revoke it and create a new one. If a key is compromised, revoke it immediately
            from the dashboard.
          </p>
        </div>
      </section>

      {/* ── Limits ───────────────────────────────────────────── */}
      <section id="limits" className="scroll-mt-24 space-y-6">
        <h2 className="font-display text-2xl font-bold text-neutral-50">Limits</h2>
        <div className="overflow-hidden rounded-lg border border-neutral-800">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-neutral-800">
              {[
                ['Max file size', '4 MB'],
                ['Accepted input formats', 'JPEG, PNG, WebP, AVIF, GIF'],
                ['Accepted output formats', 'JPEG, PNG, WebP, AVIF'],
                ['GIF as output', 'Not supported — GIF can only be used as input'],
              ].map(([label, value]) => (
                <tr key={label} className="bg-neutral-900/40">
                  <td className="w-52 shrink-0 px-4 py-3 text-xs font-medium text-neutral-500">
                    {label}
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-300">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-relaxed text-neutral-500">
          Format is detected from the file&apos;s content (magic bytes), not the file extension.
          Renaming a JPEG to <code className="text-neutral-400">.png</code> will not change how it
          is processed.
        </p>
      </section>

      {/* ── Convert ──────────────────────────────────────────── */}
      <EndpointCard
        sectionId="endpoint-convert"
        method="POST"
        path="/api/v1/convert"
        description="Convert an image from one format to another. Supports JPEG, PNG, WebP, AVIF, and GIF as input; JPEG, PNG, WebP, and AVIF as output."
        auth="X-API-Key header"
        parameters={CONVERT_PARAMS}
        responseNote="Binary image. Content-Type is set to the target format's MIME type."
        mimeNote="png → image/png · jpg → image/jpeg · webp → image/webp · avif → image/avif"
        examples={data.convert}
        errors={CONVERT_ERRORS}
      />

      {/* ── Compress ─────────────────────────────────────────── */}
      <EndpointCard
        sectionId="endpoint-compress"
        method="POST"
        path="/api/v1/compress"
        description="Compress an image to reduce file size. Output stays in the same format as the input — only file size changes, not the format."
        auth="X-API-Key header"
        parameters={COMPRESS_PARAMS}
        responseNote="Binary image in the same format as the input. Content-Type matches the input MIME type."
        examples={data.compress}
        errors={COMPRESS_ERRORS}
      />

      {/* ── Resize ───────────────────────────────────────────── */}
      <EndpointCard
        sectionId="endpoint-resize"
        method="POST"
        path="/api/v1/resize"
        description="Resize an image to specific dimensions. Output stays in the same format as the input."
        auth="X-API-Key header"
        parameters={RESIZE_PARAMS}
        showDefault
        aspectRatioNote="When keep_aspect_ratio is true (the default), the image is scaled to fit within the specified box without distortion. Example: a 1000×500 image resized to 400×400 produces 400×200 — width fills the box, height scales proportionally. When false, the image is stretched to exactly the requested dimensions."
        responseNote="Binary image in the same format as the input. Content-Type matches the input MIME type."
        examples={data.resize}
        errors={RESIZE_ERRORS}
      />

      {/* ── Error Reference ──────────────────────────────────── */}
      <section id="errors" className="scroll-mt-24 space-y-6">
        <h2 className="font-display text-2xl font-bold text-neutral-50">Error Reference</h2>
        <p className="leading-relaxed text-neutral-400">
          Every error response shares the same shape, regardless of which endpoint returned it.
        </p>
        <CodeBlock html={data.errorShape.html} code={data.errorShape.code} />
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-4 py-1">
          <ErrorTable errors={ALL_ERRORS} />
        </div>
      </section>

      {/* ── Common Mistakes ──────────────────────────────────── */}
      <section id="common-mistakes" className="scroll-mt-24 space-y-6">
        <h2 className="font-display text-2xl font-bold text-neutral-50">Common Mistakes</h2>
        <ol className="list-none space-y-5">
          {[
            {
              title: 'Setting Content-Type manually',
              body: (
                <>
                  Do not set the{' '}
                  <code className="rounded bg-neutral-800 px-1 py-0.5 text-xs text-accent">
                    Content-Type
                  </code>{' '}
                  header yourself when sending{' '}
                  <code className="rounded bg-neutral-800 px-1 py-0.5 text-xs text-neutral-400">
                    multipart/form-data
                  </code>
                  . The browser and{' '}
                  <code className="rounded bg-neutral-800 px-1 py-0.5 text-xs text-neutral-400">
                    fetch
                  </code>{' '}
                  set it automatically with the required{' '}
                  <code className="rounded bg-neutral-800 px-1 py-0.5 text-xs text-neutral-400">
                    boundary
                  </code>{' '}
                  value. Setting it manually breaks the request.
                </>
              ),
            },
            {
              title: 'Parsing the response as JSON',
              body: (
                <>
                  Image endpoints return a binary image body, not JSON. Read the response with{' '}
                  <code className="rounded bg-neutral-800 px-1 py-0.5 text-xs text-neutral-400">
                    .blob()
                  </code>{' '}
                  in JavaScript or{' '}
                  <code className="rounded bg-neutral-800 px-1 py-0.5 text-xs text-neutral-400">
                    res.content
                  </code>{' '}
                  in Python — not{' '}
                  <code className="rounded bg-neutral-800 px-1 py-0.5 text-xs text-neutral-400">
                    .json()
                  </code>
                  .
                </>
              ),
            },
            {
              title: 'Trusting the file extension',
              body: "The API detects format from the file's bytes, not the name. A file called image.png that contains JPEG data is treated as JPEG.",
            },
            {
              title: 'Losing the API key',
              body: 'The raw key is shown once, at creation. If it is not saved immediately, it cannot be recovered. Revoke it and create a new one.',
            },
          ].map(({ title, body }, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-xs font-bold text-neutral-400">
                {i + 1}
              </span>
              <div>
                <p className="mb-1 font-medium text-neutral-200">{title}</p>
                <p className="text-sm leading-relaxed text-neutral-400">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </DocsLayout>
  );
}
