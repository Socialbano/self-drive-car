'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { LeadDetailModal } from '@/components/admin/LeadDetailModal';
import { LeadStatusBadge } from '@/components/admin/LeadStatusBadge';
import { LEAD_STATUSES, CAR_TYPES, whatsappLink, BUSINESS } from '@/lib/constants';
import type { Lead } from '@/types';

const ITEMS_PER_PAGE = 20;

export default function LeadsPage() {
  const { leads, fetchLeads, isLoading, changeStatus, removeLead } = useLeads();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [carTypeFilter, setCarTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
    setMounted(true);
  }, [fetchLeads]);

  // Filter + search
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Status filter
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;

      // Car type filter
      if (carTypeFilter !== 'all') {
        const leadCarType = (lead.car_type || '').toLowerCase();
        if (!leadCarType.includes(carTypeFilter.toLowerCase())) return false;
      }

      // Date range filter
      if (dateFrom) {
        const leadDate = new Date(lead.created_at);
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (leadDate < from) return false;
      }
      if (dateTo) {
        const leadDate = new Date(lead.created_at);
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (leadDate > to) return false;
      }

      // Text search (name, phone, email)
      if (search) {
        const q = search.toLowerCase();
        const matchName = lead.name.toLowerCase().includes(q);
        const matchPhone = lead.phone.includes(q);
        const matchEmail = (lead.email || '').toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchEmail) return false;
      }

      return true;
    });
  }, [leads, search, statusFilter, carTypeFilter, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / ITEMS_PER_PAGE));
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, carTypeFilter, dateFrom, dateTo]);

  const handleExportCSV = () => {
    const Papa = require('papaparse');
    const csvData = leads.map(l => ({
      Date: new Date(l.created_at).toLocaleString(),
      Name: l.name,
      Phone: `'${l.phone}`,
      Email: l.email || '',
      Car: l.car_type || '',
      Pickup: l.pickup_date || '',
      Message: l.message || '',
      Status: l.status,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStatusChange = async (id: string, status: Lead['status']) => {
    await changeStatus(id, status);
    if (selectedLead?.id === id) {
      setSelectedLead(prev => prev ? { ...prev, status } : null);
    }
  };

  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setCarTypeFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = search || statusFilter !== 'all' || carTypeFilter !== 'all' || dateFrom || dateTo;

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const statusCount = (status: string) => leads.filter(l => l.status === status).length;

  if (!mounted) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight">Lead Management</h1>
          <p className="text-gray-500 mt-1">
            {filteredLeads.length} {filteredLeads.length === 1 ? 'lead' : 'leads'}
            {hasActiveFilters ? ' (filtered)' : ''} · {leads.length} total
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0B1F3A] text-[#0B1F3A] font-semibold text-sm hover:bg-[#0B1F3A]/5 transition-all self-start"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Export CSV
        </button>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {LEAD_STATUSES.map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
            className={`p-4 rounded-xl border text-left transition-all ${
              statusFilter === status
                ? 'border-[#E89B10] bg-[#E89B10]/5 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 capitalize">{status}</p>
            <p className="text-2xl font-black text-[#0B1F3A] mt-1">{statusCount(status)}</p>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1152d4] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1152d4] font-medium text-[#0B1F3A]"
          >
            <option value="all">All Statuses</option>
            {LEAD_STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          {/* Car Type Filter */}
          <select
            value={carTypeFilter}
            onChange={(e) => setCarTypeFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1152d4] font-medium text-[#0B1F3A] capitalize"
          >
            <option value="all">All Car Types</option>
            {CAR_TYPES.map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date Range:</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1152d4]"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1152d4]"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Car Interest</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Pickup</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(5)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-4 bg-gray-100 rounded w-24" />
                          <div className="h-3 bg-gray-100 rounded w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-gray-100 rounded-full w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-7 bg-gray-100 rounded-lg w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded w-12" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full" />
                        <div className="w-8 h-8 bg-gray-100 rounded-full" />
                        <div className="w-8 h-8 bg-gray-100 rounded-full" />
                        <div className="w-8 h-8 bg-gray-100 rounded-full" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : paginatedLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-[#0B1F3A] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {getInitials(lead.name)}
                        </div>
                        {lead.status === 'new' && (
                          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0B1F3A]">{lead.name}</div>
                        <div className="text-xs text-gray-400">{lead.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-[#0B1F3A] bg-gray-100 px-3 py-1 rounded-full">
                      {lead.car_type || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {lead.pickup_date || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                      className={`text-[10px] font-bold uppercase rounded-lg px-2.5 py-1.5 ring-1 cursor-pointer ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-800 ring-blue-200' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800 ring-yellow-200' :
                        lead.status === 'booked' ? 'bg-green-100 text-green-800 ring-green-200' :
                        'bg-gray-100 text-gray-600 ring-gray-200'
                      }`}
                    >
                      {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`tel:${lead.phone}`} className="p-2 text-[#0B1F3A] hover:bg-[#0B1F3A]/5 rounded-full transition-colors" title="Call">
                        <span className="material-symbols-outlined text-lg">call</span>
                      </a>
                      <a
                        href={whatsappLink(`Hi ${lead.name}! This is ${BUSINESS.name}. We received your inquiry regarding ${lead.car_type || 'car rental'}.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-[#25D366] hover:bg-[#25D366]/5 rounded-full transition-colors"
                        title="WhatsApp"
                      >
                        <span className="material-symbols-outlined text-lg">chat</span>
                      </a>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button
                        onClick={() => setDeleteId(lead.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-300 block mb-4">person_search</span>
                    <p className="text-gray-500 font-medium">
                      {hasActiveFilters ? 'No leads match your filters.' : 'No leads found.'}
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm font-semibold text-[#1152d4] hover:text-[#E89B10] mt-2 transition-colors"
                      >
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      page === currentPage
                        ? 'bg-[#0B1F3A] text-white'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
        />
      )}
      {/* Custom Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-gray-100 shadow-2xl scale-in duration-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">delete</span>
            </div>
            <h3 className="text-lg font-bold text-[#0B1F3A]">Delete Lead?</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to permanently delete this lead? This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full mt-6">
              <button
                onClick={async () => {
                  const id = deleteId;
                  setDeleteId(null);
                  await removeLead(id);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all bg-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
