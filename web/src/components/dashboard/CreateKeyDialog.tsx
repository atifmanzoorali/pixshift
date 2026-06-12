'use client';

import { useState, useRef, useEffect } from 'react';
import type { CreateApiKeyResponse } from '@/types/key.types';

interface CreateKeyDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<CreateApiKeyResponse>;
}

type DialogState = 'idle' | 'submitting' | 'revealed';

export function CreateKeyDialog({
  open,
  onClose,
  onCreate,
}: CreateKeyDialogProps): JSX.Element | null {
  const [state, setState] = useState<DialogState>('idle');
  const [name, setName] = useState('');
  const [rawKey, setRawKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && state === 'idle') {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, state]);

  function handleClose(): void {
    if (state === 'revealed') return;
    setName('');
    setError(null);
    setState('idle');
    onClose();
  }

  function handleDismiss(): void {
    setName('');
    setRawKey('');
    setError(null);
    setCopied(false);
    setState('idle');
    onClose();
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setError(null);
    setState('submitting');
    try {
      const result = await onCreate(trimmed);
      setRawKey(result.rawKey);
      setState('revealed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create key');
      setState('idle');
    }
  }

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(rawKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
        {state !== 'revealed' ? (
          <>
            <h2 className="mb-1 text-base font-semibold text-neutral-100">Create API Key</h2>
            <p className="mb-5 text-sm text-neutral-400">
              Give your key a name so you can identify it later.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="key-name"
                  className="mb-1.5 block text-xs font-medium text-neutral-300"
                >
                  Key name
                </label>
                <input
                  ref={inputRef}
                  id="key-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  placeholder="e.g. Production, My App"
                  disabled={state === 'submitting'}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition-colors focus:border-neutral-500 disabled:opacity-50"
                />
                {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={state === 'submitting'}
                  className="rounded-lg px-4 py-2 text-sm text-neutral-400 transition-colors hover:text-neutral-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={state === 'submitting' || !name.trim()}
                  className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200 disabled:opacity-40"
                >
                  {state === 'submitting' ? (
                    <>
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-400 border-t-neutral-900" />
                      Creating…
                    </>
                  ) : (
                    'Create key'
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="mb-1 text-base font-semibold text-neutral-100">Save your key</h2>
            <p className="mb-5 text-sm text-neutral-400">
              This is the only time you will see this key. Copy it now — it cannot be recovered.
            </p>

            <div className="mb-5 flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 p-3">
              <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-emerald-400">
                {rawKey}
              </code>
              <button
                onClick={handleCopy}
                className="shrink-0 rounded border border-neutral-700 px-2.5 py-1 text-xs font-medium text-neutral-400 transition-colors hover:border-neutral-500 hover:text-neutral-200"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleDismiss}
                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
              >
                I&apos;ve saved my key — close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
