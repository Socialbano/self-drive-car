import type { Metadata } from 'next';
import { Poppins, Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';
import { BUSINESS } from '@/lib/constants';
import { Toaster } from 'react-hot-toast';
import BookingPopup from '@/components/BookingPopup';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { PublicOnlyWrapper } from '@/components/layout/PublicOnlyWrapper';

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

export const metadata: Metadata = {
  title: `${BUSINESS.name} | Self Drive Car Rental Indore`,
  description: `Rent self drive cars in Indore from ${BUSINESS.name}. Hatchback, Sedan, SUV available. Call or WhatsApp ${BUSINESS.phoneDisplay}.`,
  metadataBase: new URL('https://www.skydeepgroup.com'),
  openGraph: {
    title: `${BUSINESS.name} | Self Drive Car Rental Indore`,
    description: `Rent self drive cars in Indore from ${BUSINESS.name}. Hatchback, Sedan, SUV available.`,
    url: 'https://www.skydeepgroup.com',
    siteName: BUSINESS.name,
    locale: 'en_IN',
    type: 'website',
  },
  verification: {
    google: 'google-site-verification=PLACEHOLDER',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    description: 'Self-Drive Car Rental Service in Indore',
    url: 'https://www.skydeepgroup.com',
    telephone: BUSINESS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Near HDFC Bank, Ramesh Dosa, Vishnupuri, Bhawarkua',
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.state,
      postalCode: BUSINESS.pincode,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '22.6914',
      longitude: '75.8478',
    },
    openingHours: 'Mo-Su 00:00-24:00',
    priceRange: '₹₹',
  };

  return (
    <html lang="en" className={clsx(poppins.variable, inter.variable, plusJakartaSans.variable, 'light')}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        <PublicOnlyWrapper />
        <main className="flex min-h-screen flex-col">
          {children}
        </main>
        <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}
