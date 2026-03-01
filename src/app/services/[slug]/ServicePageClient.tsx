
'use client';

import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/data";
import AnimatedSection from "@/components/AnimatedSection";
import { PhoneIcon, MapPinIcon } from "@/components/icons";

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface TechnicalSpec {
  label: string;
  value: string;
}

// Define a type for a single service
type Service = typeof services[0];

export default function ServicePageClient({ service }: { service: Service }) {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 pt-32 pb-20">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="mb-12 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-yellow-400 transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/#services" className="hover:text-yellow-400 transition-colors">خدماتنا</Link>
          <span>/</span>
          <span className="text-yellow-500 font-bold">{service.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Content Side */}
          <AnimatedSection className="space-y-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-extrabold bg-gold-gradient bg-clip-text text-transparent pb-4 leading-tight">
                {service.title}
              </h1>
              <div 
                className="text-xl text-gray-300 leading-relaxed mt-6 prose prose-invert max-w-none prose-a:text-yellow-500 prose-a:font-bold hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: service.longDescription }}
              />
            </div>

            {/* المميزات */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-4">
                <span className="w-10 h-1 bg-yellow-500 rounded-full"></span>
                مميزات الخدمة
              </h2>
              <ul className="grid sm:grid-cols-1 gap-4">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-4 bg-gray-800/40 p-5 rounded-2xl border border-white/5 shadow-xl">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="text-lg text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* المواصفات الفنية الثرية */}
            {service.technicalSpecs && service.technicalSpecs.length > 0 && (
                <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <h2 className="text-2xl font-bold text-yellow-500 mb-6">المواصفات الفنية والجودة:</h2>
                    <div className="grid gap-6">
                        {service.technicalSpecs.map((spec: TechnicalSpec, idx: number) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 last:border-0">
                            <span className="text-gray-400 font-medium mb-1 sm:mb-0">{spec.label}</span>
                            <span className="text-white font-bold text-lg">{spec.value}</span>
                        </div>
                        ))}
                    </div>
                </div>
            )}


            <div className="flex flex-wrap gap-4 pt-6">
              <a href="https://wa.me/966557517792" target="_blank" rel="noopener noreferrer" className="inline-flex h-16 items-center justify-center rounded-2xl px-12 text-xl transition-all shadow-gold hover:shadow-gold-hover bg-gold-gradient text-black font-bold">
                طلب تسعيرة فورية
              </a>
              <Link href="/#contact" className="inline-flex h-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-12 text-xl font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20">
                استشارة مجانية
              </Link>
            </div>
          </AnimatedSection>

          {/* Gallery Side */}
          <div className="space-y-8 lg:sticky lg:top-32">
             <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 group">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay, EffectFade]}
                  effect={'fade'}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4500, disableOnInteraction: false }}
                  loop={true}
                  className="h-full w-full"
                >
                  {service.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="relative w-full h-full">
                        <Image 
                            src={img} 
                            alt={`${service.title} - ${idx + 1}`} 
                            fill 
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
             </div>

             {/* Thumbnails */}
             <div className="grid grid-cols-4 gap-4 px-2">
                {service.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white/5 shadow-lg hover:border-yellow-500 transition-all cursor-pointer group">
                        <Image src={img} alt="نموذج" fill className="object-cover transition-transform group-hover:scale-110" />
                    </div>
                ))}
             </div>

             {/* Contact Info Card */}
             <div className="bg-[#1a1b1e] p-10 rounded-[2rem] border border-white/10 shadow-2xl mt-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                <h3 className="text-3xl font-bold mb-8 bg-gold-gradient bg-clip-text text-transparent">تواصل معنا الآن</h3>
                <div className="space-y-6">
                    <a href="tel:0557517792" className="flex items-center gap-5 text-gray-200 hover:text-yellow-500 transition-all group/link">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover/link:bg-yellow-500/20 transition-all"><PhoneIcon className="w-6 h-6 text-yellow-500" /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">اتصل بنا</p>
                            <p className="text-xl font-black">0557517792</p>
                        </div>
                    </a>
                    <div className="flex items-center gap-5 text-gray-200">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center"><MapPinIcon className="w-6 h-6 text-yellow-500" /></div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">الموقع</p>
                            <p className="text-lg">حي الصالحية، مجمع الوسط التجاري، الرياض</p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
