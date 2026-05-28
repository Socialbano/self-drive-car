'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useSettings } from '@/components/SettingsProvider';

function GoogleAnalyticsInner() {
  const { settings } = useSettings();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const measurementId = settings.googleAnalyticsId;

  useEffect(() => {
    // Send pageview with a custom path
    if (measurementId && pathname && window.gtag) {
      window.gtag('config', measurementId, {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
      });
    }
  }, [pathname, searchParams, measurementId]);

  if (!measurementId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

export function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  );
}

// Helper to track custom events
export const trackEvent = (action: string, category: string, label: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Find active GA script measurement ID from window/data if available
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Global typing for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
