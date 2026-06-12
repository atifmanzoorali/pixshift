import { highlight } from './shiki';
import {
  convertExamples,
  compressExamples,
  resizeExamples,
  AUTH_HEADER,
  ERROR_SHAPE_JSON,
  type CodeExamples,
  type DocsData,
  type ExampleTemplates,
} from '@/components/docs/docs-content';

async function buildCodeExamples(templates: ExampleTemplates, key: string): Promise<CodeExamples> {
  const curlCode = templates.curl(key);
  const jsCode = templates.js(key);
  const pythonCode = templates.python(key);

  const [curlHtml, jsHtml, pythonHtml] = await Promise.all([
    highlight(curlCode, 'bash'),
    highlight(jsCode, 'javascript'),
    highlight(pythonCode, 'python'),
  ]);

  return {
    curl: { html: curlHtml, code: curlCode },
    js: { html: jsHtml, code: jsCode },
    python: { html: pythonHtml, code: pythonCode },
  };
}

export async function buildDocsData(apiKey = 'YOUR_API_KEY'): Promise<DocsData> {
  const quickStartCode = convertExamples.curl(apiKey);

  const [quickStartHtml, authHeaderHtml, errorShapeHtml, convert, compress, resize] =
    await Promise.all([
      highlight(quickStartCode, 'bash'),
      highlight(AUTH_HEADER, 'bash'),
      highlight(ERROR_SHAPE_JSON, 'json'),
      buildCodeExamples(convertExamples, apiKey),
      buildCodeExamples(compressExamples, apiKey),
      buildCodeExamples(resizeExamples, apiKey),
    ]);

  return {
    quickStart: { html: quickStartHtml, code: quickStartCode },
    authHeader: { html: authHeaderHtml, code: AUTH_HEADER },
    errorShape: { html: errorShapeHtml, code: ERROR_SHAPE_JSON },
    convert,
    compress,
    resize,
  };
}
