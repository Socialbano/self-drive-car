import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { BUSINESS, whatsappLink } from '@/lib/constants';
import { getAdminSettings } from '@/lib/supabase/queries';
import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  return {
    title: `Rental Terms & Rules | ${name} | Self Drive Cars`,
    description: `Understand rental conditions, security deposit refunds, fuel policies, speed limits, and damage liabilities at ${name}.`,
    alternates: {
      canonical: '/rental-terms',
    },
  };
}

export default async function RentalTermsPage() {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const whatsappNumber = settings.business_whatsapp || BUSINESS.whatsapp;
  const whatsappMsg = `Hi! I want to understand more about the Rental Terms & conditions of ${name}.`;
  
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-40 pb-20 px-6 lg:px-8 bg-[#050B14] text-white flex flex-col items-center justify-center text-center overflow-hidden"
               style={{ backgroundImage: 'radial-gradient(rgba(232, 155, 16, 0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        
        {/* Background Glowing Blobs */}
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ backgroundColor: 'var(--color-accent)' }}></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[150px] opacity-10 pointer-events-none" style={{ backgroundColor: 'var(--color-primary)' }}></div>
        
        <div className="max-w-4xl mx-auto z-10 space-y-4">
          <nav className="flex justify-center mb-4 text-xs font-bold tracking-[0.25em] text-[#E89B10] uppercase">
            <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
            <span className="mx-3 text-white/30">•</span>
            <span className="text-white/70">Rental Terms</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight text-white">
            Rental <span className="text-[#E89B10] bg-gradient-to-r from-[#E89B10] to-[#FFD700] bg-clip-text text-transparent">Terms & Rules</span>
          </h1>
          
          <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Simple, transparent, and fair policies for a hassle-free driving experience.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sticky Sidebar Navigation (Desktop) */}
          <aside className="lg:col-span-4 sticky top-32 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hidden lg:block">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              On This Page
            </h3>
            <nav className="space-y-3">
              {[
                { label: '1. Driver Eligibility', href: '#eligibility' },
                { label: '2. Security Deposit Refund', href: '#deposit' },
                { label: '3. Speed Limit & Overspeeding', href: '#speed' },
                { label: '4. Fuel Policy', href: '#fuel' },
                { label: '5. Accident & Vehicle Damage', href: '#damage' },
                { label: '6. Late Return Fees', href: '#late' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-slate-500 hover:text-[#E89B10] text-sm font-medium transition-colors border-l-2 border-transparent hover:border-[#E89B10] pl-3"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Legal Content */}
          <div className="lg:col-span-8 space-y-12 bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm">
            
            <div id="eligibility" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">1</span>
                Driver Eligibility
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                To hire and drive a vehicle, the renter must meet the following baseline conditions:
              </p>
              <ul className="list-disc pl-5 text-slate-500 text-sm space-y-1 font-body">
                <li>Be at least 21 years of age.</li>
                <li>Hold a valid LMV Driving License (Original document must be physical/DigiLocker version, photos/copies are not accepted).</li>
                <li>Present a valid Government ID (Aadhaar Card, Voter ID, or Passport).</li>
              </ul>
            </div>

            <div id="deposit" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">2</span>
                Security Deposit Refund
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                Depending on the car model, a refundable security deposit is charged during delivery or booking. This deposit is fully refunded within **24 to 48 hours** after the vehicle is returned, subject to confirmation of zero damages, zero traffic violations, and timely return.
              </p>
              <div className="bg-[#E89B10]/5 border border-[#E89B10]/20 rounded-2xl p-5 text-sm">
                <p className="font-bold text-[#0B1F3A] flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-base text-[#E89B10]">payments</span> Zero Security Deposit Option
                </p>
                <p className="text-slate-600 leading-relaxed">
                  We offer zero security deposit options on selected budget cars for verified repeat customers and corporate profiles.
                </p>
              </div>
            </div>

            <div id="speed" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">3</span>
                Speed Limit & Overspeeding
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                For safety, our entire fleet is equipped with smart GPS speed monitors. The maximum permitted speed limit is:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-4 items-center">
                  <span className="material-symbols-outlined text-[#E89B10] text-3xl shrink-0">speed</span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Max Speed Limit</p>
                    <p className="text-xs text-slate-500">100 km/hr (National Highways) / 80 km/hr (State roads)</p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-4 items-center">
                  <span className="material-symbols-outlined text-red-500 text-3xl shrink-0">warning</span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Overspeeding Fine</p>
                    <p className="text-xs text-slate-500">₹500 per overspeed alert generated by the GPS tracker</p>
                  </div>
                </div>
              </div>
            </div>

            <div id="fuel" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">4</span>
                Fuel Policy
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                We operate on a **Like-to-Like Fuel Policy**. The renter must return the vehicle with the same level of fuel as recorded during checkout. If the car is returned with less fuel, fuel charges plus a handling surcharge of ₹200 will be deducted from the security deposit. No refunds are provided for extra fuel left in the car.
              </p>
            </div>

            <div id="damage" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">5</span>
                Accident & Vehicle Damage
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                In the unfortunate event of an accident or collision, the renter must report the incident to {name} support immediately.
              </p>
              <ul className="list-disc pl-5 text-slate-500 text-sm space-y-1 font-body">
                <li>Minor scratches/dents: Evaluated on actual repair cost from authorized service center workshops.</li>
                <li>Major accidents: Insurance claim benefits will be availed. The renter is liable for the insurance file charge/excess liability (capped at ₹10,000 for standard claims) plus loss of business days (down-time) for the vehicle during repairs.</li>
                <li>Violating laws (e.g. drunken driving, racing) invalidates insurance; renter holds full liability for the entire car cost in such cases.</li>
              </ul>
            </div>

            <div id="late" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">6</span>
                Late Return Fees
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                Please extend your booking in advance through our portal to avoid late charges. Unauthorized delays in vehicle return disrupt subsequent bookings and carry a penalty:
              </p>
              <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 text-sm flex gap-3 items-start">
                <span className="material-symbols-outlined text-red-500 mt-0.5">schedule</span>
                <p className="text-red-800 leading-relaxed">
                  <strong>Late Return Penalty:</strong> An initial grace period of 30 minutes is allowed. Thereafter, a flat penalty of ₹500/hour plus the standard double hourly rate of the car model is applied.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Support Callout Section */}
      <section className="bg-white py-16 px-6 lg:px-8 border-t border-slate-100 flex justify-center">
        <div className="max-w-4xl w-full bg-gradient-brand-cta border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <h3 className="text-2xl font-black text-white font-headline">Need Clarity on Rental Rules?</h3>
            <p className="text-white/60 text-xs md:text-sm">
              We are committed to absolute transparency. If you have questions about fuel level calculation, overspeeding alerts, or damage claims, chat with us.
            </p>
            <div className="pt-4">
              <a href={whatsappLink(whatsappMsg, whatsappNumber)}
                 target="_blank"
                 rel="noreferrer"
                 className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#25D366] hover:bg-[#25D366]/90 text-white transition-all duration-300 hover:scale-[1.03]">
                <span className="material-symbols-outlined text-lg">chat</span>
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
