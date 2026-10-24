'use server';

import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Resend } from 'resend';
import { savePendingWork, WorkItem, validatePartnerPin } from '@/lib/works-manager';

// ==========================================
// 1. Contact Form Schema & Types
// ==========================================
const contactFormSchema = z.object({
  name: z.string().min(3, { message: 'الاسم يجب أن يكون 3 أحرف على الأقل.' }),
  phone: z.string().regex(/^(05[0-9]{8}|\+9665[0-9]{8})$/, { message: 'الرجاء إدخال رقم جوال سعودي صحيح (مثال: 05xxxxxxx أو +9665xxxxxxx).' }),
  service: z.string().optional(),
  message: z.string().min(10, { message: 'الرسالة يجب أن تكون 10 أحرف على الأقل.' })
});

export interface FormState {
  message: string;
  errors?: { name?: string[]; phone?: string[]; service?: string[]; message?: string[]; };
  success: boolean;
}

// ==========================================
// 2. Safe Resend Init (Shared Instance)
// ==========================================
const getResend = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
};

// ==========================================
// 3. Contact Form Submission Logic
// ==========================================
export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
  const resend = getResend();
  if (!resend) {
    console.warn('⚠️ خدمة الإيميلات غير مفعلة محلياً لعدم توفر RESEND_API_KEY.');
    return { message: 'خدمة الإيميلات غير مفعلة.', success: false, errors: {} };
  }

  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    service: formData.get('service') || '',
    message: formData.get('message')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'فشل التحقق من البيانات.',
      success: false,
    };
  }

  try {
    const { name, phone, service, message } = validatedFields.data;
    if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');

    const normalizedPhoneForWhatsApp = phone.startsWith('+') ? phone.substring(1) : '966' + phone.substring(1);
    const submittedAt = new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh', dateStyle: 'full', timeStyle: 'short' });
    const serviceLabel = service && service !== '' ? service : 'غير محدد';

    const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>طلب تواصل جديد — فن الإعلان</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background-color: #0D1117; font-family: 'Cairo', -apple-system, BlinkMacSystemFont, Arial, sans-serif; }
</style>
</head>
<body style="background-color:#0D1117; padding: 24px 16px;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px; width:100%;">

        <!-- ===== HEADER ===== -->
        <tr>
          <td style="background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #F59E0B 100%); border-radius: 24px 24px 0 0; padding: 32px 40px; text-align:center;">
            <h1 style="color:#111827; font-size:32px; font-weight:900; letter-spacing:-1px; margin:0;">فن الإعلان</h1>
            <p style="color:#78350F; font-size:13px; font-weight:700; margin:6px 0 0; text-transform:uppercase; letter-spacing:3px;">للدعاية والإعلان والمقاولات العامة</p>
          </td>
        </tr>

        <!-- ===== ALERT BANNER ===== -->
        <tr>
          <td style="background:#1C2333; padding: 14px 40px; text-align:center; border-right: 4px solid #F59E0B;">
            <p style="color:#FBBF24; font-size:14px; font-weight:700; margin:0;">
              🔔 &nbsp; طلب تواصل جديد وصل للتو — يُرجى الرد خلال ساعة
            </p>
          </td>
        </tr>

        <!-- ===== BODY ===== -->
        <tr>
          <td style="background:#161B27; padding: 40px;">

            <!-- Client Info Cards -->
            <p style="color:#9CA3AF; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; margin-bottom:20px;">بيانات العميل</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#1E2640; border-radius:14px; padding:18px 22px; width:48%;">
                  <p style="color:#6B7280; font-size:11px; font-weight:700; margin-bottom:4px;">اسم العميل</p>
                  <p style="color:#FFFFFF; font-size:18px; font-weight:700; margin:0;">${name}</p>
                </td>
                <td style="width:4%;"></td>
                <td style="background:#1E2640; border-radius:14px; padding:18px 22px; width:48%;">
                  <p style="color:#6B7280; font-size:11px; font-weight:700; margin-bottom:4px;">رقم الجوال</p>
                  <a href="tel:${phone}" style="color:#F59E0B; font-size:18px; font-weight:700; text-decoration:none; direction:ltr; display:inline-block; margin:0;">${phone}</a>
                </td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
              <tr>
                <td style="background:#1E2640; border-radius:14px; padding:18px 22px; width:48%;">
                  <p style="color:#6B7280; font-size:11px; font-weight:700; margin-bottom:4px;">الخدمة المطلوبة</p>
                  <p style="color:#FCD34D; font-size:15px; font-weight:700; margin:0;">🏷️ &nbsp;${serviceLabel}</p>
                </td>
                <td style="width:4%;"></td>
                <td style="background:#1E2640; border-radius:14px; padding:18px 22px; width:48%;">
                  <p style="color:#6B7280; font-size:11px; font-weight:700; margin-bottom:4px;">وقت الإرسال</p>
                  <p style="color:#D1D5DB; font-size:13px; font-weight:600; margin:0;">🕐 &nbsp;${submittedAt}</p>
                </td>
              </tr>
            </table>

            <!-- Message Box -->
            <p style="color:#9CA3AF; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; margin-top:28px; margin-bottom:12px;">تفاصيل الطلب / الرسالة</p>
            <div style="background:#1E2640; border-right:4px solid #F59E0B; border-radius:14px; padding:20px 24px;">
              <p style="color:#E5E7EB; font-size:15px; line-height:1.8; margin:0; white-space:pre-wrap;">${message}</p>
            </div>

            <!-- Action Buttons -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
              <tr>
                <td style="width:48%;">
                  <a href="https://wa.me/${normalizedPhoneForWhatsApp}?text=${encodeURIComponent(`مرحبًا ${name}، تواصلت معنا في مؤسسة فن الإعلان بخصوص: ${serviceLabel}`)}"
                     style="display:block; background:#25D366; color:#FFFFFF; text-align:center; padding:14px 20px; border-radius:12px; font-size:15px; font-weight:700; text-decoration:none;">
                    💬 &nbsp; رد عبر واتساب فورًا
                  </a>
                </td>
                <td style="width:4%;"></td>
                <td style="width:48%;">
                  <a href="tel:${phone}"
                     style="display:block; background:#374151; color:#FFFFFF; text-align:center; padding:14px 20px; border-radius:12px; font-size:15px; font-weight:700; text-decoration:none;">
                    📞 &nbsp; اتصال بالعميل
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- ===== FOOTER ===== -->
        <tr>
          <td style="background:#11151F; border-radius:0 0 24px 24px; padding:24px 40px; text-align:center; border-top:1px solid #1E2640;">
            <p style="color:#4B5563; font-size:12px; margin:0;">
              تم إرسال هذا الإشعار تلقائيًا من موقع <strong style="color:#6B7280;">فن الإعلان</strong> الرسمي • الرياض، المملكة العربية السعودية
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>
    `;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'fanalelan@gmail.com',
      subject: `🌟 طلب جديد من ${name} — فن الإعلان`,
      html: emailHtml,
      replyTo: undefined,
    });

    return { message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.', success: true, errors: {} };
  } catch (error) {
    console.error("Email Error:", error);
    return { message: 'عفوًا، حدث خطأ أثناء إرسال الرسالة.', success: false, errors: {} };
  }
}

// ==========================================
// 4. Partner Work Submission Schema & Logic
// ==========================================
const submitWorkSchema = z.object({
  pin: z.string().min(1, 'الرجاء إدخال كلمة المرور المؤقتة.'),
  submitterName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل.'),
  submitterPhone: z.string().min(9, 'الرجاء إدخال رقم جوال صحيح للتواصل.'),
  title: z.string().min(5, 'عنوان العمل يجب أن يكون 5 أحرف على الأقل.'),
  category: z.string().min(2, 'الرجاء اختيار تصنيف العمل.'),
  location: z.string().optional(),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل.'),
});

export interface SubmitWorkState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function submitPartnerWork(
  prevState: SubmitWorkState,
  formData: FormData
): Promise<SubmitWorkState> {
  const pin = (formData.get('pin') as string) || '';
  const submitterName = (formData.get('submitterName') as string) || '';
  const submitterPhone = (formData.get('submitterPhone') as string) || '';
  const title = (formData.get('title') as string) || '';
  const category = (formData.get('category') as string) || '';
  const location = (formData.get('location') as string) || 'الرياض';
  const description = (formData.get('description') as string) || '';
  const imageFile = formData.get('image') as File | null;
  const imageBase64Input = (formData.get('imageBase64') as string) || '';

  // Validate fields
  const validation = submitWorkSchema.safeParse({
    pin,
    submitterName,
    submitterPhone,
    title,
    category,
    location,
    description,
  });

  if (!validation.success) {
    return {
      success: false,
      message: 'الرجاء التأكد من صحة الحقول المدخلة.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  // Check Dynamic PIN (Active and within 24 hours)
  const pinValidation = validatePartnerPin(pin);
  if (!pinValidation.valid) {
    return {
      success: false,
      message: pinValidation.message || 'كلمة المرور غير صحيحة أو انتهت صلاحيتها.',
      errors: { pin: [pinValidation.message || 'كلمة المرور غير صحيحة أو انتهت صلاحيتها.'] },
    };
  }

  // Check Image presence
  if ((!imageFile || imageFile.size === 0) && !imageBase64Input) {
    return {
      success: false,
      message: 'الرجاء إرفاق صورة العمل.',
      errors: { image: ['صورة العمل مطلوبة.'] },
    };
  }

  try {
    // Generate unique ID and token
    const workId = 'work_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
    const token = crypto.randomBytes(16).toString('hex');

    // Process Buffer and Base64
    let buffer: Buffer;
    let finalBase64: string;

    if (imageBase64Input && imageBase64Input.startsWith('data:image')) {
      finalBase64 = imageBase64Input;
      const rawData = imageBase64Input.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(rawData, 'base64');
    } else if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      buffer = Buffer.from(bytes);
      finalBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    } else {
      throw new Error('No valid image data provided');
    }

    // Save image to public/works_images/ and src/data/images/ for local disk fallback
    const imageName = `partner-${workId}.jpg`;
    const uploadDirs = [
      path.join(process.cwd(), 'public', 'works_images'),
      path.join(process.cwd(), 'src', 'data', 'images'),
    ];

    for (const dir of uploadDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(path.join(dir, imageName), buffer);
    }

    // Create WorkItem with embedded base64 to ensure it NEVER 404s on serverless/cloud-run!
    const newWork: WorkItem = {
      id: workId,
      title: title.trim(),
      category: category.trim(),
      imgSrc: finalBase64, // Instant zero-latency embedded image
      imageBase64: finalBase64,
      description: description.trim(),
      submitterName: submitterName.trim(),
      submitterPhone: submitterPhone.trim(),
      location: location.trim(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      token,
    };

    savePendingWork(newWork);

    // Prepare Approval Links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fan-alelan.com';
    const approveUrl = `${baseUrl}/api/works/approve?id=${workId}&token=${token}`;
    const rejectUrl = `${baseUrl}/api/works/reject?id=${workId}&token=${token}`;
    const normalizedPhone = submitterPhone.trim().startsWith('+')
      ? submitterPhone.trim().substring(1)
      : '966' + submitterPhone.trim().replace(/^0/, '');

    // Send Email to site owner via Resend (Shared with Contact Form)
    const resend = getResend();
    if (resend) {
      // Luxury HTML Email that matches the website's gallery card look and feel
      const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>عمل جديد بانتظار اعتمادك — فن الإعلان</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Tajawal', -apple-system, BlinkMacSystemFont, Arial, sans-serif; }
</style>
</head>
<body style="margin:0; padding:0; background:#0B0F17; color:#E5E7EB; direction:rtl; text-align:right;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0F17; padding:30px 10px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111827; border:1px solid #1F2937; border-radius:28px; overflow:hidden; max-width:600px; box-shadow:0 30px 60px rgba(0,0,0,0.8);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding:28px 32px; text-align:center;">
            <p style="color:#78350F; margin:0 0 6px; font-size:12px; font-weight:900; letter-spacing:2px; text-transform:uppercase;">بوابة شركاء فن الإعلان بالرياض</p>
            <h1 style="color:#111827; margin:0; font-size:24px; font-weight:900;">🔔 عمل جديد بانتظار اعتمادك للنشر!</h1>
          </td>
        </tr>

        <!-- The Realistic Gallery Card Simulation -->
        <tr>
          <td style="padding:32px;">
            <p style="color:#9CA3AF; font-size:12px; font-weight:bold; margin-bottom:14px;">معاينة العمل كما سيظهر للزوار في المعرض:</p>
            
            <div style="background:#0D1117; border:1px solid rgba(245, 158, 11, 0.3); border-radius:24px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.6);">
              
              <!-- Embedded Image via Next.js Dynamic API Route -->
              <div style="width:100%; text-align:center; background:#000000; line-height:0;">
                <img src="${baseUrl}/api/works/image?id=${workId}" alt="${newWork.title}" style="width:100%; height:auto; max-height:380px; object-fit:cover; display:block;" />
              </div>

              <!-- Card Content Overlay Look -->
              <div style="padding:24px; background:linear-gradient(180deg, #0D1117 0%, #111827 100%);">
                <div style="margin-bottom:12px;">
                  <span style="display:inline-block; background:#F59E0B; color:#000000; font-size:12px; font-weight:900; padding:4px 14px; border-radius:999px; margin-left:8px;">
                    ${newWork.category}
                  </span>
                  <span style="display:inline-block; background:rgba(255,255,255,0.08); color:#FCD34D; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:999px; border:1px solid rgba(245,158,11,0.2);">
                    📍 ${newWork.location || 'الرياض'}
                  </span>
                </div>

                <h2 style="color:#FFFFFF; margin:0 0 10px; font-size:22px; font-weight:900; line-height:1.4;">
                  ${newWork.title}
                </h2>

                <p style="color:#D1D5DB; font-size:14px; line-height:1.8; margin:0; padding-right:12px; border-right:3px solid #F59E0B;">
                  ${newWork.description}
                </p>
              </div>
            </div>

            <!-- Submitter Information Box -->
            <div style="margin-top:24px; background:#161E2E; border:1px solid #1F2D48; border-radius:18px; padding:20px;">
              <p style="color:#FBBF24; font-size:12px; font-weight:bold; margin-bottom:12px;">معلومات الشريك والاتصال:</p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%; vertical-align:top;">
                    <span style="color:#9CA3AF; font-size:11px;">اسم الشريك / الراسل:</span>
                    <p style="color:#FFFFFF; font-weight:bold; margin:4px 0 0; font-size:15px;">${newWork.submitterName}</p>
                  </td>
                  <td style="width:50%; vertical-align:top;">
                    <span style="color:#9CA3AF; font-size:11px;">رقم الجوال:</span>
                    <p style="color:#F59E0B; font-weight:bold; margin:4px 0 0; font-size:15px;" dir="ltr">${newWork.submitterPhone}</p>
                  </td>
                </tr>
              </table>

              <div style="margin-top:14px; text-align:center;">
                <a href="https://wa.me/${normalizedPhone}?text=${encodeURIComponent(`مرحباً أخي ${newWork.submitterName}، بخصوص العمل الذي أضفته في فن الإعلان (${newWork.title})`)}" target="_blank" style="display:inline-block; background:#25D366; color:#FFFFFF; text-decoration:none; font-size:13px; font-weight:bold; padding:8px 18px; border-radius:10px;">
                  💬 فتح محادثة واتساب مع الشريك
                </a>
              </div>
            </div>

            <!-- APPROVAL BUTTONS (ONE CLICK) -->
            <div style="margin-top:28px; background:#0B0F17; border:1px solid #1F2937; border-radius:20px; padding:24px; text-align:center;">
              <p style="color:#E5E7EB; font-size:14px; font-weight:bold; margin:0 0 16px;">
                اضغط على أحد الإجراءات التالية للاعتماد الفوري المباشر:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <a href="${approveUrl}" target="_blank" style="display:block; background:linear-gradient(135deg, #10B981 0%, #059669 100%); color:#FFFFFF; text-decoration:none; font-size:17px; font-weight:900; padding:16px 30px; border-radius:14px; box-shadow:0 10px 25px rgba(16,185,129,0.35);">
                      ✅ اعتماد ونشر العمل فوراً في المعرض
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${rejectUrl}" target="_blank" style="display:inline-block; background:#1F2937; color:#EF4444; text-decoration:none; font-size:13px; font-weight:bold; padding:10px 22px; border-radius:10px; border:1px solid #374151;">
                      ❌ رفض أو حذف الطلب
                    </a>
                  </td>
                </tr>
              </table>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0D1117; padding:18px; text-align:center; font-size:12px; color:#6B7280; border-top:1px solid #1F2937;">
            مؤسسة فن الإعلان للدعاية والمقاولات بالرياض • جميع الحقوق محفوظة
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>
      `;

      // Dispatch via Resend with INLINE ATTACHMENT
      const sendResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'fanalelan@gmail.com',
        subject: `🔔 طلب اعتماد عمل جديد: ${newWork.title} — فن الإعلان`,
        html: emailHtml,
        attachments: [
          {
            filename: `partner-${workId}.jpg`,
            content: buffer,
          },
        ],
      });

      console.log('Work approval email dispatch result (with inline CID attachment):', sendResult);
    } else {
      console.warn('⚠️ RESEND_API_KEY غير موجود في البيئة الحالية؛ لم يتم إرسال الإيميل محلياً ولكن تم حفظ العمل كمعلق بنجاح.');
    }

    return {
      success: true,
      message: 'تم إرسال العمل بنجاح! تم إشعار إدارة فن الإعلان للاعتماد وسيظهر في المعرض فور الموافقة عليه.',
    };
  } catch (error) {
    console.error('Error submitting partner work:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.',
    };
  }
}

