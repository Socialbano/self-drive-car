'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useSettings } from '@/components/SettingsProvider';

const navLinks = [
  { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { name: 'Leads', href: '/admin/leads', icon: 'person_search', showBadge: true },
  { name: 'Fleet / Cars', href: '/admin/cars', icon: 'directions_car' },
  { name: 'Billing / Invoices', href: '/admin/billing', icon: 'receipt_long' },
  { name: 'Agreements', href: '/admin/agreements', icon: 'handshake' },
  { name: 'Location Pages', href: '/admin/locations', icon: 'map' },
  { name: 'Blog Manager', href: '/admin/blog', icon: 'book' },
  { name: 'FAQ Manager', href: '/admin/faq', icon: 'help_center' },
  { name: 'Pricing', href: '/admin/pricing', icon: 'payments' },
  { name: 'Hero Image', href: '/admin/hero', icon: 'wallpaper' },
  { name: 'Instagram Reels', href: '/admin/reels', icon: 'smart_display' },
  { name: 'Marquee Bar', href: '/admin/marquee', icon: 'campaign' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const [newLeadCount, setNewLeadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || 'developer@socialbano.in';
  const isSuperAdmin = userEmail === superAdminEmail;

  useEffect(() => {
    const fetchNewLeads = async () => {
      try {
        const { count } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');
        setNewLeadCount(count || 0);
      } catch {
        setNewLeadCount(0);
      }
    };
    
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUserEmail(session?.user?.email || null);
      } catch (e) {
        console.error('Error fetching user email for sidebar:', e);
      }
    };

    fetchNewLeads();
    fetchUser();
    
    const interval = setInterval(fetchNewLeads, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname?.startsWith(href) ?? false;
  };

  const SidebarContent = () => {
    // Split brand name dynamically
    let firstName = 'Car';
    let lastName = 'Rental';
    const trimmedName = (settings?.name || '').trim();
    if (trimmedName) {
      const nameParts = trimmedName.split(/\s+/);
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    return (
      <>
        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="text-xl font-black tracking-tight text-white uppercase">
            {firstName}<span className="text-[#E89B10]">{lastName}</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1">Admin Console</p>
        </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-white/10 text-[#E89B10] border-l-4 border-[#E89B10] shadow-lg shadow-[#E89B10]/5'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              <span className="flex-1">{link.name}</span>
              {link.showBadge && newLeadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold min-w-[24px] text-center animate-pulse">
                  {newLeadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 pb-4 pt-2 border-t border-white/10 space-y-1">
        <Link
          href="/admin/settings"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive('/admin/settings')
              ? 'bg-white/10 text-[#E89B10] border-l-4 border-[#E89B10]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isSuperAdmin ? 'settings' : 'lock'}
          </span>
          <span className="flex-1">
            {isSuperAdmin ? 'Control Settings' : 'Change Password'}
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 rounded-xl hover:text-red-400 hover:bg-white/5 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Sign Out
        </button>
      </div>
    </>
    );
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#0B1F3A] text-white p-2 rounded-lg shadow-lg"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0B1F3A] flex flex-col shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0B1F3A] min-h-screen flex-col fixed left-0 top-0 bottom-0 z-40 shadow-2xl shadow-[#000615]/50">
        <SidebarContent />
      </aside>
    </>
  );
}
