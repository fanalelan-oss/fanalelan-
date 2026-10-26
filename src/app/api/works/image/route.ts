import { NextRequest, NextResponse } from 'next/server';
import { getApprovedCustomWorks, getPendingWorks } from '@/lib/works-manager';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.avif':
      return 'image/avif';
    case '.svg':
      return 'image/svg+xml';
    case '.gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

export async function GET(request: NextRequest) {
  const urlObj = new URL(request.url);
  const { searchParams } = urlObj;
  const id = searchParams.get('id');
  let fileParam = searchParams.get('file') || searchParams.get('name') || searchParams.get('path');

  // If accessed via rewrite like /works_images/... or /images/...
  if (!fileParam) {
    if (urlObj.pathname.startsWith('/works_images/')) {
      fileParam = urlObj.pathname.replace(/^\/works_images\//, '');
    } else if (urlObj.pathname.startsWith('/images/')) {
      fileParam = urlObj.pathname.replace(/^\/images\//, '');
    }
  }

  // 1. Direct file request (e.g. from rewrite /works_images/:path* or ?file=...)
  if (fileParam) {
    // Sanitize filename to prevent directory traversal
    const cleanFileName = path.basename(fileParam.replace(/^[/\\]+/, ''));
    
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'works_images', cleanFileName),
      path.join(process.cwd(), 'public', 'images', cleanFileName),
      path.join(process.cwd(), 'public', cleanFileName),
      path.join(process.cwd(), 'src', 'data', 'images', cleanFileName),
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        try {
          const buffer = fs.readFileSync(p);
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': getMimeType(cleanFileName),
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        } catch (err) {
          console.error(`Error reading image file at ${p}:`, err);
        }
      }
    }
  }

  // 2. Partner work by ID
  if (id) {
    // 2a. Check if ID itself matches a file name in public/works_images
    const cleanId = path.basename(id);
    const directFileCandidates = [
      path.join(process.cwd(), 'public', 'works_images', cleanId),
      path.join(process.cwd(), 'public', 'works_images', `${cleanId}.jpg`),
      path.join(process.cwd(), 'public', 'works_images', `${cleanId}.png`),
      path.join(process.cwd(), 'public', 'works_images', `${cleanId}.webp`),
      path.join(process.cwd(), 'public', 'works_images', `partner-${cleanId}.jpg`),
      path.join(process.cwd(), 'public', 'works_images', `partner-${cleanId}.png`),
    ];

    for (const p of directFileCandidates) {
      if (fs.existsSync(p)) {
        try {
          const buffer = fs.readFileSync(p);
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': getMimeType(p),
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        } catch (err) {
          console.error(`Error reading image at ${p}:`, err);
        }
      }
    }

    // 2b. Check in pending or approved works JSON
    const allCustom = [...getApprovedCustomWorks(), ...getPendingWorks()];
    const work = allCustom.find(w => w.id === id);

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

    // 2c. Check disk fallback for partner work
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
            'Content-Type': getMimeType(p),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }
  }

  return new NextResponse('Image not found', { status: 404 });
}
