import { Metadata } from 'next';
import { posts } from '@/lib/blog-data';
import AnimatedSection from '@/components/AnimatedSection';
import BlogIndexClient from '@/components/BlogIndexClient';

export const metadata: Metadata = {
  title: 'مدونة فن الإعلان | نصائح ودروس في الكلادينج واللوحات والدعاية بالرياض',
  description: 'مدونة فن الإعلان: مقالات احترافية في واجهات الكلادينج، اللوحات الإعلانية والحروف البارزة، شروط بلدية الرياض، تغليف السيارات، أعمال الحديد، والطباعة الرقمية — دليلك للنجاح في الدعاية بالرياض.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'مدونة فن الإعلان | نصائح ودروس في الكلادينج واللوحات والدعاية بالرياض',
    description: 'مقالات احترافية في واجهات الكلادينج، اللوحات الإعلانية، شاشات LED، شروط بلدية الرياض، والطباعة الرقمية.',
    url: 'https://fan-alelan.com/blog',
    images: [{ url: 'https://fan-alelan.com/works_images/kladding-facade-commercial-riyadh.png', width: 1200, height: 630, alt: 'مدونة فن الإعلان' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مدونة فن الإعلان | مقالات ونصائح الدعاية والمقاولات بالرياض',
    description: 'مقالات احترافية في واجهات الكلادينج، اللوحات الإعلانية، شاشات LED، والطباعة الرقمية بالرياض.',
    images: ['https://fan-alelan.com/works_images/kladding-facade-commercial-riyadh.png'],
  },
};

export default function BlogPage() {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <AnimatedSection id="blog-header">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span className="text-yellow-400 font-bold text-sm sm:text-base tracking-widest uppercase mb-3 inline-block bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full">
              المعرفة والخبرة الميدانية بالرياض
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold animated-gradient-text pb-4">
              مدونة فن الإعلان
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              دليلك الهندسي والتسويقي الشامل لكل ما يخص واجهات الكلادينج، اللوحات الإعلانية، تراخيص بلدي، وشاشات العرض بالرياض.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection id="blog-posts" className="mt-8">
          <BlogIndexClient posts={posts} />
        </AnimatedSection>
      </main>
    </div>
  );
}
