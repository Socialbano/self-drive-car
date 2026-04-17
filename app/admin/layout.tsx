'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Normalize: treat both /admin/login and /admin/login/ as login page
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setIsAuthenticated(true);
          if (isLoginPage) router.push('/admin');
        } else {
          setIsAuthenticated(false);
          if (!isLoginPage) router.push('/admin/login');
        }
      } catch {
        // Supabase not configured or network error
        setIsAuthenticated(false);
        if (!isLoginPage) router.push('/admin/login');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        if (isLoginPage) router.push('/admin');
      } else {
        setIsAuthenticated(false);
        if (!isLoginPage) router.push('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [isLoginPage, router]);

  // Still loading auth state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  // Login page — render without sidebar
  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // Not authenticated and not on login — will redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500 text-sm font-medium">Redirecting to login...</span>
      </div>
    );
  }

  // Authenticated admin area
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto pt-16 lg:pt-8">
        {children}
      </div>
    </div>
  );
}
