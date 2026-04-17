import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Create unique filename
    const filename = `hero-${Date.now()}${path.extname(file.name)}`;
    const assetsDir = path.join(process.cwd(), 'public', 'assets', 'hero');

    // Ensure directory exists
    try {
      await mkdir(assetsDir, { recursive: true });
    } catch {
      // directory might already exist
    }

    const filepath = path.join(assetsDir, filename);

    // Save actual file
    await writeFile(filepath, buffer);

    // Save JSON config
    const dataDir = path.join(process.cwd(), 'data');
    try {
      await mkdir(dataDir, { recursive: true });
    } catch {
      // directory might exist
    }

    const settingsPath = path.join(dataDir, 'settings.json');
    const settingsObj = {
      heroImage: `/assets/hero/${filename}`
    };

    await writeFile(settingsPath, JSON.stringify(settingsObj, null, 2));

    return NextResponse.json({ success: true, url: settingsObj.heroImage });

  } catch (error) {
    console.error('Hero upload error:', error);
    return NextResponse.json({ error: 'File upload failed.' }, { status: 500 });
  }
}
