import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { keysService } from '@/services/keys.service';
import type { ApiResponse } from '@/types/api.types';
import type {
  CreateApiKeyResponse,
  ListApiKeysResponse,
  RevokeApiKeyResponse,
} from '@/types/key.types';

const createKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer'),
});

const revokeKeySchema = z.object({
  id: z.string().uuid('Invalid key ID'),
});

async function getAuthenticatedUser(): Promise<{ id: string; email?: string } | null> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

async function parseBody(request: Request): Promise<{ ok: true; body: unknown } | { ok: false }> {
  try {
    const body = await request.json();
    return { ok: true, body };
  } catch {
    return { ok: false };
  }
}

export async function GET(): Promise<NextResponse<ApiResponse<ListApiKeysResponse>>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
      { status: 401 }
    );
  }

  try {
    const result = await keysService.listKeys(user.id);
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to retrieve API keys', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<CreateApiKeyResponse>>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
      { status: 401 }
    );
  }

  const parsed_body = await parseBody(request);
  if (!parsed_body.ok) {
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Request body must be valid JSON', code: 'VALIDATION_ERROR' },
      },
      { status: 400 }
    );
  }
  const parsed = createKeySchema.safeParse(parsed_body.body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { message: parsed.error.errors[0].message, code: 'VALIDATION_ERROR' },
      },
      { status: 400 }
    );
  }

  try {
    const result = await keysService.createKey(user.id, parsed.data.name);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create API key', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request
): Promise<NextResponse<ApiResponse<RevokeApiKeyResponse>>> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
      { status: 401 }
    );
  }

  const parsed_body = await parseBody(request);
  if (!parsed_body.ok) {
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Request body must be valid JSON', code: 'VALIDATION_ERROR' },
      },
      { status: 400 }
    );
  }
  const parsed = revokeKeySchema.safeParse(parsed_body.body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { message: parsed.error.errors[0].message, code: 'VALIDATION_ERROR' },
      },
      { status: 400 }
    );
  }

  try {
    const result = await keysService.revokeKey(user.id, parsed.data.id);
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to revoke API key', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }
}
