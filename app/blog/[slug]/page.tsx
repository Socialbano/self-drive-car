import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { BLOG_POSTS } from '@/lib/blog-data';
import { BUSINESS, whatsappLink } from '@/lib/constants';

interface Props {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: Props): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | ${BUSINESS.name}`,
    description: post.metaDescription,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: 'article',
      images: [post.image],
    },
  };
}

export default function SingleBlogPost({ params }: Props) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.image,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: BUSINESS.name,
    },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS.name,
      logo: {
        '@type': 'ImageObject',
        url: 'https://skydeepgroup.com/logo.png', // Replace with actual logo URL later
      },
    },
    description: post.metaDescription,
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((faq) => ({
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

          <div className="flex items-center gap-4 text-white/60 text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              {post.date}
            </div>
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="flex items-center gap-2 text-[#E89B10]">
              <span className="material-symbols-outlined text-lg">folder</span>
              {post.category}
            </div>
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
        {/* The generated React Content */}
        <article className="prose prose-lg max-w-none prose-h2:text-3xl prose-h2:font-black prose-h2:text-[#0B1F3A] prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#1152d4] prose-strong:text-[#0B1F3A]">
          {post.content}
        </article>

        {/* FAQs */}
        {post.faqs && post.faqs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-3xl font-black text-[#0B1F3A] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {post.faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg text-[#0B1F3A] mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action Book Now */}
        <div className="mt-16 bg-gradient-to-br from-[#0B1F3A] to-[#1152d4] p-10 rounded-3xl relative overflow-hidden shadow-2xl text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E89B10]/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
                <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-white/90 text-sm font-bold uppercase tracking-wider mb-6">
                    Start Your Journey
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white font-headline mb-6">
                    Ready to book your self-drive experience in Indore?
                </h2>
                <p className="text-white/70 mb-8 text-lg">
                    Check our fleet naturally and effortlessly. We bring the car to you across Vijay Nagar, Airport, and Palasia!
                </p>
                
                <a 
                    href={whatsappLink(`Hi SkydeepGroup! I read your blog: ${post.title} and want to book a car.`)} 
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
