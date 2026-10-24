import { NextRequest, NextResponse } from 'next/server';
import { getApprovedCustomWorks, getPendingWorks } from '@/lib/works-manager';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Image ID required', { status: 400 });
  }

  // 1. Try to find the work in approved or pending
  const allCustom = [...getApprovedCustomWorks(), ...getPendingWorks()];
  const work = allCustom.find(w => w.id === id);

  // If work has base64 data stored directly in JSON
  if (work && work.imageBase64) {
    const rawBase64 = work.imageBase64;
    const base64Data = rawBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // 2. Check local disk fallback
  const diskPaths = [
    path.join(process.cwd(), 'src', 'data', 'images', `${id}.jpg`),
    path.join(process.cwd(), 'public', 'works_images', `partner-${id}.jpg`),
    path.join(process.cwd(), 'public', 'works_images', `partner-${id}.jpeg`),
    path.join(process.cwd(), 'public', 'works_images', `partner-${id}.png`),
    path.join(process.cwd(), 'public', 'works_images', `partner-${id}.webp`),
  ];

  for (const p of diskPaths) {
    if (fs.existsSync(p)) {
      const fileBuffer = fs.readFileSync(p);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  }

  return new NextResponse('Image not found', { status: 404 });
}
