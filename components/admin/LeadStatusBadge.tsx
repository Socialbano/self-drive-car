'use client';

import React from 'react';

interface LeadStatusBadgeProps {
  status: 'new' | 'contacted' | 'booked' | 'closed';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

const STATUS_CONFIG = {
  new: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    ring: 'ring-blue-200',
    dot: 'bg-blue-500',
    label: 'New',
  },
  contacted: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    ring: 'ring-yellow-200',
    dot: 'bg-yellow-500',
    label: 'Contacted',
  },
  booked: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    ring: 'ring-green-200',
    dot: 'bg-green-500',
    label: 'Booked',
  },
  closed: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    ring: 'ring-gray-200',
    dot: 'bg-gray-400',
    label: 'Closed',
  },
};

export function LeadStatusBadge({ status, size = 'sm', pulse = false }: LeadStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  const sizeClasses = size === 'md' ? 'text-xs px-3 py-1.5' : 'text-[10px] px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase rounded-lg ring-1 ${config.bg} ${config.text} ${config.ring} ${sizeClasses}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dot} ${
          pulse && status === 'new' ? 'animate-pulse' : ''
        }`}
      />
      {config.label}
    </span>
  );
}

export function getStatusClass(status: string): string {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
  if (!config) return 'bg-gray-100 text-gray-600 ring-gray-200';
  return `${config.bg} ${config.text} ${config.ring}`;
}
