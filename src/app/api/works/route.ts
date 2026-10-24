import { NextResponse } from 'next/server';
import { getAllGalleryWorks } from '@/lib/works-manager';

export const dynamic = 'force-dynamic';

export async function GET() {
  const works = getAllGalleryWorks();
  return NextResponse.json({ success: true, count: works.length, works });
}
