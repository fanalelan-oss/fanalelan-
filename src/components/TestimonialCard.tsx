'use client';

import { QuoteIcon } from './icons';
import RealFacebookIcon from './SocialIcons/RealFacebookIcon';
import RealWhatsAppIcon from './SocialIcons/RealWhatsAppIcon';
import RealGoogleMapsIcon from './SocialIcons/RealGoogleMapsIcon';

type TestimonialCardProps = {
  name: string;
  title: string;
  text: string;
  platform: 'facebook' | 'whatsapp' | 'google' | 'instagram';
};

const TestimonialCard = ({ name, title, text, platform }: TestimonialCardProps) => {
  
  const renderPlatformIcon = () => {
    switch (platform) {
      case 'facebook': return <RealFacebookIcon className="w-8 h-8" />;
      case 'whatsapp': return <RealWhatsAppIcon className="w-8 h-8" />;
      case 'google': return <RealGoogleMapsIcon className="w-8 h-8" />;
      default: return <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black text-[10px]">فن</div>;
    }
  };

  return (
    <div className="h-full bg-gray-800 p-8 rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between transform hover:-translate-y-2 transition-transform duration-300">
      <div>
        <QuoteIcon className="w-10 h-10 text-yellow-400/50 mb-6" />
        <p className="text-lg text-gray-300 leading-relaxed italic font-medium">&ldquo;{text}&rdquo;</p>
      </div>
      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center shadow-inner border border-white/5">
              {renderPlatformIcon()}
            </div>
            <div className="text-right">
              <p className="font-bold text-white leading-none mb-1">{name}</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">{title}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
