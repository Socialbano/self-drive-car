'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useSettings } from '@/components/SettingsProvider';

export default function AdminLogin() {
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();

  // Split brand name dynamically
  let firstName = 'Car';
  let lastName = 'Rental';
  const trimmedName = (settings?.name || '').trim();
  if (trimmedName) {
    const nameParts = trimmedName.split(/\s+/);
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login')) {
          setError('Invalid email or password. Please try again.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please verify your email before signing in.');
        } else {
          setError(authError.message);
        }
        setLoading(false);
      } else {
        router.push('/admin');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError('');

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/login`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setResetSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A] via-[#0B1F3A] to-[#071428] z-0" />
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#E89B10] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#1152d4] rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            {firstName}<span className="text-[#E89B10]">{lastName}</span>
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mt-2">Admin Console</p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-100">
          {showForgotPassword ? (
            /* Forgot Password View */
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#E89B10]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[#E89B10] text-2xl">lock_reset</span>
                </div>
                <h2 className="text-xl font-bold text-[#0B1F3A]">Reset Password</h2>
                <p className="text-sm text-gray-500 mt-1">Enter your email to receive a reset link</p>
              </div>

              {resetSent ? (
                <div className="text-center">
                  <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-200 mb-6">
                    <span className="material-symbols-outlined text-lg align-middle mr-1">check_circle</span>
                    Password reset link sent to <strong>{email}</strong>. Check your inbox.
                  </div>
                  <button
                    onClick={() => { setShowForgotPassword(false); setResetSent(false); }}
                    className="text-sm font-semibold text-[#1152d4] hover:text-[#E89B10] transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-200">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1152d4] focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#E89B10] text-white font-bold text-sm hover:bg-[#d08c0e] transition-colors shadow-lg shadow-[#E89B10]/20 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(false); setError(''); }}
                    className="w-full text-sm font-semibold text-gray-500 hover:text-[#0B1F3A] transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                </form>
              )}
            </>
          ) : (
            /* Login View */
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A]/5 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[#0B1F3A] text-2xl">admin_panel_settings</span>
                </div>
                <h2 className="text-xl font-bold text-[#0B1F3A]">Welcome Back</h2>
                <p className="text-sm text-gray-500 mt-1">Sign in to manage your fleet and leads</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-200 mb-4">
                  <span className="material-symbols-outlined text-sm align-middle mr-1">error</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1152d4] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1152d4] focus:border-transparent transition-all"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#E89B10] focus:ring-[#E89B10] w-4 h-4"
                    />
                    <span className="text-sm text-gray-500">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(true); setError(''); }}
                    className="text-sm font-semibold text-[#1152d4] hover:text-[#E89B10] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#0B1F3A] text-white font-bold text-sm hover:bg-[#0B1F3A]/90 transition-colors shadow-lg disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          {settings?.name || 'Car Rental'} Admin Console · Self Drive Car Rental, {settings?.city || 'Indore'}
        </p>
      </div>
    </div>
  );
}
