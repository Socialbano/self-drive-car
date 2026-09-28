import type { Metadata } from 'next';
import { Poppins, Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';
import { BUSINESS } from '@/lib/constants';
import { Toaster } from 'react-hot-toast';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { MetaPixel } from '@/components/MetaPixel';
import { PublicOnlyWrapper } from '@/components/layout/PublicOnlyWrapper';
import { SettingsProvider } from '@/components/SettingsProvider';
import { mapDatabaseSettings } from '@/lib/settings-utils';
import { getAdminSettings, getActiveLocations } from '@/lib/supabase/queries';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getAdminSettings();
    const name = settings.business_name || siteConfig.brand.name;
    const phone = settings.business_phone || siteConfig.contact.phone;
    const phoneDisplay = phone.replace(/^\+91/, '');
    const city = settings.business_city || siteConfig.contact.city;
    
    const title = settings.business_seo_title || `${name} | Self Drive Car Rental ${city}`;
    const description = settings.business_seo_description || `Rent self drive cars in ${city} from ${name}. Hatchback, Sedan, SUV available. Call or WhatsApp ${phoneDisplay}.`;
    const keywords = settings.business_seo_keywords || 'self drive car rental, car rental without driver, ujjain self drive, indore car rental';
    const googleVerification = settings.business_google_site_verification || undefined;
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || settings.business_site_url || siteConfig.urls.siteUrl;
    const cleanSiteUrl = siteUrl.replace(/\/$/, '');
    const isDemo = siteConfig.urls.isDemo;

    return {
      title,
      description,
      keywords,
      metadataBase: new URL(cleanSiteUrl),
      alternates: {
        canonical: cleanSiteUrl,
      },
      verification: {
        google: googleVerification,
      },
      openGraph: {
        title,
        description,
        url: cleanSiteUrl,
        siteName: name,
        locale: 'en_IN',
        type: 'website',
        images: [{
          url: '/images/og-default.jpg',
          width: 1200,
          height: 630,
          alt: `${name} - Self Drive Car Rental ${city}`,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/images/og-default.jpg'],
      },
      robots: isDemo ? {
        index: false,
        follow: false,
      } : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch {
    const siteUrl = siteConfig.urls.siteUrl;
    return {
      title: `${siteConfig.brand.name} | Self Drive Car Rental ${siteConfig.contact.city}`,
      description: `Rent self drive cars in ${siteConfig.contact.city} from ${siteConfig.brand.name}. Hatchback, Sedan, SUV available.`,
      metadataBase: new URL(siteUrl),
      alternates: { canonical: siteUrl },
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let name: string = siteConfig.brand.name;
  let phone: string = siteConfig.contact.phone;
  let address: string = siteConfig.contact.address;
  let city: string = siteConfig.contact.city;
  let state: string = siteConfig.contact.state;
  let pincode: string = siteConfig.contact.pincode;
  let siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || siteConfig.urls.siteUrl;
  let googleRating: number = siteConfig.trustMetrics.googleRating;
  let googleReviewCount: number = siteConfig.trustMetrics.googleReviewCount;

  let initialSettingsData: any = undefined;
  let initialLocationsData: any = undefined;
  let primaryColor = '#0B1F3A';
  let accentColor = '#E89B10';

  try {
    const rawSettings = await getAdminSettings();
    if (rawSettings && Object.keys(rawSettings).length > 0) {
      initialSettingsData = mapDatabaseSettings(rawSettings);
      
      name = initialSettingsData.name || name;
      phone = initialSettingsData.phone || phone;
      address = initialSettingsData.address || address;
      city = initialSettingsData.city || city;
      state = initialSettingsData.state || state;
      pincode = initialSettingsData.pincode || pincode;
      siteUrl = initialSettingsData.siteUrl || siteUrl;
      primaryColor = initialSettingsData.themePrimaryColor || primaryColor;
      accentColor = initialSettingsData.themeAccentColor || accentColor;
      googleRating = initialSettingsData.googleRating || googleRating;
      googleReviewCount = initialSettingsData.googleReviewCount || googleReviewCount;
    }
  } catch (err) {
    console.error('Failed to resolve settings in Layout:', err);
  }

  try {
    initialLocationsData = await getActiveLocations();
  } catch (err) {
    console.error('Failed to resolve locations in Layout:', err);
  }

  const safeStr = (s: string) => s.replace(/[<>"'&]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;'
  }[c] || c));

  const schemaMarkup: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: safeStr(name),
    description: safeStr(`Self-Drive Car Rental Service in ${city}. Premium cars on rent without driver with zero security deposit.`),
    url: siteUrl.replace(/\/$/, ''),
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: safeStr(address),
      addressLocality: safeStr(city),
      addressRegion: safeStr(state),
      postalCode: pincode,
      addressCountry: 'IN',
    },
    openingHours: 'Mo-Su 00:00-24:00',
    priceRange: '₹₹',
  };

  // Only include aggregateRating if real rating is set in config
  if (googleRating > 0 && googleReviewCount > 0) {
    schemaMarkup.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: googleRating.toString(),
      reviewCount: googleReviewCount.toString(),
      bestRating: '5',
    };
  }

  return (
    <html lang="en" className={clsx(poppins.variable, inter.variable, plusJakartaSans.variable, 'light')} style={{ '--color-primary': primaryColor, '--color-accent': accentColor } as React.CSSProperties}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body>
        <SettingsProvider initialSettings={initialSettingsData} initialLocations={initialLocationsData}>
          <GoogleAnalytics />
          <MetaPixel />
          <PublicOnlyWrapper />
          <main className="flex min-h-screen flex-col relative">
            {children}
          </main>
          <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
        </SettingsProvider>
      </body>
    </html>
  );
}
