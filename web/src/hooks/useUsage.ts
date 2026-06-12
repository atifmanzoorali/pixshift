'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UsageSummary, UsageLog } from '@/services/usage.service';
import type { ApiResponse } from '@/types/api.types';

interface UsageData {
  summary: UsageSummary;
  logs: UsageLog[];
  total: number;
}

interface UseUsageReturn {
  summary: UsageSummary | null;
  logs: UsageLog[];
  total: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface UsageApiResponse {
  logs: { logs: UsageLog[]; total: number };
  summary: UsageSummary;
}

async function fetchUsage(): Promise<UsageData> {
  const res = await fetch('/api/v1/usage?limit=10');
  const body: ApiResponse<UsageApiResponse> = await res.json();
  if (!body.success) throw new Error(body.error.message);
  return {
    summary: body.data.summary,
    logs: body.data.logs.logs,
    total: body.data.logs.total,
  };
}

export function useUsage(): UseUsageReturn {
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsage();
      setSummary(data.summary);
      setLogs(data.logs);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load usage data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { summary, logs, total, loading, error, refresh };
}
