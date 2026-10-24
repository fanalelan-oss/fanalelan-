import { NextRequest, NextResponse } from 'next/server';
import { generatePartnerPin } from '@/lib/works-manager';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const pinData = generatePartnerPin(24);

    // Get origin / base url
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const submitUrl = `${protocol}://${host}/works/submit`;

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
