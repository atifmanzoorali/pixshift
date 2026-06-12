import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard';
import { DocsSections } from '@/components/docs/DocsSections';
import { buildDocsData } from '@/lib/docs-data';
import { createClient } from '@/lib/supabase/server';
import { keysService } from '@/services/keys.service';

interface ActiveKeyInfo {
  id: string;
  name: string;
  keyPrefix: string;
}

export default async function DashboardDocsPage(): Promise<JSX.Element> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let activeKeys: ActiveKeyInfo[] = [];
  if (user) {
    const { keys } = await keysService.listKeys(user.id);
    activeKeys = keys
      .filter((k) => k.is_active)
      .map((k) => ({ id: k.id, name: k.name, keyPrefix: k.key_prefix }));
  }

  const data = await buildDocsData();

  return (
    <DashboardShell title="API Docs">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Active keys banner */}
        {activeKeys.length > 0 ? (
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-5 py-4">
            <div className="flex items-start gap-3">
              <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="mb-2 text-sm font-medium text-neutral-200">Your active API keys</p>
                <p className="mb-3 text-xs text-neutral-400">
                  Replace{' '}
                  <code className="rounded bg-neutral-800 px-1 py-0.5 text-accent">
                    YOUR_API_KEY
                  </code>{' '}
                  in the examples below with one of these keys.
                </p>
                <ul className="space-y-1.5">
                  {activeKeys.map((k) => (
                    <li key={k.id} className="flex items-center gap-3">
                      <code className="rounded border border-neutral-700 bg-neutral-800 px-2 py-0.5 font-mono text-xs text-neutral-300">
                        {k.keyPrefix}…
                      </code>
                      <span className="text-xs text-neutral-500">{k.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 rounded-lg border border-dashed border-neutral-700 px-5 py-4">
            <div className="flex items-center gap-3">
              <KeyRound className="h-4 w-4 shrink-0 text-neutral-500" />
              <p className="text-sm text-neutral-400">
                No active API keys. Create one to start using the API.
              </p>
            </div>
            <Link
              href="/dashboard/keys"
              className="shrink-0 text-xs font-medium text-primary transition-colors hover:text-accent"
            >
              Create key →
            </Link>
          </div>
        )}

        {/* Full docs */}
        <DocsSections data={data} />
      </div>
    </DashboardShell>
  );
}
