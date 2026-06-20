'use client';

import { usePathname } from 'next/navigation';
import { MarqueeBar } from '@/components/layout/MarqueeBar';
import dynamic from 'next/dynamic';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

const BookingPopup = dynamic(() => import('@/components/BookingPopup'), {
  ssr: false,
});

/**
 * Renders MarqueeBar, BookingPopup and MobileBottomNav only on public (non-admin/non-document) pages.
 */
export function PublicOnlyWrapper() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isDocument = pathname?.startsWith('/agreements') || pathname?.startsWith('/invoice');

  if (isAdmin || isDocument) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          main {
            padding-bottom: 76px !important;
          }
        }
      `}} />
      <MarqueeBar />
      <BookingPopup />
      <MobileBottomNav />
    </>
  );
}
