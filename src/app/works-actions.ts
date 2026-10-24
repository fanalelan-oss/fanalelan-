'use server';

import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Resend } from 'resend';
import { savePendingWork, WorkItem, validatePartnerPin } from '@/lib/works-manager';

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

const getResend = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
};

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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const approveUrl = `${baseUrl}/api/works/approve?id=${workId}&token=${token}`;
    const rejectUrl = `${baseUrl}/api/works/reject?id=${workId}&token=${token}`;
    const fullImageUrl = `${baseUrl}${publicImgSrc}`;

    // Send Email to site owner
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

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'fanalelan@gmail.com',
        subject: `🔔 طلب اعتماد عمل جديد: ${newWork.title} — فن الإعلان`,
        html: emailHtml,
      });
    }

    return {
      success: true,
      message: 'تم إرسال العمل بنجاح! تم إرسال إشعار فوري إلى إدارة الموقع للاعتماد وسيظهر في المعرض فور الموافقة عليه.',
    };
  } catch (error) {
    console.error('Error submitting work:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.',
    };
  }
}
