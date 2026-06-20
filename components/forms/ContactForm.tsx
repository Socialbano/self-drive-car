'use client';

import React, { useState } from 'react';
import { insertLead } from '@/lib/supabase/queries';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    car_type: '',
    pickup_date: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    const { success, error: submitError } = await insertLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      car_type: formData.car_type || 'General',
      pickup_date: formData.pickup_date || undefined,
      message: formData.message,
    });

    if (success) {
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', car_type: '', pickup_date: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setError(submitError?.message || 'Failed to submit inquiry. Please try again.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
          Thank you! We've received your inquiry and will contact you shortly.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name *</label>
        <input 
          type="text" 
          required
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-[#0B1F3A] font-semibold placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-[#1152d4] outline-none transition-shadow"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Phone *</label>
          <input 
            type="tel" 
            required
            placeholder="+91 00000 00000"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-[#0B1F3A] font-semibold placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-[#1152d4] outline-none transition-shadow"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Email</label>
          <input 
            type="email" 
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-[#0B1F3A] font-semibold placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-[#1152d4] outline-none transition-shadow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Car Interest</label>
          <select 
            value={formData.car_type}
            onChange={(e) => setFormData({...formData, car_type: e.target.value})}
            className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-[#0B1F3A] font-semibold focus:ring-2 focus:ring-[#1152d4] outline-none transition-shadow appearance-none cursor-pointer"
          >
             <option value="">General Inquiry</option>
             <option value="Hatchback">Hatchback</option>
             <option value="Sedan">Sedan</option>
             <option value="SUV">SUV</option>
             <option value="Luxury">Luxury</option>
             <option value="Electric">Electric</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Pickup Date</label>
          <input 
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={formData.pickup_date}
            onChange={(e) => setFormData({...formData, pickup_date: e.target.value})}
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 text-[#0B1F3A] font-semibold focus:ring-2 focus:ring-[#1152d4] outline-none transition-shadow cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Message</label>
        <textarea 
          rows={4}
          placeholder="How can we help you today?"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-[#0B1F3A] font-semibold placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-[#1152d4] outline-none transition-shadow resize-none"
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#0B1F3A] text-white py-4 rounded-xl font-bold hover:bg-[#1152d4] active:scale-[0.98] transition-all shadow-lg shadow-[#0B1F3A]/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {loading ? (
           <>
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             Submitting...
           </>
        ) : 'Submit Inquiry'}
      </button>
      
      <p className="text-center text-xs text-gray-400 font-medium flex items-center justify-center gap-1">
        <span className="material-symbols-outlined text-[14px]">lock</span>
        We respect your privacy. No spam.
      </p>
    </form>
  );
}
