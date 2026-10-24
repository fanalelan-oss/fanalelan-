import { NextRequest, NextResponse } from 'next/server';
import { approveWorkById } from '@/lib/works-manager';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const token = searchParams.get('token');

  if (!id || !token) {
    return new NextResponse(renderHtmlPage({
      title: 'رابط غير صالح',
      heading: '⚠️ معرّف أو رمز التحقق مفقود',
      message: 'الرابط الذي استخدمته غير مكتمل أو غير صالح. يرجى التأكد من الرابط المرسل في البريد.',
      isSuccess: false,
    }), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const result = approveWorkById(id, token);

  if (!result.success) {
    return new NextResponse(renderHtmlPage({
      title: 'تعذر الاعتماد',
      heading: '❌ تعذر اعتماد العمل',
      message: result.message,
      isSuccess: false,
    }), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const work = result.work;

  return new NextResponse(renderHtmlPage({
    title: 'تم اعتماد العمل بنجاح',
    heading: '✅ تم اعتماد العمل ونشره في المعرض!',
    message: result.message,
    isSuccess: true,
    workDetails: work ? {
      title: work.title,
      category: work.category,
      submitterName: work.submitterName,
      location: work.location,
      imgSrc: work.imgSrc,
      description: work.description,
    } : undefined,
  }), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

interface PageProps {
  title: string;
  heading: string;
  message: string;
  isSuccess: boolean;
  workDetails?: {
    title: string;
    category: string;
    submitterName?: string;
    location?: string;
    imgSrc: string;
    description: string;
  };
}

function renderHtmlPage(props: PageProps) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${props.title} — فن الإعلان</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Tajawal', system-ui, sans-serif; }
    body {
      background: radial-gradient(circle at 50% 20%, #151d2f 0%, #0a0e17 100%);
      color: #F3F4F6;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
    }
    .card {
      background: rgba(22, 30, 49, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(16px);
      border-radius: 28px;
      padding: 40px 32px;
      max-width: 580px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px ${props.isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
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
      background: ${props.isSuccess ? 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.3) 100%)' : 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(185,28,28,0.3) 100%)'};
      border: 2px solid ${props.isSuccess ? '#10B981' : '#EF4444'};
    }
    h1 {
      font-size: 26px;
      font-weight: 900;
      color: #FFFFFF;
      margin-bottom: 12px;
      line-height: 1.4;
    }
    p.subtitle {
      font-size: 16px;
      color: #9CA3AF;
      line-height: 1.7;
      margin-bottom: 28px;
    }
    .work-preview {
      background: #0d121d;
      border: 1px solid #1f293d;
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 28px;
      text-align: right;
    }
    .work-preview img {
      width: 100%;
      height: 220px;
      object-fit: cover;
      border-radius: 14px;
      margin-bottom: 16px;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .work-preview h3 {
      font-size: 18px;
      font-weight: 800;
      color: #F59E0B;
      margin-bottom: 6px;
    }
    .meta-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }
    .tag {
      background: rgba(255,255,255,0.06);
      color: #D1D5DB;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .tag.highlight {
      background: rgba(245, 158, 11, 0.15);
      color: #FBBF24;
      border-color: rgba(245, 158, 11, 0.3);
    }
    .desc {
      font-size: 13px;
      color: #9CA3AF;
      line-height: 1.6;
    }
    .actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 28px;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btn-primary {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      color: #111827;
      box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 26px rgba(245, 158, 11, 0.45);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #E5E7EB;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.14);
    }
    .footer {
      margin-top: 28px;
      font-size: 12px;
      color: #6B7280;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-badge">
      ${props.isSuccess ? '✨' : '⚠️'}
    </div>
    <h1>${props.heading}</h1>
    <p class="subtitle">${props.message}</p>

    ${props.workDetails ? `
    <div class="work-preview">
      <img src="${props.workDetails.imgSrc}" alt="${props.workDetails.title}" />
      <h3>${props.workDetails.title}</h3>
      <div class="meta-tags">
        <span class="tag highlight">🏷️ ${props.workDetails.category}</span>
        ${props.workDetails.location ? `<span class="tag">📍 ${props.workDetails.location}</span>` : ''}
        ${props.workDetails.submitterName ? `<span class="tag">👤 ${props.workDetails.submitterName}</span>` : ''}
      </div>
      <p class="desc">${props.workDetails.description}</p>
    </div>
    ` : ''}

    <div class="actions">
      <a href="/gallery" class="btn btn-primary">🖼️ مشاهدة في معرض الأعمال</a>
      <a href="/" class="btn btn-secondary">الرئيسية</a>
    </div>

    <div class="footer">
      فن الإعلان للدعاية والمقاولات — الرياض
    </div>
  </div>
</body>
</html>`;
}
