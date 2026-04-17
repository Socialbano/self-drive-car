import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { Accordion } from '@/components/ui/Accordion';
import { getFAQs } from '@/lib/supabase/queries';
import { BUSINESS, whatsappLink } from '@/lib/constants';

export const metadata = {
  title: `FAQ & Support | ${BUSINESS.name}`,
  description: 'Find answers to frequently asked questions about car rentals, security deposits, insurance, and our self-drive policies in Indore.',
  alternates: {
    canonical: '/faq',
  },
};

export default async function FAQPage() {
  const faqs = [
    {
      id: 1,
      question: "Can I get a self drive car in Indore?",
      answer: "Yes! SkydeepGroup offers the most reliable self drive car Indore service. Whether you need a simple hatchback for city errands or a big SUV for family travel, you can easily rent a car without driver from us."
    },
    {
      id: 2,
      question: "What is the self drive car Indore price per day?",
      answer: "Humara pricing bohot simple aur transparent hai. Our self drive car Indore price starts from just ₹1200 per day. Koi hidden charges nahi hain; what you see is exactly what you pay!"
    },
    {
      id: 3,
      question: "What documents do I need to rent a car?",
      answer: "Gaadi rent karne ke liye aapko bas ek valid original Indian Driving License, apna Aadhaar Card, aur ek alternative ID (like Voter ID or Passport) dikhani hogi. Simple document check and you are good to go!"
    },
    {
      id: 4,
      question: "Can I get a self drive car Indore airport par?",
      answer: "Haan bilkul! Hum hassle-free airport pickup aur drop facility provide karte hain. Agar aap landing ke baad seedhe safely apne hotel jana chahte hain, toh choose our self drive car Indore airport delivery options."
    },
    {
      id: 5,
      question: "Do you deliver cars in the Vijay Nagar area?",
      answer: "Yes, we offer fast delivery for car rental Indore Vijay Nagar and surrounding prime areas. Agar aap Vijay Nagar ya Bhawarkua mein hain, toh aap easily humari home delivery facilities ka fayda utha sakte hain."
    },
    {
      id: 6,
      question: "How to quickly book a self drive car near me?",
      answer: "Booking is super easy! Apni pasand ki car website par select karein and WhatsApp button dabayein. For a quick \"self drive car near me\" search, just ping us your location and we'll arrange the closest available vehicle."
    },
    {
      id: 7,
      question: "Kya main outstation travel ke liye gaadi le ja sakta hu?",
      answer: "Absolutely! Our car rental Indore without driver is perfect for outstation trips like Ujjain Mahakal, Omkareshwar, ya out-of-state travel. Hum long road trips ke liye specially customized packages bhi dete hain."
    },
    {
      id: 8,
      question: "Is there a daily KM limit for road trips?",
      answer: "Standard daily rentals mein generally 300 KM per day ki generous limit hoti hai. Agar aap limit cross karte hain, toh sirf ek nominal per KM charge apply hota hai. No heavy penalties!"
    },
    {
      id: 9,
      question: "What is your fuel policy for self-drive cars?",
      answer: "Hum \"Level-to-Level\" fuel policy effectively follow karte hain. Jis fuel level par hum aapko gaadi deliver karte hain, exactly ussi level par aapko gaadi wapis karni hoti hai. Simple and clean."
    },
    {
      id: 10,
      question: "Is any security deposit required to rent a vehicle?",
      answer: "Hum zero hidden fees mein believe karte hain! Bas approval/verification process ke dauran ek chhota refundable security deposit liya jata hai. Safely car return karne ke baad ye amount instantly refund ho jata hai."
    },
    {
      id: 11,
      question: "What is the minimum age to drive your rental cars?",
      answer: "SkydeepGroup se directly gaadi rent karne ke liye aapki age at least 21 saal honi chahiye. Saath hi, safety standards ke liye aapke paas kam se kam ek saal purana valid driving license hona zaroori hai."
    },
    {
      id: 12,
      question: "Can I book a luxury car rental Indore for a wedding?",
      answer: "Ji haan! Hum premium luxury car rental Indore options bhi provide karte hain. Whether it's a VIP event, a wedding, or a special anniversary, you can book our top-tier SUVs and sedans in advance."
    },
    {
      id: 13,
      question: "How can I securely pay for my car booking?",
      answer: "Aap UPI apps (Google Pay, PhonePe, Paytm), Net Banking, ya bank transfer ke through payment kar sakte hain. Secure your booking online on WhatsApp before taking the keys!"
    },
    {
      id: 14,
      question: "How can I just book a vehicle via WhatsApp?",
      answer: "Sabse fast confirmation ke liye, humari website pe \"Book via WhatsApp\" button par click karein. Humari 24/7 support team aapse instantly connect karegi and aapki gaadi confirm kar degi."
    },
    {
      id: 15,
      question: "What is your cancellation and refund policy?",
      answer: "Because travel plans can change, hum flexible cancellation options dete hain. Agar aapko cancel karna hai, toh please trip start hone se 24 hours pehle bata dein taaki standard refund process initiate ho sake."
    },
    {
      id: 16,
      question: "What happens if I return the car late?",
      answer: "Agar aap raste mein stuck ho gaye hain aur late hain, toh please humari team ko time se pehle urgently inform karein. Uninformed late returns par standard hourly rental penalty apply hoti hai."
    },
    {
      id: 17,
      question: "How do I know if my favorite car is available?",
      answer: "Humari fleet hamesha in-demand rehti hai. Apni choice ki SUV ya hatchback select karke turant hume WhatsApp drop karein. We will check real-time availability and block the car for your dates immediately."
    }
  ];

  // Map to Accordion format
  const accordionItems = faqs.map(faq => ({
    id: faq.id.toString(),
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
            Everything you need to know about renting a car with Skydeepgroup. Can't find the answer you're looking for? Reach out to our 24/7 support team.
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
                  <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-3 w-full bg-white text-[#0B1F3A] py-3 px-4 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined text-xl">call</span>
                    {BUSINESS.phoneDisplay}
                  </a>
                  <a href={whatsappLink('Hi Skydeep Support, I have a question regarding a rental.')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full bg-[#25D366] text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-[#20bd5a] transition-colors">
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
