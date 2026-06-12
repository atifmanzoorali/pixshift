'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ApiKey, CreateApiKeyResponse } from '@/types/key.types';
import type { ApiResponse } from '@/types/api.types';

interface UseApiKeysReturn {
  keys: ApiKey[];
  loading: boolean;
  error: string | null;
  createKey: (name: string) => Promise<CreateApiKeyResponse>;
  revokeKey: (keyId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

async function fetchKeys(): Promise<ApiKey[]> {
  const res = await fetch('/api/v1/keys');
  const body: ApiResponse<{ keys: ApiKey[] }> = await res.json();
  if (!body.success) throw new Error(body.error.message);
  return body.data.keys;
}

export function useApiKeys(): UseApiKeysReturn {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchKeys();
      setKeys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createKey = useCallback(
    async (name: string): Promise<CreateApiKeyResponse> => {
      const res = await fetch('/api/v1/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const body: ApiResponse<CreateApiKeyResponse> = await res.json();
      if (!body.success) throw new Error(body.error.message);
      await refresh();
      return body.data;
    },
    [refresh]
  );

  const revokeKey = useCallback(
    async (keyId: string): Promise<void> => {
      const res = await fetch('/api/v1/keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: keyId }),
      });
      const body: ApiResponse<{ id: string }> = await res.json();
      if (!body.success) throw new Error(body.error.message);
      await refresh();
    },
    [refresh]
  );

  return { keys, loading, error, createKey, revokeKey, refresh };
}
