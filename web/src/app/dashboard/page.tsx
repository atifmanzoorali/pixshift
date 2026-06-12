'use client';

import { DashboardShell } from '@/components/dashboard';
import { useUsage } from '@/hooks/useUsage';
import { formatBytes, formatDate } from '@/lib/utils';
import type { UsageLog } from '@/services/usage.service';

function StatCard({ label, value }: { label: string; value: string | number }): JSX.Element {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <p className="mb-1 text-xs text-neutral-500">{label}</p>
      <p className="text-2xl font-semibold text-neutral-100">{value}</p>
    </div>
  );
}

function OperationCard({ label, value }: { label: string; value: number }): JSX.Element {
  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
      <span className="text-sm capitalize text-neutral-400">{label}</span>
      <span className="text-sm font-medium text-neutral-100">{value}</span>
    </div>
  );
}

function SkeletonCard(): JSX.Element {
  return (
    <div className="animate-pulse space-y-2 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <div className="h-3 w-20 rounded bg-neutral-800" />
      <div className="h-7 w-14 rounded bg-neutral-800" />
    </div>
  );
}

function StatusBadge({ status }: { status: string }): JSX.Element {
  return status === 'success' ? (
    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
      Success
    </span>
  ) : (
    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
      Error
    </span>
  );
}

function formatOperation(log: UsageLog): string {
  if (log.operation === 'convert' && log.target_format) {
    return `${log.source_format} → ${log.target_format}`;
  }
  return log.source_format;
}

export default function DashboardPage(): JSX.Element {
  const { summary, logs, loading, error, refresh } = useUsage();

  const successRate =
    summary && summary.totalCalls > 0
      ? `${Math.round((summary.successfulCalls / summary.totalCalls) * 100)}%`
      : '—';

  return (
    <DashboardShell title="Overview">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Summary stat cards */}
        <div>
          <h2 className="mb-3 text-sm font-medium text-neutral-400">All time</h2>
          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard label="Total Calls" value={summary?.totalCalls ?? 0} />
              <StatCard label="Successful" value={summary?.successfulCalls ?? 0} />
              <StatCard label="Failed" value={summary?.failedCalls ?? 0} />
              <StatCard label="Success Rate" value={successRate} />
            </div>
          )}
        </div>

        {/* By operation */}
        <div>
          <h2 className="mb-3 text-sm font-medium text-neutral-400">By operation</h2>
          {loading ? (
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3"
                >
                  <div className="h-3 w-16 rounded bg-neutral-800" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <OperationCard label="Convert" value={summary?.callsByOperation.convert ?? 0} />
              <OperationCard label="Compress" value={summary?.callsByOperation.compress ?? 0} />
              <OperationCard label="Resize" value={summary?.callsByOperation.resize ?? 0} />
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="mb-3 text-sm font-medium text-neutral-400">Recent activity</h2>

          {error && (
            <div className="flex items-center justify-between rounded-lg border border-red-900/50 bg-red-950/20 p-4">
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={refresh}
                className="text-sm text-neutral-400 transition-colors hover:text-neutral-200"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && logs.length === 0 && (
            <div className="rounded-lg border border-dashed border-neutral-800 p-10 text-center">
              <p className="text-sm text-neutral-500">No API calls yet.</p>
              <p className="mt-1 text-sm text-neutral-600">
                Activity will appear here once you start using the API.
              </p>
            </div>
          )}

          {(loading || logs.length > 0) && (
            <div className="overflow-hidden rounded-lg border border-neutral-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900/50">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500">
                      Operation
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500">
                      Format
                    </th>
                    <th className="hidden px-4 py-2.5 text-left text-xs font-medium text-neutral-500 md:table-cell">
                      File size
                    </th>
                    <th className="hidden px-4 py-2.5 text-left text-xs font-medium text-neutral-500 md:table-cell">
                      Duration
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-neutral-500">
                      Status
                    </th>
                    <th className="hidden px-4 py-2.5 text-left text-xs font-medium text-neutral-500 lg:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-4 py-3">
                            <div className="h-3 w-16 rounded bg-neutral-800" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-3 w-20 rounded bg-neutral-800" />
                          </td>
                          <td className="hidden px-4 py-3 md:table-cell">
                            <div className="h-3 w-12 rounded bg-neutral-800" />
                          </td>
                          <td className="hidden px-4 py-3 md:table-cell">
                            <div className="h-3 w-10 rounded bg-neutral-800" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-5 w-16 rounded-full bg-neutral-800" />
                          </td>
                          <td className="hidden px-4 py-3 lg:table-cell">
                            <div className="h-3 w-20 rounded bg-neutral-800" />
                          </td>
                        </tr>
                      ))
                    : logs.map((log) => (
                        <tr key={log.id} className="transition-colors hover:bg-neutral-800/30">
                          <td className="px-4 py-3 capitalize text-neutral-300">{log.operation}</td>
                          <td className="px-4 py-3 font-mono text-xs text-neutral-400">
                            {formatOperation(log)}
                          </td>
                          <td className="hidden px-4 py-3 text-neutral-500 md:table-cell">
                            {formatBytes(log.file_size_bytes)}
                          </td>
                          <td className="hidden px-4 py-3 text-neutral-500 md:table-cell">
                            {log.duration_ms}ms
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={log.status} />
                          </td>
                          <td className="hidden px-4 py-3 text-neutral-500 lg:table-cell">
                            {formatDate(log.created_at)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
