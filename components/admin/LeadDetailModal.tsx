'use client';

import React from 'react';
import type { Lead } from '@/types';
import { BUSINESS, whatsappLink } from '@/lib/constants';
import { LEAD_STATUSES } from '@/lib/constants';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (id: string, status: Lead['status']) => void;
}

export function LeadDetailModal({ lead, onClose, onStatusChange }: LeadDetailModalProps) {
  const statusStyles: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800 ring-blue-200',
    contacted: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    booked: 'bg-green-100 text-green-800 ring-green-200',
    closed: 'bg-gray-100 text-gray-600 ring-gray-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-[#0B1F3A] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm">
              {lead.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{lead.name}</h3>
              <p className="text-white/60 text-sm">{lead.phone}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Status</label>
            <select
              value={lead.status}
              onChange={(e) => onStatusChange(lead.id, e.target.value as Lead['status'])}
              className={`text-xs font-bold rounded-lg px-3 py-1.5 ring-1 focus:ring-2 focus:ring-[#1152d4] cursor-pointer ${statusStyles[lead.status]}`}
            >
              {LEAD_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {lead.email && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Email</p>
                <p className="text-sm font-medium text-[#0B1F3A]">{lead.email}</p>
              </div>
            )}
            {lead.car_type && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Car Interest</p>
                <p className="text-sm font-medium text-[#0B1F3A]">{lead.car_type}</p>
              </div>
            )}
            {lead.pickup_date && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Pickup Date</p>
                <p className="text-sm font-medium text-[#0B1F3A]">{lead.pickup_date}</p>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Source</p>
              <p className="text-sm font-medium text-[#0B1F3A]">{lead.source}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Received</p>
              <p className="text-sm font-medium text-[#0B1F3A]">
                {new Date(lead.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Message</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
                {lead.message}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <a
            href={`tel:${lead.phone}`}
            className="flex-1 flex items-center justify-center gap-2 bg-[#0B1F3A] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#0B1F3A]/90 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">call</span>
            Call Now
          </a>
          <a
            href={whatsappLink(`Hi ${lead.name}! This is ${BUSINESS.name}. We received your inquiry regarding ${lead.car_type || 'car rental'}. How can we help?`)}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#20BD5A] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chat</span>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
