import crypto from 'crypto';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database.types';
import type {
  ApiKey,
  CreateApiKeyResponse,
  ListApiKeysResponse,
  RevokeApiKeyResponse,
} from '@/types/key.types';

const KEY_HEADER = 'pxs_live_';
const KEY_PREFIX_LENGTH = 12;

function generateRawKey(): string {
  return `${KEY_HEADER}${crypto.randomBytes(16).toString('hex')}`;
}

function hashKey(rawKey: string): string {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}

function createAdminClient() {
  return createSupabaseAdmin<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const keysService = {
  async createKey(userId: string, name: string): Promise<CreateApiKeyResponse> {
    const supabase = createClient();
    const rawKey = generateRawKey();
    const keyHash = hashKey(rawKey);
    const keyPrefix = rawKey.slice(0, KEY_PREFIX_LENGTH);

    const { data, error } = await supabase
      .from('api_keys')
      .insert({ user_id: userId, name, key_hash: keyHash, key_prefix: keyPrefix, is_active: true })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { key: data, rawKey };
  },

  async listKeys(userId: string): Promise<ListApiKeysResponse> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('api_keys')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { keys: data };
  },

  async revokeKey(userId: string, keyId: string): Promise<RevokeApiKeyResponse> {
    const supabase = createClient();

    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', keyId)
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return { id: keyId };
  },

  async verifyKey(rawKey: string): Promise<ApiKey | null> {
    const supabase = createAdminClient();
    const keyHash = hashKey(rawKey);

    const { data, error } = await supabase
      .from('api_keys')
      .select()
      .eq('key_hash', keyHash)
      .eq('is_active', true)
      .single();

    if (error || !data) return null;

    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id);

    return data;
  },
};
