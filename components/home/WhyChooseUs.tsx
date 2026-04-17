export function WhyChooseUs() {
  const features = [
    {
      icon: 'account_balance_wallet',
      title: 'No Security Deposit',
      description: 'Book your car without any heavy upfront security payments. Trust is our foundation.',
      gradient: 'from-[#E89B10]/10 to-[#FFD700]/5',
    },
    {
      icon: 'verified_user',
      title: 'Fully Insured Fleet',
      description: 'All our cars come with comprehensive insurance, ensuring your safety and peace of mind.',
      gradient: 'from-[#1152d4]/10 to-[#5b9cff]/5',
    },
    {
      icon: 'all_inclusive',
      title: 'Unlimited KMs',
      description: "Don't count the miles. Drive as much as you want on select premium packages.",
      gradient: 'from-[#25D366]/10 to-[#66ff8e]/5',
    },
    {
      icon: 'support_agent',
      title: '24/7 Roadside Support',
      description: 'Stuck somewhere? Our dedicated support team is just one call away, anytime.',
      gradient: 'from-[#ff6b6b]/10 to-[#ffa07a]/5',
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#E89B10] font-bold tracking-widest uppercase text-xs">Why Us</span>
          <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A] font-headline mt-2 tracking-tight">
            Why Skydeep is Indore's Favorite
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            We provide a seamless and trustworthy car rental experience built around your convenience.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-gray-100/50 hover:shadow-[0_20px_50px_-12px_rgba(11,31,58,0.08)] transition-all duration-500 hover:-translate-y-1`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-[#0B1F3A] text-2xl">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
