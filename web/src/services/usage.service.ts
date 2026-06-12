import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/types/database.types';

export type UsageLog = Tables<'usage_logs'>;

export type Operation = 'convert' | 'compress' | 'resize';
export type OperationStatus = 'success' | 'error';

export interface UsageSummary {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  callsByOperation: Record<Operation, number>;
}

export interface GetUsageLogsResponse {
  logs: UsageLog[];
  total: number;
}

const DEFAULT_LIMIT = 50;

export const usageService = {
  async getLogs(userId: string, limit = DEFAULT_LIMIT, offset = 0): Promise<GetUsageLogsResponse> {
    const supabase = createClient();

    const { data, error, count } = await supabase
      .from('usage_logs')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    return { logs: data, total: count ?? 0 };
  },

  async getSummary(userId: string): Promise<UsageSummary> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('usage_logs')
      .select('operation, status')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);

    const summary: UsageSummary = {
      totalCalls: data.length,
      successfulCalls: 0,
      failedCalls: 0,
      callsByOperation: { convert: 0, compress: 0, resize: 0 },
    };

    for (const row of data) {
      if (row.status === 'success') summary.successfulCalls++;
      else summary.failedCalls++;

      const op = row.operation as Operation;
      if (op in summary.callsByOperation) summary.callsByOperation[op]++;
    }

    return summary;
  },
};
