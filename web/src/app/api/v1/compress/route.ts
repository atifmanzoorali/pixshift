import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { keysService } from '@/services/keys.service';
import { imageService } from '@/services/image.service';
import { detectFormat, MAX_FILE_SIZE_BYTES } from '@/lib/image';
import type { Database } from '@/types/database.types';
import type { ApiResponse } from '@/types/api.types';

const compressSchema = z.object({
  quality: z.coerce.number().int().min(1).max(100),
});

function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function logUsage(params: {
  apiKeyId: string;
  userId: string;
  sourceFormat: string;
  fileSizeBytes: number;
  durationMs: number;
  status: 'success' | 'error';
}): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from('usage_logs').insert({
    api_key_id: params.apiKeyId,
    user_id: params.userId,
    operation: 'compress',
    source_format: params.sourceFormat,
    target_format: null,
    file_size_bytes: params.fileSizeBytes,
    duration_ms: params.durationMs,
    status: params.status,
  });
}

export async function POST(request: Request): Promise<Response> {
  const rawKey = request.headers.get('x-api-key');
  if (!rawKey) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: { message: 'API key required', code: 'UNAUTHORIZED' } },
      { status: 401 }
    );
  }

  const apiKey = await keysService.verifyKey(rawKey);
  if (!apiKey) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: { message: 'Invalid or revoked API key', code: 'UNAUTHORIZED' } },
      { status: 401 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: { message: 'Request must be multipart/form-data', code: 'VALIDATION_ERROR' },
      },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: { message: 'file field is required', code: 'VALIDATION_ERROR' } },
      { status: 400 }
    );
  }

  const parsed = compressSchema.safeParse({ quality: formData.get('quality') });
  if (!parsed.success) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          message: 'quality must be an integer between 1 and 100',
          code: 'VALIDATION_ERROR',
        },
      },
      { status: 400 }
    );
  }

  const { quality } = parsed.data;

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: { message: 'File exceeds the 4MB limit', code: 'FILE_TOO_LARGE' } },
      { status: 413 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectFormat(buffer);
  if (!detected) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          message: 'Unsupported file type. Accepted: JPEG, PNG, WebP, AVIF, GIF',
          code: 'UNSUPPORTED_MEDIA_TYPE',
        },
      },
      { status: 415 }
    );
  }

  try {
    const { output, durationMs } = await imageService.compress(buffer, detected.format, quality);

    await logUsage({
      apiKeyId: apiKey.id,
      userId: apiKey.user_id,
      sourceFormat: detected.format,
      fileSizeBytes: file.size,
      durationMs,
      status: 'success',
    });

    return new Response(new Uint8Array(output), {
      headers: { 'Content-Type': detected.mime },
    });
  } catch {
    await logUsage({
      apiKeyId: apiKey.id,
      userId: apiKey.user_id,
      sourceFormat: detected.format,
      fileSizeBytes: file.size,
      durationMs: 0,
      status: 'error',
    });

    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: { message: 'Image compression failed', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}
