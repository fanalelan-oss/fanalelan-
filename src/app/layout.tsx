import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import Script from 'next/script';
import dynamic from 'next/dynamic';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import { LocalBusinessJsonLd, OrganizationJsonLd } from "@/components/JsonLd";

const NewChatbot = dynamic(() => import('@/components/NewChatbot'), { ssr: false });

const notoKufiArabic = Noto_Kufi_Arabic({ 
  subsets: ["arabic"],
  weight: ['400', '700', '900'],
  display: 'swap'
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fan-alelan.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "فن الإعلان للدعاية والإعلان والمقاولات | واجهات كلادينج ولوحات وأسوار دعائية بالرياض",
    template: "%s | فن الإعلان للدعاية والمقاولات بالرياض"
  },
  description: "فن الإعلان: شركة دعاية وإعلان ومقاولات عامة بالرياض. متخصصون في واجهات الكلادينج، الحروف البارزة المضيئة، الأسوار الدعائية، استيكرات السيارات، وأعمال الحديد بالليزر في كافة أحياء الرياض.",
  alternates: {
    canonical: BASE_URL,
    languages: {
      'ar': `${BASE_URL}/`,
      'ar-SA': `${BASE_URL}/`,
      'x-default': `${BASE_URL}/`,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${BASE_URL}/manifest.json`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Preconnects for fonts and analytics to speed up critical connections */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />

        {/* AdSense Script - This is for showing ads (lazy loaded) */}
        <Script
          id="adsbygoogle-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1856280071157486"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={`${notoKufiArabic.className} bg-gray-900 overflow-x-hidden`} suppressHydrationWarning={true}>
        
        {/* Correct Google Tag (GA4) - Deferred for performance */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-3XLS7S2Y2Y" 
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3XLS7S2Y2Y');
          `}
        </Script>

        <LocalBusinessJsonLd />
        <OrganizationJsonLd />
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
