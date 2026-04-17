'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          if (!isLoginPage) router.push('/admin/login');
        }
      } catch (err: any) {
        setError(err.message || 'Authentication error');
        setUser(null);
        if (!isLoginPage) router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (isLoginPage) router.push('/admin');
      } else {
        setUser(null);
        if (!isLoginPage) router.push('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [isLoginPage, router]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/admin/login');
  }, [router]);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/login`,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    logout,
    resetPassword,
  };
}
