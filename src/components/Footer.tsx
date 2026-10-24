'use client';

import React, { useState } from 'react';
import RealFacebookIcon from './SocialIcons/RealFacebookIcon';
import RealWhatsAppIcon from './SocialIcons/RealWhatsAppIcon';
import RealGoogleMapsIcon from './SocialIcons/RealGoogleMapsIcon';
import RealEmailIcon from './SocialIcons/RealEmailIcon';

interface GeneratedPinInfo {
  pin: string;
  expiresAt: string;
  submitUrl: string;
}

const Footer = () => {
  const [toastInfo, setToastInfo] = useState<GeneratedPinInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSecretTrigger = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      const res = await fetch('/api/works/generate-pin', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.success && data.pin) {
        const textToCopy = `مرحباً، يمكنك إضافة عملك إلى معرض أعمال مؤسسة فن الإعلان عبر الرابط التالي:
🔗 رابط إضافة العمل: ${data.submitUrl}
🔒 كلمة المرور المؤقتة (صالحة لمدة 24 ساعة فقط): ${data.pin}

(تنبيه: بعد إرسال العمل سيصل إشعار للإدارة للاعتماد الفوري والنشر في المعرض)`;

        // Copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
          setCopied(true);
        } else {
          // Fallback
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
        }

        setToastInfo({
          pin: data.pin,
          expiresAt: data.expiresAt,
          submitUrl: data.submitUrl,
        });

        // Hide notification after 8 seconds
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to generate secret pin', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 pt-10 pb-6 border-t border-white/5 text-center font-sans relative" dir="rtl">
      <div className="container px-4 max-w-4xl mx-auto">
        
        {/* Compact Social Icons */}
        <div className="flex justify-center items-center gap-6 sm:gap-10 mb-8 flex-wrap">
          
          <a href="https://www.facebook.com/profile.php?id=61587226595703" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-105">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-white/5 shadow-lg group-hover:bg-gray-700">
              <RealFacebookIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[10px] font-bold text-gray-300 uppercase">فيسبوك</span>
          </a>

          <a href="https://wa.me/966557517792" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-105">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-white/5 shadow-lg group-hover:bg-gray-700">
              <RealWhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[10px] font-bold text-gray-300 uppercase">واتساب</span>
          </a>

          <a href="https://maps.app.goo.gl/6yK27RgFCgv9NGSh9" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-105">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-white/5 shadow-lg group-hover:bg-gray-700">
              <RealGoogleMapsIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[10px] font-bold text-gray-300 uppercase">الموقع</span>
          </a>

          <a href="mailto:fanalelan@gmail.com" className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-105">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-white/5 shadow-lg group-hover:bg-gray-700">
              <RealEmailIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[10px] font-bold text-gray-300 uppercase">الإيميل</span>
          </a>

        </div>

        {/* Quick Links for Internal Linking SEO */}
        <div className="flex justify-center items-center gap-4 sm:gap-6 mb-6 flex-wrap text-xs font-bold text-gray-300">
          <a href="/about" className="hover:text-yellow-400 transition-colors">من نحن</a>
          <span>•</span>
          <a href="/services" className="hover:text-yellow-400 transition-colors">خدماتنا</a>
          <span>•</span>
          <a href="/services/cladding-facades" className="hover:text-yellow-400 transition-colors">واجهات كلادينج</a>
          <span>•</span>
          <a href="/services/advertising-signs" className="hover:text-yellow-400 transition-colors">لوحات إعلانية</a>
          <span>•</span>
          <a href="/services/promotional-fences" className="hover:text-yellow-400 transition-colors">أسوار دعائية</a>
          <span>•</span>
          <a href="/gallery" className="hover:text-yellow-400 transition-colors">معرض الأعمال</a>
          <span>•</span>
          <a href="/blog" className="hover:text-yellow-400 transition-colors">المدونة</a>
        </div>

        {/* Brand Information */}
        <div className="space-y-2 border-t border-white/5 pt-6">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">فن الإعلان للدعاية والإعلان والمقاولات العامة</h2>
            <p className="text-sm sm:text-base text-gray-300 font-bold tracking-widest uppercase">مقاولات عامة محدودة بالرياض</p>
            <p className="text-yellow-500 font-bold text-xs italic mt-2">نخدم في كافة أحياء ومناطق الرياض</p>
            
            <div className="pt-6">
                <p className="text-[10px] text-gray-400 font-medium select-none" suppressHydrationWarning>
                    &copy; {new Date().getFullYear()} جميع الحقوق محفوظة لـ فن الإعلان
                    {/* The Secret Trigger dot: totally indistinguishable to visitors, but clicking it generates and copies the 24h pass + URL */}
                    <button
                      type="button"
                      onClick={handleSecretTrigger}
                      disabled={isLoading}
                      title=""
                      aria-label="system dot"
                      className="inline-block p-1 text-gray-400 hover:text-amber-400 focus:outline-none transition-colors duration-200 cursor-default"
                    >
                      {isLoading ? '⏳' : '.'}
                    </button>
                </p>
            </div>
        </div>
      </div>

      {/* SECRET TOAST NOTIFICATION: Visible only to the owner upon clicking the secret trigger */}
      {toastInfo && (
        <div className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-gray-950/95 border-2 border-amber-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl rounded-3xl p-5 text-right text-gray-100 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>✨ تم نسخ رابط الإضافة وكلمة المرور!</span>
            </div>
            <button
              type="button"
              onClick={() => setToastInfo(null)}
              className="text-gray-400 hover:text-white text-xs px-2 py-0.5 rounded-md hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-gray-300 mb-3 leading-relaxed">
            تم نسخ رابط البوابة وكلمة المرور إلى الحافظة تلقائياً. يمكنك الآن لصقها في واتساب وإرسالها للشريك مباشرة.
          </p>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-3 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">كلمة المرور المؤقتة:</span>
              <span className="font-mono text-base font-black text-amber-300 tracking-wider bg-black/40 px-3 py-1 rounded-lg border border-amber-500/30">
                {toastInfo.pin}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 border-t border-gray-800 pt-2">
              <span>مدة الصلاحية:</span>
              <span className="text-emerald-400 font-bold">24 ساعة (تنتهي غداً)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `مرحباً، يمكنك إضافة عملك إلى معرض أعمال فن الإعلان عبر الرابط التالي:\n🔗 رابط الإضافة: ${toastInfo.submitUrl}\n🔒 كلمة المرور المؤقتة (صالحة لمدة 24 ساعة): ${toastInfo.pin}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-900/30"
            >
              💬 إرسال عبر واتساب
            </a>
            <button
              type="button"
              onClick={() => {
                const text = `مرحباً، تفضل رابط إضافة العمل إلى معرض أعمال فن الإعلان:\nالرابط: ${toastInfo.submitUrl}\nكلمة المرور (صالحة 24 ساعة): ${toastInfo.pin}`;
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-gray-200 border border-white/10 transition-colors"
            >
              {copied ? '✓ تم النسخ!' : '📋 إعادة النسخ'}
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
