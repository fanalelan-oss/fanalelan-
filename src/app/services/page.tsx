import { services } from '@/lib/data';
import ServiceCard from '@/components/ServiceCard';
import AnimatedSection from '@/components/AnimatedSection';

export default function ServicesPage() {
  return (
    <main className="flex-1 bg-gray-900 pt-20">
        <AnimatedSection id="services" className="py-24 sm:py-32 bg-gray-800 overflow-hidden">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-5xl sm:text-6xl font-bold tracking-tight bg-gold-gradient bg-clip-text text-transparent pb-4">خدماتنا المتكاملة</h2>
              <p className="mt-6 text-xl text-gray-400">من الفكرة إلى التنفيذ، نقدم حلولاً إبداعية لتحديث الواجهات وتصميم كافة أنواع اللوحات الإعلانية.</p>
            </div>
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {services.map((service, index) => <ServiceCard key={index} {...service} />)}
            </div>
          </div>
        </AnimatedSection>
    </main>
  );
}
