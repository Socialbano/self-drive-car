import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { BUSINESS, whatsappLink } from '@/lib/constants';
import { getAdminSettings, getTestimonials } from '@/lib/supabase/queries';
import { ABOUT_DEFAULTS } from '@/lib/about-defaults';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const city = settings.business_city || BUSINESS.city;
  return {
    title: `About Us | Premium Self-Drive Rental | ${name}`,
    description: `Discover how ${name} is transforming self-drive rentals in ${city} with a curated luxury fleet, zero security deposit, and verified vehicles.`,
    alternates: {
      canonical: '/about',
    },
  };
}

export default async function AboutPage() {
  const settings = await getAdminSettings();
  const name = settings.business_name || BUSINESS.name;
  const whatsappNumber = settings.business_whatsapp || BUSINESS.whatsapp;
  const whatsappMsg = settings.whatsapp_default_msg || 'Hi! I want to book a premium self drive car.';
  const city = settings.business_city || BUSINESS.city;

  const dbTestimonials = await getTestimonials();
  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : [
    {
      id: 'static-1',
      customer_name: 'Rahul Sharma',
      city: city,
      review_text: "Best experience renting a Thar for my weekend trip to Mandu. The car was spotless and the process was super smooth. Highly recommended!",
      rating: 5,
      car_rented: 'Thar'
    },
    {
      id: 'static-2',
      customer_name: 'Ananya Jain',
      city: city,
      review_text: `No security deposit is a game changer. ${name} makes it so easy to get a car whenever you need one. Professional service.`,
      rating: 5,
      car_rented: 'Self Drive'
    },
    {
      id: 'static-3',
      customer_name: 'Vivek Gupta',
      city: city,
      review_text: "Very prompt response and clean cars. Used their Fortuner for a family event and it was perfect. Will definitely rent again.",
      rating: 5,
      car_rented: 'Fortuner'
    }
  ];

  const s = {
    heroTitle: settings.about_hero_title || ABOUT_DEFAULTS.about_hero_title,
    heroSubtitle: settings.about_hero_subtitle || ABOUT_DEFAULTS.about_hero_subtitle,
    
    statTrips: settings.about_stat_trips || ABOUT_DEFAULTS.about_stat_trips,
    statTripsLabel: settings.about_stat_trips_label || ABOUT_DEFAULTS.about_stat_trips_label,
    statCustomers: settings.about_stat_customers || ABOUT_DEFAULTS.about_stat_customers,
    statCustomersLabel: settings.about_stat_customers_label || ABOUT_DEFAULTS.about_stat_customers_label,
    statVehicles: settings.about_stat_vehicles || ABOUT_DEFAULTS.about_stat_vehicles,
    statVehiclesLabel: settings.about_stat_vehicles_label || ABOUT_DEFAULTS.about_stat_vehicles_label,
    statCities: settings.about_stat_cities || ABOUT_DEFAULTS.about_stat_cities,
    statCitiesLabel: settings.about_stat_cities_label || ABOUT_DEFAULTS.about_stat_cities_label,

    introTitle: settings.about_intro_title || ABOUT_DEFAULTS.about_intro_title,
    introDesc: settings.about_intro_desc || ABOUT_DEFAULTS.about_intro_desc,
    introLocationText: settings.about_intro_location_text || ABOUT_DEFAULTS.about_intro_location_text,

    card1Title: settings.about_card1_title || ABOUT_DEFAULTS.about_card1_title,
    card1Desc: settings.about_card1_desc || ABOUT_DEFAULTS.about_card1_desc,
    card1Icon: settings.about_card1_icon || ABOUT_DEFAULTS.about_card1_icon,
    card2Title: settings.about_card2_title || ABOUT_DEFAULTS.about_card2_title,
    card2Desc: settings.about_card2_desc || ABOUT_DEFAULTS.about_card2_desc,
    card2Icon: settings.about_card2_icon || ABOUT_DEFAULTS.about_card2_icon,
    card3Title: settings.about_card3_title || ABOUT_DEFAULTS.about_card3_title,
    card3Desc: settings.about_card3_desc || ABOUT_DEFAULTS.about_card3_desc,
    card3Icon: settings.about_card3_icon || ABOUT_DEFAULTS.about_card3_icon,
    card4Title: settings.about_card4_title || ABOUT_DEFAULTS.about_card4_title,
    card4Desc: settings.about_card4_desc || ABOUT_DEFAULTS.about_card4_desc,
    card4Icon: settings.about_card4_icon || ABOUT_DEFAULTS.about_card4_icon,
    card5Title: settings.about_card5_title || ABOUT_DEFAULTS.about_card5_title,
    card5Desc: settings.about_card5_desc || ABOUT_DEFAULTS.about_card5_desc,
    card5Icon: settings.about_card5_icon || ABOUT_DEFAULTS.about_card5_icon,
    card6Title: settings.about_card6_title || ABOUT_DEFAULTS.about_card6_title,
    card6Desc: settings.about_card6_desc || ABOUT_DEFAULTS.about_card6_desc,
    card6Icon: settings.about_card6_icon || ABOUT_DEFAULTS.about_card6_icon,

    founderName: settings.about_founder_name || ABOUT_DEFAULTS.about_founder_name,
    founderTitle: settings.about_founder_title || ABOUT_DEFAULTS.about_founder_title,
    founderStory: settings.about_founder_story || ABOUT_DEFAULTS.about_founder_story,
    founderQuote: settings.about_founder_quote || ABOUT_DEFAULTS.about_founder_quote,
    founderAvatarUrl: settings.about_founder_avatar_url || ABOUT_DEFAULTS.about_founder_avatar_url,

    whyCard1Title: settings.about_why_card1_title || ABOUT_DEFAULTS.about_why_card1_title,
    whyCard1Desc: settings.about_why_card1_desc || ABOUT_DEFAULTS.about_why_card1_desc,
    whyCard2Title: settings.about_why_card2_title || ABOUT_DEFAULTS.about_why_card2_title,
    whyCard2Desc: settings.about_why_card2_desc || ABOUT_DEFAULTS.about_why_card2_desc,
    whyCard3Title: settings.about_why_card3_title || ABOUT_DEFAULTS.about_why_card3_title,
    whyCard3Desc: settings.about_why_card3_desc || ABOUT_DEFAULTS.about_why_card3_desc,
    whyCard4Title: settings.about_why_card4_title || ABOUT_DEFAULTS.about_why_card4_title,
    whyCard4Desc: settings.about_why_card4_desc || ABOUT_DEFAULTS.about_why_card4_desc,
    whyCard5Title: settings.about_why_card5_title || ABOUT_DEFAULTS.about_why_card5_title,
    whyCard5Desc: settings.about_why_card5_desc || ABOUT_DEFAULTS.about_why_card5_desc,
    whyCard6Title: settings.about_why_card6_title || ABOUT_DEFAULTS.about_why_card6_title,
    whyCard6Desc: settings.about_why_card6_desc || ABOUT_DEFAULTS.about_why_card6_desc,

    step1Title: settings.about_step1_title || ABOUT_DEFAULTS.about_step1_title,
    step1Desc: settings.about_step1_desc || ABOUT_DEFAULTS.about_step1_desc,
    step2Title: settings.about_step2_title || ABOUT_DEFAULTS.about_step2_title,
    step2Desc: settings.about_step2_desc || ABOUT_DEFAULTS.about_step2_desc,
    step3Title: settings.about_step3_title || ABOUT_DEFAULTS.about_step3_title,
    step3Desc: settings.about_step3_desc || ABOUT_DEFAULTS.about_step3_desc,
    step4Title: settings.about_step4_title || ABOUT_DEFAULTS.about_step4_title,
    step4Desc: settings.about_step4_desc || ABOUT_DEFAULTS.about_step4_desc,
    step5Title: settings.about_step5_title || ABOUT_DEFAULTS.about_step5_title,
    step5Desc: settings.about_step5_desc || ABOUT_DEFAULTS.about_step5_desc,

    ctaTitle: settings.about_cta_title || ABOUT_DEFAULTS.about_cta_title,
    ctaDesc: settings.about_cta_desc || ABOUT_DEFAULTS.about_cta_desc,
  };

  const featureCards = [
    { title: s.card1Title, desc: s.card1Desc, icon: s.card1Icon || 'clean_hands' },
    { title: s.card2Title, desc: s.card2Desc, icon: s.card2Icon || 'support_agent' },
    { title: s.card3Title, desc: s.card3Desc, icon: s.card3Icon || 'gps_fixed' },
    { title: s.card4Title, desc: s.card4Desc, icon: s.card4Icon || 'directions_car' },
    { title: s.card5Title, desc: s.card5Desc, icon: s.card5Icon || 'speed' },
    { title: s.card6Title, desc: s.card6Desc, icon: s.card6Icon || 'security' },
  ];

  const whyChooseUsCards = [
    { title: s.whyCard1Title, desc: s.whyCard1Desc, icon: 'bolt', style: 'md:col-span-2' },
    { title: s.whyCard2Title, desc: s.whyCard2Desc, icon: 'directions_car', style: 'md:col-span-1' },
    { title: s.whyCard3Title, desc: s.whyCard3Desc, icon: 'payments', style: 'md:col-span-1' },
    { title: s.whyCard4Title, desc: s.whyCard4Desc, icon: 'build', style: 'md:col-span-2' },
    { title: s.whyCard5Title, desc: s.whyCard5Desc, icon: 'description', style: 'md:col-span-1' },
    { title: s.whyCard6Title, desc: s.whyCard6Desc, icon: 'emergency_share', style: 'md:col-span-2' },
  ];

  const timelineSteps = [
    { title: s.step1Title, desc: s.step1Desc },
    { title: s.step2Title, desc: s.step2Desc },
    { title: s.step3Title, desc: s.step3Desc },
    { title: s.step4Title, desc: s.step4Desc },
    { title: s.step5Title, desc: s.step5Desc },
  ];

  const getInitials = (founderName: string) => {
    return founderName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Premium Hero Section - Dark Navy Background for High Impact Contrast */}
      <section className="relative pt-40 pb-28 px-6 lg:px-8 bg-[#050B14] text-white flex flex-col items-center justify-center text-center overflow-hidden"
               style={{ backgroundImage: 'radial-gradient(rgba(232, 155, 16, 0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        
        {/* Background Glowing Blobs */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[150px] opacity-10 pointer-events-none" style={{ backgroundColor: 'var(--color-accent)' }}></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[180px] opacity-10 pointer-events-none" style={{ backgroundColor: 'var(--color-primary)' }}></div>
        
        <div className="max-w-4xl mx-auto z-10 space-y-6">
          <nav className="flex justify-center mb-6 text-xs font-bold tracking-[0.25em] text-[#E89B10] uppercase">
            <span>Home</span>
            <span className="mx-3 text-white/30">•</span>
            <span className="text-white/70">About Us</span>
          </nav>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-headline tracking-tight text-white leading-[1.1]">
            {s.heroTitle.split('.').map((part, i) => (
              <span key={i} className="block">
                {i === 1 ? <span className="text-[#E89B10] bg-gradient-to-r from-[#E89B10] to-[#FFD700] bg-clip-text text-transparent">{part.trim()}</span> : part.trim()}
              </span>
            ))}
          </h1>
          
          <p className="text-white/60 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-body">
            {s.heroSubtitle}
          </p>

          <div className="pt-6 flex flex-wrap justify-center gap-4">
            <a href="/cars" className="px-8 py-4 rounded-xl font-bold bg-[#E89B10] hover:bg-[#FFD700] text-[#0B1F3A] transition-all duration-300 shadow-lg shadow-[#E89B10]/20 hover:scale-[1.03]">
              Explore Cars
            </a>
            <a href="/contact" className="px-8 py-4 rounded-xl font-bold border border-white/20 hover:border-white/40 text-white bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-[1.03]">
              Contact Us
            </a>
          </div>
        </div>

        {/* Counter Metrics Grid */}
        <div className="max-w-6xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-10 border-t border-white/5 z-10">
          <div className="p-6 bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-3xl md:text-4xl font-black text-[#E89B10] font-headline mb-2">
              <AnimatedCounter value={s.statTrips} />
            </span>
            <span className="text-white/50 text-xs md:text-sm font-semibold tracking-wider uppercase">{s.statTripsLabel}</span>
          </div>
          <div className="p-6 bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-3xl md:text-4xl font-black text-[#E89B10] font-headline mb-2">
              <AnimatedCounter value={s.statCustomers} />
            </span>
            <span className="text-white/50 text-xs md:text-sm font-semibold tracking-wider uppercase">{s.statCustomersLabel}</span>
          </div>
          <div className="p-6 bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-3xl md:text-4xl font-black text-[#E89B10] font-headline mb-2">
              <AnimatedCounter value={s.statVehicles} />
            </span>
            <span className="text-white/50 text-xs md:text-sm font-semibold tracking-wider uppercase">{s.statVehiclesLabel}</span>
          </div>
          <div className="p-6 bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-3xl md:text-4xl font-black text-[#E89B10] font-headline mb-2">
              <AnimatedCounter value={s.statCities} />
            </span>
            <span className="text-white/50 text-xs md:text-sm font-semibold tracking-wider uppercase">{s.statCitiesLabel}</span>
          </div>
        </div>
      </section>

      {/* About Company Section - White Background */}
      <section className="relative bg-white py-24 px-6 lg:px-8 w-full z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Intro (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[#E89B10] font-bold tracking-[0.2em] uppercase text-xs">About Company</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#0B1F3A] font-headline leading-tight">
              {s.introTitle}
            </h2>
            <div className="text-gray-600 space-y-6 text-base md:text-lg leading-relaxed font-body">
              {s.introDesc.split('\n\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
            <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-5 rounded-2xl max-w-xl">
              <span className="material-symbols-outlined text-[#E89B10] text-3xl">location_on</span>
              <span className="text-gray-700 text-sm md:text-base leading-relaxed">{s.introLocationText}</span>
            </div>
          </div>
          
          {/* Right Cards (5 Columns) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featureCards.map((card, i) => (
              <div key={i} className="p-6 bg-gray-50 border border-gray-100 rounded-2xl hover:border-[#E89B10]/40 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-[#0B1F3A]/5 flex items-center justify-center mb-4 group-hover:bg-[#0B1F3A] transition-colors duration-300">
                  <span className="material-symbols-outlined text-[#0B1F3A] group-hover:text-white text-2xl transition-colors">{card.icon}</span>
                </div>
                <h3 className="text-base font-bold text-[#0B1F3A] mb-2">{card.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder / Owner Section - Clean Light Gray Background */}
      <section className="bg-gray-50 py-24 px-6 lg:px-8 relative z-10 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#E89B10] font-bold tracking-[0.2em] uppercase text-xs">Our Leadership</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] font-headline mt-2">Founder Spotlight</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm">
            
            {/* Founder Avatar */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-[4px] border-gray-100 flex items-center justify-center bg-gray-50 shadow-md">
                {s.founderAvatarUrl ? (
                  <img src={s.founderAvatarUrl} alt={s.founderName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl md:text-5xl font-black text-[#0B1F3A] font-headline">{getInitials(s.founderName)}</span>
                )}
              </div>
            </div>

            {/* Founder Details */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-[#0B1F3A] font-headline">{s.founderName}</h3>
                <p className="text-[#E89B10] font-bold text-xs uppercase tracking-wider mt-1">{s.founderTitle}</p>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed font-body">
                {s.founderStory}
              </p>
              
              {/* Quote Card */}
              <div className="border-l-[3px] border-[#E89B10] pl-5 py-2.5 bg-gray-50 rounded-r-xl">
                <p className="text-gray-800 italic text-sm md:text-base leading-relaxed">
                  “{s.founderQuote}”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section (Bento Grid) - White Background */}
      <section className="bg-white py-24 px-6 lg:px-8 relative z-10 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#E89B10] font-bold tracking-[0.2em] uppercase text-xs font-body">Benefits</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] font-headline mt-2">Why Choose Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyChooseUsCards.map((card, i) => (
              <div key={i} className={`p-8 bg-gray-50 border border-gray-100 rounded-3xl hover:border-[#E89B10]/40 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between group ${card.style}`}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0B1F3A]/5 flex items-center justify-center mb-6 group-hover:bg-[#0B1F3A] transition-colors duration-300">
                    <span className="material-symbols-outlined text-[#0B1F3A] group-hover:text-white text-2xl transition-colors">{card.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">{card.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{card.desc}</p>
                </div>
                <div className="h-1 w-12 bg-gray-200 group-hover:bg-[#E89B10] group-hover:w-full transition-all duration-300 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Process Timeline - Clean Light Gray Background */}
      <section className="bg-gray-50 py-24 px-6 lg:px-8 relative z-10 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#E89B10] font-bold tracking-[0.2em] uppercase text-xs">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] font-headline mt-2">Rental Process Timeline</h2>
          </div>

          {/* Process Timeline Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative">
            {/* Timeline connection line (hidden on mobile) */}
            <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gray-200 z-0"></div>
            
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center lg:items-start text-center lg:text-left z-10 group">
                <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center font-black text-[#0B1F3A] text-xl mb-6 shadow-sm group-hover:bg-[#E89B10] group-hover:text-white group-hover:border-[#E89B10] transition-all duration-300">
                  0{idx + 1}
                </div>
                <h3 className="text-lg font-bold text-[#0B1F3A] mb-2">{step.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-[200px] lg:max-w-none">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - White Background */}
      {testimonials.length > 0 && (
        <section className="bg-white py-24 px-6 lg:px-8 relative z-10 border-b border-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#E89B10] font-bold tracking-[0.2em] uppercase text-xs font-body">Reviews</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] font-headline mt-2">What Our Riders Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="p-8 bg-gray-50 border border-gray-100 rounded-3xl hover:border-[#E89B10]/30 hover:bg-white hover:shadow-lg transition-all duration-300 shadow-sm flex flex-col justify-between relative">
                  <div className="absolute top-6 right-8 opacity-5">
                    <span className="material-symbols-outlined text-[#0B1F3A] text-6xl">format_quote</span>
                  </div>
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 mb-4 text-[#E89B10]">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-sm shrink-0">star</span>
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 font-body italic">
                      “{t.review_text}”
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-[#0B1F3A]/5 flex items-center justify-center text-[#0B1F3A] font-bold text-sm uppercase">
                      {t.customer_name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A]">{t.customer_name}</h4>
                      <p className="text-gray-400 text-[11px] font-semibold tracking-wide uppercase mt-0.5">{t.city} • {t.car_rented || 'Self Drive'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section - Dark Blue Premium Background for Closure */}
      <section className="bg-white py-24 px-6 lg:px-8 relative z-10 flex justify-center">
        <div className="max-w-5xl w-full bg-gradient-brand-cta border border-white/10 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
          {/* Accent decoration blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 opacity-5" style={{ backgroundColor: 'var(--color-accent)' }}></div>
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white font-headline tracking-tight leading-tight">
              {s.ctaTitle}
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">
              {s.ctaDesc}
            </p>
            <div className="pt-6 flex flex-wrap justify-center gap-4">
              <a href="/cars" className="px-8 py-4 rounded-xl font-bold bg-[#E89B10] hover:bg-[#FFD700] text-[#0B1F3A] transition-all duration-300 hover:scale-[1.03]">
                Book Now
              </a>
              <a href={whatsappLink(whatsappMsg, whatsappNumber)}
                 target="_blank"
                 rel="noreferrer"
                 className="px-8 py-4 rounded-xl font-bold bg-[#25D366] hover:bg-[#25D366]/90 text-white transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.03]">
                <span className="material-symbols-outlined text-lg">chat</span>
                WhatsApp Us
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
