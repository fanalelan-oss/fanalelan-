'use client';

import React from 'react';
import RealFacebookIcon from './SocialIcons/RealFacebookIcon';
import RealWhatsAppIcon from './SocialIcons/RealWhatsAppIcon';
import RealGoogleMapsIcon from './SocialIcons/RealGoogleMapsIcon';
import RealEmailIcon from './SocialIcons/RealEmailIcon';

const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-10 pb-6 border-t border-white/5 text-center font-sans" dir="rtl">
      <div className="container px-4 max-w-4xl mx-auto">
        
        {/* Compact Social Icons */}
        <div className="flex justify-center items-center gap-6 sm:gap-10 mb-8 flex-wrap">
          
          <a href="https://www.facebook.com/profile.php?id=61587226595703" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-105">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-white/5 shadow-lg group-hover:bg-gray-700">
              <RealFacebookIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[9px] font-bold text-gray-500 uppercase">فيسبوك</span>
          </a>

          <a href="https://wa.me/966557517792" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-105">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-white/5 shadow-lg group-hover:bg-gray-700">
              <RealWhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[9px] font-bold text-gray-500 uppercase">واتساب</span>
          </a>

          <a href="https://share.google/yok3tFEnIDCu8AZbY" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-105">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-white/5 shadow-lg group-hover:bg-gray-700">
              <RealGoogleMapsIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[9px] font-bold text-gray-500 uppercase">الموقع</span>
          </a>

          <a href="mailto:artadvertising211@gmail.com" className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-105">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-white/5 shadow-lg group-hover:bg-gray-700">
              <RealEmailIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[9px] font-bold text-gray-500 uppercase">الإيميل</span>
          </a>

        </div>

        {/* Brand Information - Scaled Down */}
        <div className="space-y-2 border-t border-white/5 pt-6">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">فن الإعلان للدعاية والإعلان</h2>
            <p className="text-sm sm:text-base text-gray-500 font-bold tracking-widest uppercase">مقاولات محدودة</p>
            <p className="text-yellow-500 font-bold text-xs italic mt-2">نخدم في كافة أحياء ومناطق الرياض</p>
            
            <div className="pt-6">
                <p className="text-[9px] text-gray-600 font-medium" suppressHydrationWarning>
                    &copy; {new Date().getFullYear()} جميع الحقوق محفوظة لـ فن الإعلان.
                </p>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
