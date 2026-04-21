import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

// ─── POST /api/hero-settings ────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { heroImage } = await req.json();

    if (!heroImage) {
      return NextResponse.json({ error: 'Hero image path is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('admin_settings')
      .upsert({ key: 'hero_image_url', value: heroImage }, { onConflict: 'key' });

    if (error) {
      console.error('[hero-settings] POST error:', error);
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }

    return NextResponse.json({ success: true, heroImage });
  } catch (error) {
    console.error('[hero-settings] POST error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