// ==========================================
// 5. Gemini Chatbot Logic (unchanged)
// ==========================================
interface GeminiModel { name: string; supportedGenerationMethods: string[]; }
export async function getGeminiResponse(userPrompt: string): Promise<string> {
  const apiKey = (process.env.MY_GEMINI_API_KEY || "").trim();
  if (!apiKey) return "المفتاح مفقود.";
  const systemContext = `أنت المساعد الذكي 'فن' لمؤسسة فن الإعلان بالرياض. متخصص في الكلادينج واللوحات. 
  الأسعار: الحروف البارزة 350 ريال، الاستيكر 35 ريال، الأسوار 150-250 ريال، الكلادينج 160-280 ريال.
  الضمان: 15 سنة على الكلادينج. الموقع: نخدم كل أحياء الرياض. تحدث بلهجة سعودية ودودة.`;
  try {
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const listData = await listRes.json();
    const availableModels: GeminiModel[] = listData.models || [];
    const targetModel = availableModels.find((m) => m.name.includes("gemini-1.5-flash") && m.supportedGenerationMethods.includes("generateContent"))
                       || availableModels.find((m) => m.supportedGenerationMethods.includes("generateContent"));
    if (!targetModel) return "يا هلا بك! جاري تحديث أنظمة الذكاء الاصطناعي، تواصل معنا واتساب وأبشر بسعدك.";
    const url = `https://generativelanguage.googleapis.com/v1beta/${targetModel.name}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `${systemContext}\n\nسؤال العميل: ${userPrompt}` }] }] })
    });
    const data = await response.json();
    if (response.ok && data.candidates) return data.candidates[0].content.parts[0].text;
    return "معليش يا غالي، حصل عندي التماس بسيط، جرب تسألني بعد دقيقة.";
  } catch (error) {
    console.error(error);
    return "يا هلا بك! فيه مشكلة في الاتصال، كلمنا واتساب وأبشر باللي يرضيك.";
  }
}
