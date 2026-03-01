'use client';

import { useState } from 'react';
import Image from 'next/image';

interface WorkCardProps {
  title: string;
  category: string;
  imgSrc: string;
  description: string;
  fullDetails?: string;
  isSimple?: boolean; // New prop to toggle between home page look and gallery look
}

export default function WorkCard({ title, category, imgSrc, description, fullDetails, isSimple = false }: WorkCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // If it's the simple version (Home Page)
  if (isSimple) {
    return (
      <div className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
        <div className="relative aspect-[4/3]">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
        <div className="absolute bottom-0 right-0 p-6 w-full text-right">
          <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full">{category}</span>
          <h3 className="text-xl font-bold text-white mt-2 leading-tight">{title}</h3>
        </div>
      </div>
    );
  }

  // Otherwise, return the full interactive version (Gallery Page)
  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="group relative block w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#101010] cursor-pointer transition-all hover:shadow-[0_20px_50px_rgba(251,191,36,0.15)]"
      >
        <div className="relative aspect-[4/3]">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity group-hover:opacity-90" />
        </div>
        
        <div className="absolute bottom-0 right-0 p-8 w-full text-right">
          <span className="text-xs font-black bg-yellow-500 text-black px-4 py-1.5 rounded-full uppercase tracking-widest">{category}</span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-4 leading-tight group-hover:text-yellow-400 transition-colors">{title}</h3>
          
          <div className="mt-4 overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-32">
            <p className="text-gray-300 text-lg leading-relaxed italic border-r-2 border-yellow-500/50 pr-4">
                {description}
            </p>
            <span className="inline-block mt-4 text-yellow-500 font-bold text-sm underline underline-offset-4">اضغط لمشاهدة التفاصيل الكاملة</span>
          </div>
        </div>
      </div>

      {/* Popup Modal for Detailed View */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-6xl bg-gray-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]">
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 left-6 z-10 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all"
            >
                ✕
            </button>

            <div className="relative w-full lg:w-3/5 h-64 sm:h-96 lg:h-auto overflow-hidden">
                <Image src={imgSrc} alt={title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent hidden lg:block" />
            </div>

            <div className="w-full lg:w-2/5 p-8 sm:p-12 overflow-y-auto text-right flex flex-col justify-center">
                <span className="text-yellow-500 font-bold text-lg mb-2">{category}</span>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-8 leading-tight">{title}</h2>
                
                <div className="space-y-6 text-gray-300 text-xl leading-relaxed">
                    <p className="font-bold text-white border-r-4 border-yellow-500 pr-4">وصف المشروع:</p>
                    <p>{description}</p>
                    {fullDetails && (
                        <>
                            <p className="font-bold text-white border-r-4 border-yellow-500 pr-4 mt-8">التفاصيل الفنية:</p>
                            <p className="italic">{fullDetails}</p>
                        </>
                    )}
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                    <a href="https://wa.me/966557517792" className="inline-flex h-14 items-center justify-center rounded-2xl px-10 bg-gold-gradient text-black font-bold text-lg shadow-gold hover:scale-105 transition-transform w-full">
                        اطلب عمل مشابه لمشروعك
                    </a>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
