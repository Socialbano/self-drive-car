'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAgreementById } from '@/lib/supabase/queries';
import { DocumentHeader } from '@/components/DocumentHeader';

export default function PublicAgreementViewer() {
  const { id } = useParams();
  const [agreement, setAgreement] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData(id as string);
    }
  }, [id]);

  const fetchData = async (agreementId: string) => {
    const data = await getAgreementById(agreementId);
    setAgreement(data);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0B1F3A] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Agreement not found or link is invalid.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex py-12 md:py-16 justify-center overflow-x-hidden print:bg-white print:py-0">
      
      {/* Print Controls (Hidden on native print) */}
      <div className="fixed top-4 right-4 z-50 print:hidden flex items-center gap-3">
         <button 
           onClick={handlePrint}
           className="bg-[#0B1F3A] text-white px-6 py-2.5 rounded-full font-bold shadow-xl shadow-[#0B1F3A]/20 flex items-center gap-2 hover:bg-[#112d54] transition-colors"
         >
           <span className="material-symbols-outlined text-[18px]">print</span>
           Save as PDF
         </button>
      </div>

      {/* Styled A4 Container */}
      <div className="w-full max-w-[800px] bg-white text-black shadow-2xl p-8 md:p-14 print:shadow-none print:w-[100%] print:max-w-none print:p-0">
        
        {/* Header replaced with reusable branding component */}
        <DocumentHeader 
          rightContent={
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-200 uppercase mt-4">Car Rental Agreement</h2>
          }
        />

        {/* AGREEMENT META */}
        <div className="flex justify-between items-center mb-8 text-sm">
           <div>
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-wider block">Agreement ID</span>
              <span className="font-mono font-bold text-gray-900">{agreement.id.split('-')[0].toUpperCase()}</span>
           </div>
           <div className="text-right">
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-wider block">Date Issued</span>
              <span className="font-bold text-gray-900">{new Date(agreement.created_at).toLocaleDateString('en-GB')}</span>
           </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 gap-8 mb-10">
           {/* Customer */}
           <div className="space-y-4">
              <h2 className="text-sm font-black uppercase text-gray-400 border-b border-gray-200 pb-2">Customer Details</h2>
              <div className="text-sm space-y-2">
                 <p><span className="font-bold inline-block w-24">Name:</span> {agreement.customer_name}</p>
                 <p><span className="font-bold inline-block w-24">Mobile:</span> {agreement.mobile}</p>
                 {agreement.email && <p><span className="font-bold inline-block w-24">Email:</span> {agreement.email}</p>}
                 <p><span className="font-bold inline-block w-24 align-top">Address:</span> <span className="inline-block w-40 leading-snug">{agreement.address}</span></p>
              </div>
           </div>

           {/* KYC Details */}
           <div className="space-y-4">
              <h2 className="text-sm font-black uppercase text-gray-400 border-b border-gray-200 pb-2">Verified Documents</h2>
              <div className="text-sm space-y-2">
                 <p><span className="font-bold inline-block w-32">Driving License:</span> <span className="uppercase">{agreement.driving_license}</span></p>
                 <p><span className="font-bold inline-block w-32">Aadhaar (ID):</span> <span className="uppercase">{agreement.aadhaar_number}</span></p>
              </div>
           </div>
        </div>

         {/* BOOKING DETAILS */}
        <div className="mb-10">
           <h2 className="text-sm font-black uppercase text-gray-400 border-b border-gray-200 pb-2 mb-4">Rental Details</h2>
           <table className="w-full text-sm text-left border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                 <tr>
                    <th className="border border-gray-200 p-3 font-bold uppercase text-xs">Vehicle</th>
                    <th className="border border-gray-200 p-3 font-bold uppercase text-xs">Pickup Date</th>
                    <th className="border border-gray-200 p-3 font-bold uppercase text-xs">Return Date</th>
                    <th className="border border-gray-200 p-3 font-bold uppercase text-xs text-right">Rate/Day</th>
                 </tr>
              </thead>
              <tbody>
                 <tr>
                    <td className="border border-gray-200 p-3 font-bold">
                       {!agreement.car_id 
                          ? agreement.manual_vehicle_name 
                          : (agreement.cars?.name || 'Unknown Vehicle')}
                    </td>
                    <td className="border border-gray-200 p-3">{new Date(agreement.start_date).toLocaleDateString('en-GB')}</td>
                    <td className="border border-gray-200 p-3">{new Date(agreement.end_date).toLocaleDateString('en-GB')}</td>
                    <td className="border border-gray-200 p-3 text-right">₹{agreement.price_24hr}</td>
                 </tr>
              </tbody>
           </table>

           <div className="flex justify-end mt-4">
              <div className="w-72 space-y-2 text-sm">
                 <div className="flex justify-between">
                    <span className="text-gray-600">Rental Amount:</span>
                    <span className="font-bold">₹{agreement.total_amount}</span>
                 </div>
                 {agreement.security_deposit > 0 && (
                   <div className="flex justify-between text-gray-600">
                     <span className="flex items-center gap-1">
                       Security Deposit:
                       <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1 py-0.5 rounded uppercase">Refundable</span>
                     </span>
                     <span className="font-bold">₹{agreement.security_deposit}</span>
                   </div>
                 )}
                 <div className="border-t-2 border-gray-900 pt-2 flex justify-between">
                    <span className="font-black uppercase">Total Rental Payable:</span>
                    <span className="font-black text-lg">₹{agreement.total_amount}</span>
                 </div>
                 {agreement.security_deposit > 0 && (
                   <p className="text-[9px] text-gray-400 leading-snug">Security Deposit is refundable after vehicle return (subject to terms).</p>
                 )}
              </div>
           </div>
        </div>

        {/* TERMS */}
        <div className="mb-12">
            <h2 className="text-sm font-black uppercase text-gray-400 border-b border-gray-200 pb-2 mb-4">Terms & Conditions</h2>
            <div className="text-xs text-gray-700 space-y-2 leading-relaxed text-justify pl-4">
               <ol className="list-decimal space-y-1.5">
                  <li>The customer must thoroughly inspect the vehicle before taking delivery. Any issue must be reported immediately (within 500 meters of pickup).</li>
                  <li>The vehicle must not be used for racing, stunts, or any illegal activities.</li>
                  <li>Driving under the influence of alcohol or any intoxicating substance is strictly prohibited. A penalty of ₹10,000 will be applicable.</li>
                  <li>The renter must possess a valid and original driving license.</li>
                  <li>Wearing a seatbelt while driving is mandatory. Any penalty will be borne by the renter.</li>
                  <li>The vehicle cannot be transferred to any other person.</li>
                  <li>Late return may result in engine immobilization and extra charges.</li>
                  <li>The vehicle must not be used for goods loading/unloading.</li>
                  <li>Over-speeding (above 80 km/h) will attract penalties.</li>
                  <li>All traffic fines will be paid by the renter.</li>
                  <li>In case of theft, accident, or misuse, the renter is fully responsible.</li>
                  <li>The company is not responsible for disputes arising from accidents.</li>
                  <li>Repairs and parts replacement will be done as per company decision.</li>
                  <li>Rental charges apply even during repair time.</li>
                  <li>Any illegal activity using the vehicle is the renter’s responsibility.</li>
                  <li>Future legal issues related to rental period will be handled by the renter.</li>
                  <li>By signing, the renter agrees to all terms.</li>
               </ol>
            </div>
        </div>

        {/* SIGNATURES */}
        <div className="grid grid-cols-2 gap-8 mt-16 pt-8 border-t-2 border-gray-200">
           
           <div className="text-center">
              <div className="h-24 flex items-center justify-center border-b border-gray-300 relative">
                 {agreement.signature_data && agreement.signature_data.startsWith('data:image') ? (
                    <img src={agreement.signature_data} alt="Customer Signature" className="max-h-full max-w-full" />
                 ) : (
                    <span className="text-gray-300 italic">Signature Not Recorded Space</span>
                 )}
              </div>
              <p className="mt-2 text-sm font-bold uppercase">{agreement.customer_name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Lessee (Customer)</p>
           </div>
           
           <div className="text-center">
              <div className="h-24 flex items-end justify-center border-b border-gray-300 pb-2">
                 {/* Signature placeholder removed as requested */}
              </div>
              <p className="mt-2 text-sm font-bold uppercase">Authorized Signatory</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Lessor (Company)</p>
           </div>

        </div>
        
        {/* FOOTER */}
        <div className="mt-16 text-center text-[10px] text-gray-400 uppercase tracking-widest print:mt-12">
            This is an electronically generated and legally binding document.
        </div>

      </div>
    </div>
  );
}
