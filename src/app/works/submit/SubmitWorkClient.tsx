'use client';

import React, { useState, useRef, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { submitPartnerWork, SubmitWorkState } from '@/app/works-actions';

const CATEGORIES = [
  'لوحات حروف بارزة',
  'واجهات كلادينج',
  'لوحات زنكور وستانلس',
  'لوحات نيون وفلكس',
  'طباعة واستيكرات',
  'لوحات إرشادية وتحذيرية',
  'أعمال إنشائية وديكور',
  'أخرى',
];

export default function SubmitWorkClient() {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<SubmitWorkState>({
    success: false,
    message: '',
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 10 ميغابايت.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (selectedFile) {
      formData.set('image', selectedFile);
    }

    startTransition(async () => {
      const result = await submitPartnerWork(formState, formData);
      setFormState(result);
      if (result.success) {
        if (formRef.current) formRef.current.reset();
        setSelectedFile(null);
        setPreviewUrl(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 py-16 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-black">
      {/* Background Glow Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors"
          >
            <span>← العودة للرئيسية</span>
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition-colors"
          >
            <span>🖼️ تصفح معرض الأعمال الحالية</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
            ✨ بوابة شركاء النجاح المعتمدين
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            إضافة عمل جديد إلى <span className="text-amber-400">معرض الأعمال</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            شارك مشاريعك المتميزة وإنجازاتك ليتم عرضها في المعرض الرسمي لمؤسسة فن الإعلان بالرياض فور مراجعتها واعتمادها من الإدارة.
          </p>
        </div>

        {/* SUCCESS ALERT */}
        {formState.success && (
          <div className="mb-10 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl mb-4 border border-emerald-500/30">
              ✓
            </div>
            <h2 className="text-2xl font-black text-white mb-2">تم استلام عملك بنجاح!</h2>
            <p className="text-emerald-200 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-6">
              {formState.message}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://wa.me/966559981123?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D9%81%D9%86%20%D8%A7%D9%84%D8%A5%D8%B9%D9%84%D8%A7%D9%86%D8%8C%20%D9%82%D9%85%D8%AA%20%D8%A8%D8%A5%D8%B6%D8%A7%D9%81%D8%A9%20%D8%B9%D9%85%D9%84%20%D8%AC%D8%AF%D9%8A%D8%AF%20%D8%B9%D8%A8%D8%B1%20%D8%A7%D9%84%D8%A8%D9%88%D8%A7%D8%A8%D8%A9%20%D9%88%D8%A3%D8%B1%D8%AC%D9%88%20%D8%A7%D9%84%D8%A7%D8%B9%D8%AA%D9%85%D8%A7%D8%AF."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
              >
                <span>💬 إشعار الإدارة عبر واتساب</span>
              </a>
              <button
                type="button"
                onClick={() => setFormState({ success: false, message: '' })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 font-bold text-sm border border-white/10 transition-all"
              >
                <span>+ إضافة عمل آخر</span>
              </button>
            </div>
          </div>
        )}

        {/* GENERAL ERROR BANNER */}
        {!formState.success && formState.message && (
          <div className="mb-8 bg-red-950/60 border border-red-500/40 rounded-2xl p-5 text-red-200 text-sm leading-relaxed flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span>{formState.message}</span>
          </div>
        )}

        {/* SUBMISSION FORM */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-gray-900/70 border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-8"
        >
          {/* Section 1: Security PIN */}
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <label htmlFor="pin" className="block text-sm font-bold text-amber-300 mb-1">
                  🔒 رمز الدخول السري (PIN) *
                </label>
                <p className="text-xs text-gray-400">
                  مخصص للمتعاونين والشركاء المعتمدين فقط. إذا لم يكن لديك الرمز، تواصل مع الإدارة.
                </p>
              </div>
            </div>
            <input
              id="pin"
              name="pin"
              type="password"
              required
              defaultValue=""
              placeholder="أدخل الرمز السري هنا..."
              className="mt-3 w-full sm:w-64 bg-gray-950 border border-gray-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-2.5 text-white font-mono text-center tracking-widest text-lg outline-none transition-all placeholder:text-gray-600 placeholder:text-sm placeholder:font-sans placeholder:tracking-normal"
            />
            {formState.errors?.pin && (
              <p className="text-xs text-red-400 mt-2 font-medium">{formState.errors.pin[0]}</p>
            )}
          </div>

          {/* Section 2: Submitter Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="submitterName" className="block text-sm font-bold text-gray-300 mb-2">
                اسم الشريك / الراسل *
              </label>
              <input
                id="submitterName"
                name="submitterName"
                type="text"
                required
                placeholder="مثال: م. أحمد الخالدي"
                className="w-full bg-gray-950/80 border border-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-gray-600"
              />
              {formState.errors?.submitterName && (
                <p className="text-xs text-red-400 mt-1">{formState.errors.submitterName[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="submitterPhone" className="block text-sm font-bold text-gray-300 mb-2">
                رقم الجوال للتواصل *
              </label>
              <input
                id="submitterPhone"
                name="submitterPhone"
                type="tel"
                required
                dir="ltr"
                placeholder="05XXXXXXXX"
                className="w-full bg-gray-950/80 border border-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all text-right placeholder:text-gray-600"
              />
              {formState.errors?.submitterPhone && (
                <p className="text-xs text-red-400 mt-1">{formState.errors.submitterPhone[0]}</p>
              )}
            </div>
          </div>

          {/* Section 3: Work Details */}
          <div className="space-y-6 pt-4 border-t border-gray-800">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-gray-300 mb-2">
                عنوان العمل أو اسم المشروع *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="مثال: واجهة كلادينج وحروف زنكور مجمع النخيل الطبي"
                className="w-full bg-gray-950/80 border border-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-gray-600"
              />
              {formState.errors?.title && (
                <p className="text-xs text-red-400 mt-1">{formState.errors.title[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-bold text-gray-300 mb-2">
                  تصنيف العمل *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  defaultValue=""
                  className="w-full bg-gray-950/80 border border-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
                >
                  <option value="" disabled>
                    اختر تصنيف العمل...
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {formState.errors?.category && (
                  <p className="text-xs text-red-400 mt-1">{formState.errors.category[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-bold text-gray-300 mb-2">
                  موقع التنفيذ / المدينة
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue="الرياض"
                  placeholder="مثال: الرياض - طريق الملك فهد"
                  className="w-full bg-gray-950/80 border border-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold text-gray-300 mb-2">
                وصف العمل والمواصفات الفنية *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="اذكر تفاصيل المواد المستخدمة، الأبعاد، الإضاءة، أو أي ميزات أخرى للمشروع..."
                className="w-full bg-gray-950/80 border border-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-gray-600 leading-relaxed resize-none"
              />
              {formState.errors?.description && (
                <p className="text-xs text-red-400 mt-1">{formState.errors.description[0]}</p>
              )}
            </div>
          </div>

          {/* Section 4: Image Upload */}
          <div className="pt-4 border-t border-gray-800">
            <label className="block text-sm font-bold text-gray-300 mb-2">
              صورة العمل أو المشروع *
            </label>
            <p className="text-xs text-gray-400 mb-3">
              ارفع صورة واضحة وعالية الدقة للعمل (JPG, PNG, WebP — بحد أقصى 10 ميغابايت).
            </p>

            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageChange(e.target.files[0]);
                }
              }}
            />

            {!previewUrl ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-amber-500 bg-amber-500/10 scale-[1.01]'
                    : 'border-gray-700 bg-gray-950/50 hover:border-gray-500 hover:bg-gray-950/80'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto text-2xl mb-4">
                  📷
                </div>
                <p className="text-base font-bold text-white mb-1">
                  اضغط هنا لاختيار الصورة أو اسحبها وأفلتها هنا
                </p>
                <p className="text-xs text-gray-400">
                  صيغ مقبولة: JPG, PNG, WEBP — حتى 10 ميغابايت
                </p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-gray-700 bg-gray-950 p-3">
                <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="معاينة الصورة"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex items-center justify-between mt-3 px-2">
                  <span className="text-xs text-gray-300 truncate max-w-xs">
                    📎 {selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 / 1024 : 0).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleImageChange(null)}
                    className="text-xs text-red-400 hover:text-red-300 font-bold px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/40 hover:bg-red-900/40 transition-colors"
                  >
                    ✕ تغيير الصورة
                  </button>
                </div>
              </div>
            )}

            {formState.errors?.image && (
              <p className="text-xs text-red-400 mt-2">{formState.errors.image[0]}</p>
            )}
          </div>

          {/* Section 5: Submit Button */}
          <div className="pt-6 border-t border-gray-800">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-950 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
            >
              {isPending ? (
                <>
                  <span className="w-5 h-5 border-3 border-gray-950 border-t-transparent rounded-full animate-spin" />
                  <span>جاري رفع العمل وإرسال إشعار الاعتماد للإدارة...</span>
                </>
              ) : (
                <>
                  <span>🚀 إرسال العمل للمراجعة والاعتماد</span>
                </>
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-3">
              🔒 بعد الإرسال، ستتلقى إدارة فن الإعلان إشعاراً فورياً عبر البريد الإلكتروني للمراجعة والاعتماد المباشر بنقرة واحدة.
            </p>
          </div>
        </form>

        {/* Support Footer */}
        <div className="mt-12 text-center text-xs text-gray-500 space-y-2">
          <p>مؤسسة فن الإعلان للدعاية والمقاولات بالرياض • جميع الحقوق محفوظة {new Date().getFullYear()}</p>
          <p>
            بحاجة إلى مساعدة أو استفسار؟{' '}
            <a
              href="https://wa.me/966559981123"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              تواصل مع الدعم الفني عبر واتساب
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
