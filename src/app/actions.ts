'use server';

import { z } from 'zod';
import { Resend } from 'resend';

// 1. Schema updated to be more flexible
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

// 2. Safe Resend Init
const getResend = () => {
    const key = process.env.RESEND_API_KEY;
    if (!key) return null;
    return new Resend(key);
};

// 3. Main form submission logic
export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
  const resend = getResend();
  if (!resend) return { message: 'خدمة الإيميلات غير مفعلة.', success: false, errors: {} };

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
                  <p style="color:#6B7280; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">👤 الاسم</p>
                  <p style="color:#F9FAFB; font-size:20px; font-weight:900; margin:0;">${name}</p>
                </td>
                <td style="width:4%;"></td>
                <td style="background:#1E2640; border-radius:14px; padding:18px 22px; width:48%;">
                  <p style="color:#6B7280; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">📱 الجوال</p>
                  <a href="tel:${phone}" style="color:#FBBF24; font-size:20px; font-weight:900; text-decoration:none; display:block;">${phone}</a>
                </td>
              </tr>
            </table>

            <!-- Service Badge -->
            <div style="margin-top:16px; background:#1E2640; border-radius:14px; padding:16px 22px; display:inline-block; width:100%;">
              <p style="color:#6B7280; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">🔧 نوع الخدمة المطلوبة</p>
              <span style="display:inline-block; background:linear-gradient(135deg,#F59E0B,#FBBF24); color:#111827; font-size:14px; font-weight:900; padding:6px 18px; border-radius:30px;">${serviceLabel}</span>
            </div>

            <!-- Message Box -->
            <div style="margin-top:24px;">
              <p style="color:#9CA3AF; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; margin-bottom:12px;">💬 نص الرسالة</p>
              <div style="background:#0D1117; border:1px solid #2D3748; border-right:3px solid #FBBF24; border-radius:14px; padding:22px 26px;">
                <p style="color:#E5E7EB; font-size:17px; line-height:1.9; margin:0; white-space:pre-wrap;">${message}</p>
              </div>
            </div>

            <!-- Metadata -->
            <p style="color:#4B5563; font-size:12px; margin-top:20px; text-align:right;">
              🕐 وقت الإرسال: ${submittedAt}
            </p>

          </td>
        </tr>

        <!-- ===== CTA ACTIONS ===== -->
        <tr>
          <td style="background:#111827; padding: 32px 40px; text-align:center; border-top:1px solid #1F2937;">
            <p style="color:#6B7280; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:2px; margin-bottom:22px;">إجراءات سريعة</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 0 6px;">
                  <a href="tel:${phone}"
                     style="display:inline-block; background:linear-gradient(135deg,#F59E0B,#FBBF24); color:#111827; font-size:15px; font-weight:900; text-decoration:none; padding:16px 28px; border-radius:14px; letter-spacing:0.5px;">
                    📞 اتصل بالعميل الآن
                  </a>
                </td>
                <td align="center" style="padding: 0 6px;">
                  <a href="https://wa.me/${normalizedPhoneForWhatsApp}?text=${encodeURIComponent(`السلام عليكم ${name}، تواصلت معنا من موقع فن الإعلان، أبشر بالرد فوراً 🙂`)}"
                     target="_blank"
                     style="display:inline-block; background:#25D366; color:#FFFFFF; font-size:15px; font-weight:900; text-decoration:none; padding:16px 28px; border-radius:14px; letter-spacing:0.5px;">
                    💬 واتساب مباشر
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ===== FOOTER ===== -->
        <tr>
          <td style="background:#0D1117; padding:24px 40px; border-radius:0 0 24px 24px; text-align:center; border-top:1px solid #1F2937;">
            <p style="color:#374151; font-size:12px; margin:0;">
              © ${new Date().getFullYear()} فن الإعلان للدعاية والإعلان والمقاولات العامة — الرياض
            </p>
            <p style="color:#374151; font-size:11px; margin:6px 0 0;">
              هذا الإيميل مُرسل تلقائياً من نموذج التواصل في موقع fan-alelan.com
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

// 4. Gemini Chatbot Logic (unchanged)
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
