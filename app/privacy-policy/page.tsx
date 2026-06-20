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
    title: `Privacy Policy | ${name} | Self Drive Cars`,
    description: `Learn how ${name} collects, protects, and manages your personal data and documents during car booking.`,
    alternates: {
      canonical: '/privacy-policy',
    },
  };
}

export default async function PrivacyPolicyPage() {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const whatsappNumber = settings.business_whatsapp || BUSINESS.whatsapp;
  const whatsappMsg = `Hi! I have a question regarding the Privacy Policy of ${name}.`;
  
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
            <span className="text-white/70">Privacy Policy</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight text-white">
            Privacy <span className="text-[#E89B10] bg-gradient-to-r from-[#E89B10] to-[#FFD700] bg-clip-text text-transparent">Policy</span>
          </h1>
          
          <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Your privacy and document security are our highest priority.
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
                { label: '1. Information We Collect', href: '#collect' },
                { label: '2. How We Use Information', href: '#use' },
                { label: '3. Data Security & Storage', href: '#security' },
                { label: '4. Cookies & Analytics', href: '#cookies' },
                { label: '5. Third-Party Sharing', href: '#sharing' },
                { label: '6. Your Document Rights', href: '#rights' },
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
            
            <div id="collect" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">1</span>
                Information We Collect
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                We collect personal information necessary to facilitate vehicle rentals and verify renter identity. This includes:
              </p>
              <ul className="list-disc pl-5 text-slate-500 text-sm space-y-1">
                <li>Identity details: Name, mobile number, email address, physical address.</li>
                <li>Verification documents: Scanned copies of your Driving License and Aadhaar Card/Passport.</li>
                <li>Location data: Real-time GPS coordinates of the rented vehicle for safety and recovery.</li>
              </ul>
            </div>

            <div id="use" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">2</span>
                How We Use Information
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                Your data is strictly utilized for core operational needs:
              </p>
              <ul className="list-disc pl-5 text-slate-500 text-sm space-y-1">
                <li>To confirm your eligibility to drive our vehicles according to Indian laws.</li>
                <li>To generate rental agreements, invoices, and billing summaries.</li>
                <li>To manage and track our fleet using installed secure GPS systems.</li>
                <li>To contact you regarding your booking updates, support, or special offers (via SMS/WhatsApp).</li>
              </ul>
            </div>

            <div id="security" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">3</span>
                Data Security & Storage
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                We implement robust security measures to protect your documents. All files uploaded to {name} are encrypted and stored in secure cloud servers powered by Supabase. Access is restricted to authorized operations staff only. We do not sell, rent, or trade your personal data to any marketing agencies.
              </p>
            </div>

            <div id="cookies" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">4</span>
                Cookies & Analytics
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                Our site uses cookies to enhance your browsing experience, remember your preferences, and track visitor statistics through Google Analytics. You can adjust your browser settings to reject cookies, though some features might not function correctly.
              </p>
            </div>

            <div id="sharing" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">5</span>
                Third-Party Sharing
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                We share data with third parties only when essential:
              </p>
              <ul className="list-disc pl-5 text-slate-500 text-sm space-y-1">
                <li>Payment Processors: Secure payment gateways to handle transactions.</li>
                <li>WhatsApp Business API: To send dynamic booking confirmation slips.</li>
                <li>Law Enforcement: In the event of vehicle theft, accidents, traffic violations, or official legal summons.</li>
              </ul>
            </div>

            <div id="rights" className="scroll-mt-32 space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-[#0B1F3A] font-headline flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#E89B10]/10 text-[#E89B10] flex items-center justify-center text-sm font-bold">6</span>
                Your Document Rights
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-body">
                Once your rental contract is successfully completed, closed, and all dues are settled, you hold the right to request the deletion or purging of your verified ID documents from our active database. Please contact us via support channels to initiate document removal.
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
            <h3 className="text-2xl font-black text-white font-headline">Privacy Concerns?</h3>
            <p className="text-white/60 text-xs md:text-sm">
              If you have any questions regarding how your data is handled or wish to request document removal, message our privacy team.
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
