'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { DocumentHeader } from '@/components/DocumentHeader';
import { useSettings } from '@/components/SettingsProvider';

function PublicInvoiceViewer() {
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [invoice, setInvoice] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
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
        <p className="text-gray-500 mt-2">Please contact {settings.name || 'our'} support if you believe this is an error.</p>
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
            <h1 className="text-2xl font-black tracking-tight text-[#0B1F3A]">{settings.name || 'Tax'} Invoice</h1>
            <p className="text-gray-500 text-sm">Download or print your official tax invoice</p>
          </div>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-[#0B1F3A] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all text-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Save PDF
          </button>
        </div>

        {/* Invoice Document */}
        <div id="invoice-capture" className="bg-white shadow-xl rounded-2xl p-10 sm:p-12 border border-gray-200 relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Header replaced with reusable branding component */}
          <DocumentHeader 
            rightContent={
              <>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-100 uppercase mt-4 sm:mt-0">Invoice</h2>
                <div className="mt-4 space-y-1">
                  <p className="text-xs font-bold text-[#E89B10] uppercase tracking-widest">Number</p>
                  <p className="font-bold text-lg text-[#0B1F3A]">{invoice.invoice_number}</p>
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Issued</p>
                  <p className="font-medium text-gray-700">{formatDate(invoice.created_at)}</p>
                </div>
              </>
            }
          />

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

          {/* Payment & Totals Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
             
             {/* Left side: Payment Method & QR code */}
             <div className="space-y-6 pt-2">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Payment Method</h3>
                  <div className="flex flex-wrap gap-2">
                     {['UPI', 'Cash', 'Debit Card', 'Credit Card'].map((method) => (
                       <button
                         key={method}
                         onClick={() => setPaymentMethod(method)}
                         className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                           paymentMethod === method 
                             ? (invoice.status === 'paid' ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white shadow-md' : 'border-[#E89B10] bg-[#E89B10]/10 text-[#E89B10]')
                             : 'border-gray-200 text-gray-400 bg-white hover:bg-gray-50'
                         }`}
                       >
                         {method}
                       </button>
                     ))}
                  </div>
                </div>

                {invoice.status === 'pending' && (
                  <div className="border border-gray-200 bg-white p-4 rounded-xl flex items-center gap-5 max-w-sm shadow-sm ring-1 ring-[#E89B10]/30 animate-in fade-in slide-in-from-bottom-4">
                     <div className="w-24 h-24 bg-white border border-gray-100 rounded-lg p-1 shrink-0 flex items-center justify-center shadow-inner">
                        <img src={settings.upiQrUrl || '/assets/upiqr.png'} alt="UPI QR Code" className="max-w-full max-h-full object-contain" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="font-bold text-[#0B1F3A] uppercase tracking-tight text-sm">Scan & Pay</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">Pay securely via any UPI app (GPay, PhonePe, Paytm, etc.)</p>
                     </div>
                  </div>
                )}
             </div>

             {/* Right side: Totals */}
             <div className="flex flex-col items-end gap-2">
               <div className="w-full space-y-3">
                 <div className="flex justify-between items-center text-gray-600">
                   <span>Rental Amount</span>
                   <span className="font-medium text-[#0B1F3A]">{formatCurrency(invoice.subtotal)}</span>
                 </div>
                 {invoice.gst_enabled && (
                   <div className="flex justify-between items-center text-gray-600">
                     <span>GST (18%)</span>
                     <span className="font-medium text-[#0B1F3A]">{formatCurrency(invoice.tax_amount)}</span>
                   </div>
                 )}
                 {invoice.security_deposit > 0 && (
                   <div className="flex justify-between items-center text-gray-600">
                     <span className="flex items-center gap-1.5">
                       Security Deposit
                       <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">Refundable</span>
                     </span>
                     <span className="font-medium text-[#0B1F3A]">{formatCurrency(invoice.security_deposit)}</span>
                   </div>
                 )}
                 <div className="h-px bg-gray-200 my-2" />
                 <div className="flex justify-between items-center bg-gray-50 border border-gray-200 p-6 rounded-xl relative overflow-hidden">
                   {invoice.status === 'pending' && <div className="absolute top-0 left-0 w-1 h-full bg-[#E89B10]" />}
                   {invoice.status === 'paid' && <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />}
                   <p className="text-[11px] font-black uppercase tracking-widest text-[#0B1F3A]">Total Payable</p>
                   <span className="text-3xl font-black tracking-tighter text-[#E89B10]">{formatCurrency(invoice.total_amount)}</span>
                 </div>
                 {invoice.security_deposit > 0 && (
                   <p className="text-[9px] text-gray-400 leading-snug">Security Deposit is refundable after vehicle return (subject to terms).</p>
                 )}
               </div>
             </div>
             
          </div>

          {/* Additional Terms & Conditions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#0B1F3A] mb-4">Additional Terms & Conditions</h3>
             <div className="text-[10px] text-gray-500 leading-relaxed text-justify">
               <ol className="list-decimal pl-4 space-y-4">
                 <li>
                   <span className="font-bold text-gray-700">Rental Charges:</span><br/>
                   Rental will be charged based on selected duration (6 hours / 12 hours / 24 hours / per day). Additional charges will apply for extra hours or extra kilometers. Fuel cost will be borne by the renter.<br/>
                   <span className="block mt-1">Vehicle usage limits: 150 km for 12 hours | 250 km for 24 hours. The vehicle must be returned to the designated location on time.</span>
                 </li>
                 <li>
                   <span className="font-bold text-gray-700">Insurance:</span><br/>
                   Only the vehicle is insured. Driver, passengers, and personal belongings are not covered under insurance. In case of an accident, repair costs of the vehicle will be borne by the renter. The company is not responsible for any personal belongings left in the vehicle.
                 </li>
                 <li>
                   <span className="font-bold text-gray-700">Security Deposit:</span><br/>
                   The renter must pay a refundable security deposit. In case of any damage, the amount will be adjusted against repair costs or deducted from the deposit.
                 </li>
                 <li>
                   <span className="font-bold text-gray-700">Jurisdiction:</span><br/>
                   All disputes are subject to {settings.city} ({settings.state}) jurisdiction only.
                 </li>
               </ol>
             </div>
          </div>

          {/* Footer info */}
          <div className="mt-16 text-[11px] text-gray-400 border-t border-gray-100 pt-8 flex justify-between items-end">
             <div>
               <p className="font-bold text-[#0B1F3A] uppercase tracking-widest mb-1">Support</p>
               <p>{settings.email}</p>
               <p>{settings.phone}</p>
             </div>
             <div className="text-right">
               <p className="font-bold text-[#0B1F3A] uppercase tracking-widest">{settings.name}</p>
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
