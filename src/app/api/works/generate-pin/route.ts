import { NextRequest, NextResponse } from 'next/server';
import { generatePartnerPin } from '@/lib/works-manager';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const pinData = generatePartnerPin(24);

    // Ensure the public URL always uses the official domain (fan-alelan.com) in production
    // to prevent Google Cloud Run 403 Forbidden on raw *.run.app internal URLs
    const host = request.headers.get('host') || '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
    const submitUrl = isLocal
      ? `http://${host}/works/submit`
      : 'https://fan-alelan.com/works/submit';

    return NextResponse.json({
      success: true,
      pin: pinData.pin,
      expiresAt: pinData.expiresAt,
      submitUrl,
      message: 'تم توليد كلمة مرور جديدة صالحة لمدة 24 ساعة بنجاح.',
    });
  } catch (error) {
    console.error('Error generating pin:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء توليد كلمة المرور.' },
      { status: 500 }
    );
  }
}
