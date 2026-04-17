# 🚗 Skydeepgroup — Self-Drive Car Rental Website
## Complete Step-by-Step Implementation Plan

> **Project:** Skydeepgroup PRO Website  
> **Tech Stack:** Next.js 14 · Tailwind CSS · Supabase · Cloudinary · Hostinger  
> **Deployment:** Static Export (`output: 'export'`) → Hostinger Shared Hosting  
> **Lead System:** Admin Panel Only (no email)  
> **Phone/WhatsApp:** +91 9111330558  

---

## Phase 1: Project Initialization & Configuration (Day 1)

### Step 1.1 — Create Next.js 14 Project

```bash
npx -y create-next-app@latest ./ \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --use-npm
```

> [!IMPORTANT]
> The `--src-dir=false` flag keeps the `app/` folder at root level matching the PRD folder structure.

### Step 1.2 — Install Dependencies

```bash
# Core dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# UI & Animations
npm install framer-motion lucide-react swiper

# Utilities
npm install clsx slugify papaparse

# Dev dependencies
npm install -D @types/papaparse
```

| Package | Purpose |
|---|---|
| `@supabase/supabase-js` | Supabase client for DB & Auth |
| `@supabase/auth-helpers-nextjs` | Supabase auth integration for Next.js |
| `framer-motion` | Smooth animations (stats counter, accordions, page transitions) |
| `lucide-react` | Modern icon set |
| `swiper` | Car photo gallery (swipeable) |
| `clsx` | Conditional CSS classnames |
| `slugify` | Auto-generate URL slugs from car names |
| `papaparse` | CSV export for lead data |

### Step 1.3 — Configure `next.config.ts` for Static Export

#### [MODIFY] [next.config.ts](file:///Users/softwaredeveloper/Desktop/Skydeepgroup/next.config.ts)

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',              // Static HTML export for Hostinger
  trailingSlash: true,           // /cars/ instead of /cars
  images: {
    unoptimized: true,           // Required for static export
  },
  // Disable server-side features incompatible with static export
  experimental: {},
};

export default nextConfig;
```

### Step 1.4 — Configure Tailwind with Skydeepgroup Brand Tokens

#### [MODIFY] [tailwind.config.ts](file:///Users/softwaredeveloper/Desktop/Skydeepgroup/tailwind.config.ts)

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:    '#0B1F3A',   // Deep Navy
        accent:     '#E89B10',   // Amber/Gold
        'bg-alt':   '#F3F3F3',
        'text-main':'#111111',
        'text-muted':'#7A7A7A',
        success:    '#145C35',
        danger:     '#8B2020',
        whatsapp:   '#25D366',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      maxWidth: {
        container: '1280px',
      },
      animation: {
        'pulse-ring': 'pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.4)' },
          '50%':      { boxShadow: '0 0 0 15px rgba(37, 211, 102, 0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### Step 1.5 — Setup Global Styles & Google Fonts

#### [MODIFY] [app/globals.css](file:///Users/softwaredeveloper/Desktop/Skydeepgroup/app/globals.css)

- Import Tailwind directives
- Add CSS custom properties for brand tokens
- Add base typography styles (Poppins headings, Inter body)
- Add smooth scroll behavior
- Add custom scrollbar styling
- Add WhatsApp pulse animation

### Step 1.6 — Configure Google Fonts in Layout

#### [MODIFY] [app/layout.tsx](file:///Users/softwaredeveloper/Desktop/Skydeepgroup/app/layout.tsx)

- Import `Poppins` and `Inter` from `next/font/google`
- Set as CSS variables `--font-heading` and `--font-body`
- Add LocalBusiness JSON-LD schema in `<head>`
- Set default metadata (title, description, OG tags)

### Step 1.7 — Create Environment Variables File

#### [NEW] [.env.local](file:///Users/softwaredeveloper/Desktop/Skydeepgroup/.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=skydeepgroup
NEXT_PUBLIC_BUSINESS_NAME=Skydeepgroup
NEXT_PUBLIC_BUSINESS_PHONE=+919111330558
NEXT_PUBLIC_BUSINESS_WHATSAPP=919111330558
NEXT_PUBLIC_BUSINESS_ADDRESS=Near HDFC Bank, Ramesh Dosa, Vishnupuri, Bhawarkua, Indore 452001
NEXT_PUBLIC_BUSINESS_CITY=Indore
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps/embed?pb=...
```

### Step 1.8 — Create `.gitignore`

Ensure `.env.local`, `node_modules/`, `.next/`, `out/` are excluded.

---

## Phase 2: Supabase Database Setup (Day 1)

### Step 2.1 — Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Region: Mumbai (ap-south-1) — closest to Indore
3. Save the project URL and anon key to `.env.local`

### Step 2.2 — Create Database Tables

Run the following SQL in Supabase SQL Editor (in order):

#### Table 1: `cars`

