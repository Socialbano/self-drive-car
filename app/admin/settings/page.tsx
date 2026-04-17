'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminSettingsPage() {
  const router = useRouter();
  
  // State
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI State
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch logged in user email
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      setUserEmail(session.user.email || null);
    };
    fetchUser();
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Front-end Validations
    if (!userEmail) return;
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Verify current password by explicitly signing in via API
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (verifyError) {
        toast.error('Current password is incorrect');
        setLoading(false);
        return;
      }

      // Step 2: Push New Password to Supabase auth record
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        toast.error(`Update failed: ${updateError.message}`);
        setLoading(false);
        return;
      }

      // Step 3: Success sequence
      toast.success('Password updated securely! Re-authenticating...', { duration: 4000 });
      
      // Wipe sensitive fields immediately
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Force user to log in again with new credentials for security bounds
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
      }, 1500);

    } catch (err: any) {
      toast.error("A network error occurred.");
    } finally {
      if(!newPassword) setLoading(false); // only disable loader if not redirecting
    }
  };

  if (!userEmail) return null; // Wait for auth check

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight flex items-center gap-3">
          <LockKeyhole size={28} className="text-[#E89B10]" />
          Security Preferences
        </h1>
        <p className="text-slate-500 mt-1">Manage your administrative credentials and security tokens.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-[#0B1F3A]">Change Password</h2>
          <p className="text-sm text-gray-500 mt-1">Securely rotate your active login key</p>
        </div>

        <form onSubmit={handlePasswordChange} className="p-8 space-y-6">
          
          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] pr-12 transition-all bg-white"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                title={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E89B10] pr-12 transition-all bg-white"
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 pr-12 transition-all bg-white
                  ${confirmPassword === '' ? 'border-gray-200 focus:ring-[#0B1F3A]' : 
                    confirmPassword === newPassword ? 'border-green-300 focus:ring-green-500 bg-green-50/30' : 
                    'border-red-300 focus:ring-red-500 bg-red-50/30'
                  }`}
                placeholder="Retype new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Visual match feedback cue */}
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">error</span> Passwords do not match
              </p>
            )}
            {confirmPassword && confirmPassword.length >= 6 && confirmPassword === newPassword && (
              <p className="text-green-600 text-xs mt-2 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Passwords match securely
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
              className="w-full bg-[#0B1F3A] text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0B1F3A]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating Cryptography...
                </>
              ) : (
                'Update Admin Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
