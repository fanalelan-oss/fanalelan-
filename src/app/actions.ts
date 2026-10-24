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

  // Check Image
  if (!imageFile || imageFile.size === 0) {
    return {
      success: false,
      message: 'الرجاء إرفاق صورة العمل.',
      errors: { image: ['صورة العمل مطلوبة.'] },
    };
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!validTypes.includes(imageFile.type)) {
    return {
      success: false,
      message: 'نوع الصورة غير مدعوم. يرجى رفع صورة بصيغة JPG أو PNG أو WEBP.',
      errors: { image: ['نوع الصورة غير مدعوم.'] },
    };
  }

  try {
    // Generate unique ID and token
    const workId = 'work_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
    const token = crypto.randomBytes(16).toString('hex');

    // Save image to public/works_images/
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = imageFile.name.split('.').pop() || 'jpg';
    const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext.toLowerCase()) ? ext.toLowerCase() : 'jpg';
    const imageName = `partner-${workId}.${safeExt}`;
    const uploadDir = path.join(process.cwd(), 'public', 'works_images');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imagePath = path.join(uploadDir, imageName);
    fs.writeFileSync(imagePath, buffer);

    const publicImgSrc = `/works_images/${imageName}`;

    // Create WorkItem
    const newWork: WorkItem = {
      id: workId,
      title: title.trim(),
      category: category.trim(),
      imgSrc: publicImgSrc,
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
    const fullImageUrl = `${baseUrl}${publicImgSrc}`;

    // Send Email to site owner via Resend (Shared with Contact Form)
    const resend = getResend();
    if (resend) {
      const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>عمل جديد بانتظار اعتمادك — فن الإعلان</title>
</head>
<body style="margin:0; padding:0; background:#0B0F17; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#E5E7EB; direction:rtl; text-align:right;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0F17; padding:30px 10px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#131C2E; border:1px solid #1E2D48; border-radius:24px; overflow:hidden; max-width:600px; box-shadow:0 25px 50px rgba(0,0,0,0.5);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding:28px 32px; text-align:center;">
            <h1 style="color:#111827; margin:0; font-size:24px; font-weight:900;">🔔 عمل جديد بانتظار اعتمادك للنشر!</h1>
            <p style="color:#374151; margin:8px 0 0; font-size:14px; font-weight:bold;">تمت إضافة عمل جديد عبر بوابة الشركاء — فن الإعلان</p>
          </td>
        </tr>

        <!-- Details -->
        <tr>
          <td style="padding:32px;">
            
            <!-- Work Title -->
            <div style="background:#0D1117; border-right:4px solid #F59E0B; border-radius:12px; padding:16px 20px; margin-bottom:20px;">
              <span style="color:#9CA3AF; font-size:12px; font-weight:bold;">عنوان المشروع:</span>
              <h2 style="color:#FFFFFF; margin:4px 0 0; font-size:18px;">${newWork.title}</h2>
            </div>

            <!-- Meta Grid -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td style="padding:8px; background:#0D1117; border-radius:10px; width:50%; vertical-align:top;">
                  <span style="color:#9CA3AF; font-size:11px;">التصنيف:</span>
                  <p style="color:#F59E0B; font-weight:bold; margin:3px 0 0; font-size:14px;">${newWork.category}</p>
                </td>
                <td style="width:10px;"></td>
                <td style="padding:8px; background:#0D1117; border-radius:10px; width:50%; vertical-align:top;">
                  <span style="color:#9CA3AF; font-size:11px;">الموقع:</span>
                  <p style="color:#E5E7EB; font-weight:bold; margin:3px 0 0; font-size:14px;">${newWork.location || 'الرياض'}</p>
                </td>
              </tr>
              <tr><td height="10"></td></tr>
              <tr>
                <td style="padding:8px; background:#0D1117; border-radius:10px; vertical-align:top;">
                  <span style="color:#9CA3AF; font-size:11px;">اسم الشريك / الراسل:</span>
                  <p style="color:#E5E7EB; font-weight:bold; margin:3px 0 0; font-size:14px;">${newWork.submitterName}</p>
                </td>
                <td style="width:10px;"></td>
                <td style="padding:8px; background:#0D1117; border-radius:10px; vertical-align:top;">
                  <span style="color:#9CA3AF; font-size:11px;">جوال الشريك:</span>
                  <p style="color:#E5E7EB; font-weight:bold; margin:3px 0 0; font-size:14px;" dir="ltr">${newWork.submitterPhone}</p>
                </td>
              </tr>
            </table>

            <!-- Description -->
            <div style="background:#0D1117; border-radius:12px; padding:16px 20px; margin-bottom:24px;">
              <span style="color:#9CA3AF; font-size:12px; font-weight:bold;">وصف العمل:</span>
              <p style="color:#D1D5DB; margin:6px 0 0; font-size:14px; line-height:1.7;">${newWork.description}</p>
            </div>

            <!-- Image Preview -->
            <div style="text-align:center; margin-bottom:28px;">
              <span style="color:#9CA3AF; font-size:12px; font-weight:bold; display:block; margin-bottom:8px;">معاينة الصورة المرفقة:</span>
              <img src="${fullImageUrl}" alt="${newWork.title}" style="max-width:100%; height:auto; max-height:280px; border-radius:14px; border:1px solid #374151;" />
            </div>

            <!-- APPROVAL BUTTONS -->
            <div style="background:#111827; border:1px solid #1F2937; border-radius:16px; padding:24px; text-align:center;">
              <p style="color:#9CA3AF; font-size:13px; margin:0 0 16px; font-weight:bold;">اضغط على أحد الإجراءات التالية للاعتماد الفوري:</p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:6px;">
                    <a href="${approveUrl}" target="_blank" style="display:inline-block; background:#10B981; color:#FFFFFF; text-decoration:none; font-size:16px; font-weight:bold; padding:14px 28px; border-radius:12px; box-shadow:0 10px 20px rgba(16,185,129,0.3);">
                      ✅ اعتماد ونشر العمل فوراً في الموقع
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:6px;">
                    <a href="${rejectUrl}" target="_blank" style="display:inline-block; background:#EF4444; color:#FFFFFF; text-decoration:none; font-size:13px; font-weight:bold; padding:10px 20px; border-radius:10px;">
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
          <td style="background:#0D1117; padding:16px; text-align:center; font-size:12px; color:#6B7280; border-top:1px solid #1F2937;">
            فن الإعلان للدعاية والمقاولات بالرياض • نظام إدارة الأعمال الذكي
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>
      `;

      const sendResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'fanalelan@gmail.com',
        subject: `🔔 طلب اعتماد عمل جديد: ${newWork.title} — فن الإعلان`,
        html: emailHtml,
      });

      console.log('Work approval email dispatch result:', sendResult);
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
