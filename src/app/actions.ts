'use server';

import { z } from 'zod';
import { Resend } from 'resend';

// 1. Schema updated to be more flexible
const contactFormSchema = z.object({
  name: z.string().min(3, { message: 'الاسم يجب أن يكون 3 أحرف على الأقل.' }),
  phone: z.string().regex(/^(05[0-9]{8}|\+9665[0-9]{8})$/, { message: 'الرجاء إدخال رقم جوال سعودي صحيح (مثال: 05xxxxxxx أو +9665xxxxxxx).' }),
  message: z.string().min(10, { message: 'الرسالة يجب أن تكون 10 أحرف على الأقل.' })
});

export interface FormState {
    message: string;
    errors?: { name?: string[]; phone?: string[]; message?: string[]; };
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
    const { name, phone, message } = validatedFields.data;
    if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');

    // --- START: ENHANCED EMAIL TEMPLATE ---
    const normalizedPhoneForWhatsApp = phone.startsWith('+') ? phone.substring(1) : '966' + phone.substring(1);

    const emailHtml = `
    <!DOCTYPE html>
    <html dir=\"rtl\">
    <head>
    <style>
      body { font-family: 'Cairo',-apple-system,BlinkMacSystemFont,Roboto,sans-serif; margin: 0; padding: 0; background-color: #111827; color: #E5E7EB; }
      .container { max-width: 600px; margin: 20px auto; background-color: #1F2937; border: 1px solid #4B5563; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
      .header { background-color: #FBBF24; padding: 25px; text-align: center; border-bottom: 4px solid #F59E0B;}
      .header h1 { color: #111827; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -1px; }
      .content { padding: 30px; }
      .content h2 { color: #FBBF24; font-size: 22px; border-bottom: 2px solid #374151; padding-bottom: 10px; margin-top: 0; }
      .field { margin-bottom: 20px; }
      .field strong { font-size: 14px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px; }
      .field p { font-size: 18px; margin: 0; padding: 12px; background-color: #374151; border-radius: 8px; }
      .message-box { border: 1px solid #4B5563; padding: 20px; border-radius: 8px; background-color: #111827; }
      .actions { padding: 30px; background-color: #111827; text-align: center; }
      .actions h3 { color: #9CA3AF; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
      .button { display: inline-block; padding: 15px 30px; margin: 5px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; transition: all 0.3s ease; }
      .button-call { background-color: #34D399; color: #111827; }
      .button-whatsapp { background-color: #25D366; color: #FFFFFF; }
      .footer { padding: 20px; text-align: center; font-size: 12px; color: #6B7280; }
    </style>
    </head>
    <body>
      <div class=\"container\">
        <div class=\"header\"><h1>فن الإعلان</h1></div>
        <div class=\"content\">
          <h2>طلب تواصل جديد من عميل</h2>
          <div class=\"field\"><strong>اسم العميل:</strong><p>${name}</p></div>
          <div class=\"field\"><strong>رقم الجوال:</strong><p><a href=\"tel:${phone}\" style=\"color: #E5E7EB; text-decoration: none;\">${phone}</a></p></div>
          <div class=\"field\"><strong>نص الرسالة:</strong><div class=\"message-box\"><p>${message}</p></div></div>
        </div>
        <div class=\"actions\">
          <h3>إجراءات سريعة</h3>
          <a href=\"tel:${phone}\" class=\"button button-call\">📞 تواصل مع العميل</a>
          <a href=\"https://wa.me/${normalizedPhoneForWhatsApp}\" target=\"_blank\" class=\"button button-whatsapp\">💬 إرسال واتساب</a>
        </div>
        <div class=\"footer\">جميع الحقوق محفوظة &copy; ${new Date().getFullYear()} فن الإعلان</div>
      </div>
    </body>
    </html>
    `;
    // --- END: ENHANCED EMAIL TEMPLATE ---

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'fanalelan@gmail.com', // Updated recipient email
      subject: `🌟 طلب تواصل جديد من العميل: ${name}`,
      html: emailHtml,
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
