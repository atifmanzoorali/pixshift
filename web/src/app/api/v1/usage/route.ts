import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  usageService,
  type UsageSummary,
  type GetUsageLogsResponse,
} from '@/services/usage.service';
import type { ApiResponse } from '@/types/api.types';

interface UsageResponse {
  logs: GetUsageLogsResponse;
  summary: UsageSummary;
}

export async function GET(request: Request): Promise<NextResponse<ApiResponse<UsageResponse>>> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { success: false, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100);
  const offset = Math.max(Number(searchParams.get('offset') ?? 0), 0);

  try {
    const [logs, summary] = await Promise.all([
      usageService.getLogs(user.id, limit, offset),
      usageService.getSummary(user.id),
    ]);
    return NextResponse.json({ success: true, data: { logs, summary } });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Failed to retrieve usage data', code: 'INTERNAL_ERROR' },
      },
      { status: 500 }
    );
  }
}
