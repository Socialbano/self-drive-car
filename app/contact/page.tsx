import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { ContactForm } from '@/components/forms/ContactForm';
import { BUSINESS, whatsappLink } from '@/lib/constants';

import { getAdminSettings } from '@/lib/supabase/queries';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const city = settings.business_city || BUSINESS.city;
  return {
    title: `Contact Us | ${name} ${city}`,
    description: `Get in touch with ${name} for self-drive car rentals in ${city}. Call us, WhatsApp us, or visit our office.`,
    alternates: {
      canonical: '/contact',
    },
  };
}

export default async function ContactPage() {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const address = settings.business_address || BUSINESS.address;
  const phone = settings.business_phone || BUSINESS.phone;
  const phoneDisplay = phone.replace(/^\+91/, '');
  const email = settings.business_email || BUSINESS.email;
  const whatsappNumber = settings.business_whatsapp || BUSINESS.whatsapp;
  const city = settings.business_city || BUSINESS.city;
  
  return (
    <main className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <Navbar />
      
      <header className="bg-[#000615] relative overflow-hidden pt-32 pb-24 px-6 lg:px-8 border-b border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: 'var(--color-primary)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E89B10] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <nav className="flex justify-center mb-6 text-sm font-bold tracking-widest text-white/40 uppercase">
            <span>Home</span>
            <span className="mx-3 text-[#E89B10]">•</span>
            <span className="text-white">Contact Us</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-headline tracking-tight mb-6">
            Let's Start Your <span className="gradient-text">Journey</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Have a question about our fleet? Need help with a booking? Our team is available 24/7 to assist you.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">
          
          {/* Left Column - Contact Info */}
          <div className="space-y-12">
             <div>
                <h2 className="text-3xl font-black text-[#0B1F3A] font-headline mb-4">Get in Touch</h2>
                <p className="text-gray-500">Reach out to us through any of the channels below, or drop by our office for a cup of coffee and a chat about your next road trip.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Address Card */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-4">
                   <div className="w-12 h-12 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-2xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">map</span>
                   </div>
                   <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Our Office</h4>
                      <p className="font-bold text-[#0B1F3A] leading-relaxed">{address}</p>
                   </div>
                </div>

                {/* Phone Card */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-4">
                   <div className="w-12 h-12 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-2xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">call</span>
                   </div>
                   <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Call Us 24/7</h4>
                      <a href={`tel:${phone}`} className="font-bold text-[#0B1F3A] hover:text-[var(--color-accent)] transition-colors">{phoneDisplay}</a>
                   </div>
                </div>

                {/* Email Card */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-4">
                   <div className="w-12 h-12 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-2xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">mail</span>
                   </div>
                   <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email Us</h4>
                      <a href={`mailto:${email}`} className="font-bold text-[#0B1F3A] hover:text-[var(--color-accent)] transition-colors">{email}</a>
                   </div>
                </div>

                {/* WhatsApp Card */}
                <div className="bg-[#25D366]/5 p-6 rounded-3xl border border-[#25D366]/20 flex gap-4">
                   <div className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] rounded-2xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">chat</span>
                   </div>
                   <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#25D366] mb-1">WhatsApp</h4>
                      <a href={whatsappLink(`Hi ${name}! I need some assistance.`, whatsappNumber)} target="_blank" rel="noopener noreferrer" className="font-bold text-[#0B1F3A] hover:text-[#25D366] transition-colors">Chat with us instantly</a>
                   </div>
                </div>
             </div>

             {/* Map Placeholder */}
             <div className="aspect-[21/9] bg-gray-100 rounded-3xl overflow-hidden relative border border-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" 
                  alt={`${name || 'Self Drive Car'} rental office location map in ${city || 'Indore'}`} 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-100 shadow-xl flex items-center gap-3">
                      <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full animate-ping"></div>
                      <span className="font-bold text-[#0B1F3A]">{city}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column - Form */}
          <div className="relative">
             <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-2xl shadow-[#0B1F3A]/5 sticky top-32">
                <h3 className="text-2xl font-black text-[#0B1F3A] font-headline mb-2">Send an Inquiry</h3>
                <p className="text-gray-500 mb-8 text-sm">Tell us about your trip and we'll find the perfect car for you.</p>

                 <ContactForm />
             </div>
          </div>

        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
