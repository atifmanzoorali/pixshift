'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/dashboard';
import { ApiKeyCard } from '@/components/dashboard/ApiKeyCard';
import { CreateKeyDialog } from '@/components/dashboard/CreateKeyDialog';
import { useApiKeys } from '@/hooks/useApiKeys';
import type { CreateApiKeyResponse } from '@/types/key.types';

function SkeletonRow(): JSX.Element {
  return (
    <div className="animate-pulse space-y-2 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center gap-2">
        <div className="h-4 w-28 rounded bg-neutral-800" />
        <div className="h-4 w-14 rounded-full bg-neutral-800" />
      </div>
      <div className="h-3 w-48 rounded bg-neutral-800" />
      <div className="h-3 w-36 rounded bg-neutral-800" />
    </div>
  );
}

export default function KeysPage(): JSX.Element {
  const { keys, loading, error, createKey, revokeKey, refresh } = useApiKeys();
  const [dialogOpen, setDialogOpen] = useState(false);

  const sorted = keys.filter((k) => k.is_active);

  async function handleCreate(name: string): Promise<CreateApiKeyResponse> {
    return createKey(name);
  }

  return (
    <DashboardShell title="API Keys">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-neutral-100">API Keys</h1>
            <p className="text-sm text-neutral-500">
              Keys authenticate your requests to the PixShift image API.
            </p>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
          >
            Create API Key
          </button>
        </div>

        {loading && (
          <div className="space-y-3">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        )}

        {!loading && error && (
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

        {!loading && !error && sorted.length === 0 && (
          <div className="rounded-lg border border-dashed border-neutral-800 p-10 text-center">
            <p className="text-sm text-neutral-500">No API keys yet.</p>
            <p className="mt-1 text-sm text-neutral-600">Create one to start using the API.</p>
          </div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div className="space-y-3">
            {sorted.map((key) => (
              <ApiKeyCard key={key.id} apiKey={key} onRevoke={revokeKey} />
            ))}
          </div>
        )}
      </div>

      <CreateKeyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
      />
    </DashboardShell>
  );
}
