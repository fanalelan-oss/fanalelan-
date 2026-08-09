import { notFound } from 'next/navigation';
import Image from 'next/image';
import { posts } from '../../../lib/blog-data'; 
import AnimatedSection from '../../../components/AnimatedSection';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BlogPostJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: "المقال غير موجود"
    };
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fan-alelan.com';
  const cleanDescription = post.content.substring(0, 160).replace(/<[^>]*>?/gm, '').trim();

  return {
    title: `${post.title} | مدونة فن الإعلان`,
    description: cleanDescription,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: cleanDescription,
      url: `${BASE_URL}/blog/${post.slug}`,
      images: [
        {
          url: `${BASE_URL}${post.image}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: cleanDescription,
      images: [`${BASE_URL}${post.image}`],
    },
  };
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fan-alelan.com';

  const breadcrumbs = [
    { name: "الرئيسية", url: BASE_URL },
    { name: "المدونة", url: `${BASE_URL}/blog` },
    { name: post.title, url: `${BASE_URL}/blog/${post.slug}` }
  ];

  // Get related posts (excluding current post)
  const relatedPosts = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <BlogPostJsonLd
        title={post.title}
        description={post.content.substring(0, 160).replace(/<[^>]*>?/gm, '').trim()}
        url={`${BASE_URL}/blog/${post.slug}`}
        image={post.image}
        datePublished={post.publishedAt}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <div className="bg-gray-950 text-gray-200 min-h-screen selection:bg-yellow-500 selection:text-black">
        
        {/* Integrated Hero Section with Image as Background */}
        <div className="relative w-full h-[320px] sm:h-[420px] flex items-end overflow-hidden border-b border-white/10">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-black/40" />

          <div className="relative z-10 container mx-auto px-4 sm:px-8 pb-8 text-right" dir="rtl">
            <div className="max-w-6xl mx-auto">
              
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-300 mb-3 font-semibold bg-black/40 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/10">
                <Link href="/" className="hover:text-yellow-400 transition-colors">الرئيسية</Link>
                <span className="text-gray-500">/</span>
                <Link href="/blog" className="hover:text-yellow-400 transition-colors">المدونة</Link>
                <span className="text-gray-500">/</span>
                <span className="text-yellow-400 font-bold line-clamp-1">{post.title}</span>
              </nav>

              {/* Main Article Title */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-2xl">
                {post.title}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-200">
                <div className="flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-3 py-1 rounded-lg backdrop-blur-md">
                  <span>📅</span>
                  <span>{post.publishedAt || '2024-03-01'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1 rounded-lg text-gray-300 backdrop-blur-md">
                  <span>⏱️</span>
                  <span>قراءة 4 دقائق</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1 rounded-lg text-gray-300 backdrop-blur-md">
                  <span>🏷️</span>
                  <span>فن الإعلان</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Article Body Layout */}
        <main className="container mx-auto px-4 sm:px-8 py-8 text-right font-sans relative z-10" dir="rtl">
          <div className="max-w-6xl mx-auto">
            
            {/* Quick Takeaways Box */}
            <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-gray-900/90 border border-yellow-500/30 backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-6 bg-yellow-400 rounded-full" />
                <h3 className="text-lg sm:text-xl font-black text-white">💡 نبذة سريعة:</h3>
              </div>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-medium">
                استعرض أهم النقاط والمعايير التقنية التي نلتزم بها في <strong className="text-yellow-400">فن الإعلان</strong> بالرياض لضمان أعلى جودة في التنفيذ والالتزام التام باشتراطات أمانة الرياض.
              </p>
            </div>

            {/* Article Main Typography Card */}
            <article className="p-6 sm:p-10 rounded-2xl bg-gray-900/80 border border-white/10 shadow-2xl backdrop-blur-md">
              <div
                className="prose prose-invert prose-lg sm:prose-xl max-w-none text-gray-300 leading-relaxed
                prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:text-yellow-400 prose-h2:font-black prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-r-4 prose-h2:border-yellow-500 prose-h2:pr-3 prose-h2:bg-white/5 prose-h2:py-1.5 prose-h2:rounded-l-lg
                prose-p:mb-4 prose-p:leading-relaxed
                prose-a:text-yellow-400 prose-a:font-bold prose-a:underline hover:prose-a:text-yellow-300
                prose-strong:text-white prose-strong:font-black
                prose-ul:list-disc prose-ul:pr-5 prose-ul:my-4 prose-li:mb-1.5
                prose-img:rounded-xl prose-img:shadow-xl prose-img:border prose-img:border-white/10 prose-img:my-6
                "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Fast Action CTA Box */}
            <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-yellow-500/30 text-center shadow-xl relative overflow-hidden">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-3">هل تبحث عن تنفيذ احترافي لمشروعك بالرياض؟</h3>
              <p className="text-gray-300 text-base mb-6 max-w-xl mx-auto font-medium">
                فريق "فن الإعلان" مستعد لتوفير استشارة مجانية ومعاينة سريعة لموقعك مع تصاميم 3D مبدئية.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a 
                  href="https://wa.me/966557517792?text=مرحباً،%20قرأت%20المقال%20وأود%20الاستفسار%20عن%20خدماتكم" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-black px-6 py-3 rounded-xl text-base transition-all shadow-md hover:scale-105"
                >
                  <span>💬 تواصل عبر الواتساب مباشرة</span>
                </a>
                <Link 
                  href="/#contact" 
                  className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black px-6 py-3 rounded-xl text-base transition-all shadow-md hover:scale-105"
                >
                  <span>طلب عرض سعر</span>
                </Link>
              </div>
            </div>

            {/* Related Articles Section */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="text-xl sm:text-2xl font-black text-white mb-6 border-r-4 border-yellow-500 pr-3">
                  مقالات قد تهمك أيضاً:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map((rPost) => (
                    <Link
                      key={rPost.slug}
                      href={`/blog/${rPost.slug}`}
                      className="group block bg-gray-900 rounded-xl overflow-hidden border border-white/10 hover:border-yellow-400 transition-all duration-300 shadow-md"
                    >
                      <div className="relative h-36 w-full">
                        <Image
                          src={rPost.image}
                          alt={rPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-60" />
                      </div>
                      <div className="p-4">
                        <h4 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
                          {rPost.title}
                        </h4>
                        <span className="mt-2 inline-flex items-center text-xs font-bold text-yellow-400 group-hover:translate-x-[-4px] transition-transform">
                          اقرأ المقال ←
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="mt-8 pt-6 flex items-center justify-between">
              <Link href="/blog" className="inline-flex items-center gap-2 text-base font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
                <span>← العودة لقائمة جميع المقالات</span>
              </Link>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
