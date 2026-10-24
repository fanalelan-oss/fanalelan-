import { NextRequest, NextResponse } from 'next/server';
import { rejectWorkById } from '@/lib/works-manager';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const token = searchParams.get('token');

  if (!id || !token) {
    return new NextResponse(renderHtmlPage({
      title: 'رابط غير صالح',
      heading: '⚠️ معرّف أو رمز التحقق مفقود',
      message: 'الرابط الذي استخدمته غير مكتمل أو غير صالح.',
    }), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const result = rejectWorkById(id, token);

  return new NextResponse(renderHtmlPage({
    title: result.success ? 'تم رفض الطلب' : 'تعذر تنفيذ الإجراء',
    heading: result.success ? '🗑️ تم رفض وحذف الطلب بنجاح' : '❌ تعذر العثور على الطلب',
    message: result.message,
  }), {
    status: result.success ? 200 : 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function renderHtmlPage({ title, heading, message }: { title: string; heading: string; message: string }) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — فن الإعلان</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Tajawal', system-ui, sans-serif; }
    body {
      background: radial-gradient(circle at 50% 20%, #1a1622 0%, #0a0e17 100%);
      color: #F3F4F6;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
    }
    .card {
      background: rgba(26, 22, 34, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(16px);
      border-radius: 28px;
      padding: 40px 32px;
      max-width: 520px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
    }
    .icon-badge {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 0 auto 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 38px;
      background: rgba(239, 68, 68, 0.15);
      border: 2px solid #EF4444;
    }
    h1 {
      font-size: 24px;
      font-weight: 900;
      color: #FFFFFF;
      margin-bottom: 12px;
    }
    p {
      font-size: 15px;
      color: #9CA3AF;
      line-height: 1.7;
      margin-bottom: 28px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 28px;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      background: rgba(255, 255, 255, 0.08);
      color: #E5E7EB;
      border: 1px solid rgba(255, 255, 255, 0.12);
      transition: all 0.2s ease;
    }
    .btn:hover { background: rgba(255, 255, 255, 0.15); }
    .footer { margin-top: 24px; font-size: 12px; color: #6B7280; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-badge">🗑️</div>
    <h1>${heading}</h1>
    <p>${message}</p>
    <a href="/" class="btn">العودة للرئيسية</a>
    <div class="footer">فن الإعلان للدعاية والمقاولات — الرياض</div>
  </div>
</body>
</html>`;
}
