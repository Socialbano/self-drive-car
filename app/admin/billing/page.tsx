'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getInvoices, deleteInvoice } from '@/lib/supabase/queries';
import type { Invoice } from '@/types';
import { Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function BillingDashboard() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ outstanding: 0, pendingCount: 0, completedCount: 0 });
  
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await getInvoices();
      setInvoices(data || []);

      const pending = (data || []).filter(i => i.status === 'pending');
      const paid = (data || []).filter(i => i.status === 'paid');

      setStats({
        outstanding: pending.reduce((sum, i) => sum + Number(i.total_amount), 0),
        pendingCount: pending.length,
        completedCount: paid.length,
      });
      setLoading(false);
    }
    loadData();
  }, []);

  // Top-level loader removed

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Toaster position="top-right" />
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#0B1F3A]">Billing & Invoicing</h1>
          <p className="text-gray-500 mt-1">Manage corporate accounts and active ledger balances.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hero Stats */}
        <div className="md:col-span-2 bg-[#0B1F3A] p-8 rounded-2xl text-white relative overflow-hidden flex flex-col justify-between min-h-[240px] shadow-xl shadow-[#0B1F3A]/10">
          <div className="relative z-10">
            <h2 className="text-blue-200 font-medium uppercase tracking-widest text-xs mb-2">Total Outstanding Balance</h2>
            <div className="text-5xl font-black tracking-tight text-white">{formatCurrency(stats.outstanding)}</div>
          </div>
          <div className="relative z-10 flex gap-4 mt-6">
            <Link
              href="/admin/billing/create"
              className="bg-[#E89B10] text-[#0B1F3A] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#F9A826] transition-colors shadow-lg shadow-[#E89B10]/20"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Create Invoice
            </Link>
          </div>
          {/* Decorative */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-8 rounded-2xl flex flex-col justify-center border border-gray-100 shadow-sm">
          <h3 className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-5">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Pending Payments</span>
              <span className="text-lg font-bold text-[#eab308]">{stats.pendingCount}</span>
            </div>
            <div className="h-px bg-gray-100 w-full" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Completed This Month</span>
              <span className="text-lg font-bold text-[#22c55e]">{stats.completedCount}</span>
            </div>
            <div className="h-px bg-gray-100 w-full" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Total Invoices</span>
              <span className="text-lg font-bold text-[#0B1F3A]">{invoices.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Billings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#0B1F3A] tracking-tight">Recent Billings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-widest">
                <th className="px-6 py-4 font-bold">Invoice & Customer</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Date Issued</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-5">
                      <div className="h-4 bg-gray-100 rounded w-2/3 mb-1.5" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 bg-gray-100 rounded w-20" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-4 bg-gray-100 rounded w-24" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="h-5 bg-gray-100 rounded-full w-16" />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No invoices generated yet.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-[#0B1F3A]">{invoice.customer_name}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">{invoice.invoice_number}</div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-[#0B1F3A]">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                      {formatDate(invoice.created_at)}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : invoice.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            invoice.status === 'paid' ? 'bg-green-500' : invoice.status === 'pending' ? 'bg-amber-500' : 'bg-gray-500'
                          }`}
                        />
                        {invoice.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end items-center gap-2">
                        <Link
                          href={`/admin/billing/view?id=${invoice.id}&whatsapp=true`}
                          target="_blank"
                          className="p-2 text-green-600 hover:bg-green-50 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm"
                          title="Generate PDF & Send on WhatsApp"
                        >
                          <span className="material-symbols-outlined text-[18px]">chat</span>
                        </Link>
                        <Link
                          href={`/admin/billing/view?id=${invoice.id}`}
                          className="p-2 text-gray-400 hover:text-[#0B1F3A] transition-colors bg-white border border-gray-200 rounded-lg shadow-sm"
                          title="View PDF"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </Link>
                        <Link
                          href={`/admin/billing/view?id=${invoice.id}&print=true`}
                          target="_blank"
                          className="p-2 text-blue-500 hover:bg-blue-50 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm"
                          title="Print Invoice"
                        >
                          <span className="material-symbols-outlined text-[18px]">print</span>
                        </Link>
                        <button
                          onClick={() => setInvoiceToDelete(invoice.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm"
                          title="Delete Invoice"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {invoiceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#0B1F3A] mb-2">Delete Invoice?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone and will permanently remove this record.</p>
            <div className="flex gap-3 justify-end">
              <button
                disabled={isDeleting}
                onClick={() => setInvoiceToDelete(null)}
                className="px-4 py-2 font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Cancel"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  const res = await deleteInvoice(invoiceToDelete);
                  if (res.success) {
                    toast.success("Invoice deleted successfully");
                    setInvoices(prev => prev.filter(i => i.id !== invoiceToDelete));
                  } else {
                    toast.error("Failed to delete invoice");
                  }
                  setIsDeleting(false);
                  setInvoiceToDelete(null);
                }}
                className="px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                title="Confirm Delete"
              >
                {isDeleting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Trash2 size={16} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
