
import { notFound } from "next/navigation";
import { services } from "@/lib/data";
import ServicePageClient from "./ServicePageClient";
import type { Metadata } from 'next';
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

type Service = typeof services[0];

interface ServicePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    return {
      title: "الخدمة غير موجودة"
    }
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fan-alelan.com';
  const cleanDescription = service.longDescription.substring(0, 160).replace(/<[^>]*>?/gm, '');

  return {
    title: `${service.title} بالرياض | تصميم وتنفيذ فن الإعلان`,
    description: `${service.title} بالرياض: ${cleanDescription}`,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} بالرياض | فن الإعلان للدعاية والمقاولات`,
      description: cleanDescription,
      url: `${BASE_URL}/services/${service.slug}`,
      images: [
        {
          url: `${BASE_URL}${service.images[0]}`,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} بالرياض | فن الإعلان`,
      description: cleanDescription,
      images: [`${BASE_URL}${service.images[0]}`],
    },
  };
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = services.find((s) => s.slug === params.slug) as Service | undefined;

  if (!service) {
    notFound();
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fan-alelan.com';

  const breadcrumbs = [
    { name: "الرئيسية", url: BASE_URL },
    { name: "خدماتنا", url: `${BASE_URL}/services` },
    { name: service.title, url: `${BASE_URL}/services/${service.slug}` }
  ];

  return (
    <>
      <ServiceJsonLd
        name={`${service.title} بالرياض`}
        description={service.description}
        url={`${BASE_URL}/services/${service.slug}`}
        image={`${BASE_URL}${service.images[0]}`}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ServicePageClient service={service} />
    </>
  );
}
