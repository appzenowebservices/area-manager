'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, LockKeyhole } from 'lucide-react';

/**
 * Landing page for the single-use set-password link e-mailed to an area
 * manager after approval. The token is verified by this app's auth service.
 */
export default function SetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Read the token client-side (avoids a useSearchParams Suspense boundary).
    const value =
      new URLSearchParams(window.location.search).get('token') || '';
    setToken(value);
    if (!value) {
      setError(
        'This password setup link is missing its token. Please request a new link.',
      );
    }
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Password and confirm password do not match.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/public/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword: confirm }),
      });
      const result = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (!res.ok || !result.ok) {
        setError(result.message || 'Could not set the password. Please try again.');
        return;
      }
      setDone(true);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4">
      <div className="bg-background-section w-full max-w-md rounded-3xl border-2 border-primary/25 p-8 shadow-[12px_12px_0px_rgba(0,0,0,0.08)]">
        <div className="mb-6 flex items-center gap-3">
          <span className="bg-primary inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/25">
            <LockKeyhole size={22} />
          </span>
          <div>
            <h1 className="text-primary-text text-xl font-black tracking-tight">
              Set your password
            </h1>
            <p className="text-secondary-text text-sm font-medium">
              Apni Desi Dukaan — Area Manager account
            </p>
          </div>
        </div>

        {done ? (
          <div className="text-center">
            <CheckCircle2 size={44} className="text-success mx-auto" />
            <h2 className="text-primary-text mt-3 text-lg font-black">
              Password set successfully
            </h2>
            <p className="text-secondary-text mt-1 text-sm">
              You can now sign in to the area manager portal with your new
              password.
            </p>
            <Link
              href="/auth"
              className="bg-primary hover:bg-primary-muted mt-6 inline-block w-full rounded-2xl px-6 py-3 text-center font-bold text-white transition-colors"
            >
              Go to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            {error ? (
              <div className="border-error/30 bg-error/10 text-error mb-4 flex items-start gap-2 rounded-2xl border-2 p-3 text-sm font-semibold">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                htmlFor="password"
                className="text-secondary-text mb-1.5 block text-sm font-bold"
              >
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                placeholder="At least 8 characters"
                className="border-borderFocus/40 bg-background-section text-primary-text focus:border-borderFocus w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-primary/15"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirm"
                className="text-secondary-text mb-1.5 block text-sm font-bold"
              >
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                placeholder="Re-enter the password"
                className="border-borderFocus/40 bg-background-section text-primary-text focus:border-borderFocus w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-primary/15"
              />
            </div>

            <button
              type="submit"
              disabled={busy || !token}
              className="bg-primary hover:bg-primary-muted w-full rounded-2xl px-6 py-3 font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Set password'}
            </button>

            <p className="text-text-muted mt-4 text-center text-xs font-medium">
              This link is valid for 30 minutes and can be used only once. Need
              a new one? Ask support at support@apnidesidukaan.com.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
