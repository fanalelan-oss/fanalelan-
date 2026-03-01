'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { useFormState, useFormStatus } from 'react-dom';

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import data
import { works, testimonials } from '../lib/data';

// Import components and icons
import { ArrowRightIcon } from "./icons";
import RealWhatsAppIcon from "./SocialIcons/RealWhatsAppIcon";
import RealGoogleMapsIcon from "./SocialIcons/RealGoogleMapsIcon";
import RealEmailIcon from "./SocialIcons/RealEmailIcon";
import RealPhoneIcon from "./SocialIcons/RealPhoneIcon";
import WorkCard from "./WorkCard";
import AnimatedSection from "./AnimatedSection";

import { submitContactForm, FormState } from '../app/actions';
import '../app/animations.css';

function RotatingWords() {
  const words = ["نخطط", "نصمم", "ننفذ"];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => { setIndex((prevIndex) => (prevIndex + 1) % words.length); }, 1200);
    return () => clearInterval(timer);
  }, [words.length]);
  return (
    <div className="mt-8 h-10 flex items-center justify-center overflow-hidden font-sans">
      <div key={index} className="text-2xl sm:text-3xl font-bold tracking-widest bg-gold-gradient bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-500">{words[index]}</div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="w-full h-16 items-center justify-center rounded-2xl px-10 text-xl transition-all shadow-gold hover:shadow-gold-hover bg-gold-gradient text-black font-black disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95">
      {pending ? 'جارٍ الإرسال...' : 'إرسال الرسالة الآن'}
    </button>
  );
}

function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3v1"/>
      <path d="M17 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3v1"/>
    </svg>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    )
}

