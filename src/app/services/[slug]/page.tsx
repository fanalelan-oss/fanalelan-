
import { notFound } from "next/navigation";
import { services } from "@/lib/data";
import ServicePageClient from "./ServicePageClient"; // Import the new client component
import type { Metadata } from 'next';

// Define a type for a single service to be safe
type Service = typeof services[0];

interface ServicePageProps {
  params: { slug: string };
}

// Function to generate metadata dynamically for each service page
export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    return {
      title: "الخدمة غير موجودة"
    }
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fan-alelan.com';

  return {
    title: `${service.title} | خدمات فن الإعلان`,
    description: service.longDescription.substring(0, 160).replace(/<[^>]*>?/gm, ''), // Use a snippet of the description
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} | فن الإعلان`,
      description: service.longDescription.substring(0, 160).replace(/<[^>]*>?/gm, ''),
      url: `${BASE_URL}/services/${service.slug}`,
      images: [
        {
          url: service.images[0], // Use the first image of the service for OG
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      type: 'article', // More specific type for a service page
    },
    twitter: {
        card: "summary_large_image",
        title: `${service.title} | فن الإعلان`,
        description: service.longDescription.substring(0, 160).replace(/<[^>]*>?/gm, ''),
        images: [service.images[0]],
    },
  };
}


// This function tells Next.js which slugs (pages) to pre-render at build time.
export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

// This is now a React Server Component (RSC)
export default function ServicePage({ params }: ServicePageProps) {
  const service = services.find((s) => s.slug === params.slug) as Service | undefined;

  if (!service) {
    notFound();
  }

  // The server component fetches the data and passes it down to the client component.
  // The server itself renders the full HTML content.
  return <ServicePageClient service={service} />;
}
