'use client';

import { useState, useEffect } from 'react';

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  // Auto-cycle through steps on mobile every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
        setIsTransitioning(false);
      }, 200);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeStep, steps.length]);

  const changeStep = (index: number) => {
    if (index === activeStep) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveStep(index);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <section className="section-padding bg-[#0B1F3A] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1152d4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E89B10] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <span className="text-[#E89B10] font-bold tracking-widest uppercase text-xs">Process</span>
          <h2 className="text-3xl md:text-4xl font-black text-white font-headline mt-2 tracking-tight">
            Start Your Journey in 3 Steps
          </h2>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">
            Renting a car has never been this simple and elegant.
          </p>
        </div>

        {/* Mobile View Steps (Interactive Timeline Tabs - Compact & Animated) */}
        <div className="md:hidden">
          {/* Progress Timeline Tracker */}
          <div className="relative flex justify-between items-center max-w-[260px] mx-auto mb-8">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>
            {/* Active connecting line */}
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-[#E89B10] -translate-y-1/2 z-0 transition-all duration-500 ease-out"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              const isCompleted = activeStep > idx;
              return (
                <button
                  key={idx}
                  onClick={() => changeStep(idx)}
                  className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#E89B10] text-[#000615] scale-110 shadow-lg shadow-[#E89B10]/30 font-black' 
                      : isCompleted
                        ? 'bg-[#E89B10]/20 text-[#E89B10] border border-[#E89B10]/40'
                        : 'bg-[#000615] text-white/50 border border-white/10'
                  }`}
                  aria-label={`Go to step ${step.number}`}
                >
                  {step.number}
                </button>
              );
            })}
          </div>

          {/* Interactive Card */}
          <div className="bg-[#000615]/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center shadow-2xl relative overflow-hidden min-h-[220px] flex flex-col justify-center">
            <div className={`transition-all duration-300 transform ${isTransitioning ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`}>
              {/* Icon Bubble */}
              <div className="w-14 h-14 mx-auto bg-[#0B1F3A] border border-white/10 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-[#0B1F3A]/30">
                <span className="material-symbols-outlined text-3xl text-[#E89B10]">
                  {steps[activeStep].icon}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{steps[activeStep].title}</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
                {steps[activeStep].description}
              </p>
            </div>
            
            {/* Auto-play status dots */}
            <div className="flex justify-center gap-1.5 mt-5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => changeStep(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeStep === idx ? 'w-4 bg-[#E89B10]' : 'w-1.5 bg-white/20'
                  }`}
                  aria-label={`Select slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Steps (Hidden on mobile) */}
        <div className="hidden md:grid grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-[44px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

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

