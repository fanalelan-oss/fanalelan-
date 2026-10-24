'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Search,
  X,
  Calendar,
  Clock,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export interface BlogPostItem {
  slug: string;
  title: string;
  image: string;
  publishedAt: string;
  category: {
    name: string;
    slug: string;
  };
  content: string;
}

interface BlogIndexClientProps {
  posts: BlogPostItem[];
}

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateReadingTime(text: string): string {
  const words = text.split(/\s+/).length;
  const minutes = Math.max(3, Math.ceil(words / 140));
  return `${minutes} دقائق قراءة`;
}

const arabicMonths = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const monthName = arabicMonths[monthIndex] || parts[1];
  return `${day} ${monthName} ${year}`;
}

const ITEMS_PER_PAGE = 9;

function BlogFilterInner({ posts }: BlogIndexClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read initial filter from URL if present
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';
  const initialSort = searchParams.get('sort') || 'newest';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Sync state to URL without full page reload
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (sortBy !== 'newest') params.set('sort', sortBy);

    const qs = params.toString();
    const newUrl = qs ? `${pathname}?${qs}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [selectedCategory, searchQuery, sortBy, pathname, router]);

  // Extract unique categories and their counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const catMap = new Map<string, string>();

    posts.forEach((p) => {
      const slug = p.category.slug;
      counts[slug] = (counts[slug] || 0) + 1;
      if (!catMap.has(slug)) {
        catMap.set(slug, p.category.name);
      }
    });

    const list = Array.from(catMap.entries()).map(([slug, name]) => ({
      slug,
      name,
      count: counts[slug] || 0,
    }));

    // Prepend "All"
    return [
      { slug: 'all', name: 'جميع المقالات', count: posts.length },
      ...list,
    ];
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    const cleanQ = searchQuery.trim().toLowerCase();

    const result = posts.filter((post) => {
      // Category match
      if (selectedCategory !== 'all' && post.category.slug !== selectedCategory) {
        return false;
      }

      // Query match
      if (cleanQ) {
        const titleMatch = post.title.toLowerCase().includes(cleanQ);
        const catMatch = post.category.name.toLowerCase().includes(cleanQ);
        const snippet = stripHtml(post.content).slice(0, 500).toLowerCase();
        const contentMatch = snippet.includes(cleanQ);
        return titleMatch || catMatch || contentMatch;
      }

      return true;
    });

    // Sort
    return result.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'ar');
      }
      // default: newest
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [posts, selectedCategory, searchQuery, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('blog-grid-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const isFiltered = selectedCategory !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="space-y-12">
      {/* Search & Controls Bar */}
      <div className="bg-gray-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Instant Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في المقالات (مثل: شاشات LED، رخصة بلدي، نيون، كلادينج)..."
              className="w-full pr-11 pl-10 py-3.5 bg-gray-900/90 border border-gray-700/80 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all text-sm sm:text-base font-sans"
              dir="rtl"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 hover:text-white transition-colors"
                aria-label="مسح البحث"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-300 text-sm font-medium whitespace-nowrap">
              <SlidersHorizontal className="w-4 h-4 text-yellow-400" />
              <span>الترتيب:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900/90 border border-gray-700/80 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 font-sans cursor-pointer transition-all"
              dir="rtl"
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="oldest">الأقدم أولاً</option>
              <option value="title">أبجدياً (أ - ي)</option>
            </select>
          </div>
        </div>

        {/* Category Pills (Horizontal Scroll on Mobile) */}
        <div className="pt-2 border-t border-gray-700/60">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide pt-1">
            {categoriesWithCounts.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/25 scale-[1.02]'
                      : 'bg-gray-900/80 text-gray-300 hover:bg-gray-700/70 hover:text-white border border-gray-700/50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-black/20 text-black' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Filter Summary & Reset Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-gray-400 pt-2 border-t border-gray-800/80">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span>
              عرض <strong className="text-white font-bold">{filteredPosts.length}</strong> من أصل{' '}
              <strong className="text-gray-300">{posts.length}</strong> مقالاً
            </span>
            {searchQuery && (
              <span className="text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-md">
                بحث: &quot;{searchQuery}&quot;
              </span>
            )}
          </div>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              type="button"
              className="inline-flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة تعيين الفلاتر</span>
            </button>
          )}
        </div>
      </div>

      <div id="blog-grid-anchor" className="scroll-mt-32" />

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
          {paginatedPosts.map((post) => {
            const cleanContent = stripHtml(post.content);
            const excerpt = cleanContent.slice(0, 140) + '...';
            const readingTime = calculateReadingTime(cleanContent);
            const formattedDate = formatDate(post.publishedAt);

            return (
              <article
                key={post.slug}
                className="group flex flex-col bg-gray-800/90 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-yellow-400/80 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(234,179,8,0.15)] hover:-translate-y-1.5"
              >
                {/* Image & Category Overlay */}
                <Link href={`/blog/${post.slug}`} className="relative h-32 sm:h-48 md:h-56 lg:h-60 w-full overflow-hidden block bg-gray-900">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Category Badge on Image */}
                  <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4">
                    <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-yellow-500 text-black shadow-md">
                      {post.category.name}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-3 sm:p-5 lg:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta Info: Date & Reading Time */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-4 text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3 font-medium">
                      <div className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400/80" />
                        <span suppressHydrationWarning>{formattedDate}</span>
                      </div>
                      <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-600" />
                      <div className="hidden sm:inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-yellow-400/80" />
                        <span>{readingTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xs sm:text-lg lg:text-2xl font-bold text-white mb-2 sm:mb-3 leading-snug group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt (Desktop / Tablet only to keep mobile cards neat) */}
                    <p className="hidden sm:block text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6">
                      {excerpt}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="pt-2 sm:pt-4 border-t border-gray-700/60 flex items-center justify-between text-xs sm:text-sm">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 sm:gap-2 font-bold text-[11px] sm:text-sm text-yellow-400 group-hover:text-yellow-300 transition-colors"
                    >
                      <span>اقرأ المقال</span>
                      <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform rtl:rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <span className="hidden sm:inline text-[11px] text-gray-400 uppercase tracking-wider font-mono">
                      فن الإعلان
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 px-4 bg-gray-800/40 rounded-3xl border border-white/5 max-w-2xl mx-auto space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white">لم يتم العثور على أي مقالات مطابقة</h3>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            لم نجد نتائج لكلمة &quot;<span className="text-yellow-400 font-bold">{searchQuery}</span>&quot;
            {selectedCategory !== 'all' ? ' في التصنيف المختار' : ''}. جرّب البحث بكلمات عامة مثل (كلادينج، لوحات، حروف بارزة، شاشات) أو أعد ضبط الفلاتر.
          </p>
          <button
            onClick={handleResetFilters}
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition-all shadow-lg shadow-yellow-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>عرض جميع المقالات ({posts.length})</span>
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            type="button"
            className="p-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="الصفحة السابقة"
          >
            <ChevronRight className="w-5 h-5 transform rtl:rotate-0" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isCurrent = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  type="button"
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    isCurrent
                      ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 scale-105'
                      : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            type="button"
            className="p-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="الصفحة التالية"
          >
            <ChevronLeft className="w-5 h-5 transform rtl:rotate-0" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function BlogIndexClient({ posts }: BlogIndexClientProps) {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">جاري تحميل مقالات المدونة...</div>}>
      <BlogFilterInner posts={posts} />
    </Suspense>
  );
}
