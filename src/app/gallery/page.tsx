import { Metadata } from 'next';
import { getAllGalleryWorks } from '@/lib/works-manager';
import GalleryClient from '@/components/GalleryClient';
import { WorksGalleryJsonLd } from '@/components/JsonLd';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'معرض الأعمال والمشاريع المنفذة — فن الإعلان بالرياض',
  description: 'استكشف أحدث أعمال مؤسسة فن الإعلان بالرياض: لوحات زنكور، حروف بارزة، واجهات كلادينج، لوحات نيون وفلكس، واستيكرات تجارية بأعلى معايير الجودة والضمان.',
  openGraph: {
    title: 'معرض أعمال فن الإعلان — تنفيذ وتركيب اللوحات والكلادينج بالرياض',
    description: 'شاهد نماذج مشاريعنا المنفذة في الرياض من واجهات المحلات، الكلادينج الفاخر واللوحات الإعلانية المضيئة.',
    url: 'https://fan-alelan.com/gallery',
    images: [
      {
        url: '/api/works/image?file=loha-elaaniya-horf-barez-madia-riyadh.jpg',
        width: 1200,
        height: 630,
        alt: 'معرض أعمال فن الإعلان بالرياض',
      },
    ],
  },
};

export default function GalleryPage() {
  const allWorks = getAllGalleryWorks();

  return (
    <>
      <WorksGalleryJsonLd works={allWorks} />
      <GalleryClient initialWorks={allWorks} />
    </>
  );
}
