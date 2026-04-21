import React from 'react';
import { BUSINESS } from '@/lib/constants';

interface DocumentHeaderProps {
  rightContent?: React.ReactNode;
}

export function DocumentHeader({ rightContent }: DocumentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-gray-900 pb-6 mb-8 relative z-10 w-full animate-in fade-in">
      
      {/* Left side: Company Name + Tagline + Registration details */}
      <div className="space-y-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#0B1F3A] rounded flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#E89B10]">directions_car</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-[#0B1F3A]">
            SKYDEEP GROUP
          </h1>
        </div>
        
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#E89B10] pl-[52px]">
          SELF CAR DRIVE ALL INDIA
        </p>

        <div className="text-[10px] text-gray-500 leading-snug pl-[52px] pt-1">
          <p>REG. No: INDO250409SE001514</p>
          <p>UDYAM-MP-23-0207225</p>
        </div>
      </div>

      {/* Right side: Contact Details + Optional Content */}
      <div className="text-left sm:text-right text-xs text-gray-600 space-y-1 mt-6 sm:mt-0 flex flex-col sm:items-end w-full sm:w-auto">
        <div className="space-y-1 text-left sm:text-right">
           <p className="font-bold text-gray-900 uppercase break-normal">{BUSINESS?.name || 'Skydeep Group'}</p>
           <p className="max-w-[200px] break-normal">{BUSINESS?.address || 'Near HDFC Bank, Ramesh Dosa, Vishnupuri, Bhawarkua, Indore 452001'}</p>
           <p className="flex items-center sm:justify-end gap-1 mt-1">
             <span className="material-symbols-outlined text-[14px]">phone</span>
             +91 {BUSINESS?.phone || '9111330558'}
           </p>
        </div>
        
        {rightContent && (
          <div className="mt-4 w-full text-left sm:text-right border-t border-gray-200 pt-4 sm:border-none sm:pt-0">
            {rightContent}
          </div>
        )}
      </div>

    </div>
  );
}