```sql
CREATE TABLE cars (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(100) NOT NULL,
  slug                VARCHAR(120) UNIQUE NOT NULL,
  car_type            VARCHAR(20) CHECK (car_type IN ('hatchback','sedan','suv','luxury','electric')),
  fuel_type           VARCHAR(20) CHECK (fuel_type IN ('petrol','diesel','cng','electric')),
  transmission        VARCHAR(10) CHECK (transmission IN ('manual','automatic')),
  seats               INTEGER NOT NULL DEFAULT 5,
  engine_cc           INTEGER,
  mileage_kmpl        NUMERIC(4,1),
  has_ac              BOOLEAN DEFAULT true,
  boot_space_l        INTEGER,
  ground_clearance_mm INTEGER,
  price_per_day       INTEGER NOT NULL,
  price_per_week      INTEGER,
  price_weekend       INTEGER,
  price_outstation    INTEGER,
  deposit             INTEGER NOT NULL DEFAULT 2000,
  km_limit_per_day    INTEGER DEFAULT 300,
  extra_km_rate       INTEGER DEFAULT 8,
  min_rental_age      INTEGER DEFAULT 21,
  features            TEXT[],
  description         TEXT,
  primary_image_url   TEXT,
  is_featured         BOOLEAN DEFAULT false,
  is_active           BOOLEAN DEFAULT true,
  is_available        BOOLEAN DEFAULT true,
  display_order       INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table 2: `car_images`

```sql
CREATE TABLE car_images (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id         UUID REFERENCES cars(id) ON DELETE CASCADE,
  url            TEXT NOT NULL,
  cloudinary_id  TEXT NOT NULL,
  display_order  INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table 3: `leads`

```sql
CREATE TABLE leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100) NOT NULL,
  phone        VARCHAR(15) NOT NULL,
  email        VARCHAR(150),
  car_type     VARCHAR(50),
  pickup_date  DATE,
  message      TEXT,
  status       VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','contacted','booked','closed')),
  source       VARCHAR(30) DEFAULT 'website_form',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table 4: `faqs`

```sql
CREATE TABLE faqs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question      TEXT NOT NULL,
  answer        TEXT NOT NULL,
  category      VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table 5: `testimonials`

```sql
CREATE TABLE testimonials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(80) NOT NULL,
  city          VARCHAR(50) DEFAULT 'Indore',
  rating        INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text   TEXT NOT NULL,
  car_rented    VARCHAR(100),
  is_approved   BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table 6: `admin_settings`

```sql
CREATE TABLE admin_settings (
  key        VARCHAR(100) PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO admin_settings (key, value) VALUES
  ('business_name',         'Skydeepgroup'),
  ('business_phone',        '+919111330558'),
  ('business_whatsapp',     '+919111330558'),
  ('business_address',      'Near HDFC Bank, Ramesh Dosa, Vishnupuri, Bhawarkua, Indore 452001'),
  ('business_city',         'Indore'),
  ('business_state',        'Madhya Pradesh'),
  ('business_pincode',      '452001'),
  ('business_hours',        'Mon–Sun 8:00 AM – 9:00 PM'),
  ('whatsapp_default_msg',  'Hi Skydeepgroup! I want to book a self drive car in Indore.'),
  ('offer_banner_text',     ''),
  ('offer_banner_active',   'false'),
  ('maps_embed_url',        'https://www.google.com/maps/embed?pb=...');
```

### Step 2.3 — Set Up Row Level Security (RLS)

```sql
-- CARS: Public read, Admin full access
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active cars" ON cars FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Admin full access to cars" ON cars FOR ALL TO authenticated USING (true);

-- CAR_IMAGES: Public read, Admin full access
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view car images" ON car_images FOR SELECT TO anon USING (true);
CREATE POLICY "Admin full access to car images" ON car_images FOR ALL TO authenticated USING (true);

-- LEADS: Public INSERT only, Admin full access
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert leads" ON leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Admin can manage leads" ON leads FOR ALL TO authenticated USING (true);

-- FAQS: Public read, Admin full access
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active FAQs" ON faqs FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Admin full access to FAQs" ON faqs FOR ALL TO authenticated USING (true);

-- TESTIMONIALS: Public read approved, Admin full access
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view approved testimonials" ON testimonials FOR SELECT TO anon USING (is_approved = true);
CREATE POLICY "Admin full access to testimonials" ON testimonials FOR ALL TO authenticated USING (true);

-- ADMIN_SETTINGS: Public read, Admin full access
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read settings" ON admin_settings FOR SELECT TO anon USING (true);
CREATE POLICY "Admin full access to settings" ON admin_settings FOR ALL TO authenticated USING (true);
```

### Step 2.4 — Create Admin User in Supabase Auth

1. Go to Supabase Dashboard → Authentication → Users
2. Create admin user with email + password
3. Save credentials securely for client handover

### Step 2.5 — Seed Sample Data

Insert 6-8 sample cars, 15 FAQs, and 3 testimonials for development testing.

---

## Phase 3: Core Library & Utility Files (Day 2)

### Step 3.1 — Supabase Client Setup

#### [NEW] `lib/supabase/client.ts`
- Browser-side Supabase client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Used by: public pages (car data fetch), contact form (lead insert), admin panel (CRUD)

#### [NEW] `lib/supabase/queries.ts`
- `getCars()` — fetch all active cars (public)
- `getFeaturedCars()` — fetch featured cars for homepage
- `getCarBySlug(slug)` — fetch single car + images
- `getSimilarCars(carType, excludeId)` — similar cars section
- `getFAQs()` — fetch all active FAQs
- `getTestimonials()` — fetch approved testimonials
- `getAdminSettings()` — fetch public business settings
- `getLeads(filters?)` — admin: fetch leads with optional filters
- `insertLead(data)` — public: insert new lead
- `updateLeadStatus(id, status)` — admin: update lead status
- `deleteLead(id)` — admin: delete a lead
- `upsertCar(data)` — admin: create or update car
- `deleteCar(id)` — admin: delete car
- `updateCarPricing(id, prices)` — admin: update car pricing

### Step 3.2 — TypeScript Types

#### [NEW] `types/index.ts`

```typescript
export interface Car {
  id: string;
  name: string;
  slug: string;
  car_type: 'hatchback' | 'sedan' | 'suv' | 'luxury' | 'electric';
  fuel_type: 'petrol' | 'diesel' | 'cng' | 'electric';
  transmission: 'manual' | 'automatic';
  seats: number;
  engine_cc?: number;
  mileage_kmpl?: number;
  has_ac: boolean;
  boot_space_l?: number;
  ground_clearance_mm?: number;
  price_per_day: number;
  price_per_week?: number;
  price_weekend?: number;
  price_outstation?: number;
  deposit: number;
  km_limit_per_day: number;
  extra_km_rate: number;
  min_rental_age: number;
  features: string[];
  description: string;
  primary_image_url: string;
  is_featured: boolean;
  is_active: boolean;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  car_images?: CarImage[];
}

export interface CarImage {
  id: string;
  car_id: string;
  url: string;
  cloudinary_id: string;
  display_order: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  car_type?: string;
  pickup_date?: string;
  message?: string;
  status: 'new' | 'contacted' | 'booked' | 'closed';
  source: string;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  city: string;
  rating: number;
  review_text: string;
  car_rented?: string;
  is_approved: boolean;
  display_order: number;
}
```

### Step 3.3 — Constants File

#### [NEW] `lib/constants.ts`

```typescript
export const BUSINESS = {
  name: 'Skydeepgroup',
  phone: '+919111330558',
  phoneDisplay: '9111330558',
  whatsapp: '919111330558',
  address: 'Near HDFC Bank, Ramesh Dosa, Vishnupuri, Bhawarkua, Indore 452001',
  city: 'Indore',
  state: 'Madhya Pradesh',
  pincode: '452001',
  hours: 'Mon–Sun 8:00 AM – 9:00 PM',
} as const;

export const WHATSAPP_MESSAGES = {
  general: 'Hi Skydeepgroup! I want to know about self drive cars in Indore.',
  hero: 'Hi! I want to book a self drive car from Skydeepgroup.',
  carBooking: (carName: string) =>
    `Hi Skydeepgroup! I want to book ${carName}. Please confirm availability.`,
  carDetail: (carName: string, date?: string) =>
    `Hi! I want to book ${carName} from Skydeepgroup.${date ? ` Pickup: ${date}.` : ''} Please confirm.`,
  formSuccess: 'Hi Skydeepgroup! I just filled the inquiry form. Please call me.',
  faq: 'Hi Skydeepgroup! I have a question about car rental.',
  footer: 'Hi Skydeepgroup!',
  adminToCustomer: (name: string) =>
    `Hi ${name}! This is Skydeepgroup. We received your inquiry about car rental. How can we help?`,
} as const;

export const whatsappLink = (message: string) =>
  `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;

export const CAR_TYPES = ['hatchback', 'sedan', 'suv', 'luxury', 'electric'] as const;
export const FUEL_TYPES = ['petrol', 'diesel', 'cng', 'electric'] as const;
export const TRANSMISSIONS = ['manual', 'automatic'] as const;
export const LEAD_STATUSES = ['new', 'contacted', 'booked', 'closed'] as const;
export const CAR_FEATURES = ['GPS', 'Music System', 'First Aid', 'Spare Tyre', 'Dashcam'] as const;
```

### Step 3.4 — Cloudinary Helper

#### [NEW] `lib/cloudinary.ts`

- `getCloudinaryUrl(publicId, transformations)` — build optimized image URLs
- Presets for: card thumbnail (400×225), gallery (1200×675), hero (1920×1080)
- Auto WebP, auto quality

### Step 3.5 — Custom Hooks

#### [NEW] `hooks/useCars.ts`
- Client-side hook for fetching/filtering cars (used by `/cars` page)
- Filter state: carType, fuelType, transmission, priceRange, search, sort

#### [NEW] `hooks/useLeads.ts`
- Admin hook for lead management
- fetchLeads, updateStatus, deleteLead, exportCSV

#### [NEW] `hooks/useFilters.ts`
- Reusable filter state management

---

## Phase 4: Shared UI Components (Day 3)

### Step 4.1 — Base UI Components

#### [NEW] `components/ui/Button.tsx`
- Variants: `primary` (accent gold), `secondary` (navy), `whatsapp` (green), `outline`, `ghost`
- Sizes: `sm`, `md`, `lg`
- Icons support (left/right)
- Link variant (renders `<a>`)

#### [NEW] `components/ui/Badge.tsx`
- Variants: `available` (green), `booked` (red), `new` (blue), `status` colors
- Used for: car availability, lead status

#### [NEW] `components/ui/Accordion.tsx`
- Smooth expand/collapse animation (framer-motion)
- Used on: FAQ page
- Supports category grouping

#### [NEW] `components/ui/Card.tsx`
- Base card with hover elevation effect
- White background, subtle border, rounded corners

#### [NEW] `components/ui/Input.tsx` / `Select.tsx` / `Textarea.tsx`
- Styled form components with validation states
- Label, error message, helper text support

#### [NEW] `components/ui/Modal.tsx`
- Overlay modal with close button
- Used for: lead detail view, image lightbox, delete confirmations

### Step 4.2 — Layout Components

#### [NEW] `components/layout/Navbar.tsx`
- Desktop: Skydeepgroup logo + nav links (Home, Cars, Pricing, FAQ, About, Contact) + "Book Now" CTA
- Mobile: hamburger → slide-out drawer
- Transparent on hero → solid white on scroll (Intersection Observer)
- Sticky top z-40
- Phone icon link on mobile: `tel:+919111330558`

#### [NEW] `components/layout/Footer.tsx`
- 4-column layout: About · Quick Links · Contact Info · Social
- Skydeepgroup address + clickable phone + WhatsApp link
- Copyright: `© 2025 Skydeepgroup. All rights reserved.`
- Dark navy background (#0B1F3A)

#### [NEW] `components/layout/WhatsAppFloat.tsx`
- Fixed bottom-6 right-6 z-50
- 56×56px green circle with WhatsApp SVG icon
- 3-second pulse-ring animation
- Opens `wa.me/919111330558` with general message
- Hidden on `/admin/*` routes

### Step 4.3 — Car Components

#### [NEW] `components/cars/CarCard.tsx`
- Image (Cloudinary optimized), car name, type badge, specs row (seats, fuel, transmission)
- Price: `₹X,XXX/day`
- Availability badge (🟢/🔴)
- Two CTAs: "Book on WhatsApp" (green) + "Call Now" (navy)
- WhatsApp pre-filled with car name
- Links to `/cars/[slug]`
- Hover: subtle scale + shadow animation

#### [NEW] `components/cars/CarGrid.tsx`
- Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
- Accepts array of `Car` objects
- Empty state: "No cars match your filters"
- Load More / Pagination (9 per page)

#### [NEW] `components/cars/CarFilters.tsx`
- Filter dropdowns: Car Type, Fuel Type, Transmission
- Price range slider: ₹500 – ₹5,000
- Search input by car name
- Sort dropdown: Price Low→High, High→Low, Newest
- Active filter chips with × to remove
- Mobile: collapsible filter panel

#### [NEW] `components/cars/CarGallery.tsx`
- Swiper.js carousel for car photos
- Thumbnail navigation
- Fullscreen lightbox on click
- Touch-swipe support on mobile

---

## Phase 5: Home Page (Day 4)

### Step 5.1 — Home Page Components

#### [NEW] `components/home/HeroSection.tsx`
- Full viewport height (100vh desktop, 80vh mobile)
- Background: premium car image with dark gradient overlay `rgba(0,0,0,0.55)`
- H1: "Self Drive Car in Indore" (main SEO keyword)
- Subheading: "Skydeepgroup — Affordable • Reliable • 24/7 Available"
- Two CTAs: "View Our Cars" (→ /cars) + "Book on WhatsApp" (→ wa.me)
- Fade-in animation on load

#### [NEW] `components/home/StatsStrip.tsx`
- 4 stat cards in a row: Total Cars (50+) · Happy Customers (500+) · Years (5+) · Cities (10+)
- Counter animation on scroll (Intersection Observer + `useState` counter increment)
- Dark navy background strip

#### [NEW] `components/home/FeaturedCars.tsx`
- Section title: "Our Popular Cars"
- Grid of 6 `CarCard` components (fetched from Supabase where `is_featured = true`)
- "View All Cars" link → `/cars`

#### [NEW] `components/home/WhyChooseUs.tsx`
- 6 USP cards with icons:
  1. 🚗 Clean & Sanitized Cars
  2. 📍 GPS Navigation
  3. 💰 No Hidden Charges
  4. ☎️ 24/7 Support
  5. 📍 Bhawarkua Location
  6. 🛡️ Fully Insured Fleet
- Grid layout with icon + title + short description

#### [NEW] `components/home/HowItWorks.tsx`
- 3 steps with numbered circles + connecting line:
  1. Browse Cars → choose from fleet
  2. WhatsApp 9111330558 → confirm booking
  3. Pick Up from Bhawarkua → drive away
- Clean horizontal layout (vertical on mobile)

#### [NEW] `components/home/Testimonials.tsx`
- 3 customer review cards
- Star rating (1-5 stars)
- Customer name, city, car rented
- Carousel or static grid

#### [NEW] `components/home/CTABanner.tsx`
- Bold section: "Ready to Drive in Indore?"
- Subtitle: "Book your self-drive car from Skydeepgroup today"
- Two CTAs: WhatsApp + Call 9111330558
- Accent background gradient

### Step 5.2 — Assemble Home Page

#### [NEW] `app/page.tsx`

```tsx
// Home page — Skydeepgroup
// SSG: fetches featured cars + testimonials at build time
// Metadata: title, description, OG tags for "Self Drive Car in Indore"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsStrip />
      <FeaturedCars cars={featuredCars} />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials testimonials={testimonials} />
      <CTABanner />
    </>
  );
}
```

### Step 5.3 — Verification

- [ ] All 9 sections render correctly
- [ ] WhatsApp buttons open `wa.me/919111330558` with correct messages
- [ ] Call buttons open `tel:+919111330558`
- [ ] Stats animate on scroll
- [ ] Responsive: mobile 375px, tablet 768px, desktop 1280px
- [ ] Navbar: transparent → white on scroll
- [ ] Floating WhatsApp button visible

---

## Phase 6: Cars & Car Detail Pages (Days 5–6)

### Step 6.1 — Cars Listing Page

#### [NEW] `app/cars/page.tsx`

- Metadata: "Self Drive Cars Available in Indore — Skydeepgroup Fleet"
- Fetch all active cars from Supabase at build time
- Client-side filtering/sorting (useFilters hook)
- Layout: filters sidebar (desktop) / top panel (mobile) + CarGrid
- Pagination: 9 per page / "Load More"

**Functional requirements covered:**
- `FR-C-01` through `FR-C-12` (all filter, search, sort, pagination features)

### Step 6.2 — Car Detail Page

#### [NEW] `app/cars/[slug]/page.tsx`

- `generateStaticParams()` — pre-render all car slugs
- `generateMetadata()` — dynamic title: "[Car Name] on Rent in Indore | ₹[Price]/day — Skydeepgroup"

**Sections:**
1. **Breadcrumb:** Home > Cars > [Car Name]
2. **Photo Gallery:** CarGallery component (Swiper)
3. **Car Info Header:** Name, type, availability badge, price
4. **Specs Table:** Engine CC, Mileage, Seats, Fuel, Transmission, AC, Boot Space
5. **Features Checklist:** GPS, Music, First Aid, etc.
6. **Pricing Table:** Per Day, Per Week, Weekend, Outstation
7. **Rental Terms:** Min age, valid DL, KM limit, extra KM rate, fuel policy
8. **WhatsApp Widget:** Pre-filled with car name
9. **Sticky Mobile Bar:** Call + WhatsApp buttons (fixed bottom)
10. **Similar Cars:** 3 cards from same car_type

**Functional requirements covered:**
- `FR-CD-01` through `FR-CD-11`

---

## Phase 7: Static Pages — Pricing, FAQ, About, Contact (Day 7)

### Step 7.1 — Pricing Page

#### [NEW] `app/pricing/page.tsx`

- Metadata: "Self Drive Car Rental Prices Indore 2025 — Skydeepgroup"
- Category tabs: Hatchback · Sedan · SUV
- Pricing table from Supabase data (built at build time)
- Columns: Car Name · Per Day · Per Week · Weekend · Outstation · Deposit
- "What's Included" section
- "Extra Charges" section
- CTA: "Need Custom Quote? → WhatsApp Skydeepgroup"

### Step 7.2 — FAQ Page

#### [NEW] `app/faq/page.tsx`

- Metadata: "Self Drive Car Rental FAQ — Skydeepgroup Indore"
- Accordion component with categories: Booking, Documents, Payment, Rules, Cancellation, Fuel
- 15+ FAQs from Supabase
- FAQPage JSON-LD schema for rich results
- CTA: "Still confused? → WhatsApp 9111330558"

**Sample FAQ JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What documents are needed to rent a car from Skydeepgroup?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You need a valid Indian driving license, Aadhaar card, and a security deposit..."
      }
    }
  ]
}
```

### Step 7.3 — About Page

#### [NEW] `app/about/page.tsx`

- Metadata: "About Skydeepgroup — Self Drive Car Rental Indore"
- Business introduction section
- Location: Near HDFC Bank, Bhawarkua
- Mission & values
- USPs / Why Skydeepgroup
- Fleet size, years in business
- Team / owner section (placeholder photo)
- Trust badges

### Step 7.4 — Contact Page

#### [NEW] `app/contact/page.tsx`

- Metadata: "Contact Skydeepgroup | Self Drive Car Rental Indore 452001"

**Left Column — Contact Info:**
- Address: Near HDFC Bank, Ramesh Dosa, Vishnupuri, Bhawarkua, Indore 452001
- Phone: `tel:+919111330558` (clickable)
- WhatsApp: `wa.me/919111330558` (clickable)
- Business hours: Mon–Sun 8:00 AM – 9:00 PM
- Google Maps embed iframe

**Right Column — Lead Form:**
- Fields: Full Name* · Phone* · Email · Car Type (select) · Pickup Date · Message
- Honeypot field (hidden, spam prevention)
- Validation: required fields, 10-digit phone, valid email
- On submit: `supabase.from('leads').insert(...)` 
- Success: "✅ Your inquiry has been received! We'll call you at [phone] shortly."
- After 2s: redirect to WhatsApp with `formSuccess` message

**Functional requirements covered:**
- `FR-CO-01` through `FR-CO-10`

---

## Phase 8: Admin Panel — Authentication (Day 8)

### Step 8.1 — Admin Layout

#### [NEW] `app/admin/layout.tsx`

- Check Supabase auth session
- If not authenticated → show login page
- If authenticated → show admin layout with sidebar
- Admin sidebar nav: Dashboard · Leads ⭐ · Cars · Pricing · Logout

### Step 8.2 — Admin Login Page

#### [NEW] `app/admin/page.tsx`

- Email + password form
- "Remember me" checkbox (7-day session)
- Supabase `signInWithPassword()`
- On success → redirect to `/admin/dashboard`
- Error handling: wrong password, account not found
- Forgot password link (Supabase email reset)
- Skydeepgroup branding

### Step 8.3 — Admin Sidebar

#### [NEW] `components/admin/AdminSidebar.tsx`

- Navigation links: Dashboard, Leads, Cars, Pricing
- Lead count badge (shows unread "new" leads count)
- Active link highlighting
- Mobile: hamburger → slide-out drawer
- Logout button at bottom

### Step 8.4 — Auth Protection Hook

#### [NEW] `hooks/useAuth.ts`

- Check Supabase session on mount
- Redirect to `/admin` if not authenticated
- Provide user object and logout function

---

## Phase 9: Admin Panel — Dashboard & Leads (Day 9)

### Step 9.1 — Admin Dashboard

#### [NEW] `app/admin/dashboard/page.tsx`

- 4 summary cards:
  - 🔴 New Leads Today (count where status='new' AND created_at=today)
  - 📋 Total Leads (all-time count)
  - 🚗 Total Cars (active cars count)
  - ✅ Available Cars (where is_available=true)
- Quick links to Leads and Cars management
- Recent 5 leads preview

### Step 9.2 — Lead Management Page ⭐ PRIMARY

#### [NEW] `app/admin/leads/page.tsx`

This is the **most critical admin page**.

**Lead Table Component:**

#### [NEW] `components/admin/LeadTable.tsx`

| Feature | Implementation |
|---|---|
| Table columns | Date/Time · Name · Phone (clickable) · Email · Car Type · Pickup Date · Message · Status · Actions |
| Status dropdown | Inline select: New (🔵) → Contacted (🟡) → Booked (🟢) → Closed (⚫) |
| Call button | `tel:+91[phone]` per row |
| WhatsApp button | `wa.me/91[phone]?text=Hi [name]! This is Skydeepgroup...` per row |
| View details | Modal with full lead info |
| Delete | Confirmation dialog → Supabase delete |
| New badge | Blue "NEW" badge on rows with status='new' |
| Filters | By status, date range, car type |
| Search | By customer name or phone |
| Sort | Newest first (default) |
| Pagination | 20 per page |
| CSV Export | Download all leads as CSV (papaparse) |

#### [NEW] `components/admin/LeadStatusBadge.tsx`
- Color-coded badges: 🔵 New · 🟡 Contacted · 🟢 Booked · ⚫ Closed

#### [NEW] `components/admin/LeadDetailModal.tsx`
- Full lead info display
- Quick actions: Call, WhatsApp, Update Status

---

## Phase 10: Admin Panel — Car Management & Pricing (Days 8–9)

### Step 10.1 — Car List Page

#### [NEW] `app/admin/cars/page.tsx`

- Table: Thumbnail · Car Name · Type · Price/Day · Status · Featured · Actions
- Status toggle: Available / Booked / Maintenance
- Featured toggle
- Edit → `/admin/cars/[id]/edit`
- Delete with confirmation
- "Add New Car" button → `/admin/cars/add`

### Step 10.2 — Add Car Form

#### [NEW] `app/admin/cars/add/page.tsx`

#### [NEW] `components/admin/CarForm.tsx`

**All fields from PRD Section 7.5:**
- Text inputs: Car Name, Slug (auto-generated)
- Selects: Car Type, Fuel Type, Transmission
- Numbers: Seats, Engine CC, Mileage, Boot Space, Ground Clearance
- Prices: Per Day, Per Week, Weekend, Outstation, Deposit
- Rental: KM Limit, Extra KM Rate
- Toggles: AC, Featured, Active, Available
- Multi-checkbox: Features (GPS, Music, First Aid, Spare Tyre, Dashcam)
- Textarea: Description (300 char limit)
- Photo upload: Multi-file (1-8 images, ≤5MB each)

**Photo Upload Flow:**
1. User selects images
2. Upload to Cloudinary (client-side signed upload)
3. Get back Cloudinary URLs
4. Save car data + image URLs to Supabase

### Step 10.3 — Edit Car Page

#### [NEW] `app/admin/cars/[id]/edit/page.tsx`

- Pre-fill CarForm with existing car data
- Allow photo reorder and removal
- Save updates to Supabase

### Step 10.4 — Pricing Control Page

#### [NEW] `app/admin/pricing/page.tsx`

- Table: all cars with current pricing columns
- Inline edit: click cell → edit → save
- Bulk percentage update: "Increase all prices by X%"
- Special offer banner text field (editable)

---

## Phase 11: SEO, Schema & Technical Polish (Day 11)

### Step 11.1 — Page-Level SEO Metadata

Each page in the `app/` directory gets:
- Unique `<title>` tag with Indore keyword
- Unique `<meta name="description">`
- Canonical URL
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card meta tags

**Implementation:** Use Next.js `generateMetadata()` in each page file.

### Step 11.2 — Structured Data (JSON-LD)

#### LocalBusiness Schema (all pages via layout.tsx)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Skydeepgroup",
  "description": "Self-Drive Car Rental Service in Indore",
  "telephone": "+919111330558",
  "address": { ... Bhawarkua, Indore 452001 }
}
```

