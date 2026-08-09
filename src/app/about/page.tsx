import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fan-alelan.com';

export const metadata: Metadata = {
  title: "من نحن | فن الإعلان للدعاية والإعلان والمقاولات العامة بالرياض",
  description: "تعرف على شركة فن الإعلان: خبرة عريقة في تصميم وتنفيذ واجهات الكلادينج، اللوحات الإعلانية، الأسوار الدعائية للمشاريع، وأعمال المقاولات العامة في مدينة الرياض.",
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: "من نحن | فن الإعلان بالرياض",
    description: "شركة فن الإعلان — رائدة خدمات الدعاية والإعلان والمقاولات العامة بالرياض. تنفيذ واجهات كلادينج، لوحات حروف بارزة، وأسوار إعلانية للمشاريع.",
    url: `${BASE_URL}/about`,
  },
};

export default function AboutPage() {
  const breadcrumbs = [
    { name: "الرئيسية", url: BASE_URL },
    { name: "من نحن", url: `${BASE_URL}/about` }
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="bg-gray-900 text-gray-100 min-h-screen pt-28 pb-16 font-sans" dir="rtl">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Header Section */}
          <div className="text-center mb-16">
            <span className="text-yellow-500 font-bold text-sm sm:text-base tracking-widest uppercase mb-2 inline-block">
              عن فن الإعلان
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">
              فن الإعلان للدعاية والإعلان والمقاولات العامة
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              نحن مؤسسة سعودية متخصصة في تقديم حلول متكاملة في مجال الدعاية والإعلان والمقاولات العامة في جميع مناطق وأحياء مدينة الرياض. نجمع بين الابتكار الهندسي والدقة في التنفيذ لضمان أعلى مستويات الجودة لعملائنا.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 text-center">
            <div className="bg-gray-800/80 p-6 rounded-2xl border border-white/5 shadow-lg">
              <div className="text-3xl sm:text-4xl font-black text-yellow-500 mb-1">15+</div>
              <div className="text-gray-400 text-sm font-semibold">سنوات ضمان الكلادينج</div>
            </div>
            <div className="bg-gray-800/80 p-6 rounded-2xl border border-white/5 shadow-lg">
              <div className="text-3xl sm:text-4xl font-black text-yellow-500 mb-1">100%</div>
              <div className="text-gray-400 text-sm font-semibold">مطابقة لاشتراطات البلدية</div>
            </div>
            <div className="bg-gray-800/80 p-6 rounded-2xl border border-white/5 shadow-lg">
              <div className="text-3xl sm:text-4xl font-black text-yellow-500 mb-1">24/7</div>
              <div className="text-gray-400 text-sm font-semibold">دعم واستجابة سريعة</div>
            </div>
            <div className="bg-gray-800/80 p-6 rounded-2xl border border-white/5 shadow-lg">
              <div className="text-3xl sm:text-4xl font-black text-yellow-500 mb-1">1000+</div>
              <div className="text-gray-400 text-sm font-semibold">مشروع منفذ بنجاح</div>
            </div>
          </div>

          {/* Main Services Scope */}
          <div className="bg-gray-800/50 p-8 sm:p-12 rounded-3xl border border-white/10 mb-16 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 border-r-4 border-yellow-500 pr-4">
              نطاق خدماتنا المتخصصة بالرياض
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-gray-300">
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">🎨 خدمات الدعاية والإعلان:</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>تصميم وتنفيذ واجهات الكلادينج الفاخرة المقاومة للحريق.</li>
                  <li>تصنيع اللوحات التجارية والحروف البارزة المضيئة (LED).</li>
                  <li>بناء وتغطية الأسوار الإعلانية والدعائية للمشاريع تحت الإنشاء والأراضي.</li>
                  <li>تغليف أسطول سيارات الشركات وتصميم الاستيكرات المخصصة.</li>
                  <li>حلول الطباعة الرقمية والبنرات والفلكس بجودة عالية.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">🏗️ خدمات المقاولات العامة والحدادة:</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>أعمال الحدادة والهياكل المعدنية للمشاريع التجارية والسكينة.</li>
                  <li>قص وتشكيل الحديد بتقنية الليزر CNC فائقة الدقة.</li>
                  <li>تصنيع وتركيب المظلات والسواتر بمواصفات معتمدة.</li>
                  <li>ترميم وصيانة واجهات المباني واللوحات القديمة.</li>
                  <li>تصميم وتجهيز بوثات المعارض والأكشاك التجارية.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quality & Compliance */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-800/40 p-8 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4">الالتزام باشتراطات أمانة الرياض منصة بلدي</h3>
              <p className="text-gray-300 leading-relaxed">
                نحرص دائماً على تطبيق كافة المعايير والأنظمة الجديدة الصادرة من أمانة منطقة الرياض للوحات التجارية والمحلات عبر منصة بلدي، مما يضمن لعملائنا التنفيذ دون التعرض لأي مخالفات بلدية.
              </p>
            </div>
            <div className="bg-gray-800/40 p-8 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-4">خدمة جميع أحياء ومناطق الرياض</h3>
              <p className="text-gray-300 leading-relaxed">
                يقدم فريقنا خدماته في كافة أحياء الرياض (شمال الرياض، شرق الرياض، غرب الرياض، وسط الرياض، وجنوب الرياض)، مع خدمة الانتقال المباشر لموقع العميل والمعاينة المجانية.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-gold-gradient text-black p-10 rounded-3xl shadow-2xl text-center">
            <h2 className="text-2xl sm:text-4xl font-black mb-4">هل لديك مشروع تتطلع لتنفيذه؟</h2>
            <p className="text-lg font-medium max-w-2xl mx-auto mb-8">
              تواصل مع فريق فن الإعلان الآن للحصول على استشارة مجانية وعرض سعر مخصص لمشروعك بالرياض.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/#contact" className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all shadow-lg">
                اطلب عرض سعر الآن
              </Link>
              <a href="tel:+966557517792" className="bg-white/20 backdrop-blur-sm text-black border border-black/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition-all">
                📞 0557517792
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
