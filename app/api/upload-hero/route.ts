import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  authenticateRequest,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  isRateLimited,
  getClientIP
} from '@/lib/auth-helpers';

// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Use service-role key for server-side storage access
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!key) {
    console.error('[Upload-Hero] CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.');
  }
  
  return createClient(url, key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting — max 5 uploads per minute
    const clientIP = getClientIP(req);
    if (isRateLimited(`upload-hero:${clientIP}`, 5, 60000)) {
      return NextResponse.json({ error: 'Too many upload requests. Try again later.' }, { status: 429 });
    }

    // Authentication required
    const user = await authenticateRequest(req);
    if (!user) {
      return unauthorizedResponse();
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      console.error('[Upload-Hero] No file in request');
      return badRequestResponse('No file received.');
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return badRequestResponse(`Invalid file type "${file.type}". Allowed: JPG, PNG, WEBP.`);
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return badRequestResponse(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum: 5MB.`);
    }

    // Additional MIME validation: check magic bytes
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    if (!isValidImageMagicBytes(bytes)) {
      return badRequestResponse('File content does not match an image. Upload rejected.');
    }

    const supabase = getSupabaseAdmin();
    
    // Generate safe filename (no user-controlled paths)
    const extension = file.type.split('/')[1] || 'webp';
    const storagePath = `hero-image.${extension}`;

    console.log(`[Upload-Hero] User ${user.email} uploading to "${storagePath}" (${(file.size / 1024).toFixed(0)}KB)`);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('hero-images')
      .upload(storagePath, arrayBuffer, {
        upsert: true,
        contentType: file.type,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('[Upload-Hero] Supabase Storage Error:', uploadError);
      return serverErrorResponse('Failed to upload to storage.');
    }

    console.log('[Upload-Hero] Upload successful:', uploadData);

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('hero-images')
      .getPublicUrl(storagePath);

    // Update admin_settings table
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
    return serverErrorResponse('Internal Server Error');
  }
}

/**
 * Validate image file by checking magic bytes (file signature).
 * Prevents disguised executables from being uploaded.
 */
function isValidImageMagicBytes(bytes: Uint8Array): boolean {
  if (bytes.length < 4) return false;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return true;

  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return true;

  // WebP: RIFF....WEBP
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes.length > 11 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return true;

  return false;
}
