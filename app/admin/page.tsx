'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { whatsappLink } from '@/lib/constants';
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge';
import { useSettings } from '@/components/SettingsProvider';
import type { Lead } from '@/types';

interface DashboardStats {
  newLeadsToday: number;
  totalLeads: number;
  totalCars: number;
  availableCars: number;
}

export default function AdminDashboard() {
  const { settings } = useSettings();
  const [stats, setStats] = useState<DashboardStats>({ newLeadsToday: 0, totalLeads: 0, totalCars: 0, availableCars: 0 });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      // Total leads
      const { count: totalLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true });

      // New leads today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const { count: newLeadsToday } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')
        .gte('created_at', todayStart.toISOString());

      // Total cars
      const { count: totalCars } = await supabase.from('cars').select('*', { count: 'exact', head: true }).eq('is_active', true);

      // Available cars
      const { count: availableCars } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('is_available', true);

      setStats({
        newLeadsToday: newLeadsToday || 0,
        totalLeads: totalLeads || 0,
        totalCars: totalCars || 0,
        availableCars: availableCars || 0,
      });

      // Recent 5 leads
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentLeads((leads as Lead[]) || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-8 bg-gray-100 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-36" />
          </div>
          <div className="h-10 bg-gray-100 rounded w-24" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-grow">
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-8 bg-gray-100 rounded w-1/3" />
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-xl" />
              </div>
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl" />
              <div className="space-y-2 flex-grow">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between">
            <div className="h-5 bg-gray-100 rounded w-28" />
            <div className="h-4 bg-gray-100 rounded w-16" />
          </div>
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3 flex-grow">
                  <div className="w-9 h-9 bg-gray-100 rounded-full" />
                  <div className="space-y-1.5 flex-grow">
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/6" />
                  </div>
                </div>
                <div className="w-20 h-5 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const statCards = [
    {
      label: 'New Leads Today',
      value: stats.newLeadsToday,
      icon: 'priority_high',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      subtitle: stats.newLeadsToday > 0 ? 'Immediate action required' : 'All caught up!',
      subtitleColor: stats.newLeadsToday > 0 ? 'text-red-500' : 'text-green-600',
    },
    {
      label: 'Total Leads',
      value: stats.totalLeads,
      icon: 'group',
      color: 'text-[#1152d4]',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      subtitle: 'All-time inquiries',
      subtitleColor: 'text-gray-500',
    },
    {
      label: 'Total Cars',
      value: stats.totalCars,
      icon: 'directions_car',
      color: 'text-[#0B1F3A]',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      subtitle: 'Active in fleet',
      subtitleColor: 'text-gray-500',
    },
    {
      label: 'Available Cars',
      value: stats.availableCars,
      icon: 'check_circle',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      subtitle: 'Ready to book',
      subtitleColor: 'text-green-600',
    },
  ];

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
        <div>
          <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">{today}</p>
        </div>
        <button
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#0B1F3A] hover:bg-gray-50 transition-all disabled:opacity-50 self-start"
        >
          <span className={`material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, index) => (
          <div
            key={card.label}
            className={`${card.bgColor} p-6 rounded-2xl border ${card.borderColor} relative overflow-hidden group hover:shadow-lg transition-all duration-300`}
            style={{ animationDelay: `${index * 100}ms`, animation: 'fadeIn 0.5s ease-out forwards' }}
          >
            <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className={`material-symbols-outlined text-5xl ${card.color}`}>{card.icon}</span>
            </div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{card.label}</p>
            <h3 className={`text-4xl font-black mt-2 ${card.color}`}>{card.value}</h3>
            <p className={`text-xs font-medium mt-3 ${card.subtitleColor}`}>{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link
          href="/admin/leads"
          className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 hover:border-[#E89B10] hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E89B10]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#E89B10]">person_search</span>
          </div>
          <div>
            <h4 className="font-bold text-[#0B1F3A] group-hover:text-[#E89B10] transition-colors">Manage Leads</h4>
            <p className="text-xs text-gray-500">View all inquiries</p>
          </div>
        </Link>
        <Link
          href="/admin/cars"
          className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 hover:border-[#1152d4] hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-[#1152d4]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#1152d4]">directions_car</span>
          </div>
          <div>
            <h4 className="font-bold text-[#0B1F3A] group-hover:text-[#1152d4] transition-colors">Manage Fleet</h4>
            <p className="text-xs text-gray-500">Add or edit cars</p>
          </div>
        </Link>
        <Link
          href="/admin/pricing"
          className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-600">payments</span>
          </div>
          <div>
            <h4 className="font-bold text-[#0B1F3A] group-hover:text-green-600 transition-colors">Pricing Control</h4>
            <p className="text-xs text-gray-500">Update rental rates</p>
          </div>
        </Link>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-[#0B1F3A] text-lg">Recent Inquiries</h3>
          <Link href="/admin/leads" className="text-sm font-semibold text-[#1152d4] hover:text-[#E89B10] transition-colors">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Car Interest</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0B1F3A] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {getInitials(lead.name)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2">
                          {lead.name}
                          {lead.status === 'new' && (
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          )}
                        </div>
                        <div className="text-xs text-gray-400">{lead.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#0B1F3A] bg-gray-100 px-3 py-1 rounded-full text-xs">
                      {lead.car_type || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <LeadStatusBadge status={lead.status} pulse={lead.status === 'new'} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={`tel:${lead.phone}`} className="p-2 text-[#0B1F3A] hover:bg-[#0B1F3A]/5 rounded-full transition-colors" title="Call">
                        <span className="material-symbols-outlined text-lg">call</span>
                      </a>
                      <a
                        href={whatsappLink(`Hi ${lead.name}! This is ${settings.name}. We received your inquiry.`, settings.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-[#25D366] hover:bg-[#25D366]/5 rounded-full transition-colors"
                        title="WhatsApp"
                      >
                        <span className="material-symbols-outlined text-lg">chat</span>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No leads yet. They will appear here as customers submit inquiries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
