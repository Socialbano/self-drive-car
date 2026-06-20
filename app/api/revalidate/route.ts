import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import {
  authenticateRequest,
  unauthorizedResponse,
  badRequestResponse,
  isRateLimited,
  getClientIP
} from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting — max 20 revalidations per minute
    const clientIP = getClientIP(req);
    if (isRateLimited(`revalidate:${clientIP}`, 20, 60000)) {
      return NextResponse.json({ error: 'Too many revalidation requests' }, { status: 429 });
    }

    // Authentication required
    const user = await authenticateRequest(req);
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await req.json();
    const { path, tag, type = 'page' } = body || {};

    if (!path && !tag) {
      return badRequestResponse('Either "path" or "tag" is required');
    }

    // Validate path format (must start with /)
    if (path && (typeof path !== 'string' || !path.startsWith('/'))) {
      return badRequestResponse('Invalid path format. Must start with "/"');
    }

    // Validate type
    if (type && !['page', 'layout'].includes(type)) {
      return badRequestResponse('Invalid type. Must be "page" or "layout"');
    }
    
    if (tag && typeof tag === 'string') {
      revalidateTag(tag);
    }
    
    if (path && typeof path === 'string') {
      revalidatePath(path, type as 'page' | 'layout');
    }
    
    return NextResponse.json({ revalidated: true, path, tag, now: Date.now() });
  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json({ revalidated: false, message: 'Error revalidating' }, { status: 500 });
  }
}
