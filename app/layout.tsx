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

// Dynamic metadata generation based on active database configuration
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getAdminSettings();
    const name = settings.business_name || BUSINESS.name;
    const phone = settings.business_phone || BUSINESS.phone;
    const phoneDisplay = phone.replace(/^\+91/, '');
    const city = settings.business_city || BUSINESS.city;
    
    // Dynamic values from DB if configured, otherwise fallback to auto-generated strings
    const title = settings.business_seo_title || `${name} | Self Drive Car Rental ${city}`;
    const description = settings.business_seo_description || `Rent self drive cars in ${city} from ${name}. Hatchback, Sedan, SUV available. Call or WhatsApp ${phoneDisplay}.`;
    const keywords = settings.business_seo_keywords || undefined;
    const googleVerification = settings.business_google_site_verification || undefined;
    const siteUrl = settings.business_site_url || 'https://selfdrivecarrental.in';
    
    return {
      title,
      description,
      keywords,
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: '/',
      },
      verification: {
        google: googleVerification,
      },
      openGraph: {
        title,
        description,
        url: siteUrl,
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
      robots: {
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
    return {
      title: `${BUSINESS.name} | Self Drive Car Rental ${BUSINESS.city}`,
      description: `Rent self drive cars in ${BUSINESS.city} from ${BUSINESS.name}. Hatchback, Sedan, SUV available.`,
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let name: string = BUSINESS.name;
  let phone: string = BUSINESS.phone;
  let address: string = BUSINESS.address;
  let city: string = BUSINESS.city;
  let state: string = BUSINESS.state;
  let pincode: string = BUSINESS.pincode;
  let siteUrl: string = 'https://selfdrivecarrental.in';

  let initialSettingsData: any = undefined;
  let initialLocationsData: any = undefined;
  let primaryColor = '#0B1F3A';
  let accentColor = '#E89B10';

  try {
    const rawSettings = await getAdminSettings();
    if (rawSettings && Object.keys(rawSettings).length > 0) {
      initialSettingsData = mapDatabaseSettings(rawSettings);
      
      name = rawSettings.business_name || name;
      phone = rawSettings.business_phone || phone;
      address = rawSettings.business_address || address;
      city = rawSettings.business_city || city;
      state = rawSettings.business_state || state;
      pincode = rawSettings.business_pincode || pincode;
      siteUrl = rawSettings.business_site_url || siteUrl;
      primaryColor = rawSettings.theme_primary_color || primaryColor;
      accentColor = rawSettings.theme_accent_color || accentColor;
    }
  } catch (err) {
    console.error('Failed to resolve settings in Layout:', err);
  }

  try {
    initialLocationsData = await getActiveLocations();
  } catch (err) {
    console.error('Failed to resolve locations in Layout:', err);
  }

  // Sanitize schema values to prevent XSS via JSON-LD injection
  const safeStr = (s: string) => s.replace(/[<>"'&]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;'
  }[c] || c));

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: safeStr(name),
    description: safeStr(`Self-Drive Car Rental Service in ${city}. Premium cars on rent without driver.`),
    url: siteUrl,
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
    sameAs: [],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1500',
      bestRating: '5',
    },
  };

  return (
    <html lang="en" className={clsx(poppins.variable, inter.variable, plusJakartaSans.variable, 'light')} style={{ '--color-primary': primaryColor, '--color-accent': accentColor } as React.CSSProperties}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
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
