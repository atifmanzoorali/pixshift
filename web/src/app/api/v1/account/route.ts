import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database.types';
import type { ApiResponse } from '@/types/api.types';

function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function DELETE(): Promise<NextResponse<ApiResponse<{ message: string }>>> {
  const supabase = createServerClient();
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

  const admin = createAdminClient();

  // Delete in FK-safe order
  await admin.from('usage_logs').delete().eq('user_id', user.id);
  await admin.from('api_keys').delete().eq('user_id', user.id);
  await admin.from('profiles').delete().eq('id', user.id);

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to delete account', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: { message: 'Account deleted' } });
}
