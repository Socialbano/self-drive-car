import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
    const data = await readFile(settingsPath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    // If file doesn't exist, return default fallback
    return NextResponse.json({ heroImage: '/images/hero-bg.jpg' });
  }
}
