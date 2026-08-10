'use client';

import { useState } from 'react';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';
import { ArrowRightIcon } from '@/components/icons';
import HashtagsBar from '@/components/HashtagsBar';
import { initialFAQs, searchFAQs, FAQItem } from '@/lib/faq-engine';
import { FAQPageJsonLd } from '@/components/JsonLd';

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/>
      <path d="M12 5v14"/>
    </svg>
  );
}

function FaqCard({ faq }: { faq: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        className="w-full flex justify-between items-start text-right py-6 px-4 sm:px-8 text-white hover:bg-white/5 transition-colors duration-300 gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <span className="inline-block text-xs font-extrabold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-0.5 rounded-full mb-2">
            {faq.category}
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white leading-snug">{faq.question}</h3>
        </div>
        <PlusIcon className={`w-6 h-6 flex-shrink-0 text-yellow-400 transition-transform duration-300 mt-1 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-4 sm:px-8 pb-6 text-gray-300 text-base sm:text-lg leading-relaxed border-t border-white/5 pt-4">
            <p>{faq.answer}</p>
            
            {/* Interactive Hashtags */}
            <HashtagsBar tags={faq.tags} className="mt-4" />

            {faq.serviceSlug && (
              <div className="mt-4 pt-3 border-t border-white/5">
                <Link href={`/services/${faq.serviceSlug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
                  <span>اطلع على تفاصيل خدمة {faq.category}</span>
                  <span>←</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredFAQs = searchFAQs(searchTerm);

  const categories = ['الكل', 'أسوار إعلانية ودعائية', 'واجهات كلادينج', 'لوحات اعلانية', 'استيكرات السيارات', 'أعمال الحديد'];
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const displayedFAQs = selectedCategory === 'الكل'
    ? filteredFAQs
    : filteredFAQs.filter((faq) => faq.category === selectedCategory);

  return (
    <>
      <FAQPageJsonLd faqs={initialFAQs.map((f) => ({ question: f.question, answer: f.answer }))} />

      <div className="bg-gray-950 text-white min-h-screen pt-28 pb-20 font-sans selection:bg-yellow-500 selection:text-black" dir="rtl">
        {/* Hero Section */}
        <AnimatedSection className="py-16 sm:py-24 text-center bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950 border-b border-white/10">
          <div className="container px-4">
            <span className="text-xs font-black bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest">
              مركز المعرفة والسيو بالرياض
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black animated-gradient-text mt-4 mb-4">
              بنك استفسارات العملاء بالرياض
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-2xl text-gray-300 font-medium">
              إجابات فنية دقيقة ومتوافقـة مع كود البناء السعودي واشتراطات أمانة منطقة الرياض.
            </p>

            {/* Instant Search Field */}
            <div className="max-w-2xl mx-auto mt-10 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن سؤالك هنا (مثال: أسوار دعائية، كلادينج، ترخيص، حروف بارزة...)"
                className="w-full bg-gray-900/90 border-2 border-yellow-500/30 rounded-2xl py-4 pr-6 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-all text-base sm:text-lg shadow-2xl"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl opacity-60">🔍</span>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-4xl mx-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 font-black'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* FAQ List Section */}
        <AnimatedSection className="py-16">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto bg-gray-900/90 rounded-3xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md">
              {displayedFAQs.length > 0 ? (
                displayedFAQs.map((faq) => <FaqCard key={faq.id} faq={faq} />)
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <p className="text-xl font-bold">لم نجد نتائج مطابقة لـ &quot;{searchTerm}&quot;</p>
                  <p className="mt-2 text-sm">تواصل معنا مباشرة عبر الواتساب لإجابتك فوراً!</p>
                </div>
              )}
            </div>

            {/* CTA Box */}
            <div className="max-w-4xl mx-auto mt-16 text-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 sm:p-12 rounded-3xl border border-yellow-500/30 shadow-2xl">
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">لديك سؤال خاص بمشروعك؟</h3>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">تواصل مع مهندسينا في فن الإعلان بالرياض للحصول على معاينة مجانية وتخفيضات الاستشارات الفنية.</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://wa.me/966557517792?text=استفسار%20عن%20خدمات%20فن%20الإعلان"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-black px-8 py-4 rounded-2xl text-lg transition-all shadow-lg hover:scale-105"
                >
                  <span>💬 استفسر عبر الواتساب مباشرة</span>
                </a>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black px-8 py-4 rounded-2xl text-lg transition-all shadow-lg hover:scale-105"
                >
                  <span>تواصل معنا الآن</span>
                  <ArrowRightIcon className="w-5 h-5 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </>
  );
}
