
import Link from 'next/link';
import Image from 'next/image';
import { posts } from '../../lib/blog-data';
import AnimatedSection from '../../components/AnimatedSection';
import { ArrowRightIcon } from '../../components/icons';

export default function BlogPage() {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <AnimatedSection id="blog-header">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl sm:text-7xl font-extrabold animated-gradient-text pb-4">
              مدونة فن الإعلان
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              مقالات ونصائح وإلهام في عالم الدعاية والإعلان والكلادينج.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection id="blog-posts" className="mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="group block bg-gray-800 rounded-2xl overflow-hidden border border-white/10 hover:border-yellow-400 transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-56 w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">{post.title}</h2>
                  <div className="flex items-center font-semibold text-yellow-400">
                    <span>إقرأ المزيد</span>
                    <ArrowRightIcon className="w-5 h-5 mr-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
}
