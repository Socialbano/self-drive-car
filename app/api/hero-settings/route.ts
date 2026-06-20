import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  authenticateRequest, 
  unauthorizedResponse, 
  badRequestResponse, 
  serverErrorResponse,
  sanitizeString,
  isRateLimited,
  getClientIP
} from '@/lib/auth-helpers';

// ─── Use service-role or anon key ───────────────────────────────────────────
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

const DEFAULT_HERO = '/images/hero-bg.jpg';

// ─── GET /api/hero-settings ─────────────────────────────────────────────────
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'hero_image_url')
      .single();

    if (error || !data) {
      // Row not found yet — return the default fallback
      return NextResponse.json({ heroImage: DEFAULT_HERO });
    }

    return NextResponse.json({ heroImage: data.value });
  } catch (error) {
    console.error('[hero-settings] GET error:', error);
    return NextResponse.json({ heroImage: DEFAULT_HERO });
  }
}

// ─── POST /api/hero-settings (Protected) ────────────────────────────────────
export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req);
    if (isRateLimited(`hero-settings:${clientIP}`, 10, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Authentication required
    const user = await authenticateRequest(req);
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await req.json();
    const heroImage = body?.heroImage;

    if (!heroImage || typeof heroImage !== 'string') {
      return badRequestResponse('Hero image path is required');
    }

    // Sanitize - only allow valid URL patterns
    const sanitizedUrl = sanitizeString(heroImage);
    if (!sanitizedUrl.startsWith('/') && !sanitizedUrl.startsWith('https://')) {
      return badRequestResponse('Invalid hero image URL');
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('admin_settings')
      .upsert({ key: 'hero_image_url', value: sanitizedUrl }, { onConflict: 'key' });

    if (error) {
      console.error('[hero-settings] POST error:', error);
      return serverErrorResponse('Failed to update settings');
    }

    return NextResponse.json({ success: true, heroImage: sanitizedUrl });
  } catch (error) {
    console.error('[hero-settings] POST error:', error);
    return badRequestResponse('Invalid request body');
  }
}
