import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { Accordion } from '@/components/ui/Accordion';
import { getFAQs } from '@/lib/supabase/queries';
import { BUSINESS, whatsappLink } from '@/lib/constants';

import { getAdminSettings } from '@/lib/supabase/queries';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  return {
    title: `FAQ & Support | ${name}`,
    description: 'Find answers to frequently asked questions about car rentals, security deposits, insurance, and our self-drive policies in Indore.',
    alternates: {
      canonical: '/faq',
    },
  };
}

export default async function FAQPage() {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const phone = settings.business_phone || BUSINESS.phone;
  const phoneDisplay = phone.replace(/^\+91/, '');
  const whatsappNumber = settings.business_whatsapp || BUSINESS.whatsapp;
  
  const faqs = await getFAQs();

  // Map to Accordion format
  const accordionItems = faqs.map(faq => ({
    id: faq.id ? faq.id.toString() : Math.random().toString(),
    title: faq.question,
    content: <div dangerouslySetInnerHTML={{ __html: faq.answer }} className="prose prose-sm prose-slate max-w-none text-gray-500" />
  }));

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <main className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      
      {/* Page Header */}
      <header className="bg-[#000615] relative overflow-hidden pt-32 pb-24 px-6 lg:px-8 border-b border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1152d4] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E89B10] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <nav className="flex justify-center mb-6 text-sm font-bold tracking-widest text-white/40 uppercase">
            <span>Home</span>
            <span className="mx-3 text-[#E89B10]">•</span>
            <span className="text-white">FAQ</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-headline tracking-tight mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about renting a car with {name}. Can't find the answer you're looking for? Reach out to our 24/7 support team.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start">
          
          {/* FAQ Accordion */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            {faqs.length > 0 ? (
              <Accordion items={accordionItems} />
            ) : (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">search_off</span>
                <p className="text-gray-500 font-medium">No FAQs available at the moment. Please check back later.</p>
              </div>
            )}
          </div>

          {/* Support Sidebar Sticky */}
          <div className="sticky top-32 space-y-6">
            <div className="bg-[#0B1F3A] p-8 rounded-3xl relative overflow-hidden shadow-2xl">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#E89B10] rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-white">support_agent</span>
                </div>
                <h3 className="text-xl font-black text-white font-headline mb-3">Still have questions?</h3>
                <p className="text-white/60 text-sm mb-8 leading-relaxed">
                  Our dedicated support team is available 24/7 to assist you with bookings, roadside help, or general inquiries.
                </p>
                <div className="space-y-3">
                  <a href={`tel:${phone}`} className="flex items-center gap-3 w-full bg-white text-[#0B1F3A] py-3 px-4 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-xl">call</span>
                    {phoneDisplay}
                  </a>
                  <a href={whatsappLink(`Hi ${name} Support, I have a question regarding a rental.`, whatsappNumber)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full bg-[#25D366] text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-[#20bd5a] transition-colors">
                    <span className="material-symbols-outlined text-xl">chat</span>
                    Message on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
               <span className="material-symbols-outlined text-[#1152d4] text-2xl">info</span>
               <div>
                 <h4 className="font-bold text-[#0B1F3A] mb-1">Rental Requirements</h4>
                 <p className="text-gray-500 text-sm">To rent a car, you must be 21+ years old and hold a valid Indian driving license & original Aadhaar card.</p>
               </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
