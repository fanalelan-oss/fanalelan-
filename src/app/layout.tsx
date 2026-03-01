import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import Script from 'next/script';
import dynamic from 'next/dynamic'; // Import dynamic
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";

// Dynamically import NewChatbot with SSR turned off
const NewChatbot = dynamic(() => import('@/components/NewChatbot'), { ssr: false });

const notoKufiArabic = Noto_Kufi_Arabic({ 
  subsets: ["arabic"],
  weight: ['400', '700', '900'] 
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fan-alelan.com';

// Comprehensive SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "فن الإعلان للدعاية والإعلان | واجهات كلادينج ولوحات محلات بالرياض",
    template: "%s | فن الإعلان بالرياض"
  },
  description: "فن الإعلان: متخصصون في تنفيذ واجهات الكلادينج الفاخرة، الحروف البارزة المضيئة، استيكرات السيارات، وأعمال الحديد بالليزر في كافة أحياء ومناطق الرياض. جودة تنفيذ بضمان 15 سنة.",
  keywords: [
    'كلادينج الرياض', 'واجهات كلادينج', 'لوحات محلات الرياض', 'حروف بارزة مضيئة', 
    'تصميم لوحات إعلانية', 'استيكرات سيارات الرياض', 'تغليف سيارات شركات', 
    'أعمال حديد ليزر', 'شروط بلدية الرياض للوحات 2024', 'منصة بلدي لوحات',
    'الواح الخليج كلادينج', 'عرب بوند الرياض', 'مقاولات دعاية وإعلان',
    'حروف أكريليك', 'لوحات زنكور', 'مظلات وسواتر الرياض', 'قص ليزر حديد'
  ],
  authors: [{ name: "فن الإعلان للدعاية والإعلان" }],
  creator: "فن الإعلان",
  publisher: "فن الإعلان للمقاولات",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "فن الإعلان | واجهات كلادينج ولوحات إعلانية بالرياض",
    description: "نحول رؤيتك إلى واقع. تنفيذ واجهات كلادينج ولوحات حروف بارزة في كل مناطق الرياض.",
    url: BASE_URL,
    siteName: "فن الإعلان",
    images: [
      {
        url: `${BASE_URL}/android-chrome-512x512.png`,
        width: 512,
        height: 512,
        alt: "شعار فن الإعلان للدعاية والإعلان",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "فن الإعلان | واجهات كلادينج ولوحات إعلانية بالرياض",
    description: "متخصصون في تصميم وتنفيذ واجهات الكلادينج واللوحات الإعلانية بالرياض.",
    images: [`${BASE_URL}/android-chrome-512x512.png`],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${BASE_URL}/manifest.json`,
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'فن الإعلان للمقاولات',
  description: 'متخصصون في تنفيذ واجهات الكلادينج الفاخرة، الحروف البارزة المضيئة، وأعمال الدعاية والإعلان في الرياض.',
  url: BASE_URL,
  logo: `${BASE_URL}/apple-touch-icon.png`,
  telephone: '+966557517792',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Riyadh',
    addressCountry: 'SA'
  },
  sameAs: [
    'https://www.facebook.com/profile.php?id=61587226595703'
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${notoKufiArabic.className} bg-gray-900 overflow-x-hidden`} suppressHydrationWarning={true}>
        <Script
          id="json-ld-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-5VHBDX5V7W"></Script>
        <Script id="google-analytics-ads">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-5VHBDX5V7W');
            gtag('config', 'AW-17953122842');
            gtag('config', 'AW-17979231936');
          `}
        </Script>
        <Header /> 
        <div className="relative">
          {children}
        </div>
        <Footer />
        <NewChatbot />
        <BackToTopButton />
      </body>
    </html>
  );
}
