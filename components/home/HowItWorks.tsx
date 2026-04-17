'use client';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Pick a Car',
      description: 'Browse our extensive collection of cars and choose the one that fits your style and needs.',
      icon: 'directions_car',
    },
    {
      number: '02',
      title: 'Book on whatsapp',
      description: 'Verify your details, select your dates, and confirm your booking via WhatsApp or our portal.',
      icon: 'touch_app',
    },
    {
      number: '03',
      title: 'Drive Away',
      description: 'Collect your keys from our central hub or get door-step delivery and start your adventure.',
      icon: 'key',
    },
  ];

  return (
    <section className="section-padding bg-[#0B1F3A] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1152d4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E89B10] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-[#E89B10] font-bold tracking-widest uppercase text-xs">Process</span>
          <h2 className="text-3xl md:text-4xl font-black text-white font-headline mt-2 tracking-tight">
            Start Your Journey in 3 Steps
          </h2>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">
            Renting a car has never been this simple and elegant.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {steps.map((step, i) => (
            <div key={i} className="relative text-center group">
              {/* Number/Icon Bubble */}
              <div className="w-24 h-24 mx-auto bg-[#000615] border border-white/10 rounded-2xl flex items-center justify-center relative mb-8 group-hover:-translate-y-2 transition-transform duration-500 shadow-xl">
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#E89B10] text-[#000615] font-black flex items-center justify-center text-sm shadow-lg">
                  {step.number}
                </span>
                <span className="material-symbols-outlined text-4xl text-white">
                  {step.icon}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
