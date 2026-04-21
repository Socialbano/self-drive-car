'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getAllCarsAdmin, createAgreement } from '@/lib/supabase/queries';
import { Car } from '@/types';
import toast from 'react-hot-toast';

export default function NewAgreementPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '',
    mobile: '',
    email: '',
    address: '',
    aadhaar_number: '',
    driving_license: '',
    car_id: '',
    custom_vehicle_name: '',
    custom_vehicle_type: 'SUV',
    custom_price: 0,
    is_manual_entry: false,
    start_date: '',
    end_date: '',
    price_per_day: 0,
    security_deposit: 2000, 
    total_amount: 0,
    terms_accepted: false,
    signature_data: ''
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const data = await getAllCarsAdmin();
    setCars(data.filter(c => c.is_active));
  };

  // Recalculate totals when dates or car changes
  // Security Deposit is NOT included in Total Amount — it's a separate refundable amount
  useEffect(() => {
    if (formData.start_date && formData.end_date && formData.price_per_day >= 0) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both days
      
      if (diffDays > 0) {
        const rentalAmount = diffDays * formData.price_per_day;
        // Total = Rental Amount only. Security Deposit is separate (refundable).
        setFormData(prev => ({ ...prev, total_amount: rentalAmount }));
      }
    }
  }, [formData.start_date, formData.end_date, formData.price_per_day]);

  const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const carId = e.target.value;
    const selectedCar = cars.find(c => c.id === carId);
    setFormData(prev => ({
      ...prev,
      car_id: carId,
      price_per_day: selectedCar ? selectedCar.price_24hr : 0
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // For checkboxes, e.target doesn't naturally have 'checked' on HTMLInputElement if loosely typed without casting,
    // so we handle it specifically below.
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // --- Canvas Signature Logic ---
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
       x = e.touches[0].clientX - rect.left;
       y = e.touches[0].clientY - rect.top;
    } else {
       x = e.clientX - rect.left;
       y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
       x = e.touches[0].clientX - rect.left;
       y = e.touches[0].clientY - rect.top;
    } else {
       x = e.clientX - rect.left;
       y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  // ------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.terms_accepted) {
         toast.error("Terms & Conditions must be accepted.");
         setLoading(false);
         return;
      }

      // Capture Signature Base64
      let signatureBase64 = '';
      if (canvasRef.current) {
         signatureBase64 = canvasRef.current.toDataURL('image/png');
      }

      // Prepare payload based on entry mode
      const payload: any = {
        ...formData,
        signature_data: signatureBase64
      };

      if (payload.is_manual_entry) {
         payload.car_id = null; // NULL out car_id relation
         payload.custom_price = payload.price_per_day; // Map calculated daily to custom price column
      } else {
         payload.custom_vehicle_name = null;
         payload.custom_vehicle_type = null;
         payload.custom_price = null;
      }

      const res = await createAgreement(payload);
      if (res.success) {
        toast.success("Agreement created successfully!");
        router.push('/admin/agreements');
      } else {
        toast.error("Failed to create agreement. See console.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-gray-800 transition-colors mb-4 text-sm font-medium">
          <span className="material-symbols-outlined text-[18px] mr-1">arrow_back</span>
          Back to Agreements
        </button>
        <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight">Generate New Agreement</h1>
        <p className="text-slate-500 mt-1">Fill in the customer details to create a legally binding digital contract.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section: Customer Details */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <span className="material-symbols-outlined text-[#E89B10]">person</span>
            <h2 className="text-xl font-bold text-[#0B1F3A]">Customer Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
              <input type="text" name="customer_name" required value={formData.customer_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-gray-50/50" placeholder="e.g. Rahul Sharma" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number *</label>
              <input type="tel" name="mobile" required pattern="[0-9]{10}" title="10 digit mobile number" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-gray-50/50" placeholder="10 Digit Mobile Number" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-gray-50/50" placeholder="e.g. rahul@example.com" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Permanent Address *</label>
              <textarea name="address" required rows={3} value={formData.address} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-gray-50/50" placeholder="Customer's full postal address"></textarea>
            </div>
          </div>
        </section>

        {/* Section: KYC Verification */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <span className="material-symbols-outlined text-[#E89B10]">id_card</span>
            <h2 className="text-xl font-bold text-[#0B1F3A]">Identity Verification</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Aadhaar Number *</label>
              <input type="text" name="aadhaar_number" required value={formData.aadhaar_number} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-gray-50/50 uppercase" placeholder="12 Digit Aadhaar" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Driving License Number *</label>
              <input type="text" name="driving_license" required value={formData.driving_license} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-gray-50/50 uppercase" placeholder="e.g. MP09 2020..." />
            </div>
          </div>
        </section>

        {/* Section: Booking Details */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <span className="material-symbols-outlined text-[#E89B10]">car_rental</span>
            <h2 className="text-xl font-bold text-[#0B1F3A]">Booking Details</h2>
          </div>

          {/* Toggle Manual / Saved */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6 w-fit border border-gray-200/60 shadow-inner">
            <button 
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, is_manual_entry: false }))}
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${!formData.is_manual_entry ? 'bg-white text-[#0B1F3A] shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Saved Vehicle
            </button>
            <button 
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, is_manual_entry: true, car_id: '' }))}
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${formData.is_manual_entry ? 'bg-white text-[#0B1F3A] shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Manual Entry
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!formData.is_manual_entry ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Vehicle *</label>
                <select name="car_id" required value={formData.car_id} onChange={handleCarChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-gray-50/50">
                  <option value="" disabled>-- Choose a Car --</option>
                  {cars.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - ₹{c.price_24hr}/day</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Custom Vehicle Name *</label>
                  <input type="text" name="custom_vehicle_name" required value={formData.custom_vehicle_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-gray-50/50" placeholder="e.g. Thar 4x4" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Type *</label>
                  <select name="custom_vehicle_type" required value={formData.custom_vehicle_type} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-gray-50/50">
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Daily Price Rate (₹) *</label>
                  <input type="number" name="price_per_day" required value={formData.price_per_day} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-gray-50/50" placeholder="e.g. 2500" />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Rental Start Date *</label>
              <input type="date" name="start_date" required value={formData.start_date} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-gray-50/50" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Rental End Date *</label>
              <input type="date" name="end_date" required min={formData.start_date} value={formData.end_date} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-gray-50/50" />
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl md:col-span-2 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Price Per Day (₹)</label>
                    <input type="number" name="price_per_day" value={formData.price_per_day} onChange={handleChange} className="w-full px-4 py-2 font-bold text-lg rounded-xl border border-gray-200" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Security Deposit (₹) — Refundable</label>
                    <input type="number" name="security_deposit" value={formData.security_deposit} onChange={handleChange} className="w-full px-4 py-2 font-bold text-lg rounded-xl border border-gray-200" />
                    <p className="text-xs text-gray-400 mt-1">Collected separately. Not included in rental total.</p>
                 </div>
               </div>

               {/* Summary breakdown */}
               <div className="border border-gray-200 rounded-xl overflow-hidden">
                 <div className="px-4 py-3 flex justify-between text-sm text-gray-600 bg-white">
                   <span>Rental Amount</span>
                   <span className="font-bold text-gray-800">₹{formData.total_amount.toLocaleString('en-IN')}</span>
                 </div>
                 <div className="px-4 py-3 flex justify-between text-sm text-gray-600 bg-white border-t border-dashed border-gray-200">
                   <span className="flex items-center gap-1">
                     Security Deposit
                     <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">Refundable</span>
                   </span>
                   <span className="font-bold text-gray-800">₹{Number(formData.security_deposit).toLocaleString('en-IN')}</span>
                 </div>
                 <div className="px-4 py-3 flex justify-between items-center bg-orange-50 border-t-2 border-[#E89B10]">
                   <span className="text-sm font-black uppercase tracking-wider text-[#0B1F3A]">Total Rental Payable</span>
                   <input type="number" name="total_amount" value={formData.total_amount} onChange={handleChange} className="w-28 px-3 py-1.5 font-black text-lg rounded-xl border-2 border-[#E89B10] bg-white text-[#0B1F3A] text-right" />
                 </div>
                 <p className="text-[10px] text-gray-400 px-4 pb-3 bg-orange-50">Rental only. Security deposit is collected separately and is refundable after vehicle return.</p>
               </div>
            </div>
          </div>
        </section>

        {/* Section: terms */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <span className="material-symbols-outlined text-[#E89B10]">gavel</span>
            <h2 className="text-xl font-bold text-[#0B1F3A]">Terms & Signature</h2>
          </div>
          
          <div className="mb-6 bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-2 h-[280px] overflow-y-auto border border-gray-200">
             <p className="font-bold text-gray-800 text-base mb-3">Key Rental Terms & Conditions</p>
             <ol className="list-decimal pl-5 space-y-2">
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

          <label className="flex items-start gap-3 cursor-pointer mb-8">
            <div className="mt-1">
               <input type="checkbox" name="terms_accepted" checked={formData.terms_accepted} onChange={handleCheckboxChange} className="w-5 h-5 rounded border-gray-300 text-[#0B1F3A] focus:ring-[#0B1F3A]" />
            </div>
            <span className="text-sm font-medium text-gray-700">I confirm that the customer has read, understood, and agreed to the full Terms and Conditions.</span>
          </label>

          <div className="mb-4">
             <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-bold text-gray-700">Customer Digital Signature</label>
                <button type="button" onClick={clearSignature} className="text-xs text-red-500 hover:text-red-700 font-bold border border-red-200 px-3 py-1 rounded-lg">Clear Pad</button>
             </div>
             <div className="border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden bg-gray-50" style={{ touchAction: 'none' }}>
                <canvas 
                   ref={canvasRef}
                   width={800}
                   height={200}
                   className="w-full h-[200px] cursor-crosshair"
                   onMouseDown={startDrawing}
                   onMouseMove={draw}
                   onMouseUp={stopDrawing}
                   onMouseLeave={stopDrawing}
                   onTouchStart={startDrawing}
                   onTouchMove={draw}
                   onTouchEnd={stopDrawing}
                ></canvas>
             </div>
             <p className="text-xs text-gray-400 mt-2 text-center">Use mouse or finger to sign inside the box</p>
          </div>
          
        </section>

        {/* Submit */}
        <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
           <button type="button" onClick={() => router.back()} className="px-8 py-4 rounded-xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              Cancel
           </button>
           <button disabled={loading} type="submit" className="px-10 py-4 rounded-xl font-bold bg-[#0B1F3A] text-white hover:bg-[#112d54] hover:shadow-xl hover:shadow-[#0B1F3A]/20 transition-all flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">contract</span>
                  Generate Agreement
                </>
              )}
           </button>
        </div>

      </form>
    </div>
  );
}
