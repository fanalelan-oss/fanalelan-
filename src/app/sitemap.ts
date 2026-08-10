import { MetadataRoute } from 'next';
import { posts as blogPosts } from '@/lib/blog-data'; // Corrected import for blog posts
import { services } from '@/lib/data'; // Assuming services are still here, will verify

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fan-alelan.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Static pages
  const staticRoutes = [
    '/',
    '/services',
    '/gallery',
    '/blog',
    '/faq',
    '/about',
  ].map((route) => ({
    url: route === '/' ? BASE_URL : `${BASE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1.0 : 0.8,
  }));

  // Dynamic service pages
  const serviceRoutes = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Dynamic blog post pages
  const blogRoutes = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
