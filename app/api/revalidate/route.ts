import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { path, tag, type = 'page' } = await req.json();
    
    if (tag) {
      revalidateTag(tag);
    }
    
    if (path) {
      revalidatePath(path, type as 'page' | 'layout');
    }
    
    return NextResponse.json({ revalidated: true, path, tag, now: Date.now() });
  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json({ revalidated: false, message: 'Error revalidating' }, { status: 500 });
  }
}
