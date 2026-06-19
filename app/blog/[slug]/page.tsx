import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { BUSINESS, whatsappLink } from '@/lib/constants';
import { getAdminSettings, getBlogBySlug } from '@/lib/supabase/queries';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [post, settings] = await Promise.all([
    getBlogBySlug(params.slug),
    getAdminSettings()
  ]);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const name = settings.business_name || BUSINESS.name;

  return {
    title: `${post.title} | ${name}`,
    description: post.meta_description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.meta_description,
      type: 'article',
      images: [post.image],
    },
  };
}

export default async function SingleBlogPost({ params }: Props) {
  const [post, settings] = await Promise.all([
    getBlogBySlug(params.slug),
    getAdminSettings()
  ]);

  if (!post) {
    notFound();
  }

  const name = settings.business_name || BUSINESS.name;
  const whatsappNumber = settings.business_whatsapp || BUSINESS.whatsapp;
  const blogCity = post.locations?.name || settings.business_city || BUSINESS.city;

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.image,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: name,
    },
    publisher: {
      '@type': 'Organization',
      name: name,
      logo: {
        '@type': 'ImageObject',
        url: settings.business_logo_url || (settings.business_site_url ? `${settings.business_site_url.replace(/\/$/, '')}/logo.png` : 'https://selfdrivecarrental.in/logo.png'),
      },
    },
    description: post.meta_description,
  };

  const faqsList = Array.isArray(post.faqs) ? post.faqs : [];

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqsList.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#f9f9f9] flex flex-col">
      {/* Inject Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 px-6 lg:px-8 bg-[#000615]">
        <div className="max-w-4xl mx-auto relative z-10">
          <nav className="flex items-center gap-2 text-sm font-bold tracking-widest text-white/50 uppercase mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[#E89B10]">{post.category}</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-headline tracking-tight mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-white/60 text-sm font-medium flex-wrap">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              {post.date}
            </div>
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="flex items-center gap-2 text-[#E89B10]">
              <span className="material-symbols-outlined text-lg">folder</span>
              {post.category}
            </div>
            {post.locations && (
              <>
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-2 text-emerald-400">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                  {post.locations.name}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 -mt-8 relative z-20 w-full mb-16">
        <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl bg-white border-4 border-white">
          <img 
            src={post.image} 
            alt={`${post.title} travel guide`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="flex-grow max-w-4xl mx-auto px-6 lg:px-8 pb-20 w-full">
        {/* Render HTML content safely */}
        <article 
          className="prose prose-lg max-w-none prose-h2:text-3xl prose-h2:font-black prose-h2:text-[#0B1F3A] prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[var(--color-accent)] prose-strong:text-[#0B1F3A]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* FAQs */}
        {faqsList.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-3xl font-black text-[#0B1F3A] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqsList.map((faq: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg text-[#0B1F3A] mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action Book Now */}
        <div className="mt-16 bg-gradient-brand-cta p-10 rounded-3xl relative overflow-hidden shadow-2xl text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-glow rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
                <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-white/90 text-sm font-bold uppercase tracking-wider mb-6">
                    Start Your Journey
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white font-headline mb-6">
                    Ready to book your self-drive experience in {blogCity}?
                </h2>
                <p className="text-white/70 mb-8 text-lg">
                    Check our fleet naturally and effortlessly. We bring the car directly to your requested location in {blogCity}!
                </p>
                
                <a 
                    href={whatsappLink(`Hi ${name}! I read your blog: "${post.title}" and want to book a car in ${blogCity}.`, whatsappNumber)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#E89B10] text-[#0B1F3A] px-8 py-4 rounded-xl font-black text-lg hover:bg-white hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-[#E89B10]/30"
                >
                    <span className="material-symbols-outlined">directions_car</span>
                    Book Your Car Now
                </a>
            </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