export default function HomePageClient() {
  const initialState: FormState = { message: "", errors: undefined, success: false };
  const [state, dispatch] = useFormState(submitContactForm, initialState);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200 font-sans text-right" dir="rtl">
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative h-screen min-h-[800px] w-full flex items-center justify-center text-center bg-cover bg-center bg-fixed" style={{backgroundImage: "url('/images/hero-background.jpg')"}}>
          <div className="absolute inset-0 bg-black/75" />
          <div className="relative z-10 container px-4">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold animated-gradient-text pb-4 leading-tight">واجهات فريدة<br/>ولوحات تترك أثراً</h1>
            <p className="mt-8 max-w-4xl mx-auto text-xl sm:text-2xl text-gray-200 font-medium opacity-90">في فن الإعلان، نقدم حلولاً مبتكرة تضمن تميز علامتك التجارية في كل أحياء ومناطق الرياض.</p>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <Link href="/services" className="inline-flex h-14 items-center justify-center rounded-lg px-10 text-xl transition-all shadow-gold hover:shadow-gold-hover bg-gold-gradient text-black font-bold animate-shadow-gold">اكتشف خدماتنا</Link>
              <Link href="#our-work" className="inline-flex h-14 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-10 text-xl font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20">شاهد أعمالنا</Link>
            </div>
            <RotatingWords />
          </div>
        </section>

        {/* WORK SECTION */}
        <AnimatedSection id="our-work" className="py-24 sm:py-32 bg-gray-900 overflow-hidden">
          <div className="container">
             <div className="text-center max-w-4xl mx-auto mb-20">
              <h2 className="text-5xl sm:text-6xl font-bold tracking-tight animated-gradient-text pb-4">من أعمالنا المميزة</h2>
              <p className="mt-6 text-xl text-gray-400 font-medium">أعمال تعكس شغفنا بالجودة والابتكار في كافة مناطق الرياض.</p>
            </div>
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ clickable: true }}
              navigation={true}
              className="work-swiper pb-16"
            >
              {works.map((work, index) => (
                <SwiperSlide key={index}><WorkCard {...work} isSimple={true} /></SwiperSlide>
              ))}
            </Swiper>
            <div className="mt-10 text-center">
                <Link href="/gallery" className="group inline-flex items-center justify-center rounded-lg bg-yellow-400 px-8 py-4 text-lg font-bold text-black transition-all hover:bg-yellow-300 shadow-xl hover:shadow-yellow-400/20 transform hover:-translate-y-1">
                    <span>تصفح معرض الأعمال بالكامل</span>
                    <ArrowRightIcon className="w-6 h-6 mr-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* ABOUT SECTION - REWRITTEN */}
        <AnimatedSection id="about-us" className="py-24 sm:py-32 bg-gray-800 text-right">
            <div className="container px-4">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-5xl sm:text-6xl font-bold tracking-tight animated-gradient-text pb-4 leading-tight">لماذا تختار فن الإعلان؟</h2>
                        <p className="mt-6 text-xl text-gray-300 leading-relaxed">
                            لأكثر من 15 عاماً، ونحن في فن الإعلان نحول الأفكار إلى واقع ملموس يترك بصمة في شوارع الرياض. نحن لسنا مجرد منفذين، بل شركاء نجاح نضع خبرتنا بين يديك لضمان تحقيق أفضل النتائج.
                        </p>
                        <div className="mt-12 space-y-8">
                            <div className="flex items-start gap-5">
                                <div className="mt-1 w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500"><CheckIcon className="w-6 h-6"/></div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">جودة لا تقبل المساومة</h3>
                                    <p className="text-gray-400 mt-2 text-lg">نستخدم أجود المواد الخام من كلادينج وأكريليك ومصادر موثوقة ونتبع أدق معايير الصناعة.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="mt-1 w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500"><CheckIcon className="w-6 h-6"/></div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">فريق من الخبراء</h3>
                                    <p className="text-gray-400 mt-2 text-lg">مصممون، فنيون، وحدادون يعملون بتناغم لإنجاز مشروعك على أكمل وجه ممكن.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-5">
                                <div className="mt-1 w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500"><CheckIcon className="w-6 h-6"/></div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">ضمان يريح بالك</h3>
                                    <p className="text-gray-400 mt-2 text-lg">نقدم ضمانات حقيقية على أعمالنا تصل إلى 15 عاماً على الكلادينج وسنتين على الإضاءة.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                        <Image src="https://i.imgur.com/8eTDB7o.png" fill alt="فريق عمل فن الإعلان" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                </div>
            </div>
        </AnimatedSection>

        {/* TESTIMONIALS SECTION - NEW */}
        <AnimatedSection id="testimonials" className="py-24 sm:py-32 bg-gray-900 overflow-hidden">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto mb-20">
              <h2 className="text-5xl sm:text-6xl font-bold tracking-tight animated-gradient-text pb-4">ماذا يقول عملاؤنا عنا؟</h2>
              <p className="mt-6 text-xl text-gray-400 font-medium">آراء نعتز بها وتدفعنا لتقديم الأفضل دائماً.</p>
            </div>
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{ 640: { slidesPerView: 2 }, 1280: { slidesPerView: 3 } }}
              autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ clickable: true, el: '.swiper-pagination' }}
              className="testimonials-swiper pb-20"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index} className="h-auto">
                  <div className="bg-gray-800/50 rounded-3xl p-8 h-full flex flex-col border border-white/10 transform hover:border-yellow-500/50 transition-colors duration-300 hover:-translate-y-2">
                    <QuoteIcon className="w-10 h-10 text-yellow-500/30" />
                    <p className="mt-6 text-lg text-gray-300 leading-relaxed flex-grow">{testimonial.text}</p>
                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">{testimonial.title}</p>
                      </div>
                      <div className="capitalize text-xs font-bold text-gray-500 bg-black/30 px-3 py-1 rounded-full">
                        {testimonial.platform}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
                <div className="swiper-pagination"></div>
            </Swiper>
          </div>
        </AnimatedSection>

        {/* CONTACT SECTION */}
        <AnimatedSection id="contact" className="py-32 sm:py-48 bg-gray-900 relative overflow-hidden">
          <div className="container px-4 relative z-10">
              <div className="text-center max-w-4xl mx-auto mb-20">
                <h2 className="text-5xl sm:text-7xl font-black animated-gradient-text pb-6 leading-tight">تواصل معنا الآن</h2>
                <p className="text-xl sm:text-2xl text-gray-400 font-bold italic tracking-wide">نخدم في كافة أحياء ومناطق الرياض</p>
              </div>

              <div className="grid lg:grid-cols-5 gap-12 items-stretch text-right">
                {/* Contact Form Card */}
                <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 border border-white/10 shadow-2xl relative">
                    <h3 className="text-3xl font-bold text-white mb-10 flex items-center gap-4">
                        <span className="w-2 h-8 bg-yellow-500 rounded-full"></span>
                        أرسل لنا تفاصيل مشروعك
                    </h3>
                    <form action={dispatch} className="space-y-8">
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-widest">الاسم الكامل</label>
                                <input id="name" type="text" name="name" autoComplete="name" placeholder="محمد السالم" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 ring-yellow-500 outline-none transition-all" required />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-widest">رقم الجوال</label>
                                <input id="phone" type="tel" name="phone" autoComplete="tel" placeholder="05xxxxxxxx" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 ring-yellow-500 outline-none transition-all" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-bold text-gray-500 mr-2 uppercase tracking-widest">وصف العمل المطلوب</label>
                            <textarea id="message" name="message" rows={4} placeholder="اكتب هنا تفاصيل اللوحة أو الواجهة..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-2 ring-yellow-500 outline-none transition-all" required autoComplete="off"></textarea>
                        </div>
                        <SubmitButton />
                        {state.message && (
                            <div className={`mt-6 p-6 rounded-[2rem] text-center font-bold text-xl transition-all shadow-2xl animate-in zoom-in-95 duration-500 ${state.success ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                                {state.success ? '🚀 ' : '⚠️ '}{state.message}
                            </div>
                        )}
                    </form>
                </div>

                {/* Quick Info Card */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-10 border border-white/5 shadow-2xl flex-1 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-white mb-12 border-r-4 border-yellow-500 pr-6">قنوات الاستجابة السريعة</h3>
                        
                        <div className="space-y-12">
                            <a href="tel:0557517792" className="flex items-center gap-6 group">
                                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-all duration-500 shadow-xl"><RealPhoneIcon className="w-8 h-8" /></div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">اتصل بنا الآن</p>
                                    <p className="text-2xl font-black text-white tracking-widest">0557517792</p>
                                </div>
                            </a>

                            <a href="https://wa.me/966557517792" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
                                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-all duration-500 shadow-xl"><RealWhatsAppIcon className="w-8 h-8" /></div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">واتساب سريع</p>
                                    <p className="text-2xl font-black text-green-400">ابدأ المحادثة</p>
                                </div>
                            </a>

                            <a href="mailto:admin@fan-alelan.com" className="flex items-center gap-6 group">
                                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-all duration-500 shadow-xl"><RealEmailIcon className="w-8 h-8" /></div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">راسلنا بريدياً</p>
                                    <p className="text-lg font-bold text-white break-all">admin@fan-alelan.com</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    {/* Maps Mini Card */}
                    <a href="https://share.google/yok3tFEnIDCu8AZbY" target="_blank" rel="noopener noreferrer" className="bg-blue-600/10 border border-blue-500/20 rounded-[2rem] p-8 flex items-center justify-between group hover:bg-blue-600/20 transition-all">
                        <div className="flex items-center gap-5">
                            <RealGoogleMapsIcon className="w-12 h-12" />
                            <span className="text-xl font-bold text-blue-400">موقعنا في الرياض</span>
                        </div>
                        <ArrowRightIcon className="w-6 h-6 text-blue-400 rotate-180 group-hover:translate-x-[-5px] transition-transform" />
                    </a>
                </div>
              </div>
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
}
