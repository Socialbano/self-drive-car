'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

function PublicInvoiceViewer() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPublicInvoice() {
      if (id) {
        // We call the public RPC function that safely fetches only this specific ID
        const { data, error } = await supabase.rpc('get_public_invoice', { inv_id: id });
        
        if (error || !data) {
          setError('Invoice not found or invalid link.');
        } else {
          setInvoice(data);
          if (searchParams.get('print') === 'true') {
            setTimeout(() => {
              window.print();
            }, 500);
          }
        }
      } else {
        setError('No invoice ID provided.');
      }
      setLoading(false);
    }
    fetchPublicInvoice();
  }, [id, searchParams]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-screen bg-gray-50 text-center">
        <span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
        <h1 className="text-2xl font-bold text-[#0B1F3A]">{error}</h1>
        <p className="text-gray-500 mt-2">Please contact Skydeepgroup support if you believe this is an error.</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  const diffDays = Math.ceil(Math.abs(new Date(invoice.end_date).getTime() - new Date(invoice.start_date).getTime()) / (1000 * 60 * 60 * 24)) || 1;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * { visibility: hidden; background-color: white; }
            #invoice-capture, #invoice-capture * { visibility: visible; }
            #invoice-capture { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; border: none; }
            .no-print { display: none !important; }
          }
        `}} />

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8 no-print animate-in fade-in">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#0B1F3A]">Skydeepgroup Invoice</h1>
            <p className="text-gray-500 text-sm">Download or print your official tax invoice</p>
          </div>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-[#0B1F3A] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all text-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Save PDF
          </button>
        </div>

        {/* Invoice Document */}
        <div id="invoice-capture" className="bg-white shadow-xl rounded-2xl p-10 sm:p-12 border border-gray-200 relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-16 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0B1F3A] rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#E89B10]">directions_car</span>
                </div>
                <span className="font-black text-2xl uppercase tracking-tighter text-[#0B1F3A]">Skydeep<span className="text-[#E89B10]">group</span></span>
              </div>
              <div className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Near HDFC Bank, Ramesh Dosa,<br/>
                Vishnupuri, Bhawarkua, Indore 452001<br/>
                <span className="flex items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-[16px]">phone</span>
                  +91 91113 30558
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">receipt</span>
                  GST/VAT: 23AXXPSXXXXX1Z5
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-100 uppercase">Invoice</h2>
              <div className="mt-4 space-y-1">
                <p className="text-xs font-bold text-[#E89B10] uppercase tracking-widest">Number</p>
                <p className="font-bold text-lg text-[#0B1F3A]">{invoice.invoice_number}</p>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Issued</p>
                <p className="font-medium text-gray-700">{formatDate(invoice.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16 relative z-10">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Billing To</h3>
              <div className="space-y-1">
                <p className="font-bold text-lg text-[#0B1F3A]">{invoice.customer_name}</p>
                <p className="text-gray-600">{invoice.customer_address || 'Address not provided'}</p>
                <p className="text-gray-600 mt-2 text-sm flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">call</span> {invoice.customer_phone}</p>
                {invoice.customer_email && (
                   <p className="text-gray-600 text-sm flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">mail</span> {invoice.customer_email}</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col justify-center sm:border-l-2 border-gray-100 sm:pl-12">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Payment Status</h3>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${invoice.status === 'paid' ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]'}`} />
                <span className="font-bold text-2xl uppercase tracking-tight text-[#0B1F3A]">
                  {invoice.status === 'paid' ? 'Completed' : 'Awaiting Payment'}
                </span>
              </div>
              {invoice.status === 'pending' && <p className="text-gray-500 text-sm mt-2 font-medium">Due by completion of rental</p>}
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-12 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-[#0B1F3A] text-white">
                <tr>
                  <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase">Description</th>
                  <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase text-right">Rate/Day</th>
                  <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase text-center">Duration</th>
                  <th className="px-6 py-4 font-bold text-sm tracking-wider uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white">
                  <td className="px-6 py-6">
                    <div className="font-bold text-[#0B1F3A] text-lg">{invoice.car_name || 'Vehicle Rental'}</div>
                    <div className="text-sm text-gray-500 mt-1">Rental Period: {formatDate(invoice.start_date)} to {formatDate(invoice.end_date)}</div>
                  </td>
                  <td className="px-6 py-6 text-right font-medium text-gray-700">{formatCurrency(invoice.daily_rate)}</td>
                  <td className="px-6 py-6 text-center text-gray-500">{diffDays} Days</td>
                  <td className="px-6 py-6 text-right font-bold text-[#0B1F3A]">{formatCurrency(invoice.subtotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex flex-col items-end gap-2">
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex justify-between items-center text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-[#0B1F3A]">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.gst_enabled && (
                <div className="flex justify-between items-center text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-medium text-[#0B1F3A]">{formatCurrency(invoice.tax_amount)}</span>
                </div>
              )}
              <div className="h-px bg-gray-200 my-4" />
              <div className="flex justify-between items-center bg-gray-50 border border-gray-200 p-6 rounded-xl">
                <p className="text-[11px] font-black uppercase tracking-widest text-[#0B1F3A]">Total Payable</p>
                <span className="text-3xl font-black tracking-tighter text-[#E89B10]">{formatCurrency(invoice.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-16 text-[11px] text-gray-400 border-t border-gray-100 pt-8 flex justify-between items-end">
             <div>
               <p className="font-bold text-[#0B1F3A] uppercase tracking-widest mb-1">Support</p>
               <p>booking@skydeepgroup.com</p>
               <p>+91 91113 30558</p>
             </div>
             <div className="text-right">
               <p className="font-bold text-[#0B1F3A] uppercase tracking-widest">Skydeep Group</p>
               <p>Thank you for choosing us.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicInvoicePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-20 min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PublicInvoiceViewer />
    </Suspense>
  );
}
