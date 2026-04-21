import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service-role key for server-side storage access
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!key) {
    console.error('[Upload-Hero] CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.');
    // Fallback to anon key but log warning
  }
  
  return createClient(url, key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      console.error('[Upload-Hero] No file in request');
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    // Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const arrayBuffer = await file.arrayBuffer();
    
    // Constant path
    const extension = file.type.split('/')[1] || 'webp';
    const storagePath = `hero-image.${extension}`;

    console.log(`[Upload-Hero] Attempting to upload ${file.name} to bucket "hero-images" at path "${storagePath}"...`);

    // 1. Upload/Upsert to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('hero-images')
      .upload(storagePath, arrayBuffer, {
        upsert: true,
        contentType: file.type,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('[Upload-Hero] Supabase Storage Error:', uploadError);
      return NextResponse.json({ 
        error: 'Failed to upload to storage.',
        details: uploadError.message 
      }, { status: 500 });
    }

    console.log('[Upload-Hero] Upload successful:', uploadData);

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('hero-images')
      .getPublicUrl(storagePath);

    // 3. Update admin_settings table
    const { error: dbError } = await supabase
      .from('admin_settings')
      .upsert({ key: 'hero_image_url', value: publicUrl }, { onConflict: 'key' });

    if (dbError) {
      console.error('[Upload-Hero] Database Update Error:', dbError);
    }

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      timestamp: Date.now()
    });

  } catch (error: any) {
    console.error('[Upload-Hero] Runtime Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
