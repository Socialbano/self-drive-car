import { NextResponse } from 'next/server';
import { getAdminSettings, updateAdminSettings } from '@/lib/supabase/queries';
import {
  authenticateRequest,
  isSuperAdmin,
  unauthorizedResponse,
  forbiddenResponse,
  serverErrorResponse,
  sanitizeObject,
  isRateLimited,
  getClientIP
} from '@/lib/auth-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getAdminSettings();
    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch settings', details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req);
    if (isRateLimited(`settings:${clientIP}`, 15, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Authentication required
    const user = await authenticateRequest(req);
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await req.json();
    
    if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'Request body is empty or invalid' }, { status: 400 });
    }

    // Only super admin can modify settings
    if (!isSuperAdmin(user.email)) {
      return forbiddenResponse('Only super admin can modify settings');
    }

    // Sanitize all string values
    const sanitizedBody = sanitizeObject(body);

    const success = await updateAdminSettings(sanitizedBody);
    
    if (!success) {
      return serverErrorResponse('Failed to update settings in database');
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
