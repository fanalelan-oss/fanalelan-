'use client';

import React, { useState, useRef, useTransition } from 'react';
import Link from 'next/link';
import { submitPartnerWork, SubmitWorkState } from '@/app/actions';

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

interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  savingsPercent: number;
  dimensions: { width: number; height: number };
}

export default function SubmitWorkClient() {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<SubmitWorkState>({
    success: false,
    message: '',
  });

  // Form Field States (for Live Interactive Card Preview)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('الرياض');
  const [description, setDescription] = useState('');

  // Image & Compression State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [stats, setStats] = useState<CompressionStats | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Client-Side Smart Image Compressor & Aspect-Ratio Normalizer
  const processAndCompressImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP).');
      return;
    }

    setIsCompressing(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setIsCompressing(false);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // High efficiency JPEG at 0.82
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setIsCompressing(false);
              return;
            }

            const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            const savings = Math.max(0, Math.round(((file.size - blob.size) / file.size) * 100));

            setCompressedFile(optimizedFile);
            setPreviewUrl(dataUrl);
            setStats({
              originalSize: file.size,
              compressedSize: blob.size,
              savingsPercent: savings,
              dimensions: { width, height },
            });
            setIsCompressing(false);
          },
          'image/jpeg',
          0.82
        );
      };
      img.onerror = () => setIsCompressing(false);
    };
    reader.onerror = () => setIsCompressing(false);
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
      processAndCompressImage(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (compressedFile) {
      formData.set('image', compressedFile);
    }
    if (previewUrl) {
      formData.set('imageBase64', previewUrl);
    }

    startTransition(async () => {
      const result = await submitPartnerWork(formState, formData);
      setFormState(result);
      if (result.success) {
        if (formRef.current) formRef.current.reset();
        setCompressedFile(null);
        setPreviewUrl(null);
        setStats(null);
        setTitle('');
        setCategory('');
        setDescription('');
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
            <span>🖼️ تصفح معرض الأعمال</span>
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
            أداة متطورة تفحص وتضغط صور مشاريعك تلقائياً لتظهر بأعلى وضوح وأسرع تحميل في المعرض الرسمي لمؤسسة فن الإعلان بالرياض فور اعتمادها.
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
                href="https://wa.me/966557517792?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D9%81%D9%86%20%D8%A7%D9%84%D8%A5%D8%B9%D9%84%D8%A7%D9%86%D8%8C%20%D9%82%D9%85%D8%AA%20%D8%A8%D8%A5%D8%B6%D8%A7%D9%81%D8%A9%20%D8%B9%D9%85%D9%84%20%D8%AC%D8%AF%D9%8A%D8%AF%20%D8%B9%D8%A8%D8%B1%20%D8%A7%D9%84%D8%A8%D9%88%D8%A7%D8%A8%D8%A9%20%D9%88%D8%A3%D8%B1%D8%AC%D9%88%20%D8%A7%D9%84%D8%A7%D8%B9%D8%AA%D9%85%D8%A7%D8%AF."
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
                  🔒 كلمة مرور إضافة العمل (صالحة 24 ساعة) *
                </label>
                <p className="text-xs text-gray-400">
                  مخصصة للشركاء والمتعاونين المعتمدين فقط. يتم تزويدك بها مباشرة من إدارة فن الإعلان وصلاحيتها 24 ساعة.
                </p>
              </div>
            </div>
            <input
              id="pin"
              name="pin"
              type="text"
              required
              maxLength={8}
              defaultValue=""
              placeholder="أدخل كلمة المرور (6 أرقام)..."
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
                اسم الشريك / المنفّذ *
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
                رقم الجوال للتواصل والاعتماد *
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
                  موقع التنفيذ / الحي بالرياض
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="مثال: الرياض - حي الملقا"
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اذكر تفاصيل المواد المستخدمة، الأبعاد، الإضاءة، أو أي ميزات فنية أخرى للمشروع..."
                className="w-full bg-gray-950/80 border border-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-gray-600 leading-relaxed resize-none"
              />
              {formState.errors?.description && (
                <p className="text-xs text-red-400 mt-1">{formState.errors.description[0]}</p>
              )}
            </div>
          </div>

          {/* Section 4: SMART IMAGE UPLOAD & AUTO COMPRESSION */}
          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-gray-300">
                📷 صورة العمل أو المشروع (نظام الضغط الذكي) *
              </label>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                ⚡ ضغط تلقائي فوري
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              ارفع أي صورة مهما كان حجمها (حتى لو كانت صورة جوال عالية الحجم)، وسيقوم النظام الذكي بضغطها وضبط أبعادها فورياً حتى لا تُثقل على سرعة تصفح الموقع.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processAndCompressImage(e.target.files[0]);
                }
              }}
            />

            {/* Hidden field carrying the compressed base64 */}
            <input type="hidden" name="imageBase64" value={previewUrl || ''} />

            {/* COMPRESSION PROGRESS SPINNER */}
            {isCompressing && (
              <div className="border-2 border-dashed border-amber-500/50 bg-amber-500/5 rounded-2xl p-8 text-center animate-pulse">
                <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-bold text-amber-300">جاري فحص أبعاد الصورة وضغطها بذكاء فائق...</p>
                <p className="text-xs text-gray-400 mt-1">يتم تحسين الحجم لتسريع الموقع وحماية البيانات</p>
              </div>
            )}

            {/* UPLOAD DROP ZONE (When no image is chosen) */}
            {!isCompressing && !previewUrl && (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-amber-500 bg-amber-500/10 scale-[1.01]'
                    : 'border-gray-700 bg-gray-950/50 hover:border-amber-500/60 hover:bg-gray-950/80'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto text-2xl mb-4">
                  📷
                </div>
                <p className="text-base font-bold text-white mb-1">
                  اضغط هنا لاختيار الصورة أو اسحبها وأفلتها هنا
                </p>
                <p className="text-xs text-gray-400">
                  صيغ مقبولة: JPG, PNG, WEBP — النظام يضغط أي حجم تلقائياً
                </p>
              </div>
            )}

            {/* SMART OPTIMIZATION REPORT & PREVIEW */}
            {!isCompressing && previewUrl && stats && (
              <div className="space-y-4">
                {/* Diagnostic Badge */}
                <div className="bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border border-emerald-500/30 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>⚡ تقرير الضغط والتحسين الذكي للصورة:</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-black/40 border border-white/5 rounded-xl p-3">
                      <span className="text-gray-400 block mb-1">الحجم قبل الضغط:</span>
                      <span className="font-mono text-gray-300 font-bold">
                        {(stats.originalSize / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>

                    <div className="bg-black/40 border border-emerald-500/30 rounded-xl p-3">
                      <span className="text-emerald-400 block mb-1">الحجم بعد التحسين:</span>
                      <span className="font-mono text-emerald-300 font-bold">
                        {(stats.compressedSize / 1024).toFixed(0)} KB
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 bg-black/40 border border-amber-500/30 rounded-xl p-3">
                      <span className="text-amber-400 block mb-1">نسبة التوفير بالسرعة:</span>
                      <span className="font-mono text-amber-300 font-black text-sm">
                        وفرت {stats.savingsPercent}% 🚀
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px] text-gray-400">
                    <span>
                      الأبعاد: {stats.dimensions.width} × {stats.dimensions.height} بكسل (أبعاد مثالية لشاشات الجوال والكمبيوتر)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setCompressedFile(null);
                        setStats(null);
                      }}
                      className="text-red-400 hover:text-red-300 font-bold hover:underline"
                    >
                      ✕ اختيار صورة أخرى
                    </button>
                  </div>
                </div>

                {/* REALISTIC LIVE GALLERY CARD PREVIEW */}
                <div className="border border-white/10 rounded-2xl p-5 bg-black/40">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <span>✨</span>
                      <span>معاينة حية: هكذا سيظهر عملك داخل معرض الأعمال تماماً:</span>
                    </span>
                    <span className="text-[10px] text-gray-500">تصميم مطابق للمعرض 100%</span>
                  </div>

                  {/* Visual Replica of WorkCard on the website */}
                  <div className="group relative block w-full max-w-md mx-auto overflow-hidden rounded-[2rem] border border-white/10 bg-[#101010] shadow-[0_20px_50px_rgba(245,158,11,0.15)]">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt={title || 'معاينة المشروع'}
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 right-0 p-6 sm:p-7 w-full text-right">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[11px] font-black bg-yellow-500 text-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                          {category || 'اختر التصنيف'}
                        </span>
                        <span className="text-[10px] font-bold bg-black/60 text-yellow-400 border border-yellow-500/30 px-2.5 py-0.5 rounded-full">
                          #{location || 'الرياض'}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 leading-tight">
                        {title || 'عنوان العمل والمشروع'}
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm mt-2 line-clamp-2 italic border-r-2 border-yellow-500/50 pr-3">
                        {description || 'تفاصيل ومواصفات المشروع ستظهر هنا عند المعاينة والتمرير...'}
                      </p>
                    </div>
                  </div>
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
              disabled={isPending || isCompressing}
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
              href="https://wa.me/966557517792"
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
