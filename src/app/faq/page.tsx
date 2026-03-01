'use client';

import { useState } from 'react';
import Link from 'next/link';
import { faqs } from '@/lib/data';
import AnimatedSection from '@/components/AnimatedSection';
import { ArrowRightIcon, SendIcon } from '@/components/icons';

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
        </svg>
    )
}

function FaqItem({ faq }: { faq: { question: string; answer: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button
        className="w-full flex justify-between items-center text-right py-6 px-4 sm:px-6 text-white hover:bg-white/5 transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg sm:text-xl font-bold">{faq.question}</span>
        <PlusIcon className={`w-6 h-6 flex-shrink-0 text-yellow-500 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
            <div className="px-4 sm:px-6 pb-6 text-gray-300 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.answer }} />
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="bg-gray-900 text-white min-h-screen" dir="rtl">
      {/* Hero Section */}
      <AnimatedSection className="py-32 text-center bg-gray-800/50">
        <div className="container px-4">
          <h1 className="text-5xl md:text-7xl font-black animated-gradient-text">الأسئلة الشائعة</h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">كل ما تحتاج معرفته عن خدماتنا في مكان واحد.</p>
        </div>
      </AnimatedSection>

      {/* AI Assistant Section */}
      <AnimatedSection className="py-16">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <button 
                onClick={() => setIsChatOpen(!isChatOpen)} 
                className="w-full bg-gradient-to-r from-gray-800 to-gray-700 rounded-3xl border border-yellow-500/30 shadow-2xl p-8 sm:p-12 text-center transition-all duration-300 hover:shadow-yellow-400/20 hover:border-yellow-500/60 transform hover:-translate-y-1"
              >
                  <div className="w-20 h-20 mx-auto bg-yellow-500/10 rounded-full flex items-center justify-center border-2 border-yellow-500/20 mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-yellow-400"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">أو اسأل &quot;فن&quot; مباشرة!</h2>
                  <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
                      اضغط هنا لبدء محادثة فورية مع مساعدنا الآلي &quot;فن&quot; للحصول على إجابات ذكية على جميع استفساراتك.
                  </p>
              </button>

              <div className={`grid transition-all duration-500 ease-in-out ${isChatOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="mt-8 bg-gray-800 rounded-3xl border border-white/10 p-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/20 shrink-0">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-400"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                        </div>
                        <div className="bg-gray-700/50 rounded-2xl p-4 w-full">
                            <p className="font-bold text-yellow-400">المساعد الآلي &quot;فن&quot;</p>
                            <p className="text-white mt-1">أهلاً بك! كيف يمكنني مساعدتك اليوم؟</p>
                        </div>
                    </div>
                    <div className="mt-4 relative">
                        <input type="text" placeholder="اكتب سؤالك هنا..." className="w-full bg-gray-900 border-2 border-gray-700 rounded-full py-3 px-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"/>
                        <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-yellow-500 text-black rounded-full h-10 w-10 flex items-center justify-center hover:bg-yellow-400 transition-colors">
                           <SendIcon className="w-5 h-5"/>
                        </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
      </AnimatedSection>

      {/* FAQ List Section */}
      <AnimatedSection className="pt-12 pb-24 sm:pb-32">
        <div className="container px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">أو تصفح الأسئلة الأكثر شيوعاً</h2>
          <div className="max-w-4xl mx-auto bg-gray-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {faqs.map((faq, index) => (
              <FaqItem key={index} faq={faq} />
            ))}
          </div>

           <div className="max-w-4xl mx-auto mt-20 text-center bg-yellow-500/10 p-10 rounded-3xl border border-yellow-500/20">
                <h3 className="text-3xl font-bold text-yellow-400 mb-4">لم تجد إجابتك؟</h3>
                <p className="text-gray-300 text-xl mb-8">لا تتردد في التواصل معنا مباشرة. فريقنا جاهز للإجابة على جميع استفساراتك.</p>
                <Link href="/contact" className="group inline-flex items-center justify-center rounded-lg bg-yellow-500 px-8 py-4 text-lg font-bold text-black transition-all hover:bg-yellow-300 shadow-xl hover:shadow-yellow-400/20 transform hover:-translate-y-1">
                    <span>تواصل معنا الآن</span>
                    <ArrowRightIcon className="w-6 h-6 mr-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
