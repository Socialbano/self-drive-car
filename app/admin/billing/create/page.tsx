'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { createInvoice } from '@/lib/supabase/queries';
import type { Car } from '@/types';

export default function CreateBillingPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isManualMode, setIsManualMode] = useState(true);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    aadhaar_number: '',
    driving_license: '',
    gst_enabled: false,
    car_id: '',
    manual_vehicle_name: '',
    manual_vehicle_type: 'SUV',
    manual_daily_rate: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    async function loadCars() {
      const { data, error } = await supabase.from('cars').select('*');
      if (error) {
        console.error('Error fetching cars:', error);
        setFetchError(error.message);
      }
      
      // Filter active cars client side to avoid strict boolean null crashes on legacy rows
      const activeCars = (data || []).filter(c => c.is_active !== false);
      setCars(activeCars);
      setLoading(false);
    }
    loadCars();
  }, []);

  const selectedCar = useMemo(() => cars.find(c => c.id === formData.car_id), [cars, formData.car_id]);

  const daysDuration = useMemo(() => {
    if (!formData.start_date || !formData.end_date) return 0;
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1; // Minimum 1 day
  }, [formData.start_date, formData.end_date]);

  const calculations = useMemo(() => {
    let daily_rate = 0;
    if (isManualMode) {
      daily_rate = parseFloat(formData.manual_daily_rate as string) || 0;
    } else {
      daily_rate = selectedCar ? (selectedCar.price_24hr || 0) : 0;
    }
    const subtotal = daily_rate * daysDuration;
    const tax_amount = formData.gst_enabled ? subtotal * 0.18 : 0; // 18% GST
    const total_amount = subtotal + tax_amount;
    return { daily_rate, subtotal, tax_amount, total_amount };
  }, [isManualMode, formData.manual_daily_rate, selectedCar, daysDuration, formData.gst_enabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const structuredData = {
      ...formData,
      car_id: isManualMode ? null : formData.car_id,
      manual_vehicle_name: isManualMode ? formData.manual_vehicle_name : null,
      manual_vehicle_type: isManualMode ? formData.manual_vehicle_type : null,
      invoice_number: invoiceNumber,
      daily_rate: calculations.daily_rate,
      subtotal: calculations.subtotal,
      tax_amount: calculations.tax_amount,
      total_amount: calculations.total_amount,
      status: 'pending',
    };
    
    // Remove purely frontend state keys before sending to Supabase
    const { manual_daily_rate, ...cleanData } = structuredData;

    const res = await createInvoice(cleanData);

    if (res.success) {
      router.push(`/admin/billing/view?id=${res.data.id}`);
    } else {
      alert(`Failed to generate invoice: ${JSON.stringify(res.error)}`);
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-[3px] border-[#0B1F3A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="mb-4">
        <Link href="/admin/billing" className="text-sm font-bold text-gray-500 hover:text-[#E89B10] flex items-center gap-1 w-fit mb-4">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Billing
        </Link>
        <h1 className="text-[2.5rem] font-black leading-tight tracking-tight text-[#0B1F3A]">Customer Billing</h1>
        <p className="text-gray-500 mt-2 max-w-xl">Initialize high-value rental transactions and generate audited invoices for the fleet.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Section */}
        <div className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            <h3 className="text-lg font-bold text-[#0B1F3A] border-b pb-2">Customer Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Full Name *</label>
                <input required name="customer_name" value={formData.customer_name} onChange={handleChange} className="bg-gray-50 border border-gray-200 focus:border-[#E89B10] focus:ring-1 focus:ring-[#E89B10] rounded-lg px-4 py-3 text-sm transition-all" placeholder="e.g. Julian Alexander" type="text" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Mobile Number *</label>
                <input required name="customer_phone" value={formData.customer_phone} onChange={handleChange} className="bg-gray-50 border border-gray-200 focus:border-[#E89B10] focus:ring-1 focus:ring-[#E89B10] rounded-lg px-4 py-3 text-sm transition-all" placeholder="+91 00000 00000" type="tel" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Email Address</label>
              <input name="customer_email" value={formData.customer_email} onChange={handleChange} className="bg-gray-50 border border-gray-200 focus:border-[#E89B10] focus:ring-1 focus:ring-[#E89B10] rounded-lg px-4 py-3 text-sm transition-all" placeholder="client@example.com" type="email" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Physical Address</label>
              <textarea name="customer_address" value={formData.customer_address} onChange={handleChange} className="bg-gray-50 border border-gray-200 focus:border-[#E89B10] focus:ring-1 focus:ring-[#E89B10] rounded-lg px-4 py-3 text-sm transition-all" placeholder="Primary residence or corporate headquarters" rows={3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Aadhaar / National ID</label>
                <input name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} className="bg-gray-50 border border-gray-200 focus:border-[#E89B10] focus:ring-1 focus:ring-[#E89B10] rounded-lg px-4 py-3 text-sm transition-all" placeholder="XXXX-XXXX-XXXX" type="text" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Driving License</label>
                <input name="driving_license" value={formData.driving_license} onChange={handleChange} className="bg-gray-50 border border-gray-200 focus:border-[#E89B10] focus:ring-1 focus:ring-[#E89B10] rounded-lg px-4 py-3 text-sm transition-all" placeholder="DL-XXXXXXXXXXXX" type="text" />
              </div>
            </div>

            <div className="flex justify-between items-end border-b pb-2 mt-8 mb-4">
              <h3 className="text-lg font-bold text-[#0B1F3A]">Rental Details</h3>
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Saved Vehicle</span>
                <div className="relative inline-flex items-center">
                  <input type="checkbox" checked={isManualMode} onChange={() => setIsManualMode(!isManualMode)} className="sr-only peer" />
                  <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#E89B10]"></div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Manual Entry</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isManualMode ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Vehicle Name *</label>
                    <input required={isManualMode} name="manual_vehicle_name" value={formData.manual_vehicle_name} onChange={handleChange} className="bg-gray-50 border border-gray-200 focus:border-[#E89B10] focus:ring-1 focus:ring-[#E89B10] rounded-lg px-4 py-3 text-sm transition-all" placeholder="e.g., Hyundai Creta" type="text" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Vehicle Type</label>
                    <select name="manual_vehicle_type" value={formData.manual_vehicle_type} onChange={handleChange} className="bg-gray-50 border border-gray-200 focus:border-[#E89B10] focus:ring-1 focus:ring-[#E89B10] rounded-lg px-4 py-3 text-sm transition-all">
                      <option value="SUV">SUV</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Luxury">Luxury</option>
                      <option value="MUV">MUV</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Daily Price Rate (₹) *</label>
                    <input required={isManualMode} name="manual_daily_rate" value={formData.manual_daily_rate} onChange={handleChange} className="bg-gray-50 border border-gray-200 focus:border-[#E89B10] focus:ring-1 focus:ring-[#E89B10] rounded-lg px-4 py-3 text-sm transition-all" placeholder="Enter price (e.g., 2800)" type="number" min="0" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Select Vehicle *</label>
                  <select 
                    required={!isManualMode} 
                    name="car_id" 
                    value={formData.car_id} 
                    onChange={handleChange} 
                    className={`bg-gray-50 border ${fetchError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#E89B10] focus:ring-[#E89B10]'} rounded-lg px-4 py-3 text-sm transition-all focus:ring-1`}
                    disabled={loading || !!fetchError || cars.length === 0}
                  >
                    <option value="">
                      {fetchError ? 'Error loading cars' : (cars.length === 0 && !loading) ? 'No active cars available' : '-- Choose a Car --'}
                    </option>
                    {cars.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.car_type ? `(${c.car_type.toUpperCase()})` : ''} - {formatCurrency(c.price_24hr || 0)}/day
                      </option>
                    ))}
                  </select>
                  {fetchError && (
                    <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      Ensure your database has the "cars" table or check connection.
                    </p>
                  )}
                  {!fetchError && cars.length === 0 && !loading && (
                    <p className="text-amber-600 text-xs mt-1 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">info</span>
                      Please add active cars in the Fleet section first.
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Pick-up Date *</label>
                <input required name="start_date" type="date" value={formData.start_date} onChange={handleChange} className="bg-gray-50 border border-gray-200 focus:border-[#E89B10] focus:ring-1 focus:ring-[#E89B10] rounded-lg px-4 py-3 text-sm transition-all" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Drop-off Date *</label>
                <input required name="end_date" type="date" value={formData.end_date} onChange={handleChange} className="bg-gray-50 border border-gray-200 focus:border-[#E89B10] focus:ring-1 focus:ring-[#E89B10] rounded-lg px-4 py-3 text-sm transition-all" min={formData.start_date} />
              </div>
            </div>

            {/* GST Toggle */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#0B1F3A]">account_balance</span>
                <div>
                  <h4 className="text-sm font-bold text-[#0B1F3A]">Enable GST Details</h4>
                  <p className="text-xs text-gray-500">Applies 18% tax for corporate invoicing</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="gst_enabled" checked={formData.gst_enabled} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0B1F3A]"></div>
              </label>
            </div>

            <div className="pt-6">
              <button disabled={submitting} type="submit" className="w-full bg-[#0B1F3A] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50">
                {submitting ? (
                   <div className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined">receipt</span>
                    Generate Invoice
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-[#0B1F3A] text-white rounded-2xl p-8 relative overflow-hidden shadow-xl">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#E89B10] mb-6">Live Summary</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Estimated Total</p>
                <p className="text-4xl font-black mt-1 tracking-tight">{formatCurrency(calculations.total_amount)}</p>
              </div>
              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span className="font-bold">{daysDuration} Days</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Daily Rate</span>
                  <span className="font-bold">{formatCurrency(calculations.daily_rate)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-bold">{formatCurrency(calculations.subtotal)}</span>
                </div>
                {formData.gst_enabled && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">GST (18%)</span>
                    <span className="font-bold">{formatCurrency(calculations.tax_amount)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
             <h4 className="text-xs font-bold uppercase text-gray-500 mb-4">Verification Check</h4>
             <ul className="space-y-3">
               <li className="flex items-center gap-3 text-xs text-gray-700">
                 <span className={`material-symbols-outlined text-[18px] ${formData.aadhaar_number || formData.driving_license ? 'text-green-500' : 'text-amber-500'}`}>
                   {formData.aadhaar_number || formData.driving_license ? 'check_circle' : 'warning'}
                 </span>
                 {formData.aadhaar_number || formData.driving_license ? 'Identity Document Provided' : 'Identity Document Missing'}
               </li>
               <li className="flex items-center gap-3 text-xs text-gray-700">
                 <span className={`material-symbols-outlined text-[18px] ${(isManualMode ? formData.manual_vehicle_name : formData.car_id) ? 'text-green-500' : 'text-amber-500'}`}>
                   {(isManualMode ? formData.manual_vehicle_name : formData.car_id) ? 'check_circle' : 'warning'}
                 </span>
                 {(isManualMode ? formData.manual_vehicle_name : formData.car_id) ? 'Vehicle Allocated' : 'Vehicle Selection Pending'}
               </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
