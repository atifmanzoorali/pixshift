'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';

// ─── Profile Section ──────────────────────────────────────────────────────────

function ProfileSection({ name, email }: { name: string; email: string }): JSX.Element {
  const [displayName, setDisplayName] = useState(name);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSave(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (!trimmed) return;
    setSaving(true);
    setMessage(null);
    try {
      await authService.updateProfile(trimmed);
      setMessage({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update profile.',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
      <h2 className="mb-4 text-sm font-semibold text-neutral-100">Profile</h2>
      <form onSubmit={handleSave} className="max-w-sm space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-400">Display name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={100}
            disabled={saving}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition-colors focus:border-neutral-500 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-400">Email</label>
          <p className="py-2 text-sm text-neutral-500">{email}</p>
        </div>
        {message && (
          <p
            className={`text-xs ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={saving || !displayName.trim()}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200 disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </section>
  );
}

// ─── Password Section ─────────────────────────────────────────────────────────

function PasswordSection(): JSX.Element {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSave(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await authService.updatePassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ type: 'success', text: 'Password updated.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update password.',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
      <h2 className="mb-4 text-sm font-semibold text-neutral-100">Password</h2>
      <form onSubmit={handleSave} className="max-w-sm space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-400">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={saving}
            placeholder="Minimum 8 characters"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition-colors focus:border-neutral-500 disabled:opacity-50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-neutral-400">
            Confirm new password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={saving}
            placeholder="Repeat new password"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition-colors focus:border-neutral-500 disabled:opacity-50"
          />
        </div>
        {message && (
          <p
            className={`text-xs ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={saving || !newPassword || !confirmPassword}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200 disabled:opacity-40"
        >
          {saving ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </section>
  );
}

// ─── Danger Zone Section ──────────────────────────────────────────────────────

function DangerZoneSection({ email }: { email: string }): JSX.Element {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [typedEmail, setTypedEmail] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(): Promise<void> {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/account', { method: 'DELETE' });
      const body = await res.json();
      if (!body.success) throw new Error(body.error.message);
      await authService.signOut();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account.');
      setDeleting(false);
    }
  }

  return (
    <section className="rounded-lg border border-red-900/50 bg-neutral-900 p-6">
      <h2 className="mb-1 text-sm font-semibold text-red-400">Danger Zone</h2>
      <p className="mb-4 text-xs text-neutral-500">
        Permanently delete your account, all API keys, and all usage history. This cannot be undone.
      </p>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="rounded-lg border border-red-800 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-950/30"
        >
          Delete account
        </button>
      ) : (
        <div className="max-w-sm space-y-3">
          <p className="text-xs text-neutral-400">
            Type <span className="font-mono text-neutral-200">{email}</span> to confirm.
          </p>
          <input
            type="email"
            value={typedEmail}
            onChange={(e) => setTypedEmail(e.target.value)}
            disabled={deleting}
            placeholder="Your email address"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none transition-colors focus:border-red-800 disabled:opacity-50"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setConfirming(false);
                setTypedEmail('');
                setError(null);
              }}
              disabled={deleting}
              className="text-sm text-neutral-400 transition-colors hover:text-neutral-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting || typedEmail !== email}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-40"
            >
              {deleting ? 'Deleting…' : 'Confirm delete'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage(): JSX.Element {
  const { user } = useAuth();

  const name = (user?.user_metadata?.full_name as string | undefined) ?? '';
  const email = user?.email ?? '';

  return (
    <DashboardShell title="Settings">
      <div className="mx-auto max-w-2xl space-y-6">
        <ProfileSection name={name} email={email} />
        <PasswordSection />
        <DangerZoneSection email={email} />
      </div>
    </DashboardShell>
  );
}
