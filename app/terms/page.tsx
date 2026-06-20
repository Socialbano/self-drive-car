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
    title: `Terms & Conditions | ${name} | Self Drive Cars`,
    description: `Read the Terms & Conditions for renting a self-drive car with ${name}. Learn about rules, eligibility, user accounts, and liability policies.`,
    alternates: {
      canonical: '/terms',
    },
  };
}

export default async function TermsPage() {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const whatsappNumber = settings.business_whatsapp || BUSINESS.whatsapp;
  const whatsappMsg = `Hi! I have a question regarding the Terms and Conditions of ${name}.`;
  
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
            <span className="text-white/70">Terms & Conditions</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight text-white">
            Terms & <span className="text-[#E89B10] bg-gradient-to-r from-[#E89B10] to-[#FFD700] bg-clip-text text-transparent">Conditions</span>
          </h1>
          
          <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Please read these terms carefully before booking your self-drive ride with {name}.
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
                { label: '1. Acceptance of Terms', href: '#acceptance' },
                { label: '2. User Accounts & Verification', href: '#verification' },
                { label: '3. Usage Restrictions', href: '#restrictions' },
                { label: '4. Intellectual Property', href: '#property' },
                { label: '5. Limitation of Liability', href: '#liability' },
                { label: '6. Dispute Resolution', href: '#disputes' },
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
            
            <div id="acceptance" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">1</span>
                Acceptance of Terms
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                By accessing this website, booking a vehicle, or using any services provided by {name}, you signify your agreement and consent to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our website or services. We reserve the right to modify these terms at any time without prior notice.
              </p>
            </div>

            <div id="verification" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">2</span>
                User Accounts & Verification
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                To rent a vehicle, you must create an account and complete our document verification process. You agree to provide accurate, current, and complete information.
              </p>
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 text-sm space-y-2">
                <p className="font-bold text-amber-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">verified_user</span> Mandatory Documents for Verification:
                </p>
                <ul className="list-disc pl-5 text-amber-700 space-y-1">
                  <li>Valid LMV Driving License (minimum 1 year old, original must be shown during pick-up).</li>
                  <li>Aadhaar Card or Passport (original identity verification required).</li>
                  <li>Local address proof if your ID has a non-local address.</li>
                </ul>
              </div>
            </div>

            <div id="restrictions" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">3</span>
                Usage Restrictions
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                The renter agrees to use the vehicle with reasonable care and strictly in accordance with local traffic laws. The following operations are strictly prohibited:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-500 text-sm font-medium">
                <li className="flex gap-2 items-start">
                  <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">cancel</span>
                  Sub-leasing, lending, or letting unauthorized people drive.
                </li>
                <li className="flex gap-2 items-start">
                  <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">cancel</span>
                  Using the vehicle for racing, off-roading, or towing.
                </li>
                <li className="flex gap-2 items-start">
                  <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">cancel</span>
                  Carrying contraband, hazardous, or illegal goods.
                </li>
                <li className="flex gap-2 items-start">
                  <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">cancel</span>
                  Driving under the influence of alcohol or drugs.
                </li>
              </ul>
            </div>

            <div id="property" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">4</span>
                Intellectual Property
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                All content, logos, website layout, images, and designs on this platform are the intellectual property of {name} and are protected by applicable trademark and copyright laws. Unauthorized reproduction or usage of any assets is strictly prohibited.
              </p>
            </div>

            <div id="liability" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">5</span>
                Limitation of Liability
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                {name} shall not be liable for any indirect, incidental, or consequential damages arising out of your booking, rental, or usage of the vehicle. Renter takes full responsibility for any loss of personal items left in the car, mechanical issues caused due to reckless driving, or third-party claims.
              </p>
            </div>

            <div id="disputes" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">6</span>
                Dispute Resolution
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                These terms are governed by the laws of India. Any disputes, claims, or controversies arising under these terms or related to the vehicle rental shall be subject to the exclusive jurisdiction of the courts of {settings.business_city || BUSINESS.city}, Madhya Pradesh.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Support Callout Section */}
      <section className="bg-white py-16 px-6 lg:px-8 border-t border-slate-100 flex justify-center">
        <div className="max-w-4xl w-full bg-gradient-brand-cta border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <h3 className="text-2xl font-black text-white font-headline">Have Questions About Our Terms?</h3>
            <p className="text-white/60 text-xs md:text-sm">
              If you need clarification regarding eligibility, security deposits, or usage policies, feel free to contact us.
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
