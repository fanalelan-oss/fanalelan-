'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import AnimatedLogo from './AnimatedLogo';
import { MenuIcon, XIcon, PhoneIcon, ChevronDownIcon } from './icons';
import { services } from '@/lib/data';
import RealWhatsAppIcon from './SocialIcons/RealWhatsAppIcon';
import { AnimatePresence, motion } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileServicesOpen, setMobileServicesOpen] = useState(false);

  const navLinks = [
    { href: "/", text: "الرئيسية" },
    { href: "/gallery", text: "أعمالنا" },
    { href: "/services", text: "خدماتنا" },
    { href: "/#testimonials", text: "الشهادات" },
    { href: "/faq", text: "الأسئلة الشائعة" },
    { href: "/blog", text: "المدونة" },
  ];

  return (
    <>
      <header className="sticky top-0 z-[100] w-full bg-gray-900/90 backdrop-blur-xl border-b border-white/10 h-20 sm:h-24 transition-all">
        <div className="container h-full px-4 text-right" dir="rtl">
          <div className="flex h-full items-center justify-between gap-4">
            
            <Link href="/" className="flex items-center gap-2 shrink-0 group" onClick={() => setIsMenuOpen(false)}>
              <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105"><AnimatedLogo /></div>
              <div className="flex flex-col justify-center">
                <span className="text-xl sm:text-2xl font-bold text-white leading-none">فن الإعلان</span>
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-widest uppercase">مقاولات محدودة</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => {
                if (link.text === "خدماتنا") {
                  return (
                    <div key={link.href} className="relative py-6" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                      <Link href={link.href} className="flex items-center gap-1 text-base font-bold text-gray-300 hover:text-yellow-400">{link.text} <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} /></Link>
                      <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={`absolute top-full right-0 w-72 bg-gray-800/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden`}>
                                <div className="p-3 grid gap-1">{services.map((s) => (<Link key={s.slug} href={`/services/${s.slug}`} className="block px-4 py-3 text-sm font-medium text-gray-300 hover:bg-yellow-500 hover:text-black rounded-xl transition-all" onClick={() => setIsDropdownOpen(false)}>{s.title}</Link>))}</div>
                            </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return <Link key={link.href} href={link.href} className="text-base font-bold text-gray-300 hover:text-yellow-400 transition-colors">{link.text}</Link>
              })}
            </nav>

            <div className="relative">
                <button onClick={() => setIsContactOpen(!isContactOpen)} className="hidden sm:inline-flex h-12 items-center justify-center rounded-xl px-8 text-sm font-bold transition-all shadow-gold hover:shadow-gold-hover bg-gold-gradient text-black hover:scale-105 active:scale-95 animate-pulse-slow">
                    تواصل معنا
                </button>
                <AnimatePresence>
                    {isContactOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-3 w-56 bg-gray-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="p-2 flex flex-col gap-1">
                                <a 
                                    href="https://wa.me/966557517792" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-3 px-4 py-4 hover:bg-green-600/20 text-green-400 rounded-xl transition-all"
                                    onClick={() => setIsContactOpen(false)}
                                >
                                    <RealWhatsAppIcon className="w-6 h-6" /> <span className="font-bold">محادثة واتساب</span>
                                </a>
                                <a 
                                    href="tel:0557517792" 
                                    className="flex items-center gap-3 px-4 py-4 hover:bg-yellow-500/20 text-yellow-500 rounded-xl transition-all"
                                    onClick={() => setIsContactOpen(false)}
                                >
                                    <PhoneIcon className="w-6 h-6" /> <span className="font-bold">اتصال هاتفي</span>
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <XIcon className="h-8 w-8" /> : <MenuIcon className="h-8 w-8" />}</button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
        <AnimatePresence>
        {isMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden fixed inset-0 bg-gray-950 z-[90] flex flex-col items-center text-center p-6 overflow-y-auto" dir="rtl">
                <div className="w-full max-w-sm mx-auto pt-24">
                    {navLinks.map(link => {
                        if (link.text === "خدماتنا") {
                            return (
                                <div key="mobile-services" className='border-b border-white/10'>
                                    <button onClick={() => setMobileServicesOpen(!isMobileServicesOpen)} className="w-full flex justify-between items-center py-5 text-2xl font-bold text-gray-100">
                                        <span>{link.text}</span>
                                        <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                    {isMobileServicesOpen && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden">
                                                <div className="pb-5 pt-2 flex flex-col items-center gap-5">{services.map(s => (<Link key={s.slug} href={`/services/${s.slug}`} onClick={() => setIsMenuOpen(false)} className="text-gray-400 text-lg hover:text-yellow-400">{s.title}</Link>))}</div>
                                        </motion.div>
                                    )}
                                    </AnimatePresence>
                                </div>
                            )
                        }
                        return <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="block py-5 text-2xl font-bold text-gray-100 border-b border-white/10">{link.text}</Link>
                    })}
                    <div className="grid grid-cols-2 gap-4 w-full mt-12">
                        <a href="https://wa.me/966557517792" onClick={() => setIsMenuOpen(false)} className="h-14 flex items-center justify-center rounded-2xl bg-green-500 text-white font-bold text-base shadow-lg"><RealWhatsAppIcon className="w-6 h-6 ml-2" /> واتساب</a>
                        <a href="tel:0557517792" onClick={() => setIsMenuOpen(false)} className="h-14 flex items-center justify-center rounded-2xl bg-yellow-500 text-black font-bold text-base shadow-lg"><PhoneIcon className="w-6 h-6 ml-2" /> اتصال</a>
                    </div>
                </div>
            </motion.div>
      )}
      </AnimatePresence>
    </>
  );
};

export default Header;
