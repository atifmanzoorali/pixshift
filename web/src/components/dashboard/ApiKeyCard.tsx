'use client';

import { useState } from 'react';
import type { ApiKey } from '@/types/key.types';
import { formatDate } from '@/lib/utils';

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onRevoke: (id: string) => Promise<void>;
}

export function ApiKeyCard({ apiKey, onRevoke }: ApiKeyCardProps): JSX.Element {
  const [confirming, setConfirming] = useState(false);
  const [revoking, setRevoking] = useState(false);

  async function handleRevoke(): Promise<void> {
    setRevoking(true);
    try {
      await onRevoke(apiKey.id);
    } finally {
      setRevoking(false);
      setConfirming(false);
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-neutral-100">{apiKey.name}</span>
          {apiKey.is_active ? (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
              Active
            </span>
          ) : (
            <span className="rounded-full bg-neutral-700/50 px-2 py-0.5 text-xs font-medium text-neutral-500">
              Revoked
            </span>
          )}
        </div>

        <code className="block font-mono text-xs tracking-wide text-neutral-400">
          {apiKey.key_prefix}••••••••••••••••••••
        </code>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
          <span>Created {formatDate(apiKey.created_at)}</span>
          <span>Last used: {apiKey.last_used_at ? formatDate(apiKey.last_used_at) : 'Never'}</span>
        </div>
      </div>

      {apiKey.is_active && (
        <div className="flex shrink-0 items-center gap-3">
          {confirming ? (
            <>
              <button
                onClick={() => setConfirming(false)}
                className="text-xs text-neutral-400 transition-colors hover:text-neutral-200"
                disabled={revoking}
              >
                Cancel
              </button>
              <button
                onClick={handleRevoke}
                disabled={revoking}
                className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
              >
                {revoking ? 'Revoking…' : 'Confirm?'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:border-red-600 hover:text-red-400"
            >
              Revoke
            </button>
          )}
        </div>
      )}
    </div>
  );
}
