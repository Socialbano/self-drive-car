'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAgreements, deleteAgreement } from '@/lib/supabase/queries';
import { Agreement } from '@/types';
import { Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useSettings } from '@/components/SettingsProvider';

export default function AgreementsPage() {
  const { settings } = useSettings();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [agreementToDelete, setAgreementToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    setLoading(true);
    const data = await getAgreements();
    setAgreements(data as unknown as Agreement[]);
    setLoading(false);
  };

  const filtered = agreements.filter(
    (a) =>
      a.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.mobile.includes(searchTerm)
  );

  const getWhatsAppLink = (agreement: Agreement) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${origin}/agreements/${agreement.id}`;
    const text = `Hi ${agreement.customer_name},\n\nYour rental agreement from ${settings.name || 'us'} is ready.\n\n📄 View & Download here: ${link}\n\nThank you for choosing us!`;
    return `https://wa.me/91${agreement.mobile}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight">Rental Agreements</h1>
          <p className="text-slate-500 mt-1">Manage and generate digital contracts for your customers</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link
            href="/admin/agreements/new"
            className="w-full md:w-auto bg-[#E89B10] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#d68f0e] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Agreement
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Search by customer name or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition-all bg-white"
              />
            </div>
            {/* Sort / Filter place holder */}
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center font-medium">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0B1F3A] text-white">
              <tr>
                <th className="py-4 px-6 font-semibold text-sm">Customer</th>
                <th className="py-4 px-6 font-semibold text-sm">Car</th>
                <th className="py-4 px-6 font-semibold text-sm">Dates</th>
                <th className="py-4 px-6 font-semibold text-sm">Amount</th>
                <th className="py-4 px-6 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#0B1F3A] rounded-full animate-spin mb-2" />
                    <p>Loading agreements...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
                      description
                    </span>
                    <p>No agreements found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((agreement: any) => (
                  <tr key={agreement.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#0B1F3A]">{agreement.customer_name}</div>
                      <div className="text-gray-500 text-sm">{agreement.mobile}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                        <span className="material-symbols-outlined text-[14px]">directions_car</span>
                        {agreement.cars?.name || agreement.manual_vehicle_name || 'Unknown Car'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-gray-700">
                        {new Date(agreement.start_date).toLocaleDateString('en-GB')}
                        <span className="text-gray-400 mx-1">→</span>
                        {new Date(agreement.end_date).toLocaleDateString('en-GB')}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-green-600">₹{agreement.total_amount}</div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/agreements/${agreement.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-gray-400 hover:text-[#0B1F3A] hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center grouped"
                          title="View / Print PDF"
                        >
                          <span className="material-symbols-outlined text-[20px]">print</span>
                        </a>
                        <a
                          href={getWhatsAppLink(agreement)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-gray-400 hover:text-[#25D366] hover:bg-green-50 rounded-lg transition-colors flex items-center justify-center"
                          title="Share on WhatsApp"
                        >
                          <span className="material-symbols-outlined text-[20px]">maps_ugc</span>
                        </a>
                        <button
                          onClick={() => setAgreementToDelete(agreement.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center grouped"
                          title="Delete Agreement"
                        >
                          <Trash2 size={20} />
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

      {agreementToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-[#0B1F3A] mb-2">Delete Agreement?</h3>
            <p className="text-gray-500 text-sm mb-6">This agreement will be permanently removed.</p>
            <div className="flex gap-3 justify-end">
              <button
                disabled={isDeleting}
                onClick={() => setAgreementToDelete(null)}
                className="px-4 py-2 font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title="Cancel"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  const res = await deleteAgreement(agreementToDelete);
                  if (res.success) {
                    toast.success("Agreement deleted successfully");
                    setAgreements(prev => prev.filter((a: any) => a.id !== agreementToDelete));
                  } else {
                    toast.error("Failed to delete agreement");
                  }
                  setIsDeleting(false);
                  setAgreementToDelete(null);
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
