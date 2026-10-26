'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface WorkCardProps {
  title: string;
  category: string;
  imgSrc: string;
  description: string;
  fullDetails?: string;
  isSimple?: boolean; // Toggle between home page look and gallery look
}

function normalizeImageSrc(src: string): string {
  if (!src) return '/images/og-image.jpg';
  if (src.startsWith('/works_images/')) {
    const filename = src.replace(/^\/works_images\//, '');
    return `/api/works/image?file=${encodeURIComponent(filename)}`;
  }
  return src;
}

export default function WorkCard({ title, category, imgSrc, description, fullDetails, isSimple = false }: WorkCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(() => normalizeImageSrc(imgSrc));

  useEffect(() => {
    setCurrentSrc(normalizeImageSrc(imgSrc));
  }, [imgSrc]);

  const handleImageError = () => {
    if (currentSrc.startsWith('/works_images/')) {
      const filename = currentSrc.replace(/^\/works_images\//, '');
      setCurrentSrc(`/api/works/image?file=${encodeURIComponent(filename)}`);
    } else if (currentSrc.startsWith('/images/')) {
      const filename = currentSrc.replace(/^\/images\//, '');
      setCurrentSrc(`/api/works/image?file=${encodeURIComponent(filename)}`);
    }
  };

  // If it's the simple version (Home Page)
  if (isSimple) {
    return (
      <div className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
        <div className="relative aspect-[4/3]">
          <Image
            src={currentSrc}
            alt={title}
            fill
            unoptimized={true}
            onError={handleImageError}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
        <div className="absolute bottom-0 right-0 p-6 w-full text-right">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full">{category}</span>
            <span className="text-[10px] font-bold bg-black/40 text-yellow-400 border border-yellow-500/30 px-2.5 py-0.5 rounded-full">#الرياض</span>
          </div>
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
            src={currentSrc}
            alt={title}
            fill
            unoptimized={true}
            onError={handleImageError}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                <Image 
                  src={currentSrc} 
                  alt={title} 
                  fill 
                  unoptimized={true} 
                  onError={handleImageError} 
                  className="object-cover" 
                />
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
                            <p className="font-bold text-white border-r-4 border-yellow-500 pr-4 mt-8">تفاصيل التنفيذ والمواد:</p>
                            <p className="text-base text-gray-400">{fullDetails}</p>
                        </>
                    )}
                </div>

                <div className="mt-12 flex gap-4">
                    <a 
                        href="https://wa.me/966557517792" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full text-center py-4 rounded-2xl bg-yellow-500 text-black font-extrabold text-lg hover:bg-yellow-400 transition-all shadow-lg"
                    >
                        طلب عمل مشابه عبر واتساب
                    </a>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
