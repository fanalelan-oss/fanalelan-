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

      <div className="bg-gray-900 text-gray-200 min-h-screen pt-20">
        
        {/* Hero Section for Article */}
        <div className="relative h-[300px] sm:h-[450px] w-full flex items-end">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
          <div className="relative z-10 container mx-auto px-4 pb-10 text-right" dir="rtl">
              <AnimatedSection id="post-header" className="max-w-4xl">
                  <nav className="flex items-center gap-2 text-xs sm:text-sm text-yellow-500 mb-4 font-bold">
                      <Link href="/blog" className="hover:underline">المدونة</Link>
                      <span>/</span>
                      <span className="text-white opacity-70 italic line-clamp-1">{post.title}</span>
                  </nav>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-2xl">
                      {post.title}
                  </h1>
              </AnimatedSection>
          </div>
        </div>

        {/* Article Content */}
        <main className="container mx-auto px-4 py-12 text-right font-sans" dir="rtl">
          <div className="max-w-5xl mx-auto">
               <div
                  className="prose prose-invert prose-lg sm:prose-xl max-w-none text-gray-300 leading-relaxed
                  prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:text-yellow-400 prose-h2:font-black prose-h2:border-r-4 prose-h2:border-yellow-500 prose-h2:pr-6
                  prose-a:text-yellow-500 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white prose-strong:font-black
                  prose-img:rounded-[1.5rem] sm:prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:border prose-img:border-white/10
                  "
                  dangerouslySetInnerHTML={{ __html: post.content }}
               />

               {/* Bottom Navigation */}
               <AnimatedSection id="back-to-blog" className="mt-20 pt-10 border-t border-white/5">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                      <Link href="/blog" className="group flex items-center gap-4 text-lg font-bold text-yellow-500 hover:gap-6 transition-all">
                          <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                          <span>العودة لجميع المقالات</span>
                      </Link>
                      <Link href="/#contact" className="bg-gold-gradient text-black px-8 py-3 rounded-xl font-black text-base shadow-gold hover:scale-105 transition-all">
                          اطلب استشارة لمشروعك الآن
                      </Link>
                  </div>
               </AnimatedSection>
          </div>
        </main>
      </div>
    </>
  );
}
