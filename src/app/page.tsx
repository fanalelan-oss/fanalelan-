import { Metadata } from 'next';
import HomePageClient from '@/components/HomePageClient';

export const metadata: Metadata = {
  title: 'فن الإعلان للدعاية والإعلان والمقاولات | واجهات كلادينج ولوحات بالرياض',
  description: 'شركة فن الإعلان بالرياض: تنفيذ واجهات كلادينج مقاوم للحريق، حروف بارزة مضيئة، شاشات LED، استيكرات سيارات، وبوثات معارض بأعلى معايير الجودة والضمان.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'فن الإعلان للدعاية والإعلان والمقاولات بالرياض',
    description: 'تنفيذ احترافي لواجهات الكلادينج المقاوم للحريق، الحروف البارزة المضيئة، شاشات LED، واستيكرات السيارات بالرياض.',
    url: 'https://fan-alelan.com',
    siteName: 'فن الإعلان للدعاية والمقاولات بالرياض',
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: 'https://fan-alelan.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'فن الإعلان للدعاية والإعلان والمقاولات بالرياض',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فن الإعلان للدعاية والإعلان والمقاولات بالرياض',
    description: 'تنفيذ احترافي لواجهات الكلادينج، الحروف البارزة المضيئة، وشاشات LED بالرياض.',
    images: ['https://fan-alelan.com/images/og-image.jpg'],
  },
};

export default function Home() {
  return <HomePageClient />;
}
