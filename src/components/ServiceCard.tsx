'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ServiceCardProps {
  title: string;
  description: string;
  images: string[];
  subtitles?: string[];
  slug?: string;
}

const ServiceCard = ({ title, description, images, subtitles, slug }: ServiceCardProps) => {
  const cardLink = slug ? `/services/${slug}` : '#';

  return (
    <Link href={cardLink} className="block group">
      <div className="bg-[#181818] rounded-2xl overflow-hidden transform hover:-translate-y-4 transition-all duration-300 border border-white/10 shadow-2xl hover:shadow-gold/20 flex flex-col h-full cursor-pointer">
        {/* Gallery Area */}
        <div className="relative h-64 w-full">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={true}
            className="h-full w-full service-swiper pointer-events-none" // Disable swiper interaction to let click pass to Link
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                    <Image
                    src={src}
                    alt={`${title} - image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Content Area */}
        <div className="p-8 flex-grow flex flex-col">
          <h3 className="text-3xl font-bold text-white group-hover:text-yellow-400 transition-colors">{title}</h3>
          
          {subtitles && (
            <p className="mt-3 text-sm text-yellow-500 font-bold tracking-wider uppercase">
              {subtitles.join(' • ')}
            </p>
          )}
          
          <p className="mt-5 text-lg text-gray-400 line-clamp-3 leading-relaxed">
            {description}
          </p>
          
          <div className="mt-auto pt-8 flex items-center gap-2 text-yellow-500 font-bold">
            <span>اكتشف المزيد</span>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 rotate-180 transition-transform group-hover:translate-x-[-8px]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