#### FAQPage Schema (`/faq` page only)
- Dynamically generated from FAQ data

#### Product Schema (`/cars/[slug]` pages)
- Car details as Product schema for rich results

### Step 11.3 — Sitemap

#### [NEW] `app/sitemap.ts`

```typescript
export default async function sitemap() {
  const cars = await getCars(); // All active cars
  
  const staticPages = [
    { url: 'https://www.skydeepgroup.com/', changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://www.skydeepgroup.com/cars/', changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://www.skydeepgroup.com/pricing/', changeFrequency: 'monthly', priority: 0.8 },
    // ... all static pages
  ];

  const carPages = cars.map(car => ({
    url: `https://www.skydeepgroup.com/cars/${car.slug}/`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...carPages];
}
```

### Step 11.4 — Robots.txt

#### [NEW] `app/robots.ts`

```typescript
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin/' },
    ],
    sitemap: 'https://www.skydeepgroup.com/sitemap.xml',
  };
}
```

### Step 11.5 — 404 Page

#### [NEW] `app/not-found.tsx`

- "Page not found" with Skydeepgroup branding
- CTA: "Go back to Homepage" + "Browse Cars"
- WhatsApp support link

### Step 11.6 — Performance Optimization

- All images lazy loaded below the fold
- Cloudinary auto WebP + auto quality
- Font display: swap (prevent FOIT)
- Minimal JS bundle — leverage SSG
- Preconnect to Supabase + Cloudinary domains

### Step 11.7 — Image Alt Text

- Every car image: "[Car Name] - Self Drive Car Rental in Indore | Skydeepgroup"
- Hero image: "Self Drive Cars Available in Indore - Skydeepgroup Fleet"
- Logo: "Skydeepgroup - Self Drive Car Rental Indore"

---

## Phase 12: Content Population & Testing (Day 10)

### Step 12.1 — Upload Car Data to Supabase

Upload 8-12 cars with:
- Complete details (all fields)
- 3-5 Cloudinary-hosted photos each
- Accurate pricing
- Mark 6 as featured

### Step 12.2 — Upload FAQ Content

Insert 15+ FAQs organized by category:
- **Booking (3):** How to book, booking hours, advance booking
- **Documents (3):** Required documents, age requirement, international DL
- **Payment (2):** Deposit amount, payment methods
- **Rules (3):** KM limit, fuel policy, outside Indore trips
- **Cancellation (2):** Cancellation policy, late return charges
- **Fuel (2):** Fuel policy, who pays for fuel

### Step 12.3 — Upload Testimonials

Insert 3 approved testimonials:
1. Name, "Indore", 5 stars, "Great experience renting [car] from Skydeepgroup..."
2. Name, "Indore", 4 stars, "Clean cars and professional service..."
3. Name, "Bhopal", 5 stars, "Used Skydeepgroup for outstation trip..."

### Step 12.4 — Generate Placeholder Images

Use `generate_image` tool to create:
- Hero background image (premium car with city backdrop)
- Car placeholder images (if client photos not yet available)
- About page photos
- Skydeepgroup logo (if not provided by client)

---

## Phase 13: Final Testing & QA (Day 11)

### Step 13.1 — Functional Testing

| Test | Expected Result |
|---|---|
| Every WhatsApp button | Opens `wa.me/919111330558` with correct pre-filled message |
| Every Call button | Opens `tel:+919111330558` |
| Contact form submit | Lead saved in Supabase, success message shown |
| Admin login | Auth works, redirects to dashboard |
| Admin lead table | All leads visible, status update works |
| Car filters | All 4 filters + search + sort work correctly |
| Car detail page | All sections render, gallery works |
| FAQ accordion | Smooth expand/collapse |
| Floating WhatsApp | Visible on all public pages, hidden on admin |
| Navbar scroll | Transparent → white transition |

### Step 13.2 — Responsive Testing

Test at breakpoints: 375px, 640px, 768px, 1024px, 1280px

### Step 13.3 — SEO Audit

- [ ] Google Rich Results Test — LocalBusiness schema passes
- [ ] Every page has unique title + description
- [ ] Sitemap includes all pages + car URLs
- [ ] Robots.txt blocks /admin/
- [ ] All images have alt text
- [ ] No broken links
- [ ] Canonical tags present

### Step 13.4 — Performance Testing

- [ ] Lighthouse Mobile score ≥ 85
- [ ] FCP ≤ 1.8s
- [ ] LCP ≤ 2.5s
- [ ] CLS ≤ 0.1

---

## Phase 14: Build & Hostinger Deployment (Day 12)

### Step 14.1 — Static Export Build

```bash
npm run build
# Generates /out folder with static HTML/CSS/JS
```

### Step 14.2 — Verify Build Output

- Check `/out` folder contains all pages
- Open `out/index.html` locally to verify
- Check all car detail pages exist: `out/cars/[slug]/index.html`

### Step 14.3 — Upload to Hostinger

**Option A: Hostinger File Manager**
1. Login to Hostinger hPanel
2. Files → File Manager
3. Navigate to `public_html`
4. Upload all contents of `/out` folder

**Option B: FTP (FileZilla)**
1. Connect with Hostinger FTP credentials
2. Upload `/out` contents to `public_html`

### Step 14.4 — Create `.htaccess`

```apache
Options -MultiViews
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle Next.js static routing (trailing slash)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /$1.html [L]
```

### Step 14.5 — Enable SSL

1. Hostinger hPanel → Security → SSL Certificates
2. Enable Free SSL (Let's Encrypt)
3. Force HTTPS redirect

### Step 14.6 — Post-Deploy Verification

- [ ] All 7 public pages load correctly
- [ ] Admin panel loads and login works
- [ ] HTTPS working (no mixed content warnings)
- [ ] All images load from Cloudinary
- [ ] WhatsApp buttons work on real mobile device
- [ ] Contact form submits lead to Supabase
- [ ] Google Maps embed loads

---

## File Summary — Complete List

```
skydeepgroup-website/
├── app/
│   ├── layout.tsx                        # Root layout + fonts + JSON-LD
│   ├── globals.css                       # Global styles + Tailwind
│   ├── page.tsx                          # Home page
│   ├── not-found.tsx                     # 404 page
│   ├── sitemap.ts                        # Dynamic sitemap
│   ├── robots.ts                         # Robots.txt
│   ├── cars/
│   │   ├── page.tsx                      # Fleet listing
│   │   └── [slug]/page.tsx              # Car detail (dynamic)
│   ├── pricing/page.tsx                  # Pricing page
│   ├── faq/page.tsx                      # FAQ page
│   ├── about/page.tsx                    # About Skydeepgroup
│   ├── contact/page.tsx                  # Contact + lead form
│   └── admin/
│       ├── layout.tsx                    # Admin layout + auth gate
│       ├── page.tsx                      # Login page
│       ├── dashboard/page.tsx            # Dashboard cards
│       ├── leads/page.tsx                # ⭐ Lead management
│       ├── cars/
│       │   ├── page.tsx                  # Car list
│       │   ├── add/page.tsx              # Add car
│       │   └── [id]/edit/page.tsx        # Edit car
│       └── pricing/page.tsx              # Pricing control
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppFloat.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── StatsStrip.tsx
│   │   ├── FeaturedCars.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTABanner.tsx
│   ├── cars/
│   │   ├── CarCard.tsx
│   │   ├── CarGrid.tsx
│   │   ├── CarFilters.tsx
│   │   └── CarGallery.tsx
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── LeadTable.tsx
│   │   ├── LeadStatusBadge.tsx
│   │   ├── LeadDetailModal.tsx
│   │   └── CarForm.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Accordion.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Textarea.tsx
│       └── Modal.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── queries.ts
│   ├── cloudinary.ts
│   └── constants.ts
├── hooks/
│   ├── useCars.ts
│   ├── useLeads.ts
│   ├── useFilters.ts
│   └── useAuth.ts
├── types/
│   └── index.ts
├── public/
│   ├── logo.svg
│   └── og-image.jpg
├── next.config.ts
├── tailwind.config.ts
├── .env.local
├── .gitignore
├── tsconfig.json
└── package.json
```

---

## Open Questions

> [!IMPORTANT]
> **1. Supabase Credentials**  
> Do you already have a Supabase project created? If so, please provide:
> - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
> - Anon Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
> - Or should I use placeholder values and you'll set them up later?

> [!IMPORTANT]
> **2. Cloudinary Account**  
> Do you have a Cloudinary account ready? If not, I'll use placeholder/local images initially and set up Cloudinary integration points for later.

> [!IMPORTANT]
> **3. Car Data & Photos**  
> Do you have actual car photos and data ready to upload? If not, I'll:
> - Use AI-generated car images as placeholders
> - Seed 8-10 sample cars with realistic Indian pricing
> - You can replace them via the admin panel later

> [!IMPORTANT]
> **4. Skydeepgroup Logo**  
> Do you have the Skydeepgroup logo file? If not, I'll create a text-based logo using the brand fonts (Poppins).

> [!IMPORTANT]
> **5. Domain Name**  
> The PRD mentions domain "to be confirmed." For now I'll use `skydeepgroup.com` in all SEO metadata and schema. Please confirm the actual domain.

> [!WARNING]
> **6. Static Export Limitation**  
> With `output: 'export'`, the admin panel will work as a client-side SPA. However, **car changes made in admin won't appear on the public site until a rebuild & re-upload to Hostinger**. The admin can manage leads immediately (client-side Supabase queries), but car additions require a redeploy. Is this acceptable?

---

## Verification Plan

### Automated Testing
```bash
# Build verification — ensures static export succeeds
npm run build

# Lint check
npm run lint

# Local preview of static export
npx serve out/
```

### Browser Testing
- Open each of the 7 public pages and verify rendering
- Test all WhatsApp links open correctly on mobile
- Test contact form → verify lead appears in Supabase
- Test admin login → dashboard → leads → car management
- Test responsive layouts at 375px, 768px, 1280px

### Performance Testing
- Run Lighthouse on built static pages
- Verify Mobile score ≥ 85

### Manual Verification
- Test on real Android device (target audience)
- Verify WhatsApp app opens (not browser)
- Verify call button opens phone dialer

---

*Plan Version: 1.0 | Total Files: ~45 | Estimated Build Time: 12 phases*
