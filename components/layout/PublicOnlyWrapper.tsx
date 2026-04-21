'use client';

import { usePathname } from 'next/navigation';
import { MarqueeBar } from '@/components/layout/MarqueeBar';
import BookingPopup from '@/components/BookingPopup';

/**
 * Renders MarqueeBar and BookingPopup only on public (non-admin) pages.
 */
export function PublicOnlyWrapper() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <>
      <MarqueeBar />
      <BookingPopup />
    </>
  );
}
